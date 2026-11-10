# Step 2 — Interactive Substrate Design

## Disclaimer (stated up front, in the UI copy itself, not only here)
This is an independent toy model illustrating the BDH-CQ mechanism described in
Pathway's published work (recurrent-state adaptation, no parameter update at
inference). It is not the official BDH-CQ checkpoint and is never presented as one.

## Puzzle family ("Mini-ARC")
- 4x4 grids, 4 colors per cell -> chance baseline = 25% per-cell accuracy (stated,
  not hidden).
- 6 hidden transformation types: rotate90, rotate180, h-flip, v-flip, fixed color
  permutation, translate-by-1 (wraparound).
- 8 precomputed puzzle instances shipped as static data (grid_size=4, num_colors=4).
- Each instance: up to 5 demonstration pairs (input grid, output grid) + 1 held-out
  query (input shown, output withheld from the learner, known to the harness for
  scoring).

## The model (frozen weights vs. live state)
- Trained parameters: encoder/decoder weights, fit once offline via backprop over a
  large synthetic set of the same 6 transformation types, then frozen. These never
  change while the page runs.
- Recurrent state: a fixed-width (64-dim) contextual memory M, written additively per
  demonstration via a Hebbian-style update M_d = M_(d-1) + eta * f(demo_d), matching
  BDH's synaptic-write mechanism referenced in the BDH module (Step 3).
  the state, not the weights, is what "adapts" at inference.
- Query-side latent refinement is fixed at 4 steps (not exposed as a control -- see
  Errors Found, item 1).

## Controls (exactly 3, each maps to one real variable)
| Control | Type | Range | What it actually changes |
|---|---|---|---|
| Puzzle | dropdown | 8 instances | which hidden transformation/task is loaded |
| Demonstrations shown (D) | slider | 0-5 | how many demo pairs are folded into memory M before the query |
| Reset state before query | toggle | off/on | zeroes M immediately before the final query refinement; weights untouched |

## Truth beside estimate
Two 4x4 grids side by side: "Ground truth" (query's real output, labeled as known-for-
teaching-purposes) and "Model prediction" (live-computed), with per-cell green/red
match highlighting, plus a headline "Per-cell accuracy: X% (chance = 25%)" that
recomputes on every control change.

## Preset on load (no blank canvas)
Opens on puzzle #1 (90-degree rotation), D=3, reset=OFF, already showing a live,
correct-looking prediction beside ground truth. A one-line caption points at the reset
toggle: "This model just read 3 examples of the hidden rule into memory. Watch what
happens if that memory is erased right before it answers."

## Guide, then sandbox
1. Guided state (as above, running by default).
2. Learner flips reset ON (or clicks "Try it") -> per-cell accuracy collapses toward
   the 25% chance line, which is drawn on the accuracy readout for comparison.
3. Sandbox unlocks: all 3 controls freely adjustable across all 8 puzzles.

## Fast feedback (why live computation, not precomputation, is safe here)
Frozen model is small (<50k parameters, 64-dim state, 4 fixed refinement steps, 4x4
grids) -> a forward pass is microseconds of arithmetic in-browser. Computation is
genuinely live at interaction time, not a lookup table, which is stronger evidence for
"Technical ownership and live defense" than precomputed results would be.

## Data payload schema (static JSON, loaded once)
```json
{
  "puzzles": [
    {
      "id": "rotate90-a",
      "grid_size": 4,
      "num_colors": 4,
      "demos": [{"input": [[0,1,2,3], ["..."]], "output": [["..."]]}],
      "query": {"input": [["..."]], "output": [["..."]]}
    }
  ],
  "model_meta": {
    "state_width": 64,
    "query_refinement_steps": 4,
    "chance_baseline_per_cell": 0.25
  }
}
```
Frozen weights ship separately as `weights.json` (quantized floats), loaded once.

## Caps and limits (stated, not hidden)
- Grid fixed at 4x4, 4 colors: chance baseline = 25%.
- Contextual memory width fixed at 64.
- Query refinement steps fixed at 4 (not a control).
- Demonstration slider capped at 0-5 (bank precomputes up to 5 demos per puzzle).
- 8 puzzle instances total in this build; no claim of generalization beyond them.

## Errors found and fixed during this design pass
1. Control-naming collision: an earlier draft called the demo-count control "K", which
   collides with BDH-CQ's separate query-refinement-depth K from the Step 1/earlier
   research. Renamed to "D" (demonstrations) and fixed refinement steps as a stated
   constant instead of a 4th control, so the substrate tests exactly the Step 1 claim
   and nothing else ("one claim" design standard).
2. Metric choice: exact-grid-match accuracy would be near-binary (almost always 0% or
   100%) and wouldn't show a legible "collapse toward chance." Switched to per-cell
   accuracy with an explicit 25% chance baseline drawn on the readout.
3. Mislabeling risk: added the toy-model disclaimer into the on-page copy itself (not
   only supporting docs), and split "weights" (frozen) from "state" (resettable) as
   distinct, separately-labeled UI elements, so a judge questioning the team live can't
   mistake the reset toggle for a weight reset.
4. Latency-feasibility check: confirmed the frozen model's size (<50k params) makes a
   live in-browser forward pass a microsecond-scale operation, so true live computation
   -- not a precomputed lookup table -- safely meets the sub-second feedback bar.
5. Unverified-claim risk: the "reset collapses accuracy toward chance" behavior is a
   design intent, not yet an empirical fact -- it must be measured once the toy model is
   actually trained and is carried forward as a build-time validation requirement
   (a gate), not asserted as already true.
6. Scope creep against "few controls": removed a tempting 4th slider for query-side
   refinement depth; it is now a stated fixed constant, keeping exactly 3 controls, each
   mapped to a real variable in the Step 1 claim.
