---
layout: page
title: 5. Zero Knowledge Proofs
nav_order: 5
nav_exclude: false
---

$$
\newcommand{\Enc}{\mathsf{Enc}}
\newcommand{\Dec}{\mathsf{Dec}}
\newcommand{\Com}{\mathsf{Com}}
\newcommand{\out}{\mathsf{out}}
\newcommand{\view}{\mathsf{view}}
$$
{: .d-none}

Zero Knowledge Proofs
=====================

What is information?
What is knowledge?

- Alice sends to Bob the string $0^n$
- Alice sends to Bob the string $s = 3.14159...$, $n$ bits
- Alice sends to Bob the encryption of $s$ without a key

Shannon's information theory is relevant, but here we consider 
"knowledge" (instead of information) in the context of *computational aspects*. 

Example:
the encrypted message is zero-knowledge to the adversary who has no key
because the encryption can be simulated by the adversary itself!

#### **Definition:** Zero-Knowledge Encryption

{:.defn}
> A private-key encryption scheme $(\Gen, \Enc, \Dec)$ is zero-knowledge encryption scheme 
> if there exists a PPT simulator algorithm $S$ such that 
> $\forall$ NUPPT $D$, $\exists$ a negligible function $\eps(n)$, such that 
> $\forall m \in \bit^n$ it holds that $D$ distinguishes the following distributions 
> with probability at most $\eps(n)$:
> 
> - $\set{k \to \Gen(1^n) : \Enc_k(m)}$
> - $\set{S(1^n)}$

Discuss: what if we allow $S$ to take exponential time (in $n$)?

#### **Theorem:**

{:.theorem}
> $(\Gen, \Enc, \Dec)$ is secure if and only if it is zero-knowledge.

See [Ps, Sec 4.2] for proof.

Interactive Proofs
------------------

We consider interactions between *interactive* Turing machines (ITM) that run in multiple *rounds*.
Each ITM has the following tapes:

- Input tape, read only
- Auxiliary input tape, read only (we will see later why it is needed)
- Working tape, allowing both read/write 
- Sending tape, write only
- Receiving tape, read only
- Output tape, write only

In each round, the ITM reads from input + aux + receive tapes, performs computation on working tape, 
and then writes to sending / output tape.

A *protocol* between two ITMs $(A,B)$ is the computation performed by $(A,B)$ through rounds,
where the sending tape of $A$ is the receiving tape of $B$ and vice versa.
In each round, only one ITM is active.

Transcript: all messages sent by both $(A,B)$ during the execution of the protocol.

Random execution: both $A$ and $B$ can be randomized and takes randomness (ie random tapes) $r_a$ and $r_b$ correspondingly.

Outputs: each ITM in the protocol may halt and write to its output tape.
We denote $\out_A[A(x_a, z_a, r_a) \leftrightarrow B(x_b, z_b, r_b)]$ as the output of $A$
when the inputs $x_a, x_b$, aux inputs $z_a, z_b$, and randomness $r_a, r_b$ are given to $A$ and $B$ correspondingly.
We similarly denote $\out_B[A(x_a, z_a, r_a) \leftrightarrow B(x_b, z_b, r_b)]$ as the output of $B$.
We analogously use the random varialbe $\out_A[A(x_a, z_a) \leftrightarrow B(x_b, z_b)]$ as the output of $A$
(and $\out_B$ similarly) if the random tapes are randomized.

Views: fixing inputs $x_a, x_b$, aux inputs $z_a, z_b$, and randomness $r_a, r_b$,
the transcript of the execution between $A(x_a, z_a, r_a)$ and $B(x_b, z_b, r_b)$ is fixed.
We denote the *view* of $A$ as $\view_B[A(x_a, z_a, r_a) \leftrightarrow B(x_b, z_b, r_b)]$,
which consists of

- $x_a, z_a, r_a$
- the receiving tape (for all rounds of communication)

Similarly, if the ITMs are randomized, the transcript is a random variable (depends on $r_a, r_b$),
and we write the random variable $\view_A[A(x_a, z_a) \leftrightarrow B(x_b, z_b)]$.
The view of $B$ is denoted as $\view_B[A(x_a, z_a) \leftrightarrow B(x_b, z_b)]$ symmetrically.

#### **Definition:** Interactive Proof

