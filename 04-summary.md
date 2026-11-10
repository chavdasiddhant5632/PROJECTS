<!-- summary-start -->
# Test-Time Adaptation on ARC-AGI: Where the Learning Actually Happens

## The claim
On an unseen ARC-AGI-style puzzle, a BDH-CQ-style adapter improves its answer by
writing each demonstration into a fixed-size recurrent state, `S_t = U_theta(S_{t-1},
D_t)`, then refining a query workspace against that state, `H_{r+1} = F_theta(H_r,
S_K)`, `y_hat = G_theta(H_R)` (Engdahl, Kosowski, Chorowski et al., 2026, arXiv:2608.09888).
Every theta is frozen at inference. So wiping S_K to empty immediately before the
query -- leaving theta untouched -- should collapse accuracy back to chance. This
project's interactive artifact makes exactly that ablation clickable.

## Why a demonstration rather than a description
ARC-AGI and GSM8K probe different things. GSM8K checks multi-step arithmetic a model
was largely trained to perform; ARC-AGI checks whether a system can infer an
unfamiliar rule from a handful of input-output pairs and apply it once. Success on
GSM8K establishes computational reliability; success on ARC-AGI establishes something
closer to rule acquisition. Neither is a complete measure of reasoning, and this
project only claims the second, narrower thing.

## Two ways to acquire that rule
Sapient's Hierarchical Reasoning Model (Wang et al., 2025, arXiv:2506.21734) reaches
41% on ARC-AGI-1 with a 27M-parameter model trained via a one-step gradient
approximation and adaptive computation time; its ARC pipeline assigns each puzzle a
learned identity embedding and votes predictions over augmentations. The Tiny
Recursive Model (Jolicoeur-Martineau et al., 2025, arXiv:2510.04871) simplifies HRM's
recursive core but keeps that identity-embedding-plus-voting recipe. A 2026 analysis
of TRM (arXiv:2512.11847) found that swapping the correct identity embedding for a
blank or random token drops accuracy to zero, and that most of the accuracy gain
appears after the first recursion step -- evidence that this family's "adaptation" is
substantially a trained-in artifact of the identity signal, not fresh in-context
inference. BDH-CQ (arXiv:2608.09888) takes the other route: no demonstrations from the
evaluation task appear in training, no parameter update happens at inference, and
adaptation is carried entirely in the state S_K described above. On ARC-AGI-1, a
150M-parameter BDH-CQ reaches 21% pass@2 at low reasoning effort and 29.5% at high
effort, at roughly $0.0007 per task.

## Architecture comparison
| | Transformer (dense attn.) | HRM / TRM | BDH-CQ |
|---|---|---|---|
| Where task-specific adaptation lives | nowhere at inference (fixed context) | trained identity embedding + inference-time voting | recurrent state S_K, written per demonstration |
| Parameter update at inference | no | no (but training-time optimization shapes per-puzzle behavior) | no |
| Reasoning trace | verbalized (if any) | none (latent, fixed-depth recursion) | none (latent, state-conditioned recursion) |
| ARC-AGI-1 (reported) | not the comparison point here | HRM: 41% (27M params) | BDH-CQ: 29.5% pass@2, high effort (150M params) |

## Cost-accuracy Pareto framing
Define intelligence-per-dollar as verified task accuracy divided by cost per task.
BDH-CQ's $0.0007/task at 29.5% pass@2 is the reported anchor point; independent
sources place its cost advantage over a comparably-capable frontier reasoning model
(GPT-5.6 Luna) anywhere from roughly 11x to over 50x cheaper, depending on which
reasoning-effort tier is used as the matching point -- a real ambiguity in how the
comparison was constructed, not a number this summary will collapse into false
precision. HRM's 41% on ARC-AGI-1 is higher accuracy at a far smaller parameter count
(27M), but was achieved with 1,000 task-specific training examples and an
optimization-heavy pipeline, which is a different point on a different frontier: cheap
per-inference dollar cost is not the same claim as cheap total cost of acquiring the
capability.

## Evidence classification
BDH-CQ's ARC-AGI-1 figures above are the developer's own reported benchmark numbers,
not an independent reproduction and not a production deployment. HRM's 41% figure is
similarly self-reported by its authors. The TRM identity-embedding ablation
(arXiv:2512.11847) is an independent third-party analysis, and is the strongest
external evidence cited here. This project's own artifact is a small illustrative toy
model built to demonstrate the state-vs-weights mechanism, not a reproduction of any
of these published numbers -- it is explicitly labeled as such throughout.

## Strengths, limitations, and one open question
BDH-CQ's strength is architectural: because adaptation is legible as a state (S_K),
one can ask what is actually stored in it, in a way a fine-tuned weight update
resists. Its central limitation is generality of the mechanism under load: this
project's own artifact predicts (and must empirically verify once built) that accuracy
collapses toward chance under state-reset for a puzzle with a handful of
demonstrations; the unanswered question is how that collapse behaves as demonstration
count and task complexity grow. It is not yet established, in the literature or in
this project's own testing, whether the recurrent state saturates gracefully or fails
sharply once it must hold many simultaneous constraints -- a genuine open failure
case, not a hedge added to sound careful.
<!-- summary-end -->
