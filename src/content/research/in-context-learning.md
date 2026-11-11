---
title: What is a transformer actually doing when it learns in-context?
description: An open question I keep returning to, and the threads I'd pull first.
date: 2026-09-20
kind: interest
status: idea
tags: [ml, interpretability, transformers]
---

<!-- Sample research interest. Replace with your own. -->

Large language models can pick up a task from a handful of examples in the
prompt, with no weight updates. There are competing stories for why: implicit
gradient descent in the forward pass, induction-head style copying, Bayesian
inference over latent tasks. They probably aren't mutually exclusive.

## Threads I'd pull first

- Train tiny transformers on synthetic tasks where the "right" algorithm is
  known, then look for it in the weights.
- Track when in training in-context ability appears relative to loss plateaus.
- Compare against [[attention]] patterns in models that *fail* to generalise.

If you work on this, I'd love to read what you're reading.
