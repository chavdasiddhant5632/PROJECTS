# Iteration Prompt — Critical Audit of Steps 1-4

Code and the final summary document are deliberately NOT started/finalized while this
critique is outstanding, per the user's own iteration-prompt instruction.

## Audit 1: The One-Sentence Claim
- Finding: "collapses toward chance" is directional, not a sharp falsification
  criterion -- a 2-point drop and a 20-point drop would both "count" as-is, which
  weakens what "falsifiable" buys us. Fix: define a numeric operational threshold at
  build time (e.g. "collapse" = landing within ~5 points of the 25% chance baseline,
  or a minimum-magnitude drop consistent across the 8-puzzle bank) as a build-time
  validation gate, without rewriting the approved sentence.
- Finding: the claim's causal language ("lives entirely in state") is stronger than a
  single ablation can prove -- it shows accuracy depends on state, not that nothing
  else (e.g. query-encoding leakage) contributes. Fix: add an explicit second control
  -- D=0 (no demonstrations ever stored) should land at the same chance floor as
  reset-after-D>0; call this out as a named control when building, not just an
  incidental sandbox state.
- Otherwise stands: genuinely falsifiable and specific, not a restated definition.

## Audit 2: Interactive Substrate & Code
- Confirmed: no scripted animation or decorative sliders. Exact variables: Puzzle
  (categorical, 8 values), D (integer, 0-5), Reset (boolean) -- all three map to real
  mechanism components.
- Finding: "sub-second feedback" is currently a parameter-count argument, not a
  measurement. Fix: instrument the actual forward pass (e.g. performance.now() around
  it, report p95) as a build-time gate.
- Finding: the original prompt assumed a precomputed JSON payload; this design
  deliberately uses live computation instead (justified: the model is cheap enough,
  and live computation is stronger evidence for "technical ownership" than a lookup
  table) -- but Step 2 didn't flag this deviation explicitly. The JSON schema already
  specified is for the static puzzle bank (inputs/outputs/demos), not precomputed
  predictions; state that distinction plainly in the README.
- Finding: the schema example itself has a real error -- `"input": [[0,1,2,3],
  ["..."]]` mixes a real row with a placeholder-string row inline, which is malformed
  as a template. Fix when building: use a fully consistent placeholder convention or
  one fully worked concrete example, not a mix.

## Audit 3: BDH / BDH-CQ Integration
- Accurately reflects state-not-weights adaptation, grounded in the paper's actual
  recurrence equations (`S_t = U_theta(S_{t-1}, D_t)`, `H_{r+1} = F_theta(H_r, S_K)`)
  rather than the earlier generic Hebbian formula -- a real correction, not cosmetic.
- Designed to be woven in at the toggle interaction, not appended -- currently a design
  intent; nothing is built yet, so this is a risk to track at implementation time, not
  a settled fact.
- Finding: the reset-before-query ablation is not itself a documented BDH-CQ
  experiment. The paper establishes the mechanism (adaptation lives in state, weights
  frozen); it does not describe a "wipe state and re-run" ablation. That specific test
  is this project's own diagnostic, invented to make the mechanism falsifiable, not
  something cited from the literature. State this precisely in the README/BDH module
  -- conflating "the mechanism is paper-grounded" with "this specific test is
  paper-grounded" is exactly what a live-defense question would catch.

## Audit 4: One-Page Summary
- AI-slop phrases: the mechanical check caught one ("not just a description" -- fixed
  to "rather than a description"). Manual re-read found no further padding, undefined
  buzzwords, or invented numbers; the 11x-vs-50x cost-multiplier ambiguity is flagged
  rather than resolved by picking the more flattering number.
- Cost-accuracy Pareto comparison against other reasoning systems: present (HRM/TRM
  table + framing).
- Citations: 4 distinct primary papers, 2025-2026 (BDH-CQ 2608.09888, HRM 2506.21734,
  TRM 2510.04871, TRM-analysis 2512.11847) -- clears the "3+" bar.
- Finding: BDH itself (the parent architecture, arXiv:2509.26507) is never mentioned
  in the summary, and its absence isn't explained. The PS explicitly permits unequal
  relevance ("if one has no direct role... say so rather than inventing a connection")
  but expects that to be stated, not silent. Fix: add one sentence noting BDH is the
  parent architecture supplying BDH-CQ's Hebbian/sparse formalism but isn't itself
  directly tested by this artifact.
- Finding: the "unanswered question" is about this project's own untested toy
  artifact, not about the published BDH-CQ system. Sharper version: the BDH-CQ paper
  itself doesn't report how pass@2 scales with demonstration count, or fix a published
  value for refinement depth R -- a real evidence gap in the literature, distinct from
  "we haven't built and tested our toy yet." Fix: reframe the limitation to lead with
  the literature's gap, then note the artifact is built specifically to probe it.

## Net assessment
No fatal errors -- the core mechanism, equations, and citations are sound and
primary-sourced. Real findings: two miscalibrations (claim needs a numeric collapse
threshold; "sub-second" needs an actual measurement) and three precision gaps
(own-diagnostic vs. published-ablation; malformed JSON-schema example; BDH's absence
from the summary unexplained). All are fixable in the build phase without touching
what's already approved.
