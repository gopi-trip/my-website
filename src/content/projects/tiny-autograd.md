---
title: tiny-autograd
description: A scalar reverse-mode autodiff engine in ~150 lines, written to understand backprop rather than to use it.
date: 2026-06-14
status: done
stack: [python, numpy]
tags: [ml, learning]
---

<!-- Sample project entry. Replace with your own work. -->

A from-scratch reverse-mode automatic differentiation engine. Every value is a
node that remembers its parents and how to pass gradients back to them; calling
`backward()` walks the graph in reverse topological order.

## What I learned

- Gradient accumulation (`+=`, not `=`) is the whole trick for nodes used twice.
- Topological sorting matters more than I expected; a naive DFS double-counts.
- Once it worked, a two-layer MLP on a toy dataset trained fine. Seeing the
  loss curve go down on code I fully understood was the point.

Related notes: [[attention]], [[kl-divergence]].
