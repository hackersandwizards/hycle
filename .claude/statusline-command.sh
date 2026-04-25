#!/usr/bin/env bash
#
# Claude Code Status Line
#
# Renders a colored, single-line status bar:
#   [Project |] [Branch* |] [(REBASING 3/7) |] [↑N↓N |] [Agent |] Model | [Effort |] ████░░░░░░ XX% | [████░░░░░░ XX% Xh Xm] [| status]
#
# Colors match starship prompt: cyan=directory, gray=branch, red=dirty, yellow=git state.
# Effort badge colors match Claude's UI: low=yellow, medium=green, high=blue, xhigh=magenta, max=gradient.
#
# Performance: hot path forks `git status` once when in a git repo; pure bash
# otherwise. `env bash` picks up bash 5+ for $EPOCHSECONDS (no `date` fork).
# Service status fetched in a backgrounded curl every 5min and cached as a tiny
# derived file (just the component status string), with a sidecar epoch for freshness.

ESC=$'\033'
RESET="${ESC}[0m"
CYAN="${ESC}[36m"
GREEN="${ESC}[32m"
YELLOW="${ESC}[33m"
BLUE="${ESC}[34m"
RED="${ESC}[31m"
MAGENTA="${ESC}[35m"
GRAY="${ESC}[90m"
# Truecolor for the `max` effort gradient — m=orange, a=gold, x=sky.
ORANGE="${ESC}[38;2;230;130;50m"
GOLD="${ESC}[38;2;220;200;60m"
SKY="${ESC}[38;2;110;180;200m"

FILLED="██████████"
EMPTY="░░░░░░░░░░"
SEP="${GRAY}|${RESET}"

# Context window: rescale raw % to "usable %" by subtracting the autocompact reserve.
# 200k window: 167k usable (~83.5%); 1M window: 967k usable (~96.7%).
# thresh_red / thresh_yellow are the rescaled thresholds at which the bar turns red/yellow.
CTX_USABLE_PERMILLE_200K=835  CTX_RED_200K=76  CTX_YELLOW_200K=52
CTX_USABLE_PERMILLE_1M=967    CTX_RED_1M=15    CTX_YELLOW_1M=10

# 5-hour rate limit thresholds (raw %, no rescaling).
RL5_RED=80   RL5_YELLOW=50

# Service status: how long to trust the cache, and the curl timeout for refreshes.
STATUS_CACHE_TTL=300   STATUS_FETCH_TIMEOUT=5

format_countdown() {
    local secs="$1" var="$2"
    if (( secs <= 0 )); then printf -v "$var" '%s' "0m"
    elif (( secs < 3600 )); then printf -v "$var" '%s' "$((secs / 60))m"
    elif (( secs < 86400 )); then printf -v "$var" '%s' "$((secs / 3600))h$((secs % 3600 / 60))m"
    else printf -v "$var" '%s' "$((secs / 86400))d$((secs % 86400 / 3600))h"
    fi
}

pct_color() {
    local pct="$1" red="$2" yellow="$3" var="$4"
    if   (( pct >= red    )); then printf -v "$var" '%s' "$RED"
    elif (( pct >= yellow )); then printf -v "$var" '%s' "$YELLOW"
    else                            printf -v "$var" '%s' "$GREEN"
    fi
}

# Color the rate-limit countdown by how alarming the burn rate is.
# Matrix (pct used × seconds left):
#   high pct (≥80) + lots of time left → red (burning too fast)
#   mid  pct (≥50) + lots of time left → yellow; ≤30min left → green (almost reset)
#   low  pct (<50)                     → gray (no concern, ignore time)
time_color() {
    local pct="$1" secs="$2" var="$3"
    if (( pct >= 80 )); then
        if   (( secs > 3600 ));  then printf -v "$var" '%s' "$RED"
        elif (( secs > 1200 ));  then printf -v "$var" '%s' "$YELLOW"
        else                          printf -v "$var" '%s' "$GREEN"
        fi
    elif (( pct >= 50 )); then
        if   (( secs > 7200 ));  then printf -v "$var" '%s' "$YELLOW"
        elif (( secs <= 1800 )); then printf -v "$var" '%s' "$GREEN"
        else                          printf -v "$var" '%s' "$GRAY"
        fi
    else
        printf -v "$var" '%s' "$GRAY"
    fi
}

IFS= read -r -d '' input

