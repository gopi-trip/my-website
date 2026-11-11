---
title: KL divergence
description: Why it's asymmetric, and which direction you want.
created: 2026-08-19
stage: budding
tags: [ml, probability]
---

The Kullback–Leibler divergence measures how much information is lost when
you use distribution *Q* to approximate *P*:

```txt
KL(P ‖ Q) = Σ P(x) · log( P(x) / Q(x) )
```

It's always ≥ 0, and 0 only when P = Q. It is **not** a distance: it isn't
symmetric and doesn't satisfy the triangle inequality.

## Which direction?

- **Forward KL, KL(P ‖ Q)** — "mean-seeking". Q is punished wherever P has mass
  and Q doesn't, so Q spreads out to cover all of P's modes. This is what
  maximum likelihood training minimises.
- **Reverse KL, KL(Q ‖ P)** — "mode-seeking". Q is punished for putting mass
  where P has none, so it happily collapses onto one mode. Common in
  variational inference.

## Connection to cross-entropy

Cross-entropy H(P, Q) = H(P) + KL(P ‖ Q). When P is fixed (your labels),
minimising cross-entropy *is* minimising forward KL. That's why the loss in
[[attention|transformer]] training is usually called cross-entropy even though
the thing you care about is the KL term.

## Still to write

- [ ] A picture of forward vs reverse KL fitting a bimodal P.
- [ ] Where KL shows up in RLHF (the penalty against the reference model).
