# Intro to Large Language Models

> From the transformer breakthrough to tokens, context windows, and how today's most powerful models actually think.

---

## Table of Contents

- [01 — What is an LLM?](#01--what-is-a-large-language-model)
- [02 — The Breakthrough](#02--the-breakthrough--attention-is-all-you-need)
- [03 — Tokens](#03--tokens--the-unit-of-language)
  - [How Tokenization Works](#how-tokenization-works)
  - [Tokens Across Different Models](#tokens-across-different-models)
  - [Context Windows](#context-windows--why-they-matter)
- [04 — How LLMs Work](#04--how-llms-actually-work)
  - [Self-Attention](#self-attention--the-core-mechanism)
  - [Training](#training--pretraining--fine-tuning)
- [05 — Model Comparison](#05--model-families--architectures)
- [06 — Reasoning Models](#06--reasoning-models--a-new-paradigm)
- [Index](#index)

---

## 01 — What is a Large Language Model?

A **Large Language Model (LLM)** is a type of AI trained on enormous amounts of text data — books, websites, code, research papers — to predict and generate human language. At its core, it's a probability machine: given some input text, it calculates the most likely next word, then the next, and so on.

The "large" in LLM refers to two things: the size of the training data (often hundreds of billions to trillions of words) and the number of **parameters** — the internal numerical weights that the model learns during training. Models like GPT-4, Claude, and Gemini have hundreds of billions of parameters.

> **Key Concept:** A parameter is a single number the model adjusts during training. A model with 70 billion parameters has 70 billion of these numbers working together to transform your input into a response.

LLMs don't "know" things the way humans do — they don't have beliefs, memory between conversations (by default), or real understanding. What they have is an extraordinarily refined statistical map of how language works, which produces outputs that *appear* deeply intelligent.

---

## 02 — The Breakthrough — "Attention Is All You Need"

Before 2017, language AI was limited. Models processed text word-by-word in sequence (RNNs and LSTMs), meaning they struggled with long documents and couldn't parallelize training efficiently. Then came the paper that changed everything.

### Timeline

**2017 — "Attention Is All You Need" (Google Brain)**
Researchers introduced the **Transformer architecture**, replacing sequential processing with a mechanism called *self-attention*. Every word could now relate to every other word in the input simultaneously. Training became massively parallelizable on GPUs.

**2018 — BERT & GPT-1**
Google released BERT (Bidirectional Encoder Representations from Transformers) for understanding tasks. OpenAI released GPT-1, showing that unsupervised pretraining on large text corpora produces powerful general-purpose language abilities.

**2020 — GPT-3, 175 Billion Parameters**
GPT-3 was a shock to the research community. At 175B parameters, it could write essays, answer questions, generate code, and more — all from a single model with no task-specific fine-tuning. The era of foundation models began.

**2022 — ChatGPT & RLHF**
OpenAI introduced ChatGPT, which added **Reinforcement Learning from Human Feedback (RLHF)** on top of GPT — human raters taught the model to be helpful, harmless, and honest. LLMs became consumer products overnight.

**2023–2025 — The Frontier Era**
Claude, Gemini, Mistral, LLaMA, and DeepSeek emerged. Models gained multimodal capabilities (images, audio), massive context windows, and specialized reasoning abilities. The field now advances monthly.

> **Why It Mattered:** The transformer allowed models to scale. More data + more compute + more parameters = reliably better models. This "scaling law" drove the LLM arms race that defines AI today.

---

## 03 — Tokens — The Unit of Language

LLMs don't read words — they read **tokens**. A token is a chunk of text, somewhere between a character and a word. The model converts all text — your input and its output — into sequences of tokens before doing any processing.

### How Tokenization Works

Most modern LLMs use a method called **Byte Pair Encoding (BPE)**. It starts with individual characters and repeatedly merges the most common pairs until it has a vocabulary of ~50,000–100,000 tokens. Common words become single tokens; rare words get split into multiple.

**Example — How text gets tokenized:**

```
"Transformers changed AI forever"
→ [Transform] [ers] [ changed] [ AI] [ forever]   — 5 tokens

"UnstructuredDataPipeline"
→ [Un] [struct] [ured] [Data] [Pipeline]           — 5 tokens

"def calculate(x):"
→ [def] [ calculate] [(] [x] [):]                 — 5 tokens
```

> **Rule of Thumb:** ~1 token ≈ ¾ of a word in English. 100 tokens ≈ 75 words. A full novel (~90,000 words) ≈ 120,000 tokens. Code and non-English languages often use more tokens per word.

### Tokens Across Different Models

Token limits and pricing vary significantly across models. This directly affects what tasks you can perform and at what cost.

| Model | Input Context | Output Limit | Vocab Size | Price (per 1M in/out) |
|---|---|---|---|---|
| Claude Sonnet 4.6 | 200K tokens | 64K tokens | ~100K | $3 / $15 |
| Claude Opus 4.6 | 200K tokens | 32K tokens | ~100K | $15 / $75 |
| Gemini 2.5 Pro | 1M tokens | 65K tokens | ~256K | $1.25 / $10 |
| GPT-4o | 128K tokens | 16K tokens | ~100K | $2.50 / $10 |
| DeepSeek R1 | 128K tokens | 32K tokens | ~102K | $0.55 / $2.19 |
| Llama 3.1 70B | 128K tokens | 4K tokens | ~128K | ~$0.12 / $0.30 |

### Context Windows — Why They Matter

The **context window** is the total number of tokens the model can "see" at once — your input + conversation history + its output. If you exceed the context window, the earliest content gets cut off (the model forgets the beginning of your conversation).

**Context Window Comparison:**

```
Gemini 2.5 Pro     ████████████████████████████████████████  1,000,000 tokens
Claude 4.6         ████████                                     200,000 tokens
GPT-4o             █████                                        128,000 tokens
DeepSeek R1        █████                                        128,000 tokens
Llama 3.1 70B      █████                                        128,000 tokens
```

Context windows are why you can paste an entire codebase into Gemini 2.5 Pro but might need to chunk it for GPT-4o. Larger context = more powerful for long documents, multi-file coding, and lengthy research tasks.

---

## 04 — How LLMs Actually Work

Under the hood, an LLM is a neural network — specifically a **Transformer** — that converts tokens into vectors (lists of numbers), processes them through many layers, and outputs a probability distribution over the next token.

### Self-Attention — The Core Mechanism

The key innovation of the Transformer is **self-attention**. When processing the word "bank" in the sentence "I went to the bank to deposit money," self-attention lets the model relate "bank" to "deposit" and "money" to determine it means a financial institution — not a river bank.

For every token, the model computes three vectors:
- **Query** — what am I looking for?
- **Key** — what do I represent?
- **Value** — what should I contribute?

Attention scores between every pair of tokens determine how much each one influences the others.

> **In Plain Terms:** Self-attention lets every word in your prompt simultaneously "look at" every other word to understand context. This is why transformers handle long-range dependencies that stumped older sequential models.

### Training — Pretraining & Fine-Tuning

LLM training happens in two main phases:

**Pretraining** — The model is given massive text corpora (Common Crawl, Wikipedia, books, GitHub, etc.) and trained to predict the next token. It does this billions of times, adjusting its parameters via backpropagation. This is extremely compute-intensive — GPT-3 training was estimated to cost ~$5M in GPU time.

**Fine-tuning / RLHF** — After pretraining, the model is refined. Instruction fine-tuning teaches it to follow instructions. RLHF uses human raters to score responses, then trains the model to produce higher-rated outputs. This is why Claude, ChatGPT, and Gemini feel "aligned" rather than like raw text predictors.

> **Important Distinction:** Pretraining gives the model knowledge. Fine-tuning shapes its behavior. A base GPT model and ChatGPT have the same underlying weights — they're just tuned differently. Claude's helpfulness and safety constraints come from Anthropic's fine-tuning, not a different architecture.

---

## 05 — Model Families & Architectures

Different companies have taken different approaches to model architecture, training data, and specialization.

| Family | Architecture | Strengths | Notable Trait |
|---|---|---|---|
| Claude (Anthropic) | Dense Transformer | Reasoning, writing, coding, safety | Constitutional AI for alignment |
| GPT / o-series (OpenAI) | Dense Transformer | General purpose, tool use | o-series uses extended thinking chains |
| Gemini (Google) | Multimodal Transformer | Long context, vision, search | Native multimodal from the ground up |
| DeepSeek | MoE Transformer | Math, coding, cost efficiency | Only activates relevant parameter subsets |
| LLaMA (Meta) | Dense Transformer | Open source, customizable | Weights are public — run locally |
| Mistral | MoE Transformer | Efficiency, small footprint | Strong performance at small model sizes |

> **Mixture of Experts (MoE):** MoE models like DeepSeek and Mistral have a large total parameter count but only activate a *subset* of parameters per token — making them faster and cheaper to run while maintaining high quality. DeepSeek V3 has 671B total parameters but only activates ~37B per token.

---

## 06 — Reasoning Models — A New Paradigm

Standard LLMs generate responses token-by-token in a single forward pass. **Reasoning models** take a different approach: they spend extra compute *thinking* before answering, producing long internal chains of thought.

Models like DeepSeek R1, o3, and Claude Opus 4.6 with its "extended thinking" mode use this paradigm. They're trained with reinforcement learning to explore multiple solution paths, self-verify, and backtrack — much like a human working through a hard problem on scratch paper.

| Model | Thinking Style | Best For | Trade-off |
|---|---|---|---|
| Claude Sonnet 4.6 | Standard (fast) | Writing, coding, everyday tasks | Less deep on hard math/logic |
| Claude Opus 4.6 | Extended thinking (optional) | Complex multi-step problems | Slower, higher quota cost |
| DeepSeek R1 | Chain-of-thought (always on) | Math, algorithms, proofs | Verbose, slower responses |
| o3 (OpenAI) | Extended thinking (scalable) | Competitive coding, hard science | Very expensive at high compute |

> **Token Cost of Reasoning:** Reasoning models use many more tokens internally before producing an answer. A single o3-high response might consume 10,000–50,000 "thinking tokens" you never see — which is why they're expensive and slower. You're paying for compute time to think, not just output words.

---

## Index

| Term | Definition | Section |
|---|---|---|
| LLM | Large Language Model — AI trained on text to generate language | [§01](#01--what-is-a-large-language-model) |
| Parameters | Numerical weights learned during training — model's "knowledge" | [§01](#01--what-is-a-large-language-model) |
| Transformer | Neural network architecture powering all modern LLMs | [§02](#02--the-breakthrough--attention-is-all-you-need) |
| Scaling Laws | More data + compute + params = reliably better models | [§02](#02--the-breakthrough--attention-is-all-you-need) |
| Token | Subword text chunk — the unit LLMs process and generate | [§03](#03--tokens--the-unit-of-language) |
| BPE | Byte Pair Encoding — algorithm that creates tokens from text | [§03](#03--tokens--the-unit-of-language) |
| Tokenizer | Model-specific tool that converts text → token IDs | [§03](#03--tokens--the-unit-of-language) |
| Context Window | Max tokens the model can see at once (input + output) | [§03](#context-windows--why-they-matter) |
| Self-Attention | Mechanism letting every token relate to every other token | [§04](#self-attention--the-core-mechanism) |
| Query / Key / Value | Three vectors used in attention score computation | [§04](#self-attention--the-core-mechanism) |
| Pretraining | Training on raw text to predict next tokens — gives knowledge | [§04](#training--pretraining--fine-tuning) |
| Fine-tuning | Further training to shape model behavior post-pretraining | [§04](#training--pretraining--fine-tuning) |
| RLHF | Reinforcement Learning from Human Feedback — alignment method | [§04](#training--pretraining--fine-tuning) |
| MoE | Mixture of Experts — only activates a subset of params per token | [§05](#05--model-families--architectures) |
| Chain-of-Thought | Technique of generating step-by-step reasoning before answering | [§06](#06--reasoning-models--a-new-paradigm) |
| Reasoning Model | LLM that "thinks" using extended internal compute before responding | [§06](#06--reasoning-models--a-new-paradigm) |