---
title: git rebase, without fear
description: The handful of rebase commands I actually use, and how to undo them.
created: 2026-05-10
updated: 2026-09-01
stage: budding
tags: [git, tools]
---

Rebase replays your commits on top of another base, producing a linear history.
It rewrites commits, so only do it to branches nobody else has pulled.

## Everyday commands

```bash
# bring my branch up to date with main, replaying my commits on top
git fetch origin
git rebase origin/main

# squash / reword / reorder the last 5 commits
git rebase -i HEAD~5

# I hit a conflict: fix the files, then
git add <files>
git rebase --continue

# I regret everything
git rebase --abort
```

## The undo button

Even after a rebase finishes, the old commits still exist. The reflog
remembers where your branch used to point:

```bash
git reflog              # find the entry from before the rebase
git reset --hard HEAD@{5}
```

## Rules of thumb

- `--force-with-lease`, never plain `--force`, when pushing a rebased branch.
- If a rebase has more than a few conflicts, a merge is probably kinder.
- Set `git config --global rebase.autoStash true` and stop worrying about a dirty tree.
