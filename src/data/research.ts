// Deliberately curated. Hub syncs must never expand this selection automatically.
export type DemoId = 'cadenza' | 'qalb' | 'lafzyn';
export type ResearchCategory = 'All work' | 'Speech & phonetics' | 'Language models' | 'Open source';

export const demos: Record<DemoId, {
  name: string; task: string; description: string; spaceUrl: string; embedUrl: string;
}> = {
  cadenza: {
    name: 'Cadenza', task: 'Text → speech',
    description: 'Give Urdu text a voice. Enter your text in the Space below and listen to the generated audio.',
    spaceUrl: 'https://huggingface.co/spaces/mahwizzzz/cadenza-tts',
    embedUrl: 'https://mahwizzzz-cadenza-tts.hf.space',
  },
  qalb: {
    name: 'Qalb-DPO', task: 'Prompt → responses',
    description: 'Explore Urdu language generation and compare model responses in the hosted Qalb demo.',
    spaceUrl: 'https://huggingface.co/spaces/mahwizzzz/Qalb-DPO',
    embedUrl: 'https://mahwizzzz-qalb-dpo.hf.space',
  },
  lafzyn: {
    name: 'Lafzyn', task: 'Urdu → IPA',
    description: 'Explore how an Urdu word or phrase is transcribed into the International Phonetic Alphabet.',
    spaceUrl: 'https://huggingface.co/spaces/mahwizzzz/lafzyn',
    embedUrl: 'https://mahwizzzz-lafzyn.hf.space',
  },
};

export interface SelectedResearch {
  id: string;
  name: string;
  category: Exclude<ResearchCategory, 'All work'>;
  label: string;
  description: string;
  tags: string[];
  url: string;
  linkLabel: string;
  demo?: DemoId;
  details: { label: string; value: string }[];
  note: string;
}

export const selectedResearch: SelectedResearch[] = [
  {
    id: 'cadenza', name: 'Cadenza', category: 'Speech & phonetics', label: 'Urdu speech synthesis',
    description: 'From written Urdu to spoken expression. An interactive space to explore Urdu text-to-speech.',
    tags: ['Urdu', 'Text-to-speech', 'Interactive demo'],
    url: demos.cadenza.spaceUrl, linkLabel: 'View Space', demo: 'cadenza',
    details: [{ label: 'Input', value: 'Urdu text' }, { label: 'Output', value: 'Generated speech' }, { label: 'Try it', value: 'Generate and listen in the embedded Space below.' }],
    note: 'Inference runs on Hugging Face 🤗. Voice choices and generation controls are supplied by the current Space.',
  },
  {
    id: 'qalb', name: 'Qalb-DPO', category: 'Language models', label: 'Urdu language generation',
    description: 'Explore preference-tuned Urdu generation through a side-by-side model comparison.',
    tags: ['Urdu', 'DPO', 'Model comparison'],
    url: 'https://huggingface.co/mahwizzzz/Qalb-1.0-8B-DPO', linkLabel: 'Model card', demo: 'qalb',
    details: [{ label: 'Checkpoint', value: 'mahwizzzz/Qalb-1.0-8B-DPO' }, { label: 'Demo', value: 'Qalb Urdu LLM Comparison' }],
    note: 'The interactive demo illustrates model behavior; it is not a held-out evaluation. Consult the model card for attribution, training, and licensing.',
  },
  {
    id: 'avey', name: 'Avey-B Urdu', category: 'Language models', label: 'A compact Urdu encoder',
    description: 'A 24.87M-parameter masked-language encoder, trained from scratch for Urdu representations and downstream tasks.',
    tags: ['24.87M parameters', 'Fill-mask', 'Apache-2.0'],
    url: 'https://huggingface.co/mahwizzzz/avey-b-ur', linkLabel: 'Model card',
    details: [{ label: 'Architecture', value: 'Urdu adaptation of Avey-B by Devang Acharya and Mohammad Hammoud (ICLR 2026).' }, { label: 'Training', value: 'HPLT 3.0 Urdu, quality bins 10 and 9; 20,000 steps; sequence length 512.' }, { label: 'Reported sentiment accuracy', value: '78.53% on machine-translated movie reviews.' }, { label: 'Reported WikiANN Urdu NER F1', value: '81.27; model-card result, not an independent replication.' }],
    note: 'An encoder, not a chat model. These results do not claim the upstream Avey-B paper’s benchmarks. Evaluate on native, domain-specific Urdu before production use.',
  },
  {
    id: 'lafzyn', name: 'Lafzyn', category: 'Speech & phonetics', label: 'The shape of pronunciation',
    description: 'Urdu script to IPA. A pronunciation layer for speech synthesis, dictionaries, and linguistic tools.',
    tags: ['Urdu → IPA', 'Qwen3.5-0.8B', 'GGUF available'],
    url: 'https://huggingface.co/mahwizzzz/lafzyn', linkLabel: 'Model card', demo: 'lafzyn',
    details: [{ label: 'Base model', value: 'Qwen/Qwen3.5-0.8B; fine-tuned on 100,000 Urdu–IPA pairs.' }, { label: 'Reported mean PER', value: '16.94%, measured as character-level edit distance on IPA strings.' }, { label: 'Evaluation set', value: '500 held-out samples from the phoneme map; 88 exact transcriptions.' }],
    note: 'Split overlap is not fully specified, and training-pair sources and licensing are not identified. Rare compounds and Arabic loanwords show higher errors. Repository license: Apache-2.0.',
  },
  {
    id: 'piper', name: 'Aegis for Piper', category: 'Open source', label: 'Contributing an Urdu voice',
    description: 'A female Urdu voice contributed to rhasspy/piper-voices, packaged for the Piper speech ecosystem.',
    tags: ['ur_PK', 'ONNX', '22,050 Hz'],
    url: 'https://huggingface.co/rhasspy/piper-voices/discussions/89', linkLabel: 'View contribution',
    details: [{ label: 'Contribution', value: 'Pull request #89: Add Urdu female voice Aegis.' }, { label: 'Voice key', value: 'ur_PK-aegis_female-medium' }, { label: 'Package', value: 'ONNX model, Piper configuration, model card, sample audio, and voices.json entry.' }, { label: 'Phonemizer', value: 'eSpeak ur · medium quality · 22,050 Hz sample rate.' }],
    note: 'Contributed by mahwizzzz. The upstream discussion records the maintainer’s acknowledgement and merge.',
  },
];

export const aveyUsage = `import torch
from transformers import AutoModelForMaskedLM, AutoTokenizer

repo = "mahwizzzz/avey-b-ur"
# Review the repository's custom code before enabling trust_remote_code.
tokenizer = AutoTokenizer.from_pretrained(repo, trust_remote_code=True)
model = AutoModelForMaskedLM.from_pretrained(repo, trust_remote_code=True).eval()

inputs = tokenizer("پاکستان کا دارالحکومت [MASK] ہے۔", return_tensors="pt")
with torch.inference_mode():
    logits = model(**inputs).logits

position = (inputs.input_ids[0] == tokenizer.mask_token_id).nonzero()[0, 0]
top_ids = logits[0, position].topk(5).indices
print(tokenizer.convert_ids_to_tokens(top_ids.tolist()))`;
