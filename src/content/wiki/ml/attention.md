---
title: Attention, from scratch
description: Scaled dot-product attention in one paragraph, one equation and ten lines of code.
created: 2026-07-02
updated: 2026-11-05
stage: evergreen
tags: [ml, transformers]
---

Attention lets every position in a sequence build its output as a weighted
average of every other position's *values*, where the weights come from how
well its *query* matches their *keys*.

## The equation

Given queries *Q*, keys *K* and values *V* (one row per token):

```txt
Attention(Q, K, V) = softmax( Q Kᵀ / √d_k ) V
```

- `Q Kᵀ` is a matrix of similarity scores: row *i* says how much token *i* cares about every token.
- Dividing by `√d_k` keeps the scores from growing with dimension, which would push softmax into near one-hot territory and kill gradients.
- `softmax` turns each row into weights that sum to 1.
- Multiplying by `V` mixes the values with those weights.

## In code

```python
import numpy as np

def attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ K.swapaxes(-1, -2) / np.sqrt(d_k)
    if mask is not None:
        scores = np.where(mask, scores, -np.inf)
    scores -= scores.max(axis=-1, keepdims=True)   # numerical stability
    w = np.exp(scores)
    w /= w.sum(axis=-1, keepdims=True)
    return w @ V
```

## Things that tripped me up

- **Causal masking** sets future positions to −∞ *before* the softmax, not after.
- **Multi-head** attention isn't more expensive than one big head: you split
  `d_model` into `h` heads of size `d_model / h`.
- The softmax over attention scores is closely related to the cross-entropy
  machinery in [[kl-divergence]] — both are about comparing distributions.

## Further reading

- Vaswani et al., *Attention Is All You Need* (2017) — on the [bookshelf](/bookshelf/).