# bash 5+ exposes $EPOCHSECONDS as a no-fork builtin; `date +%s` is the bash 3-4 fallback.
now=${EPOCHSECONDS:-$(date +%s)}

[[ $input =~ \"project_dir\":\"([^\"]+)\" ]] && project_dir="${BASH_REMATCH[1]##*/}" || project_dir=""
[[ $input =~ \"display_name\":\"([^\"]+)\" ]] && model="${BASH_REMATCH[1]}" || model="Claude"
# `used_percentage` appears in context_window AND in rate_limits.{five_hour,seven_day}.
# Strip rate_limits before matching so we always read the context-window value.
ctx_only="${input%%\"rate_limits\"*}"
[[ $ctx_only =~ \"used_percentage\":([0-9]+) ]] && pct="${BASH_REMATCH[1]}" || pct=0
[[ $input =~ \"agent\":\{[^}]*\"name\":\"([^\"]+)\" ]] && agent="${BASH_REMATCH[1]}" || agent=""
[[ $input =~ \"context_window_size\":([0-9]+) ]] && ctx_size="${BASH_REMATCH[1]}" || ctx_size=200000
[[ $input =~ \"effort\":\{[^}]*\"level\":\"([^\"]+)\" ]] && effort="${BASH_REMATCH[1]}" || effort=""
[[ $input =~ \"five_hour\":\{[^}]*\"used_percentage\":([0-9]+) ]] && rl5_pct="${BASH_REMATCH[1]}" || rl5_pct=""
[[ $input =~ \"five_hour\":\{[^}]*\"resets_at\":([0-9]+) ]] && rl5_resets="${BASH_REMATCH[1]}" || rl5_resets=""

# Find .git in $PWD or an ancestor without forking; resolve worktree pointer files inline.
git_dir="" git_state=""
branch="" dirty="" ahead="" behind=""
dir=$PWD
while [[ $dir && $dir != / ]]; do
    if [[ -d $dir/.git ]]; then
        git_dir=$dir/.git; break
    elif [[ -f $dir/.git ]]; then
        # Worktree: .git is a text file containing "gitdir: <path>"
        gitdir_pointer=$(< "$dir/.git")
        git_dir=${gitdir_pointer#gitdir: }
        # Relative gitdir → absolute (worktrees can use either form).
        [[ $git_dir == /* ]] || git_dir=$dir/$git_dir
        break
    fi
    dir=${dir%/*}
done

if [[ -n $git_dir ]]; then
    git_status=$(git status --porcelain -b 2>/dev/null)
    if [[ -n $git_status ]]; then
        [[ $git_status =~ ^##\ ([^.$'\n']+) ]] && branch="${BASH_REMATCH[1]%%...*}"
        [[ $git_status == *$'\n'* ]] && dirty=1
        [[ $git_status =~ ahead\ ([0-9]+) ]] && ahead="${BASH_REMATCH[1]}"
        [[ $git_status =~ behind\ ([0-9]+) ]] && behind="${BASH_REMATCH[1]}"
    fi
    if [[ -d $git_dir/rebase-merge ]]; then
        git_state="REBASING $(< "$git_dir/rebase-merge/msgnum")/$(< "$git_dir/rebase-merge/end")"
    elif [[ -d $git_dir/rebase-apply ]]; then
        git_state="REBASING $(< "$git_dir/rebase-apply/next")/$(< "$git_dir/rebase-apply/last")"
    elif [[ -f $git_dir/MERGE_HEAD ]]; then       git_state="MERGING"
    elif [[ -f $git_dir/CHERRY_PICK_HEAD ]]; then git_state="CHERRY-PICKING"
    elif [[ -f $git_dir/REVERT_HEAD ]]; then      git_state="REVERTING"
    elif [[ -f $git_dir/BISECT_LOG ]]; then       git_state="BISECTING"
    fi
fi

if (( ctx_size >= 1000000 )); then
    usable_permille=$CTX_USABLE_PERMILLE_1M   thresh_red=$CTX_RED_1M    thresh_yellow=$CTX_YELLOW_1M
else
    usable_permille=$CTX_USABLE_PERMILLE_200K thresh_red=$CTX_RED_200K  thresh_yellow=$CTX_YELLOW_200K
fi
if (( pct > 0 )); then
    pct=$(( (pct * 1000 + usable_permille / 2) / usable_permille ))
    (( pct > 100 )) && pct=100
fi

bar_idx=$(( pct / 10 ))
pct_color "$pct" "$thresh_red" "$thresh_yellow" bar_color

# --- Build output ---
# Convention: trailing " ${SEP} " on a section means "more sections may follow."
# Leading " ${SEP} " (used by the rl5 bar and the status badge) means "only joins
# when something rendered before us" — the load-bearing inconsistency is intentional.

out=""

[[ -n $project_dir ]] && out+="${CYAN}${project_dir}${RESET} ${SEP} "
if [[ -n $branch ]]; then
    out+="${GRAY}${branch}${RESET}"
    [[ -n $dirty ]] && out+="${RED}*${RESET}"
    out+=" ${SEP} "
fi
[[ -n $git_state ]] && out+="${YELLOW}(${git_state})${RESET} ${SEP} "
if [[ -n $ahead || -n $behind ]]; then
    [[ -n $ahead ]] && out+="${GRAY}↑${ahead}${RESET}"
    [[ -n $behind ]] && out+="${GRAY}↓${behind}${RESET}"
    out+=" ${SEP} "
fi

[[ -n $agent ]] && out+="${MAGENTA}${agent}${RESET} ${SEP} "
out+="${CYAN}${model}${RESET}"
out+=" ${SEP} "
if [[ -n $effort ]]; then
    case "$effort" in
        low)    out+="${YELLOW}low${RESET}" ;;
        medium) out+="${GREEN}med${RESET}" ;;
        high)   out+="${BLUE}high${RESET}" ;;
        xhigh)  out+="${MAGENTA}xhigh${RESET}" ;;
        max)    out+="${ORANGE}m${GOLD}a${SKY}x${RESET}" ;;
        *)      out+="${GRAY}${effort}${RESET}" ;;
    esac
    out+=" ${SEP} "
fi

out+="${bar_color}${FILLED:0:bar_idx}${RESET}${EMPTY:bar_idx} ${bar_color}${pct}%${RESET}"
if [[ -n $rl5_pct ]]; then
    rl5_idx=$(( rl5_pct / 10 ))
    pct_color "$rl5_pct" "$RL5_RED" "$RL5_YELLOW" rl5_color
    rl5_secs=$(( rl5_resets - now ))
    format_countdown "$rl5_secs" rl5_time
    time_color "$rl5_pct" "$rl5_secs" rl5_time_color
    out+=" ${SEP} "
    out+="${rl5_color}${FILLED:0:rl5_idx}${RESET}${EMPTY:rl5_idx} ${rl5_color}${rl5_pct}%${RESET} ${rl5_time_color}${rl5_time}${RESET}"
fi

# Service status: background curl every 5min stores just the Claude Code component
# status string (~20 bytes), so the hot path doesn't have to regex a 30 KB summary JSON.
status_cache="/tmp/claude-statusline-status.cc"
status_expiry_file="/tmp/claude-statusline-status.expiry"
status_expiry=0
read -r status_expiry < "$status_expiry_file" 2>/dev/null
[[ $status_expiry =~ ^[0-9]+$ ]] || status_expiry=0
if (( now >= status_expiry )); then
    # Pre-write next expiry so parallel renders don't all spawn fetches; also
    # debounces retries when the upstream is unreachable (curl fails → cache stays).
    echo $(( now + STATUS_CACHE_TTL )) > "$status_expiry_file"
    (
        resp=$(curl -s --max-time "$STATUS_FETCH_TIMEOUT" "https://status.claude.com/api/v2/summary.json")
        if [[ $resp =~ \"name\":\"Claude\ Code\"[^}]*\"status\":\"([^\"]+)\" ]]; then
            printf '%s' "${BASH_REMATCH[1]}" > "${status_cache}.tmp" \
                && mv "${status_cache}.tmp" "$status_cache"
        fi
    ) >/dev/null 2>&1 &
fi
if [[ -s $status_cache ]]; then
    read -r cc_status < "$status_cache"
    case "$cc_status" in
        operational|"")       label="" ;;
        degraded_performance) label="${YELLOW}degraded" ;;
        partial_outage)       label="${YELLOW}partial outage" ;;
        major_outage)         label="${RED}major outage" ;;
        under_maintenance)    label="${YELLOW}maintenance" ;;
        *)                    label="" ;;
    esac
    [[ -n $label ]] && out+=" ${SEP} ${label}${RESET}"
fi

printf '%s\n' "$out"
