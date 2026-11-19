# AI Standards Reference

AI-specific standards for City of Amsterdam projects that build, train, fine-tune, or deploy AI models, including LLM applications and RAG systems. They extend the general standards (testing, secure coding, monitoring) and implement the EU AI Act requirements. Source: developers.amsterdam → AI.

Audience: AI engineers, data scientists, MLOps engineers, UX/UI designers, product owners.

## Table of Contents

- [Data Governance & Quality](#data-governance--quality)
- [Model Architecture & Robustness](#model-architecture--robustness)
- [Fairness & Bias Mitigation](#fairness--bias-mitigation)
- [Human Oversight & Operational Boundaries](#human-oversight--operational-boundaries)
- [Transparency & Disclosures](#transparency--disclosures)
- [AI Cybersecurity](#ai-cybersecurity)
- [Post-Market Monitoring](#post-market-monitoring)
- [Notebooks vs Production Code](#notebooks-vs-production-code)

## Data Governance & Quality

AI Act Art. 10. Record all decisions (preprocessing, augmentation, inclusion/exclusion criteria) in the **Data Template**.

- [ ] Version every dataset (e.g. DVC) and link each data version to a model version
- [ ] Separate and document Training, Validation (tuning) and hold-out Test sets
- [ ] RAG: version and log the chunking strategy (size + overlap), the embedding model version/hash, and the vector index snapshot used in testing
- [ ] Automated validation: completeness, outliers, corrupt files, duplicates, schema
- [ ] Document representativeness and known data gaps and their impact
- [ ] Annotation: define annotator qualifications; dual-labeling with audit trail (e.g. CVAT)
- [ ] Data-quality checks are a mandatory MLOps stage before training

Avoid: unversioned data, test data leaking into training/validation, ignoring skewed distributions.

## Model Architecture & Robustness

AI-specific addendum to the general testing standard.

- [ ] State the architecture and algorithmic logic (e.g. ResNet-50 CNN, Random Forest)
- [ ] Document optimization goals and trade-offs (e.g. recall over precision)
- [ ] Unique, versioned model artifact identifier (e.g. `BosFauna-CNN-v1.0.pth`)
- [ ] Final evaluation only on a representative, strictly held-out test set
- [ ] Disaggregated metrics (precision, recall, F1, AUC-ROC) per class/subgroup, not just overall accuracy
- [ ] LLM / generative: evaluate with Ragas, TruLens or similar; score **faithfulness** (hallucination), **answer relevance**, **context precision**
- [ ] Noise/perturbation tests that mimic the deployment environment; document the expected performance drop
- [ ] Confidence thresholds with a programmatic fail-safe (defer to a human below e.g. `0.75`)
- [ ] Versioned change log: retraining, architecture changes, ML library updates
- [ ] Any deviation from technical baselines is signed off and logged as a **Compliance/Management Decision**

Avoid: final evaluation on the validation set, aggregate-only metrics, undocumented black-box models. Architecture changes trigger a fairness re-evaluation.

## Fairness & Bias Mitigation

Document trade-offs in the **Bias Template**. Processing special-category personal data for bias mitigation needs a legal basis (GDPR, AI Act Art. 10(5)).

- [ ] List protected characteristics (EU non-discrimination law + context of use)
- [ ] Choose fairness metrics: demographic parity, equalized odds, equal opportunity, per-class F1, accuracy disparity
- [ ] Set quantifiable thresholds **before** testing (e.g. "per-class F1 ≥ 0.70")
- [ ] LLMs: run the bias, toxicity and stereotyping tests from [GRIP on LLMs](https://github.com/Amsterdam/grip-on-llms)
- [ ] Baseline bias analysis on the training data before mitigation
- [ ] Apply and document mitigation: pre-processing (re-sampling, re-weighting, augmentation), in-processing (class-weighted / focal loss), post-processing (threshold adjustment)
- [ ] Final fairness evaluation on the unseen hold-out set after mitigation
- [ ] Counterfactual tests, or error analysis on the worst-performing subgroups
- [ ] Production fairness monitoring with alerts per subgroup; feed user corrections back

Avoid: setting thresholds after testing, relying on overall accuracy, deploying without a bias-drift monitoring plan.

Further reading: [The Fairness Handbook](https://openresearch.amsterdam/nl/page/87589/the-fairness-handbook).

## Human Oversight & Operational Boundaries

The "Instructions for Use" for the deployer.

- [ ] Precise intended purpose and operational environment
- [ ] Explicit list of prohibited / foreseeable misuses
- [ ] Oversight model by risk profile:

| Model | Meaning |
|-------|---------|
| Human-in-the-Loop (HitL) | AI recommends; a human approves every decision |
| Human-on-the-Loop (HotL) | AI acts autonomously; a human monitors and can intervene |
| Human-in-Command (HiC) | Humans set constraints, review aggregates, can shut it down |

- [ ] Define operator qualifications and training
- [ ] UI lets operators disregard, override, correct, or reverse outputs (accessible per WCAG)
- [ ] Log every override (input for bias monitoring and retraining)
- [ ] Stop/abort switch for high-stakes or physical systems
- [ ] Instructions for low-confidence output (e.g. "< 75% → flagged, verify manually")
- [ ] Prevent automation bias: present outputs as probabilistic recommendations, not facts

Avoid: rubber-stamp approval flows, function creep, autonomous systems without override.

## Transparency & Disclosures

- [ ] Tell users explicitly they're interacting with AI (chatbots, automated decisions, agents)
- [ ] Persistent UI cue (banner, intro disclaimer) throughout the interaction
- [ ] Human-readable label on AI-generated or AI-manipulated content ("Dit rapport is gemaakt met AI")
- [ ] Machine-readable provenance metadata / watermarks where applicable (media, deepfakes)
- [ ] Plain-language explanation of how the system works and what data it uses
- [ ] Disclose known limitations (e.g. knowledge cutoff, error-prone areas)
- [ ] Explain how to escalate to a human

Avoid: anthropomorphizing the AI to pass as human, hiding disclosures in terms of service, presenting AI output as solely human-authored. Build disclosures with Amsterdam Design System components and write them per `amsterdam-stijl`.

## AI Cybersecurity

On top of the general secure-coding standard.

- [ ] Validate inference inputs against a schema (shape, dimensions, encoding); in Python APIs use **Pydantic**
- [ ] Out-of-distribution detection at the API gateway; log anomalous requests
- [ ] Adversarial/perturbation testing where applicable (e.g. FGSM)
- [ ] Protect training data stores against poisoning; cryptographically validate batch training files
- [ ] LLM apps: guardrails against **prompt injection**, **jailbreaks**, **system prompt leakage**
- [ ] Don't expose model internals (full probability distributions, gradients) that enable inversion/extraction
- [ ] Strict rate limiting on inference endpoints
- [ ] Verify signatures/hashes of third-party weights and tokenizers; load only from trusted registries; scan `.pkl` / `.h5` / `.pt` for code execution before loading

Avoid: skipping validation because "the model handles noise", serving weights over unauthenticated networks, trusting open-source checkpoints blindly.

## Post-Market Monitoring

AI-specific extension of the general monitoring standard.

- [ ] Monitor data drift and concept drift against the training distribution
- [ ] Log custom AI telemetry: confidence scores, inference latency, edge-case frequency
- [ ] Alerts on performance thresholds (e.g. weekly mean confidence −15%)
- [ ] Continuously track the fairness metrics from the bias standard
- [ ] SLAs and procedures for retraining and patching
- [ ] Retraining uses verified data per the data-governance standard; version-bump and re-test every retrained model
- [ ] Log operator overrides and feed them into retraining

Avoid: fire-and-forget deployments, unvalidated auto-retraining (model collapse), logging raw sensitive input. Control cost: minimal retention, log aggregates instead of raw text/images, sample high-throughput traffic.

## Notebooks vs Production Code

- Jupyter notebooks are allowed for exploration and analysis
- Before deployment, refactor into modular, testable `.py` files that follow the testing and code-review standards
- Don't submit notebooks for production code review; if one is committed, strip all outputs first (e.g. `nbstripout`)