{:.defn}
> A pair of ITMS $(P, V)$ is an *interactive proof system* for a language $L$ 
> if $V$ is a PPT machine and the follwing properties hold. 
> 
> 1. (Completeness) For every $x \in L$, there exists a witness string $w \in \bit^\ast$ 
>    such that for every auxiliary string $z$:
> 
>    $$
>    \Pr \left[\out_V [P(x, w) \leftrightarrow V(x, z)] = 1 \right] = 1
>    $$
> 
> 2. (Soundness) There exists some negligible function $\eps$ such that for all $x \notin L$ and 
>    for all (adversarial) prover algorithms $P^\ast$, and all auxiliary strings $z \in \bit^\ast$,
> 
>    $$
>    \Pr \left[\out_V [P^\ast(x) \leftrightarrow V(x, z)] = 0 \right] \gt 1 − \eps(|x|)
>    $$

Notice: both the honest $P$ and the malicious $P^\ast$ are allowed to be unbounded and non-uniform.
That is, inefficient prover.

Complexity:
The class of languages having an interactive proofs is denoted $IP$.
It is direct to see that $NP \subset IP$ as $V$ is PPT (simply sending the witness $w$ to $V$).
It is proved that $IP = PSPACE$.

It is natural to consider IP in crypto setting 
because one party may want to achieve more than what's given by the completeness.

Zero-Knowledge Proofs
---------------------

We first require the honest prover to be efficient, i.e., PPT ITM.
For any $L \in NP$, the IP is simply sending the witness $w$ to $V$.

In cryptography, we consider to *hide* the witness from an *adversarial* $V$.
Following the intuition of zero-knowledge, $V$ shall be able to *simulate* its view
using its own input.

#### **Definition:** Honest Verifier Zero-Knowledge

{:.defn}
> Let $(P, V)$ be an efficient interactive proof for the language $L \in NP$ 
> with witness relation $R_L$. 
> $(P, V)$ is said to be *honest verifier* zero-knowledge if there exists a PPT simulator $S$ such that 
> for every $x \in L, w \in R_L(x), z \in \bit^\ast$, 
> the following distributions are computationally indistinguishable.
> 
> - $\set{\view_V [P(x, w) \leftrightarrow V(x, z)]}_n$
> - $\set{S(x, z)}_n$
> 
> where 
> $n := |x|$ is the problem size.

Note: the auxiliary info $z$ denotes any *a-priori* information that is given to $V$;
that is, if $V$ knew $w$, then $S$ needs $w$ as well to simulate the view.

The above definition supposes the verifier follows the protocol (provided as the algorithm $V$).
This is unsatisfactory, and we go for a stronger definition that considers *any*
efficient adversary $A^\ast$.
However, the view then depends on $A^\ast$, and we need the simulator that depends on $A^\ast$ as well.
Notice that the quantifier of $S$ differs below.

#### **Definition:** Zero-Knowledge

{:.defn}
> Let $(P, V)$ be an efficient interactive proof for the language $L \in NP$ 
> with witness relation $R_L$. 
> $(P, V)$ is said to be *zero-knowledge* if for every PPT adversary $V^\ast$,
> there exists a PPT simulator $S$ such that 
> for every $x \in L, w \in R_L(x), z \in \bit^\ast$, 
> the following distributions are computationally indistinguishable.
> 
> - $\set{\view_{V^\ast} [P(x, w) \leftrightarrow V(x, z)]}_n$
> - $\set{S(x, z)}_n$
> 
> where 
> $n := |x|$ is the problem size.

> Note that here only consider PPT adversaries $V^\ast$ (as opposed to *non-uniform* PPT adversaries). 
> This only makes our definition stronger: $V^\ast$ can anyway receive any non-uniform “advice” as its
> auxiliary input; in contrast, we can now require that the simulator $S$ is *only PPT* 
> but is also given the auxiliary input of $V^\ast$. 
> Thus, our definition says that even if $V^\ast$ is non-uniform, 
> the simulator only needs to get the same non-uniform advice to produce its view.
> 
> [Ps, p122]

Alternatively, we can directly replace $\view_{V^\ast}$ with $\out_{V^\ast}$.
(The proof is left as an exercise)

