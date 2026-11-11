---
title: How much label noise can a small CNN shrug off?
description: A weekend experiment sweeping symmetric label noise on CIFAR-10. Short answer — more than I expected, until it suddenly isn't.
date: 2026-08-03
kind: experiment
status: published
tags: [ml, experiments]
links:
  code: https://github.com/gop-trip
---

<!-- Sample experiment write-up. Replace with your own. -->

## Setup

A small ResNet trained on CIFAR-10 with a fraction *p* of training labels
replaced uniformly at random, for *p* from 0 to 0.8. Same seed, same schedule,
three runs each.

## What I saw

| noise *p* | test acc. (mean of 3) |
| --------: | --------------------: |
|       0.0 |                     — |
|       0.4 |                     — |
|       0.8 |                     — |

<!-- fill in your real numbers -->

The interesting part wasn't the final accuracy but *when* the model started
memorising the noisy labels: validation accuracy peaked early and then decayed,
which makes early stopping look less like a heuristic and more like a necessity.

## What I'd do differently

Log per-example loss. The clean and noisy examples separate cleanly early in
training, and that's the experiment I actually wanted to run.
