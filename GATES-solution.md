# Gates: Pathway Track solution build (Solution Prompt Steps 1-4 + Iteration audit)

OWNS: **

Scope: Execute the user's 4-step Solution Prompt against the official `Pathway PS.pdf`
brief (Test-Time Adaptation, framed through ARC-AGI-style abstract reasoning, with a
mandatory BDH/BDH-CQ module), pausing for explicit user approval after each step. After
Step 4 is approved, run the Iteration Prompt as a single critical audit of all four
outputs, present it, and only finalize code/summary after that audit is approved too.

- [x] G1: Step 1 (one-sentence claim) is exactly one sentence, names the chosen topic's
  core mechanism (recurrent-state adaptation vs. parameter-update adaptation) and the
  ARC-AGI/abstract-reasoning framing, and is falsifiable inside a toy substrate (not a
  restatement of the approved-topic description).
  CHECK: node "/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/scripts/verify-claim.mjs"
  EXPECT: CLAIM_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=401ab995642bb0dcfc2c2426c242565bc64034d33eff496051a5820fe9a3e6aa; exit=0; EXPECT=matched; output-sha256=c94ab68353119ccfbd7b9536c89c8b173526ac6e473121d6ed2c0cf9fae700a8; output-bytes=412; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Competition/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G2: Step 2 (interactive substrate design) names exact manipulable variables, a
  sub-second feedback path, a "truth beside estimate" comparison, and a running-preset
  default (Step 2 blocked until user approves Step 1).
  CHECK: node "/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/scripts/verify-substrate.mjs"
  EXPECT: SUBSTRATE_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=0869967d22d0ee2848b8cb2df75d02afdc76e601e9aae7737bba0d4268a8fcbe; exit=0; EXPECT=matched; output-sha256=d9777cbe14bbf9321e678497650bb12c0d917e771fc158ca2ea494bc4ee8cecf; output-bytes=60; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Competition/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G3: Step 3 (BDH/BDH-CQ module) cites primary BDH/BDH-CQ sources for its equations
  and claims, states plainly which system (BDH vs BDH-CQ) is meant, and is woven into the
  main flow rather than appended (Step 3 blocked until user approves Step 2).
  CHECK: node "/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/scripts/verify-bdh-module.mjs"
  EXPECT: BDH_MODULE_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=c5b0f5139c907df60acff9e59df05683b25da81fffc2fd2e0e157acdef0b740b; exit=0; EXPECT=matched; output-sha256=f3734b1addbcfd946e890052d4faaff1fe684023deb281efa7b82b8c371b9f8d; output-bytes=51; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Competition/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G4: Step 4 (one-page concept summary) is 500-950 words, contains zero flagged
  "AI slop" markers (banned stock phrases), and cites 3+ primary papers 2022-2026 with
  citations placed beside the technical claims they support (Step 4 blocked until user
  approves Step 3).
  CHECK: node "/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/scripts/verify-summary.mjs"
  EXPECT: SUMMARY_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=407eb742bf4411186f4435f17d1de24cacb4ee7359402fc5b38a85be9cfcdef8; exit=0; EXPECT=matched; output-sha256=ba9f2162487d0364577d7a0294c482abaee08e4b5bfa2f84e2ef824380035c0f; output-bytes=99; shell=/bin/sh; cwd=/Users/virajvekariya/Desktop/Competition/Prem/Data Forge; path=26afc6890493/20 entries

- [x] G5: The Iteration Prompt's 4-part audit is produced as a bulleted critique
  (Audit 1-4) of the approved Steps 1-4, and no code/summary is finalized before the user
  approves that critique (blocked until Step 4 is approved).
  EVIDENCE: manual — critique posted in chat and persisted at
  "Pathway Solution/05-iteration-audit.md", covering Audit 1-4 each with concrete
  findings and fixes (not just confirmations); code and final summary document
  deliberately NOT started/finalized, pending the user's explicit approval of this
  critique, per the user's own iteration-prompt instruction.

<!-- Gates unlock sequentially by explicit user approval, per the user's own stepwise
process instruction, not by agent judgment. Each unlock is recorded as EVIDENCE on the
prior gate before the next gate's CHECK is written and run. -->