We will propose a ZKP for the NP-complete language, graph 3-coloring.
The protocol will use *commitments* that can be thought as a physical locked box:
$P$ gives it to $V$, then $P$ can not change the content while $V$ knows nothing about the content,
and then $P$ can open it later to $V$.

#### **Definition**: Commitment

{:.defn}
> A polynomial-time machine $\Com$ is called a commitment scheme if there exists 
> some polynomial $\ell(\cdot)$ such that the following two properties hold:
> 
> 1. (Binding): For all $n \in \N$ and all $v_0 \neq v_1 \in \bit^n$, $r_0, r_1 \in \bit^{\ell(n)}$ 
>    it holds that $\Com(v_0, r_0) \neq \Com(v_1, r_1)$.
> 2. (Hiding): For every $v_0, v_1 \in \bit^n$, the following distributions are computationally indistinguishable:
>    
>    - $\set{r \gets \bit^{\ell(n)} : \Com(v_0, r)}$
>    - $\set{r \gets \bit^{\ell(n)} : \Com(v_1, r)}$

Notice: 
in the definition, the binding is *perfect*, which means that no adversary can 
open $\Com(v,r)$ to $v' \neq v$ by providing any $r'$ (even the adversary is unbounded).
In contrast, the hiding is only *computational* 
where an exponential time adversary may find $v$ given only $\Com(v,r)$.

#### **Theorem:**

{:.theorem}
> If one-way permutations exist, then commitment schemes exist.

{:.proof}
> Let $f$ be a OWP and $h$ be its hard-core predicate.
> Let $\Com(b , r) := (f(r), b \oplus h(r))$.
> Binding is direct from permutation.
> Hiding is simple by the definition of hard-core predicate.


#### **Protocol:** ZKP for Graph 3-Coloring

{:.defn}
> Common input: $G = (V, E)$ 
> where $|V| = n, |E| = m$
> 
> Prover input: Witness $w = (c_0, c_1, . . . , c_m)$
> 
> | $P ~\to ~ V$ |   Let $\pi$ be a random permutation over $\set{1, 2, 3}$. For each $i \in [1, n]$, $P$ sends a commitment to the color $c'_i := \pi(c_i)$ |
> | $P~\gets ~V$ |   $V$ sends a randomly chosen edge $(i, j) \in E$  |
> | $P ~\to ~ V$ |   $P$ opens commitments $c'_i$ and $c'_j$.  |
> | $\quad\quad~ V$ | $V$ rejects the proof if and only if $c'_i = c'_j$ (continue o.w.)  |
> | $P, V$ |   Repeat the procedure $n \vert E \vert$ times.  |

#### **Theorem:**

> Assume $\Com$ is a secure commitment scheme.
> The above protocol is a zero-knowledge protocol for the language of 3-colorable graphs.

{:.proof}
> The completeness is direct.
> The soundness follows by the binding property as below.
> If $G$ is not 3-colorable, then there exists $(i,j)$ such that $c_i = c_j$,
> and then by binding, any adversarial $P^\ast$ must open $c'_i$ and $c'_j$ to the same $c_i = c_j$
> when $V$ chose $(i,j)$, which happens w.p. $1/|E|$.
> It follows that all $n|E|$ repetition passes w.p.
> 
> $$
> (1 - \frac{1}{|E|})^{n |E|} \le e^{-\Omega(n)}.
> $$
> 
> To prove ZK, the intuition is that $P$ reveals only the colors of two random vertices,
> and that the hiding of $\Com$ guarantees that other vertices are hidden.
> Formally, we construct the following simulator.
> 
> {:.defn-title}
>> Simulator for graph 3-coloring, $S(G, z)$: 
>> 
>> 1. Pick a random edge $(s, t) \in E$ and pick random colors $c'_s, c'_t \in \set{1, 2, 3}, c'_s \neq c'_t$. 
>>    Let $c'_k = 1$ for all other $k \in [n] \setminus \set{s,t}$.
>> 2. Commit to $c'_i$ for all $i$ and send them to $V(G, z)$. Let $(i,j)$ be the message of $V$.
>> 3. If $(i,j) = (s,t)$ then open $c'_s, c'_t$ and output the view of $V$.
>>    Otherwise, restart the process from picking random $(s,t)$ again, but for at most $n|E|$ times.
>> 4. If the simulation has not been successful
>>    after $n|E|$ repetitions, output fail.
> 
> 
