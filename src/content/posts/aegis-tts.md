---
title: Distilling OmniVoice into Aegis
description: How I built a compact female Urdu TTS voice for CPU inference using data-level distillation and Piper.
createdAt: 2026-07-05
category: Speech AI
readingTime: 2 min
tags: [Urdu, Text-to-Speech, ONNX]
---

I built Aegis to make an open female Urdu voice practical on CPUs. The 61 MB ONNX model was trained on more than 32,000 filtered synthetic speech samples and released for Piper.

My [full technical write-up on Hugging Face](https://huggingface.co/blog/mahwizzzz/distilling-omnivoice-into-aegis) covers the motivation, data-level distillation, training, inference, and evaluation limits. You can also [download the voice](https://huggingface.co/mahwizzzz/piper-voice-ur-aegis-female).
