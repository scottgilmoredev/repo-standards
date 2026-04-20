#!/bin/bash
# create-labels.sh
# Creates the recommended default label set in the current repository.
# Requires: GitHub CLI (gh) authenticated — run `gh auth login` first.
# Usage: bash create-labels.sh

set -e

echo "Creating type labels..."
gh label create "feat"          --color "0075ca" --description "New feature or enhancement" --force
gh label create "fix"              --color "d73a4a" --description "Bug fix, correction, or broken behavior" --force
gh label create "refactor"         --color "e4e669" --description "Code restructuring with no behavior change" --force
gh label create "test"             --color "0e8a16" --description "Adding or modifying tests only" --force
gh label create "chore"            --color "e8e8e8" --description "Dependency updates, config, tooling, maintenance" --force
gh label create "docs"             --color "0075ca" --description "Documentation changes only" --force
gh label create "style"            --color "cfd3d7" --description "Formatting, whitespace — no logic change" --force
gh label create "perf"             --color "f9d0c4" --description "Performance improvements" --force
gh label create "ci"               --color "1d76db" --description "CI/CD configuration changes" --force
gh label create "user-story"            --color "5319e7" --description "Feature described from the user's perspective" --force

echo "Creating priority labels..."
gh label create "priority: high"   --color "b60205" --description "Urgent — blocks progress or affects many users" --force
gh label create "priority: medium" --color "fbca04" --description "Important but not blocking" --force
gh label create "priority: low"    --color "0e8a16" --description "Nice to have — address when bandwidth allows" --force

echo "Creating status labels..."
gh label create "status: blocked"       --color "d93f0b" --description "Cannot proceed — waiting on external dependency" --force
gh label create "status: in progress"   --color "0075ca" --description "Actively being worked on" --force
gh label create "status: needs review"  --color "e4e669" --description "Ready for review" --force
gh label create "status: wont fix"      --color "ffffff" --description "Acknowledged but will not be addressed" --force

echo "✓ Labels created successfully."
