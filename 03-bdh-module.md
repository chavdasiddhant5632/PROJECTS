# Step 3 — BDH / BDH-CQ Integration Module

## Which system, stated plainly
The substrate directly implements and tests **BDH-CQ** (arXiv:2608.09888, "BDH-CQ:
In-Context Learning with Recurrent Latent Reasoning", Engdahl, Kosowski, Chorowski et
al., 2026). **BDH** (arXiv:2509.26507, "The Dragon Hatchling: The Missing Link between
the Transformer and Models of the Brain") is the parent architecture whose Hebbian,
sparse-positive-activation formalism BDH-CQ's memory write inherits; BDH itself is not
directly tested by the demo, and this document says so rather than inventing a role
for it.

## Where this is woven into the flow (not appended)
The module fires at the exact interaction point in Step 2: the moment the learner
flips "Reset state before query." That single toggle *is* the BDH-CQ concept -- flipping
it live-annotates the screen with the equations below, mapped onto the same M, D and
"reset" the learner just touched. There is no separate "now let's learn some theory"
page.

## BDH: attention reframed as synaptic memory (arXiv:2509.26507, Section 2.2)
The paper defines fast-weight-like synaptic state variables sigma(i,j) on edges
between neurons (Definition 1). Two rules govern them (paraphrased from Section 2.2,
quoted fragments in quotes):
- Propagation: "X(i), sigma(i,j) -> A(j)" -- belief flows from neuron i to j in
  proportion to the edge's current synaptic strength.
- Hebbian write: "Y(i), X(j) -> sigma(i,j)" -- "co-presence of Y(i) followed by X(j)
  increases sigma(i,j) by Y(i)X(j)". This is the literal Hebbian rule: correlated
  activity strengthens the edge, by exactly the outer product of the two activations.
- The interaction kernel (Definition 1, Eq. 3) governing edge reweighting is
  `q_k' := (1 - d_k) q_k + sum_ij r_ijk q_i q_j`, i.e. each edge decays by a factor
  (1 - d_k) and is injected with a bilinear interaction term every step.
- Activations are enforced sparse and non-negative via ReLU thresholds; reported runs
  show roughly 5% of neurons active at a time (Section 6.4), with activity tracking
  predictability rather than a fixed sparsity budget.
- The paper's own scaling experiments cover 10M-1B parameters (Section 4.2), matching
  GPT2-architecture Transformer baselines. Pathway's own more recent public materials
  (cited in the track brief, not independently re-verified here) additionally report
  early pretraining runs from 1B up to 600B parameters and a Sudoku Extreme case study;
  those two figures are carried as brief-sourced, not primary-verified in this module.

## BDH-CQ: two-stage recurrence (arXiv:2608.09888)
BDH-CQ has two distinct recurrent updates, both with the underlying network's
parameters theta held fixed at inference:
- **Stage 1 -- contextual memory over demonstrations:** `S_t = U_theta(S_{t-1}, D_t)`.
  Each demonstration pair D_t folds into a fixed-size state S; after K demonstrations
  the state is S_K. No gradient step touches theta.
- **Stage 2 -- query-side latent refinement:** workspace H_0 is initialized from the
  query, then `H_{r+1} = F_theta(H_r, S_K)` for R recurrence steps, and the answer is
  decoded as `y_hat = G_theta(H_R)`. Reasoning is the trajectory of H, never verbalized.
- Adaptation to the specific unseen puzzle lives entirely in S_K (and the H trajectory
  it seeds) -- theta never changes. This is the literal mechanism Step 1's claim
  operationalizes as a toggle.

## Exact correspondence to the substrate
| Substrate element | BDH-CQ formalism |
|---|---|
| Memory M after D demos | S_K (state after K demonstrations; D in the substrate = K in the paper) |
| "Reset state before query" ON | forcing S_K -> S_0 (the empty state) immediately before Stage 2 begins |
| Frozen encoder/decoder weights | theta in U_theta, F_theta, G_theta -- never modified |
| 4 fixed query-refinement steps | **a toy-model implementation choice, not a published BDH-CQ hyperparameter** -- the paper does not fix R as a stated constant (see Errors Found, item 2) |

## Contrast with HRM / TRM (why "test-time adaptation" is the right topic)
- **HRM** (Wang et al., arXiv:2506.21734, "Hierarchical Reasoning Model", 2025): a
  two-timescale recurrent architecture trained with a one-step gradient approximation
  and adaptive computation; 27M parameters, 41% on ARC-AGI-1 with 1,000 training
  tasks. Its ARC pipeline uses per-puzzle learned identity embeddings and augmentation
  voting -- adaptation is folded into the training/optimization procedure.
- **TRM** ("Less is More: Recursive Reasoning with Tiny Networks", Jolicoeur-Martineau
  et al., arXiv:2510.04871, 2025): simplifies HRM's recursive core, keeping the same
  identity-embedding-plus-augmentation-voting inference recipe.
- A 2026 independent analysis of TRM (arXiv:2512.11847, "Tiny Recursive Models on
  ARC-AGI-1: Inductive Biases, Identity Conditioning, and Test-Time Compute") found
  that replacing the correct puzzle-identity embedding with a blank or random token
  collapses accuracy to zero, and that most of the accuracy gain saturates after the
  first recursion step -- i.e. TRM's apparent "recursion" is shallow and its adaptation
  is heavily dependent on a trained-in identity signal, not on genuinely reading new
  demonstrations at inference.
- BDH-CQ's contrast is therefore precise, not rhetorical: HRM/TRM's adaptation signal
  is substantially anchored in training-time optimization artifacts (identity
  embeddings, augmentation voting); BDH-CQ's is demonstrably read from state at
  inference with theta frozen. The substrate's reset-toggle is a direct test of the
  BDH-CQ side of that contrast; it says nothing about HRM/TRM (the demo does not run
  HRM/TRM), and the module says so explicitly rather than implying a head-to-head race.

## Errors found and fixed in this pass
1. An earlier draft (from prior research this session) used a generic Hebbian formula
   `W_t = W_{t-1} + eta x_t y_t^T` as if it were BDH's own notation. The real paper uses
   edge-indexed synaptic variables sigma(i,j) with the rule "increases sigma(i,j) by
   Y(i)X(j)" (Section 2.2) -- replaced the generic formula with the paper's actual
   formalism and cited the section.
2. Step 2 stated the toy substrate's query-refinement steps are "fixed at 4" without
   flagging that BDH-CQ's paper does not publish a fixed R. Corrected: this is now
   explicitly labeled a toy-model implementation choice, not a claimed property of the
   real system (see correspondence table).
3. The HRM/TRM contrast was previously sourced only from the track brief's paraphrase.
   Replaced with direct citations to the HRM and TRM papers plus an independent 2026
   analysis paper, upgrading from secondhand summary to primary sourcing as required.
4. BDH-CQ's cost-advantage-over-GPT-5.6-Luna figure differs across sources depending on
   which reasoning-effort tier is compared (roughly 11x at a low-effort match point vs.
   a >50x figure reported elsewhere) -- flagged as a comparison-basis ambiguity rather
   than silently reporting the larger, more impressive number.
