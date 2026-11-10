# Gates: Data Forge 2026 hackathon strategy PDF (run Prompts 1-3, output as PDF)

OWNS: **

Scope: Execute Prompt 1 (research), Prompt 2 (track selection judgment), and Prompt 3
(solution assembly) from `Untitled document.pdf` in order, and deliver one readable PDF
in `Data Forge/` containing all three outputs plus the 500-950 word one-page concept
summary required by Track B.

- [x] G1: Combined source content covers all three prompts' required subsections.
  CHECK: node /private/tmp/claude-501/-Users-virajvekariya-Desktop-Prem/7e25d0b9-079b-4474-9964-ce3b40edd591/scratchpad/scripts/verify-sections.mjs
  EXPECT: SECTIONS_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=df44e47638a50f1b3b095cc6c531b6e0622ca7b0937026e21ceed81b9f2cca3c; exit=0; EXPECT=matched; output-sha256=3dd3328f2ce4d3b30ae22019d0ac0b7cf21a2e9df9666929169752b95a4fd052; output-bytes=12; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G2: One-page Track B concept summary is between 500 and 950 words (Track B hard constraint).
  CHECK: node /private/tmp/claude-501/-Users-virajvekariya-Desktop-Prem/7e25d0b9-079b-4474-9964-ce3b40edd591/scratchpad/scripts/verify-word-count.mjs
  EXPECT: WORDCOUNT_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=49cba14e96f5a987537dcc40515610df4422329fcd5f9260a6fb069d5cc88778; exit=0; EXPECT=matched; output-sha256=58d9399b9967de280ba7de0a1db9268c00f22382fea6df4dee567515d1061aa6; output-bytes=57; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G3: Final PDF exists in Data Forge/, is multi-page, and its extracted text contains all three prompts' key markers (proves the PDF, not just the source HTML, carries the content).
  CHECK: node /private/tmp/claude-501/-Users-virajvekariya-Desktop-Prem/7e25d0b9-079b-4474-9964-ce3b40edd591/scratchpad/scripts/verify-pdf.mjs
  EXPECT: PDF_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=8ce2df2e02ff380cea629d3db58370bd6cc49d6b18c6410b100f27c2026db6ca; exit=0; EXPECT=matched; output-sha256=e642c0c95542b2f6a13eb612404301932982c462fd477e3954d5aaa0b3dc89e9; output-bytes=21; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G4: Technical claims about Rime/LiveKit interruption handling and Pathway BDH/BDH-CQ are grounded in real, current sources (not fabricated), reviewed manually against the web research gathered this session (pathway.com/research/bdh-explainer, arxiv 2509.26507, arxiv 2608.09888, docs.livekit.io Rime + adaptive interruption docs, docs.rime.ai).
  EVIDENCE: manual — checked against WebSearch/WebFetch results gathered this session before drafting: (1) BDH derivation-from-attention, Hebbian updates, sparse non-negative activations, BDH-GPU low-rank variant — pathway.com/research/bdh-explainer and arXiv:2509.26507; (2) BDH-CQ's two recurrences (contextual memory + latent workspace), no verbalized CoT, 150M params / 29.5% pass@2 / ~$0.0007 per task on ARC-AGI-1, ~11x cheaper than GPT-5.6 Luna (low) — arXiv:2608.09888; (3) Rime WebSocket streaming (use_websocket=True, word-level timestamps) and LiveKit Agents plugin behavior — docs.livekit.io Rime TTS plugin docs and rime.ai LiveKit integration page; (4) VAD-triggered barge-in cancelling TTS/rolling back the LLM turn, and the ~1s adaptive-interruption cooldown window — docs.livekit.io adaptive interruption handling docs. The hackathon's own name/dates/sponsors were confirmed via hackathonradar.com/database/hackathon/dataforge-2026 (Data Forge 2026, 21 Aug-12 Sep 2026, Pathway + Rime sponsors), matching the working folder name. No claim in the PDF was invented without a corresponding fetched source; numeric figures (TTFA/cancellation thresholds, word-count range, rubric percentages) were copied verbatim from the brief itself, not fabricated.
