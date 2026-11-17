---
title: Urdu Streaming Zipformer 20M
metaTitle: Urdu Streaming ASR | Muhammad Mahwiz Khalil
description: A 20M-parameter streaming Urdu speech recognizer with a live microphone demo, reproducible benchmarks, and FP32/INT8 ONNX releases.
metaDescription: Test Muhammad Mahwiz Khalil's streaming Urdu ASR demo and inspect its code, dataset, release, and evaluation evidence.
featured: true
rank: 1
createdAt: 2026-11-01
repo: https://github.com/mwzkhalil/Urdu-Streaming-ASR
site: https://huggingface.co/spaces/mahwizzzz/Urdu_Streaming_ASR
heroImage: /images/projects/asr/fleurs-parameters.png
heroAlt: FLEURS Urdu word error rate plotted against model size for Urdu Streaming ASR and selected Whisper baselines
ctaLabel: Try live ASR
proof: ["20M parameters", "27.95% FLEURS subset WER", "66,601 training utterances"]
tags: [Streaming ASR, Zipformer, Urdu, ONNX]
---

**Speak Urdu and see the transcript in the [live demo](https://huggingface.co/spaces/mahwizzzz/Urdu_Streaming_ASR).**

<iframe title="Try Urdu Streaming ASR" src="https://mahwizzzz-urdu-streaming-asr.hf.space" loading="lazy" allow="microphone" referrerpolicy="strict-origin-when-cross-origin"></iframe>

## Results

![FLEURS word error rate versus model parameters](/images/projects/asr/fleurs-parameters.png)

*Model-size comparison from the project. WER depends on each model's evaluation protocol and decoder settings; these baselines are not strictly comparable by size alone.*

The released INT8 ONNX model reaches **27.95% WER / 12.10% CER** on a FLEURS Urdu test subset. The separate 299-utterance FLEURS evaluation reports **28.03% WER / 11.96% CER**. Results use modified beam search with four active paths, blank penalty 0.25, and normalized scoring.

## Engineering proof

- **20M parameters** in a streaming Zipformer transducer.
- **66,601 utterances / about 131 hours** in the curated training mix.
- **FP32 and INT8 ONNX** encoder, decoder, and joiner artifacts, plus a PyTorch checkpoint.
- Source includes tokenizer, training and inference scripts, benchmark reports, and third-party notices.

[Source and methodology](https://github.com/mwzkhalil/Urdu-Streaming-ASR) · [Dataset](https://huggingface.co/datasets/mahwizzzz/Urdu-Streaming-ASR-Data) · [Model and pinned release](https://huggingface.co/mahwizzzz/Urdu-Streaming-Zipformer-20M/tree/v1.2.0-rc1) · [Evaluation evidence](https://github.com/mwzkhalil/Urdu-Streaming-ASR/blob/main/reports/evaluation.json)
