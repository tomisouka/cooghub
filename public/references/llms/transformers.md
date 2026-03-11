# The Transformer Architecture — A Deep Dive

> How the 2017 paper "Attention Is All You Need" rewired the entire field of AI, and what's actually happening inside every modern LLM.

---

## Table of Contents

- [The Transformer Architecture — A Deep Dive](#the-transformer-architecture--a-deep-dive)
  - [Table of Contents](#table-of-contents)
  - [01 — Before Transformers: The Problem](#01--before-transformers-the-problem)
    - [Recurrent Neural Networks (RNNs)](#recurrent-neural-networks-rnns)
  - [02 — The Paper That Changed Everything](#02--the-paper-that-changed-everything)
  - [03 — High-Level Architecture](#03--high-level-architecture)
    - [The Encoder](#the-encoder)
    - [The Decoder](#the-decoder)
  - [04 — Inside the Encoder: Step by Step](#04--inside-the-encoder-step-by-step)
    - [Step 1: Input Embeddings](#step-1-input-embeddings)
    - [Step 2: Positional Encoding](#step-2-positional-encoding)
    - [Step 3: Self-Attention — The Core Mechanism](#step-3-self-attention--the-core-mechanism)
    - [Scaled Dot-Product Attention](#scaled-dot-product-attention)
    - [Step 4: Multi-Head Attention](#step-4-multi-head-attention)
    - [Step 5: Residual Connections \& Layer Normalization](#step-5-residual-connections--layer-normalization)
    - [Step 6: Feed-Forward Network](#step-6-feed-forward-network)
  - [05 — Inside the Decoder](#05--inside-the-decoder)
    - [Masked Self-Attention](#masked-self-attention)
    - [Cross-Attention (Encoder-Decoder Attention)](#cross-attention-encoder-decoder-attention)
  - [06 — Transformer Variants](#06--transformer-variants)
    - [Encoder-Only (e.g., BERT, RoBERTa)](#encoder-only-eg-bert-roberta)
    - [Decoder-Only (e.g., GPT series, Claude, LLaMA, Gemini)](#decoder-only-eg-gpt-series-claude-llama-gemini)
    - [Encoder-Decoder (e.g., T5, BART, original Transformer)](#encoder-decoder-eg-t5-bart-original-transformer)
    - [Summary Comparison](#summary-comparison)
  - [07 — Modern Improvements Beyond the Original Paper](#07--modern-improvements-beyond-the-original-paper)
    - [RoPE — Rotary Positional Embeddings](#rope--rotary-positional-embeddings)
    - [RMSNorm vs LayerNorm](#rmsnorm-vs-layernorm)
    - [SwiGLU Activation](#swiglu-activation)
    - [Grouped Query Attention (GQA)](#grouped-query-attention-gqa)
    - [Flash Attention](#flash-attention)
    - [KV Cache](#kv-cache)
  - [08 — Transformers Beyond Text](#08--transformers-beyond-text)
  - [Index](#index)

---

## 01 — Before Transformers: The Problem

To understand why transformers matter, you need to understand what came before them and why it wasn't enough.

### Recurrent Neural Networks (RNNs)

Before 2017, sequence tasks — translation, text summarization, language modeling — were dominated by **Recurrent Neural Networks (RNNs)** and their variants: LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units).

RNNs processed text **one token at a time**, left to right. Each step passed a "hidden state" to the next — essentially a compressed memory of everything seen so far. This worked for short sequences but had three serious problems:

**1. The Vanishing Gradient Problem** — During training, gradients (the signals used to adjust the model) had to travel backward through many sequential steps. Over long sequences, those gradients shrank to near-zero before reaching early tokens, meaning the model couldn't learn long-range dependencies. A word from 200 tokens ago might as well not exist.

**2. No Parallelization** — Because each step depended on the previous step's output, you couldn't process the sequence in parallel. Training was slow, and scaling was painful.

**3. Fading Memory** — Even with LSTM's gating mechanisms to help retain information, long documents caused relevant context to get diluted or lost.

> **The bottleneck:** RNNs compressed entire input sequences into a single fixed-size vector before decoding. For a 500-word paragraph, that one vector had to carry all the meaning. Information inevitably got lost.

---

## 02 — The Paper That Changed Everything

In 2017, eight researchers at Google Brain published **"Attention Is All You Need"** (Vaswani et al.), introducing the **Transformer** — a model that dispensed with recurrence entirely and relied solely on **attention mechanisms**.

The core insight: instead of reading text sequentially and hoping the model retains what it needs, why not let every token directly attend to every other token at once? The model doesn't read — it *compares*.

This had two immediate consequences:

- **Full parallelization** — every token is processed simultaneously, making training dramatically faster on modern GPUs
- **Direct long-range dependencies** — a token at position 1 and a token at position 500 have equal access to each other, with no decay over distance

The original paper was designed for machine translation (English → French/German), but the architecture turned out to be a universal backbone for nearly every AI task that followed.

---

## 03 — High-Level Architecture

The original Transformer follows an **encoder-decoder** structure. Think of it as two stacks of layers wired together.

```
Input Text
    ↓
[Input Embedding + Positional Encoding]
    ↓
┌─────────────────────────┐
│   ENCODER STACK (×N)   │  ← Reads and understands the input
│  - Multi-Head Attention │
│  - Feed-Forward Network │
└──────────┬──────────────┘
           │ (encoded representation)
           ↓
┌─────────────────────────┐
│   DECODER STACK (×N)   │  ← Generates the output
│  - Masked Self-Attention│
│  - Cross-Attention      │
│  - Feed-Forward Network │
└──────────┬──────────────┘
           ↓
[Linear Layer + Softmax]
    ↓
Output Token (probabilities over vocabulary)
```

The original paper used **N = 6** layers in each stack. Modern LLMs use far more — GPT-3 has 96 layers.

### The Encoder

The encoder's job is to take the input sequence and produce a rich **contextual representation** of it — a set of vectors where each token's meaning is informed by every other token around it. It does *not* generate output directly.

### The Decoder

The decoder generates output tokens one at a time, autoregressively — each new token is conditioned on all previously generated tokens *and* the encoder's representation of the input. It produces a probability distribution over the entire vocabulary at each step, and the highest-probability token is selected.

> **Key distinction:** Not all modern LLMs use both encoder and decoder. Claude, GPT, and LLaMA are **decoder-only**. BERT is **encoder-only**. T5 uses the full encoder-decoder setup. More on this in [§06](#06--transformer-variants).

---

## 04 — Inside the Encoder: Step by Step

Let's trace a single sentence through one encoder layer: `"The bank approved the loan"`

### Step 1: Input Embeddings

Raw text can't enter a neural network. First, the sentence is tokenized (split into subword tokens), then each token is converted into a dense vector called an **embedding** — a list of numbers that represents the token's meaning in a high-dimensional space.

In the original Transformer, these vectors have dimension **d_model = 512**. So each token becomes a 512-dimensional vector. Modern models use 4096 or more.

```
"The"    → [0.21, -0.83, 0.04, ..., 0.67]  (512 numbers)
"bank"   → [0.55,  0.12, 0.91, ..., -0.33] (512 numbers)
"approv" → [-0.08, 0.74, -0.21, ..., 0.18] (512 numbers)
...
```

These embeddings are **learned during training** — they're not hand-crafted. The model discovers that "bank" and "finance" should be close together in this space, and that "bank" and "river" are also nearby but in a different direction.

### Step 2: Positional Encoding

Here's the problem: the attention mechanism treats the input as a **set**, not a sequence. If you shuffle the tokens, the self-attention output is the same (just shuffled). The model has no inherent sense of order.

The fix is **positional encoding** — adding a position-specific signal to each token's embedding before it enters the encoder. The original paper used sinusoidal functions (sine and cosine waves at different frequencies):

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

Each position gets a unique vector of sine/cosine values. The model learns to decode these positional signatures to understand word order.

> **Modern alternative:** Most current LLMs (LLaMA, GPT-NeoX) use **RoPE (Rotary Positional Embeddings)** instead of sinusoidal encoding. RoPE bakes position directly into the attention math rather than adding it to embeddings, and generalizes much better to longer context windows than the model was trained on.

### Step 3: Self-Attention — The Core Mechanism

This is where the magic happens. Self-attention allows every token to look at every other token and decide: *how much should I be influenced by each of them?*

For the word "bank" in `"The bank approved the loan"`, self-attention lets the model notice that "approved" and "loan" are nearby and relevant — so "bank" here means a financial institution, not a riverbank.

Each token produces three vectors, derived by multiplying the token embedding by three learned weight matrices:

- **Query (Q)** — "What am I looking for?"
- **Key (K)** — "What do I offer to others?"
- **Value (V)** — "What information do I actually carry?"

You can think of it like a search engine: the Query is your search term, the Keys are the documents' metadata, and the Values are the documents' actual content. High similarity between a Query and a Key means that token gets a higher weight, pulling more of the corresponding Value into the result.

### Scaled Dot-Product Attention

The attention score between token i and token j is computed as:

```
Attention(Q, K, V) = softmax( Q × Kᵀ / √d_k ) × V
```

Breaking this down:

1. **Q × Kᵀ** — dot product between every Query and every Key. Produces a matrix of raw similarity scores.
2. **/ √d_k** — scale down by the square root of the key dimension. Without this, dot products grow very large in high dimensions, pushing softmax into regions with near-zero gradients, making training unstable.
3. **softmax(...)** — convert scores to probabilities (all weights sum to 1).
4. **× V** — weighted sum of Value vectors. Each output token is a blend of all Value vectors, weighted by attention.

The result: each token's output is a contextually-aware representation that has "attended" to the most relevant parts of the sequence.

```
Example attention weights for "bank":
  "The"      → 0.05
  "bank"     → 0.10  (itself)
  "approved" → 0.35  ← high attention
  "the"      → 0.05
  "loan"     → 0.45  ← highest attention
```

### Step 4: Multi-Head Attention

A single attention pass can only capture one type of relationship at a time. **Multi-Head Attention** runs several attention operations in parallel — each with its own independent Q, K, V weight matrices — then concatenates and projects their outputs.

The original paper used **8 attention heads**. Modern models use many more (GPT-3 uses 96 heads per layer).

Each head learns to specialize in a different kind of relationship:
- One head might track syntactic dependencies (subject → verb)
- Another might track coreference (pronoun → noun it refers to)
- Another might focus on semantic similarity
- Another on positional proximity

> **Important implementation detail:** The heads don't operate on separate copies of the data. The Query, Key, and Value matrices are logically split across heads — it's a single matrix with each head occupying a different slice. This makes computation efficient.

After all heads run in parallel, their outputs are concatenated and passed through a final linear projection to merge them back into a single representation of the original dimension.

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) × W_O

where head_i = Attention(Q×W_Q_i, K×W_K_i, V×W_V_i)
```

### Step 5: Residual Connections & Layer Normalization

After each sub-layer (attention and feed-forward), two critical operations happen:

**Residual Connection (Skip Connection):**
```
output = LayerNorm(x + SubLayer(x))
```
The input `x` is added back to the sub-layer's output before normalization. This "skip" allows gradients to flow directly through the network without passing through every layer — solving the vanishing gradient problem for deep networks and preserving the original positional/semantic information.

**Layer Normalization:**
Normalizes the activations across the feature dimension for each token independently. This stabilizes training by keeping activations in a well-behaved range, preventing the model from becoming too confident or collapsing to near-zero values.

> **Without residual connections:** the attention mechanism ignores position entirely (it treats input as a set). Without skip connections, positional encoding information would be destroyed after the first attention layer. They're not optional.

### Step 6: Feed-Forward Network

After multi-head attention, each token passes through a **Position-wise Feed-Forward Network (FFN)** — two linear transformations with a non-linear activation in between:

```
FFN(x) = max(0, x × W₁ + b₁) × W₂ + b₂
```

Key properties:
- Applied **independently to each token** — no cross-token interaction here
- The inner dimension is **4× larger** than d_model (512 → 2048 in the original paper, 4096 → 16384 in large models)
- This expansion-contraction gives the model capacity to learn complex non-linear transformations of the contextual representation built by attention
- Parameters are **shared across all positions** but applied independently

This FFN is where a large portion of the model's "knowledge" is thought to be stored — research has shown that factual associations (e.g., "Paris is the capital of France") tend to be retrievable from the FFN weights.

The output of the FFN (with another residual + LayerNorm) is the final output of one encoder layer, which feeds into the next.

---

## 05 — Inside the Decoder

The decoder mirrors the encoder in structure but has two important differences.

### Masked Self-Attention

The decoder also runs self-attention on its input (the tokens generated so far), but with a critical constraint: **a token can only attend to tokens that came before it** — not to future positions.

This is enforced via a **causal mask**: future positions are set to `-∞` before the softmax, so their attention weights become 0. This preserves the **autoregressive** property — when generating token 5, the model genuinely hasn't "seen" tokens 6, 7, 8. If it could, it would just copy the answer, not learn to generate.

```
Attention mask for a 5-token sequence:
      T1    T2    T3    T4    T5
T1  [ 0    -∞    -∞    -∞    -∞  ]
T2  [ 0     0    -∞    -∞    -∞  ]
T3  [ 0     0     0    -∞    -∞  ]
T4  [ 0     0     0     0    -∞  ]
T5  [ 0     0     0     0     0  ]
```

### Cross-Attention (Encoder-Decoder Attention)

The decoder's second attention layer is **cross-attention** — this is how the decoder "reads" the encoder's output.

- **Queries** come from the decoder's masked self-attention output (what the decoder is currently building)
- **Keys and Values** come from the encoder's final output (the encoded representation of the input)

This is what connects understanding (encoder) to generation (decoder). The decoder can look at any part of the encoded input sequence to decide what to generate next — no masking, full access.

The decoder's full per-layer stack:
```
Decoder Input
    ↓
Masked Self-Attention  (can only see past output tokens)
    ↓ + residual + LayerNorm
Cross-Attention        (attends to encoder output)
    ↓ + residual + LayerNorm
Feed-Forward Network
    ↓ + residual + LayerNorm
Next Decoder Layer
```

Finally, the last decoder layer's output passes through a **linear layer** (projecting to vocabulary size) and a **softmax** to produce a probability distribution over every possible next token.

---

## 06 — Transformer Variants

The original encoder-decoder architecture spawned three distinct families, each optimized for different tasks.

### Encoder-Only (e.g., BERT, RoBERTa)

Encoder-only models process the entire input **bidirectionally** — every token attends to every other token with no masking. This gives deep, rich understanding of existing text.

**Training objective:** Masked Language Modeling (MLM) — randomly mask ~15% of tokens and train the model to predict the originals from context.

**Best for:** text classification, sentiment analysis, named entity recognition, question answering (extractive), semantic search.

**Cannot do:** generate free-form text. BERT has no decoder and no autoregressive capability.

```
BERT reads: "The [MASK] approved the loan"
BERT predicts: "bank" (with high confidence, from context)
```

### Decoder-Only (e.g., GPT series, Claude, LLaMA, Gemini)

Decoder-only models process text **left-to-right only** with causal masking. Despite being called "decoder-only," they have no encoder — the cross-attention layer is dropped entirely since there's nothing to cross-attend to.

**Training objective:** Causal Language Modeling (CLM) — predict the next token given all previous tokens.

**Best for:** text generation, code generation, conversation, reasoning, instruction following. This is the dominant architecture for modern LLMs.

**Why it won:** decoder-only models turned out to be surprisingly capable at understanding tasks too, especially at scale. They're simpler to train and serve at production scale.

```
GPT reads: "The bank approved the"
GPT predicts: "loan" (next token)
```

### Encoder-Decoder (e.g., T5, BART, original Transformer)

These use both stacks as designed in the original paper. The encoder reads the full input bidirectionally; the decoder generates output autoregressively while cross-attending to the encoder.

**Training objective:** T5 uses span corruption (mask spans, predict them); BART uses denoising (corrupt input in various ways, reconstruct it).

**Best for:** translation, summarization, abstractive question answering — any task that maps one sequence to a different sequence.

**T5's key insight:** frame every NLP task as text-to-text. Translation, summarization, classification — all become "given this input text, produce this output text." One unified model for everything.

```
T5 input:  "translate English to French: The cat sat on the mat"
T5 output: "Le chat était assis sur le tapis"
```

### Summary Comparison

| Architecture | Attention Direction | Training Objective | Best Use Case | Examples |
|---|---|---|---|---|
| Encoder-Only | Bidirectional (full) | Masked LM | Understanding / classification | BERT, RoBERTa |
| Decoder-Only | Unidirectional (causal) | Causal LM | Generation / conversation | GPT, Claude, LLaMA |
| Encoder-Decoder | Bi (enc) + Uni (dec) | Denoising / span corruption | Seq-to-seq tasks | T5, BART |

---

## 07 — Modern Improvements Beyond the Original Paper

The 2017 Transformer was groundbreaking but rough. Every major LLM today uses a refined version.

### RoPE — Rotary Positional Embeddings

Used by LLaMA, GPT-NeoX, and most modern open-source models. Instead of adding a fixed positional vector to each embedding, RoPE applies a rotation to the Query and Key vectors based on position. This encodes position directly into the attention computation and generalizes significantly better to sequence lengths longer than what the model was trained on.

### RMSNorm vs LayerNorm

The original paper normalized after each sub-layer (post-norm). Most modern models (LLaMA, PaLM) use **pre-norm** — normalize before the sub-layer, not after — and **RMSNorm** instead of LayerNorm. RMSNorm drops the mean-centering step, making it faster and equally stable. Pre-norm also makes training more stable at large scale.

### SwiGLU Activation

The original FFN used ReLU activation. LLaMA, PaLM, and others now use **SwiGLU** — a gated linear unit variant. It performs better in practice, though the theoretical reason is still debated. SwiGLU uses 3 weight matrices instead of 2 in the FFN.

### Grouped Query Attention (GQA)

Full multi-head attention requires storing separate Key and Value matrices for each attention head in the KV cache during inference — expensive for long contexts. **GQA** (used in LLaMA 2/3, Mistral) shares K and V matrices across groups of heads, dramatically reducing memory at inference time with minimal quality loss.

### Flash Attention

A hardware-aware rewrite of the attention computation that avoids materializing the full attention matrix in GPU memory (which is O(n²) in sequence length). Flash Attention tiles the computation to stay within fast SRAM, making long-context attention 2–4× faster and memory-efficient. Most production LLMs use this now.

### KV Cache

During inference (generation), the model recomputes attention over the same tokens repeatedly as it generates new ones. The **KV cache** stores the Key and Value vectors from previous positions so they don't need recomputing. This makes token generation roughly linear in new tokens rather than quadratic in total sequence length.

---

## 08 — Transformers Beyond Text

The transformer's generality has allowed it to spread far beyond NLP.

**Vision Transformers (ViT)** — Images are split into fixed-size patches, each treated as a "token." The same self-attention mechanism learns which patches are relevant to each other. ViT now rivals or exceeds CNNs on image classification benchmarks.

**Multimodal Models** — Gemini, GPT-4o, and Claude 3+ are trained on text, images, audio, and video simultaneously. Different modalities are tokenized and projected into a shared embedding space, then processed by a unified transformer stack.

**Image & Video Generation** — DALL-E, Stable Diffusion 3, and Sora use transformers to process text prompts (and sometimes image patches) via self-attention to understand context and generate coherent visual outputs.

**Code** — GitHub Copilot, Claude Code, and similar tools use transformer-based models specifically trained or fine-tuned on source code. The attention mechanism handles long-range dependencies in code (e.g., a function definition and its call site) naturally.

**Protein Folding** — AlphaFold 2 uses transformer attention over amino acid sequences to predict 3D protein structures. Biology is, in a sense, a language problem.

**Reinforcement Learning** — Decision Transformer reframes RL as a sequence prediction problem, replacing value functions with a transformer that predicts optimal actions given a history of states, actions, and returns.

---

## Index

| Term | Definition | Section |
|---|---|---|
| RNN | Recurrent Neural Network — sequential predecessor to Transformers | [§01](#01--before-transformers-the-problem) |
| LSTM | Long Short-Term Memory — gated RNN variant designed to handle longer sequences | [§01](#01--before-transformers-the-problem) |
| Vanishing Gradient | Training problem where gradients shrink to zero over long sequences | [§01](#01--before-transformers-the-problem) |
| Attention Is All You Need | 2017 paper by Vaswani et al. introducing the Transformer | [§02](#02--the-paper-that-changed-everything) |
| Transformer | Neural network architecture based entirely on attention mechanisms | [§03](#03--high-level-architecture) |
| Encoder | Stack that reads input and produces contextual representations | [§03](#the-encoder) |
| Decoder | Stack that generates output tokens autoregressively | [§03](#the-decoder) |
| Input Embedding | Dense vector representation of a token learned during training | [§04](#step-1-input-embeddings) |
| d_model | Dimension of all embedding and attention vectors (512 in original paper) | [§04](#step-1-input-embeddings) |
| Positional Encoding | Sinusoidal or learned signal added to embeddings to encode token order | [§04](#step-2-positional-encoding) |
| RoPE | Rotary Positional Embeddings — modern alternative baked into attention math | [§07](#rope--rotary-positional-embeddings) |
| Self-Attention | Mechanism where every token computes relationships with every other token | [§04](#step-3-self-attention--the-core-mechanism) |
| Query (Q) | Vector representing what a token is "looking for" in attention | [§04](#step-3-self-attention--the-core-mechanism) |
| Key (K) | Vector representing what a token "offers" to others in attention | [§04](#step-3-self-attention--the-core-mechanism) |
| Value (V) | Vector containing the actual information a token contributes | [§04](#step-3-self-attention--the-core-mechanism) |
| Scaled Dot-Product | Core attention formula: softmax(QKᵀ / √d_k) × V | [§04](#scaled-dot-product-attention) |
| Multi-Head Attention | Running multiple attention operations in parallel across different subspaces | [§04](#step-4-multi-head-attention) |
| Attention Head | Single parallel attention operation within multi-head attention | [§04](#step-4-multi-head-attention) |
| Residual Connection | Skip connection that adds input to sub-layer output, preserving gradients | [§04](#step-5-residual-connections--layer-normalization) |
| Layer Normalization | Normalizes activations per token to stabilize training | [§04](#step-5-residual-connections--layer-normalization) |
| Feed-Forward Network (FFN) | Per-token two-layer MLP applied after attention in each encoder/decoder layer | [§04](#step-6-feed-forward-network) |
| Causal Mask | Mask that prevents decoder tokens from attending to future positions | [§05](#masked-self-attention) |
| Cross-Attention | Decoder attention that reads Keys and Values from encoder output | [§05](#cross-attention-encoder-decoder-attention) |
| Autoregressive | Generating one token at a time, each conditioned on all previous tokens | [§05](#masked-self-attention) |
| Encoder-Only | Transformer variant with only an encoder stack (e.g., BERT) | [§06](#encoder-only-eg-bert-roberta) |
| Decoder-Only | Transformer variant with only a causal decoder stack (e.g., GPT, Claude) | [§06](#decoder-only-eg-gpt-series-claude-llama-gemini) |
| Encoder-Decoder | Full original Transformer architecture (e.g., T5, BART) | [§06](#encoder-decoder-eg-t5-bart-original-transformer) |
| Masked LM (MLM) | BERT's training task: predict randomly masked tokens from context | [§06](#encoder-only-eg-bert-roberta) |
| Causal LM (CLM) | GPT-style training task: predict the next token given all previous tokens | [§06](#decoder-only-eg-gpt-series-claude-llama-gemini) |
| RMSNorm | Simplified LayerNorm without mean-centering, used in modern LLMs | [§07](#rmsnorm-vs-layernorm) |
| SwiGLU | Gated activation function used in modern FFNs (LLaMA, PaLM) | [§07](#swiglu-activation) |
| GQA | Grouped Query Attention — shares K/V heads to reduce inference memory | [§07](#grouped-query-attention-gqa) |
| Flash Attention | Hardware-efficient attention computation that avoids O(n²) memory | [§07](#flash-attention) |
| KV Cache | Cached Key/Value vectors to avoid recomputing past tokens during generation | [§07](#kv-cache) |
| Vision Transformer (ViT) | Transformer applied to image patches instead of text tokens | [§08](#08--transformers-beyond-text) |