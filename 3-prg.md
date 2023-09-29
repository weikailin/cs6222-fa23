---
layout: page
title: 3. Pseudo-Randomness
nav_order: 3
nav_exclude: false
---

$
\newcommand{\RF}{\mathsf{RF}}
\newcommand{\PRF}{\mathsf{PRF}}
\newcommand{\Enc}{\mathsf{Enc}}
\newcommand{\Dec}{\mathsf{Dec}}
\newcommand{\Gen}{\mathsf{Gen}}
\newcommand{\Expr}{\mathsf{Expr}}
\newcommand{\state}{\mathsf{state}}
$
{: .d-none}

Indistinguishability and Pseudo-Randomness
==========================================

Recall the perfectly secure encryption, OTP. 
That is, we bitwise-XOR our message with a uniform random string.

$$
m \oplus k, ~ |m| = |k|.
$$

OTP is inefficient because the long random string must be shared between Alice and Bob in advance.
Suppose that we have a (mathematical, deterministic) function 
that can extends a short truely random string to a long "random-looking" string.
We can use the seemingly random to encrypt messages as in OTP, yet it is efficient.

Is that possible?
How to formally define "random-looking"?

Let $g$ be the above function with short input $x$ and long output $g(x)$.
We want Alice and Bob share the same $g(x)$ to decrypt correctly, so $g$ must be deterministic. 
Mathematically, we have def for the distance between two probability distributions.
However, for any $|g(x)| \gt |x|$, the input / output distributions are far.
The point is "random-looking" at best.

$$
m \oplus g(s), ~ |m| = |g(s)|, \text{ but } |s| \ll |m|.
$$

We will introduce computational indistinguishability, and then define pseudo-random generator (PRG) and pseudo-random function (PRF).

Computational Indistinguishability
------------------------

Key Idea:
If we have no way to show the difference, then we are satisfied. We call it indistinguishability.

Example: Turing test, when a machine and a human is indistinguishable in *every* human's prompts, we call it AI.
- [Turing 1950, Computing machinery and intelligence](https://link.springer.com/chapter/10.1007/978-1-4020-6710-5_3)
- [Wigderson 2022, Imitation game](https://www.youtube.com/watch?v=JZH1AT1kdK8)

Observation: they are *not* the same, not even close in any sense; 
however, the distinguisher "another human" can not tell the difference due to a limited power.

Concept: we say a distribution is pseudorandom if for *every* efficient algorithm,
it can not be distinguished from a (truely) uniform distribution.

We will formalize the concept asymptotically.

#### **Definition:** Ensembles of Probability Distributions

{: .defn}
> A sequence $\set{X_n}_{n\in\N}$ is called an *ensemble* if for each $n \in \N$, 
> $X_n$ is a probability distribution over $\bits$.
> (We often write $\cX = \set{X_n}_n$ when the context is clear.)

E.g., supposing $X_n$ is a distribution over $n$-bit strings for all $n\in\N$, $\set{X_n}_{n\in\N}$ is an ensemble.

#### **Definition:** Computational Indistinguishability

{: .defn}
> Let $\cX = \set{X_n}_n$ and $\cY = \set{Y_n}_n$ be ensembles 
> where $X_n, Y_n$ are distributions over $\bit^{\ell(n)}$ for some polynomial $\ell(·)$. 
> We say that $\cX$ and $\cY$ are *computationally indistinguishable*
> (denoted by $\cX \approx \cY$) 
> if for all NUPPT $D$ (called the “distinguisher”), there exists a negligible function $\eps$
> such that $\forall n \in \N$,
> 
> $$
> \Big| \Pr[t \gets X_n, D(t) = 1] − \Pr[t \gets Y_n, D(t) = 1] \Big| \lt \eps(n).
> $$

Note: 
- "=1" is a convention in literature
- "absolute" is not necessary due to "for all D"

This definition requires the two distributions to pass *all efficient* statistical tests,
which include the following.
- Roughly as many 0 as 1.
- Roughly as many 01 as 10.
- Each sequence of bits occurs with roughly the same probability.
- Given any prefix, guessing the next bit correctly happens with roughly the same probability.

#### **Lemma:** Closure Under Efficient Operations

{: .theorem}
> If the pair of ensembles $\set{X_n}_n \approx \set{Y_n}_n$, 
> then for any NUPPT $M$, $\set{M(X_n)}_n \approx \set{M(Y_n)}_n$.

{: .proof}
> (By standard reduction) 

Examples:

1. $M$ ignores its input. Clearly, $M(X_n) \equiv M(Y_n)$ for all $n$.
2. $M$ is identity, i.e., its output is exactly the input. $\set{M(X_n) = X_n}_n \approx \set{M(Y_n)=Y_n}_n$.
3. $M$ outputs the first half of the input, 
   i.e., $M(x) := x[1, ..., |x|/2]$.

#### **Lemma:** Hybrid Lemma

{: .theorem}
> Let $X^{(1)}, X^{(2)}, ..., X^{(m)}$ be a sequence of probability distributions. 
> Assume that the machine $D$ distinguishes $X^{(1)}$ and $X^{(m)}$ with probability $p$. 
> Then there exists some $i \in \set{1, ..., m − 1}$ s.t. 
> $D$ distinguishes $X^{(1)}$ and $X^{(m)}$ with probability $p/m$.

{: .proof}
> (By triangular ineq) 

Notice that this lemma applies to distributions, *not ensembles*.
Fortunately, it implies the following.

#### **Corollary:**

{: .theorem}
> For any ensembles $\cX, \cY, \cZ$, if $\cX \approx \cY$ and $\cY \approx \cZ$,
> then it follows that $\cX \approx \cZ$.

{: .proof}
> (left as exercise)

**Discuss**{: .label}
If the number of hybrid distributions (between two ensembles) depends on 
the size $n$ (of the distributions in the ensembles), the above corollary is tricky.
Consider two ensembles $\cX = \set{X_n}_n, \cY=\set{Y_n}_n$, and suppose that
the machine $D$ distinguishes $\cX, \cY$ w.p. $p(n)$ (that depends on $n$),
and then suppose that the sequence $(X_n = X_n^{(1)}, ... , X_n^{(m(n))} = Y_n)$
consists of $m(n)$ distributions such that $m$ depends on $n$.
Then, we *can not* define $m(n)$ ensembles between $\cX$ and $\cY$ due to the dependence 
(i.e., the length of the sequence depends on $n$).
This is indeed the case when we have many hybrids, e.g., going from $(n+1)$-bit PRG to $2n$-bit PRG.
There are two ways to treat this case, the formal one and the more popular one.
In the formal way, we assume for contra that exists $D$ and $p(n)$ s.t. 
for inf many $n\in\N$, $D$ distinguishes $(X_n, Y_n)$ w.p. at least $p(n)$;
we then construct a reduction $B$ such that *guesses* an index $j \in [m(n)-1]$ 
and hoping that $j = i$, where $i$ is the index given by hybrid lemma, 
so that $B$ runs $D$ to distinguish and solve the challenge specified by the $j$-th hybrid.
The popular way is less rigorous but more intuitive:
we just claim that the two distributions $X_n^{(j)}, X_n^{(j+1)}$ are "indistinguishable"
for each $j, n$, and thus $X_n, Y_n$ are "indistinguishable";
this is informal because fixing any $j$ means that $n$ is also fixed and $X_n, Y_n$ are two distributions (not ensembles), 
but indistinguishability is defined asymptotically on ensembles.

Example:
Let $\cX, \cY, \cZ, \cZ'$ be ensembles.
Suppose that $(\cX, \cZ) \approx (\cX, \cZ')$ and $(\cY, \cZ) \approx (\cY, \cZ')$.
Does $(\cX, \cY, \cZ) \approx (\cX, \cY, \cZ')$?

#### **Lemma:** Prediction Lemma

{: .theorem}
> Let $\set{X^0_n}_n$ and $\set{X^1_n}_n$ be two ensembles where $X^0_n, X^1_n$ are 
> probability distributions over $\bit^{\ell(n)}$ for some polynomial $\ell(\cdot)$, 
> and let $D$ be a NUPPT machine that distinguishes between $\set{X^0_n}_n$ and $\set{X^1_n}_n$
> with probability $\ge p(·)$ for infinitely many $n \in \N$.
> Then there exists a NUPPT $A$ such that
> 
> $$
> \Pr[b \gets \bit, t \gets X^b_n : A(t) = b] \ge \frac{1}{2} + \frac{p(n)}{2}
> $$
> 
> for infinitely many $n \in \N$.

{: .proof}
> Remove the absolute value in the def of comp. ind. by negating the distinguisher $D$,
> and then standard probability. 

Note: the converse the easier to prove. Hence, prediction and distinguishing is essentially equivalent.

Pseudo-Random Generator 
------------------------

#### **Definition:** Pseudo-random Ensembles.

{: .defn}
> The probability ensemble $\set{X\_n}\_n$, where $X\_n$ is a probability distribution
> over $\bit^{l(n)}$ for some polynomial $l(\cdot)$, is said to be pseudorandom 
> if $\set{X\_n}\_n \approx \set{U\_{l(n)}}\_n$,
> where $U\_m$ is the uniform distribution over $\bit^m$.

Note:
- this definition says that a pseudorandom distribution must pass 
  **all** efficiently computable tests that the uniform distribution would have passesd.
- it is hard to check or prove if a distribution is pseudorandom 
  (due to the "for all" quantifier from comp. ind.)

#### **Definition:** Pseudo-random Generators.

{: .defn}
> A function $g : \bit^\ast \to \bit^\ast$ is a *Pseudo-random Generator (PRG)* 
> if the following holds.
> 1. (efficiency): $g$ can be computed in PPT.
> 2. (expansion): 
>    $|g(x)| \gt |x|$
> 3. The ensemble $\set{x \gets U_n : g(x)}_n$ is pseudorandom.

We sometimes say that the expansion of PRG $g$ is $t$ 
if $|g(x)| - |x| \ge t$ for all $x$.

Example: if $g: \bit^n \to \bit^{n+1}$ for all $n$ is a PRG, then $g$ is a OWF.
(proof left as exercise, why expansion is necessary?)

#### **Lemma:** Expansion of a PRG

{:.theorem}
> Let $g:\bit^n \to \bit^{n+1}$ to be a PRG for all $n \in\N$. 
> For any polynomial $\ell(n) \gt n$, define $g': \bit^n \to \bit^{\ell(n)}$ as follows:
> 
> $$
> g'(s) \to b_1 b_2 ... b_{\ell},
> $$
> 
> where 
> $\ell := \ell(|s|)$, $x_0 \gets s, x_{i+1} \\| b_{i+1} \gets g(x_i)$. Then $g'$ is a PRG.

{:.proof-title}
> Proof, warmup:
> 
> Suppose that $\ell = 2$, no expansion, but we want to show pseudorandomness.
> Define distributions 
> 
> $$
> H^0_n := g'(s), H^1_n := U_1 \| g(s)[n+1], H^2\_n := U\_2
> $$
> 
> for $n \in \N$, and define $\cH^i := \set{H^i_n}_n$ for $i=0,1,2$.
> Since $g'(s) = g(s)[n+1] \\| g(g(s)[1...n])[n+1]$, by $g(s) \approx U\_{n+1}$ and closure,
> we have $\cH^0 \approx \cH^1$.
> By $g(x)$ is pseudorandom and closure, $g(U\_n)[n+1] \approx U\_1$, which implies $\cH^1 \approx \cH^2$.
> By the corollary of hybrid lemma, we have $\cH^0 \approx \cH^2$.

{:.proof-title}
> Proof of PRG Expansion
> 
> It is slightly tricky when $\ell$ depends on $n$.
> Define the prefix $h$ and last bit $s$ of iterating $g$ as:
> 
> $$
> h^i(x) := \begin{cases}
>   g(x)[1...n] & i = 1,\\
>   g(h^{i-1}(x))[1...n] & i > 1
> \end{cases}
> $$
> 
> and
> 
> $$
> s^i := s^i(x) := \begin{cases}
>   g(x)[n+1]  & i=1,\\
>   g(h^{i-1}(x))[n+1] & i \gt 1.
> \end{cases}
> $$
> 
> We have $g'(x) = s^1 \\| s^2 \\| ...s^{\ell}$, and we want to prove it through Hybrid Lemma.
> Given $n$, define hybrid distributions $H_0 := g'(x)$, $H_{\ell} := U_{\ell}$,
> and define $H_i$ for $i = 1,...,\ell-1$ as 
> 
> $$
> H_i := U_i \| s^{1} \| ...s^{\ell(n)-i},
> $$
> 
> where $U_i$ denotes sampling an $i$-bit string uniformly at random.
> Observe that for each $i=0,1,...,\ell-1$, $H_i$ and $H_{i+1}$ differ by a $g(x)$, that is,
> 
> $$
> \begin{align*}
> H_{i+1} & = U_{i} \| U_1 \| s^{1} \| ...s^{\ell-i-1}, \text{ and } \\
> H_{i} & = U_{i} \| s^{1} \| s^{2} \| ...s^{\ell-i} \\
> & = U_{i} \| g(x)[n+1] \| s^{1}(g(x)[1...n]) \| ...s^{\ell-i-1}(g(x)[1...n])
> \end{align*}
> $$
> 
> for all $i = 0, 1, ..., \ell$.
> 
> Assume for contra (AC), there exists NUPPT $D$, poly $p(n)$ s.t. for inf many $n\in\N$,
> $D$ distinguishes $\set{x\gets\bit^n : g(x)}\_n$ and $U\_{\ell(n)}$ w.p. at least $1/p(n)$.
> The intuition is to apply Hybrid Lemma so that there exists $j^\ast$ 
> such that $H\_{j^*}, H\_{j^\ast+1}$ are distinguishable, 
> and thus by Closure Lemma $g(x)$ is distinguishable from uniform.
> 
> We prove it formally by constructing $D'$ that aims to distinguish $g(x)$.
> Given input $t \in \bit^{n+1}$, $D'$ performs:
> 1. Samplable $i \gets \set{0,...,\ell-1}$ (where $\ell \gets \ell(n)$)
> 2. $t_0 \gets U_i$, $t_1 \gets t[n+1]$, and $t_2 \gets s^1(t[1...n]) \\| s^2(t[1...n]) \\| ...s^{\ell-i-1}(t[1...n])$
> 3. output $D(t_0 \\| t_1 \\| t_2)$
> 
> To show that $D'$ succeed with non-negl prob., we partition the event as follows:
> 
> $$
> \begin{align*}
> & \Pr_{t\gets U_{n+1}, i} [D'(t) = 1] - \Pr_{x\gets U_n, i} [D'(g(x)) = 1] \\
> =& \sum_{j=0}^{\ell-1} \Pr_{t, i} [D'(t) = 1 \cap i=j] - \Pr_{x, i} [D'(g(x)) = 1 \cap i=j] \\
> =& \sum_{j=0}^{\ell-1} \left(\Pr_{t, i} [D'(t) = 1 | i=j] - \Pr_{x, i} [D'(g(x)) = 1 | i=j]\right) \cdot \Pr[i=j] \\
> =& \frac{1}{\ell} \cdot \sum_{j=0}^{\ell-1} \Pr_{t, i} [D'(t) = 1 | i=j] - \Pr_{x, i} [D'(g(x)) = 1 | i=j] \\
> \end{align*}
> $$
> 
> where the random variable $i \gets \set{0,1,...,\ell-1}$ is sampled exactly the same as in $D'$. 
> 
> Notice that conditioned on $i = j$ for any fixed $j$, the distribution $t_0 \\| t_1 \\| t_2$ (given to $D$)
> is identical to 
> 
> $$
> \begin{cases}
> H_{j+1} & \text{if } t \gets \bit^{n+1}\\
> H_{j}  &  \text{if } x \gets \bit^n, t \gets g(x).
> \end{cases}
> $$
> 
> That implies 
> 
> $$
> \begin{align*}
> \Pr_{t,i} [D'(t) = 1 | i=j] = \Pr[t' \gets H_{j+1} : D(t') = 1], \\
> \Pr_{x,i} [D'(t) = 1 | i=j] = \Pr[t' \gets H_{j} : D(t') = 1].
> \end{align*}
> $$
> 
> We thus have the summations cancelling out,
> 
> $$
> \begin{align*}
> & \Pr_{t\gets U_{n+1}, i} [D'(t) = 1] - \Pr_{x\gets U_n, i} [D'(g(x)) = 1] \\
> =& \frac{1}{\ell} \cdot \sum_{j=0}^{\ell-1} \Pr_{t'\gets H_{j+1}} [D(t') = 1] - \Pr_{t' \gets H_j} [D(t') = 1] \\
> =& \frac{1}{\ell} \cdot \left(\Pr_{t'\gets H_\ell} [D(t') = 1] - \Pr_{t' \gets H_0} [D(t') = 1]\right) \\
> \ge& \frac{1}{\ell} \cdot \frac{1}{p(n)},
> \end{align*}
> $$
> 
> where the last inequality follows by (AC).
> That is, $D'$ distinguishes $g(x)$ w.p. at least $\frac{1}{\ell(n)p(n)}$, contradicting $g$ is a PRG.

**Discuss**{:.label}
In the above, we proved it formally and preserved the uniformity (if $D$ is a uniform TM, then $D'$ is also uniform). 
We did not apply Hybrid Lemma (and no triangular ineq), nor did we use Closure Lemma.
Alternatively after (AC), one may apply Hybrid Lemma which claims that exists $j^\ast$
s.t. $H_{j^\ast}$ is distinguishable from $H^{j^\ast+1}$ w.p. at least $1/(\ell p)$,
and then hardwire $j^\ast$ into $D'$ in order to distinguish $g(x)$.
This would make $D'$ **non-uniform** because $j^\ast$ would depend on each $n$ 
and we would not have an efficient way to find $j^\ast$.

We proved in the above that a PRG with 1-bit expansion is sufficient to build any poly-long expansion.
We have not yet give any candidate construct of PRG (even 1-bit expansion), 
but it is useful to firstly see what we can achieve using PRGs.

Example:
Now suppose that we have a PRG $g$ with $n \mapsto \ell(n)$ expansion for any poly $\ell$.
We can construct a *computationally* secure encryption by 
sampling key $k$ as an $n$-bit string and then bitwise XORing $g(k)$ with the message.
That $m \oplus g(k)$ encrypts one message.
We can encrypt more messages by attaching to each message a sequence number,
such as $(m_1 \oplus g(k)[1...n], 1), (m_2 \oplus g(k)[n...2n], 2)$, and so on.

What's the downside of the above multi-message encryption?

Pseudo-Random Functions 
------------------------

In order to apply PRGs more efficiently, 
we construct a tree structure and call the abstraction pseudo-random functions (PRFs).
We begin with defining (truly) random function.

#### **Definition:** Random Functions

{: .defn}
> A random function $f: \bit^n \to \bit^n$ is a random variable sampled uniformly 
> from the set $\RF_n := \set{f : \bit^n \to \bit^n}$.

We can view a random function in two ways.
In the combinatorial view, any function $f: \bit^n \to \bit^n$ is described by
a table of $2^n$ entries, each entry is the $n$-bit string, $f(x)$.

$f(0000...00),f(0000...01), ...,f(1111...11)$

In the computational view, a random function $f$ is a data structure that on any input $x$,
perform the following:
1. initialize a map $m$ to empty before any query
2. if $x \notin m$, then sample $y \gets \bit^n$ and set $m[x] \gets y$
3. output $m[x]$

In both views, the random function needs $2^n \cdot n$ bits to describe,
and thus there are $2^{n2^n}$ random functions in $\RF_n$.

Note: the random function $F\gets \RF_n$ is also known as *random oracle* in the literature.

Intuitively, a *pseudo-random* function (PRF) shall look similar to a random function.
That is, indistinguishable by any NUPPT Turing machine that is *capable of interacting with the function*.

#### **Definition:** Oracle Indistinguishability

{:.defn}
> Let $\set{\cO\_n}\_{n\in\N}$ and $\set{\cO\_n}\_{n\in\N}$ be ensembles 
> where $\cO\_n, \cO'\_n$ are probability distributions over functions.
> We say that $\set{\cO\_n}\_{n}$ and $\set{\cO\_n}\_{n}$ are *computationally indistinguishable*
> if if for all NUPPT machines D that is given oracle accesses to a function, 
> there exists a negligible function $\eps(\cdot)$ such that for all $n\in\N$,
>   
> $$
> \Pr[F\gets\cO : D^{F(\cdot)}(1^n) = 1] - \Pr[F\gets\cO' : D^{F(\cdot)}(1^n) = 1] \le \eps(n).
> $$

Note: $D^{f(\cdot)}$ denotes that the TM $D$ may interact with the function $f$ 
through black-box input and output, while each input-output takes time to read/write 
but computing $f$ takes 0 time.

It is easy to verify that oracle indistinguishability satisfies “closure under efficient operations”, 
the Hybrid Lemma, and the Prediction Lemma.

Also notic that we can transform a distribution of oracle functions to 
a distribution of strings using an efficient oracle operation, 
and in that case, the oracle indistinguishability is translated into the comp. indistinguishability
of strings (see CPA-secure encryption below).

#### **Definition:** Pseudo-random Functions (PRFs)

{:.defn}
> A family of functions $\set{f_s: \bit^{|s|} \to \bit^{|s|}}_{s \in \bits}$
> is *pseudo-random* if
> 
> - (Easy to compute): $f_s(x)$ can be computed by a PPT algo that is given input $s,x$.
> - (Pseudorandom): $\set{s\gets \bit^n : f_s}_n \approx \set{F \gets \RF_n : F}_n$.

Note: similar to PRG, the seed $s$ is not revealed to $D$ (otherwise it is trivial to distinguish).

#### **Theorem:** Construct PRF from PRG

{:.theorem}
> If a pseudorandom generator exists, then pseudorandom functions exist.

We have shown that a PRG with 1-bit expansion implies any PRG with poly expansion.
So, let $g$ be a length-doubling PRG, i.e., $|g(x)| = 2 |x|$.
Also, define $g_0, g_1$ to be 

$$
g_0(x) := g(x)[1...n], \text{ and } g_1:= g(x)[n...2n],
$$

where 
$n := |x|$ is the input length.

We define $f_s$ as follows to be a PRF:

$$
f_s(b_1 b_2 ... b_n) := g_{b_n} \circ g_{b_{n-1}} \circ ... g_{b_1}(s).
$$

That is, we evaluate $g$ on $s$, but keep only one side of the output depending on $b_1$,
and then keep applying $g$ on the kept side, and then continue to choose the side by $b_2$, and so on.

This constructs a binary tree. 
The intuition is from expanding the 1-bit PRG,
but now we want that any sub-string of the expansion can be efficiently computed.
(We CS people love binary trees.)
Clearly, $f_s$ is easy to compute, and we want to prove it is pseudorandom.

{:.proof}
> There are $2^n$ leaves in the tree, too many so that we can not use the
> "switch one more PRG to uniform in each hybrid" technique as in expanding PRG.
> The trick is that the distinguisher $D$ can only query $f_s$ at most polynomial many times
> since $D$ is poly-time.
> Each query correspond to a path in the binary tree, and there are at most 
> polynomial many nodes in all queries.
> Hence, we will switch the $g(x)$ evaluations from root to leaves of the tree
> and from the first query to the last query.
> 
> Note: switching *each instance* of $g(x)$ (for each $x$) is a reduction
> that runs $D$ to distinguish *one instance* of $g(x)$; 
> therefore, we switch *exactly one* in each hybrid.
> 
> More formally, assume for contra (AC), there exists NUPPT $D$, poly $p$ s.t.
> for inf many $n\in\N$, $D$ distinguishes $f_s$ from RF (in the oracle interaction).
> We want to construct $D'$ that distinguishes $g(x)$.
> We define hybrid oracles $H_i(b_1 ... b_n)$ as follows:
> 
> 1. the map $m$ is initialized to empty
> 2. if the prefix $b_1 ... b_i \notin m$, then sample $s(b_{i} b_{i-1} ... b_{1}) \gets \bit^n$ 
>    and set $m[b_i ... b_1] \gets s(b_{i} b_{i-1} ... b_{1})$
> 3. output $g_{b_n} \circ g_{b_{n-1}} \circ ... g_{b_{i-1}}(m[b_{i} ... b_{1}])$
> 
> Notice that $H_i$ is a function defined using the computational view.
> 
> Let $\PRF_n := \set{f_s : s \gets \bit^n}$ be the distribution of $f_s$ for short.
> We have $H_0 \equiv \PRF_n$ and $H_n \equiv \RF_n$, 
> but there are still too many switches between $H_i, H_{i+1}$.
> The key observation is that,
> given $D$ is PPT, we know a poly $T(n)$ that is the running time of $D$ on $1^n$,
> and then we just need to switch at most $T(n)$ instances of $g(x)$.
> That is to define sub-hybrids $H_{i,j}$,
> 
> 1. the map $m$ is initialized to empty
> 2. if the prefix $b_1 ... b_i b_{i+1} \notin m$, 
>    then depending on the "number of queries" that are made to $H_{i,j}$ so far, including the current query,
>    do the following:
>    sample $s \gets \bit^n$, set 
>    
>    $$
>    m[b_{i+1} b_i ... b_1] \gets 
>    \begin{cases}
>      \bit^n   & \text{number of queries} \le j \\
>      g_{b_{i+1}}(s)     & \text{otherwise}
>    \end{cases},
>    $$
>    
>    and set
>    
>    $$
>    m[\overline{b_{i+1}} b_i ... b_1] \gets 
>    \begin{cases}
>      \bit^n   & \text{number of queries} \le j \\
>      g_{\overline{b_{i+1}}}(s)     & \text{otherwise}
>    \end{cases}.
>    $$
>    
> 3. output $g_{b_n} \circ g_{b_{n-1}} \circ ... g_{b_{i}}(m[b_{i+1} ... b_{1}])$
> 
> We have $H_{i,0} \equiv H_i$. 
> Moreover for any $D$ runs in time $T(n)$, we have $H_{i,T(n)} \equiv H_{i+1}$
> (their combinatorial views differ, but their computational views are identical for $T(n)$ queries).
> Now we have $n \cdot T(n)$ hybrids, so we can construct $D'(t)$:
> 
> 1. sample $i \gets \set{0,1,...,n-1}$ and $j\gets\set{0,...,T(n)-1}$ uniformly at random
> 2. define oracle $O\_{i,j,t}(\cdot)$ such that is similar to $H\_{i,j}$ but 
>    "injects" $t$ to the map $m$ in the $j$-th query if the prefix $b\_1 ... b\_i b\_{i+1} \notin m$.
>    (This is constructable and computable only in the *next step* when queries come from $D$.)
> 3. run and output $D^{O\_{i,j,t}(\cdot)}(1^n)$, that is running $D$ on input $1^n$ 
>    when providing $D$ with oracle queries to $O\_{i,j,t}$
>
> It remains to calculate the probabilities, namely, 
> given (AC), $D'$ distinguishes $g(x)$ from uniformly sampled string w.p. $\ge \frac{1}{nT(n)p(n)}$,
> a contradiction.
> The calculation is almost identical to [the proof of PRG expansion](#lemma-expansion-of-a-prg) and left as an exercise.

Secure Encryption Scheme
------------------------

Perfect secrecy considers that the adversary gets the ciphertext *only* (but nothing else).
However, there are other natural adversarial models in practical scenarios.

- Known plaintext attack: The adversary may get to see pairs of form $(m_0, \Enc_k(m_0)) ...$
- Chosen plain text, CPA: 
  The adversary gets access to an *encryption oracle* before and after selecting messages.
- Chosen ciphertext attack, CCA1:
  The adversary has access to an encryption oracle and to a decryption oracle *before*
  selecting the messages. ["lunch-time attack", Naor and Young]
- Chosen ciphertext attack, CCA2:
  This is just like a CCA1 attack except that the adversary also has access to 
  decryption oracle *after* selecting the messages. 
  It is not allowed to decrypt the challenge ciphertext however. [Rackoff and Simon]

We formalize CPA-security next (but leave CCA1/CCA2 later in authentication).

#### **Definition:** Chose-Plaintext-Attack Encryption (CPA)

{: .defn}
> Let $\Pi = (\Gen, \Enc, \Dec)$ be an encryption scheme.
> For any NUPPT adversary $A$, for any $n\in\N, b\in\bit$, 
> define the experiment $\Expr_b^{\Pi, A}(1^n)$ to be:
> 
> {: .defn}
>> Experiment $\Expr_b^{\Pi, A}(1^n)$:
>> 
>> 1. $k \gets \Gen(1^n)$
>> 2. $(m_0, m_1, \state) \gets A^{\Enc_k(\cdot)}(1^n)$
>> 3. $c \gets \Enc_k(m_b)$
>> 4. Output $A^{\Enc_k(\cdot)}(c, \state)$
> 
> Then we say $\Pi$ is CPA secure if for all NUPPT $A$,
> 
> $$
> \left\{\Expr_0^{\Pi,A}(1^n)\right\}_n \approx
> \left\{\Expr_1^{\Pi,A}(1^n)\right\}_n.
> $$

Note: the experiment $\Expr$ is often equivalently described as 
"the adversary $A$ interacts a challenger $C$, 
where $C$ performs all other steps that are not belong to $A$ 
(such as $\Gen$, $\Enc$, and answering the queries to $\Enc_k(\cdot)$)".

Compared to Shannon/perfect secrecy, what are the differences?
- comp. bounded
- orcale before
- orcale after
- choose $m$

Suppose that we have a secure encryption even without CPA oracle but the key is shorter than the message.
Can we get a PRG/PRF? Can we get a OWF?

#### **Theorem:** CPA-Secure Encryption from PRF

{: .theorem}
> Let $\PRF = \set{f_s : \bit^{|s|} \to \bit^{|s|}}_{s\in\bit^\ast}$ be a family of PRFs.
> Then the following $(\Gen, \Enc, \Dec)$ is a CPA-secure encryption scheme.
> 
> - $\Gen(1^n)$: sample and output $k \gets \bit^n$.
> - $\Enc_k(m)$: given input $m \in \bit^n$, sample $r \gets \bit^n$, and then output
>   
>   $$
>   c := m \oplus f_k(r) ~\|~ r.
>   $$
>   
> - $\Dec_k(c)$: given input $c = c' \| r' \in \bit^{2n}$, output 
> 
>   $$
>   m := c' \oplus f_k(r').
>   $$

The correctness and efficiency of the construction follows from PRF directly.
It remains to prove CPA security.

{: .proof}
> To show $\Expr_0$ and $\Expr_1$ are comp. ind., we define hybrid experiments $H_0, H_1$ as follows.
> 
> {: .defn}
>> Hybrid $H_b^{A}(1^n)$:
>> 
>> 1. $F \gets \RF_n$, and then let $O_F$ to be the following oracle:
>>    
>>    $$
>>    O_F(x) := x \oplus F(r) \| r,
>>    $$
>>    
>>    where $r \gets \bit^n$ is sampled uniformaly.
>> 2. $(m_0, m_1, \state) \gets A^{O_F(\cdot)}(1^n)$
>> 3. $r \gets \bit^n, c \gets m_b\oplus F(r) \| r$
>> 4. Output $A^{O_F(\cdot)}(c, \state)$
> 
> By oracle indistinguishability of $\PRF$ and $\RF$ and closure under efficient operations, 
> we have 
> $\set{\Expr_0^{\Pi, A}(1^n)}_n \approx \set{H_0^{A}(1^n)}_n$ and
> $\set{\Expr_1^{\Pi, A}(1^n)}_n \approx \set{H_1^{A}(1^n)}_n$.
> (Notice that $\PRF$ and $\RF$ are oracle ind., but $\Expr$ and $H$ are comp. ind. of strings.)
> 
> Hence, it suffices to prove that the ensembles $H_0$ and $H_1$ are ind.
> They seem to be indentically distributed (as in OTP).
> However, there is a difference: $A$ gets oracle accesses to $O_F$ 
> (before and after choosing $m_b$), and $O_F$ could sample the same $r$ in the cipher $c$
> and in another oracle accesses.
> Fortunately, hitting the same $r$ twice in polynomial time happens with negligible probability.
> 
> We formally prove $\set{H_0^{A}(1^n)}_n \approx \set{H_1^{A}(1^n)}_n$ next.
> Define $R$ to be the set 
> 
> $$
> R := \set{r \in \bit^n : r \text{ is sampled when } A^{O_F(\cdot)}},
> $$
> 
> and let $r$ be the random variable sampled for the cipher $c$.
> We want to show that $|\Pr[H_0^A(1^n)=1] - \Pr[H_0^A(1^n)=1]|$ is negligible for all NUPPT $A$.
> Let $H_0$ and $H_1$ be the events for short.
> 
> $$
> \begin{align*}
> \Pr[H_0]
> & = \Pr[H_0 \cap r \in R] + \Pr[H_0 \cap r \notin R] \\
> & \le \Pr[r \in R] + \Pr[H_0 | r \notin R] \cdot \Pr[r \notin R] \\
> & = \gamma + \Pr[H_0 | r \notin R] \cdot (1 - \gamma),
> \end{align*}
> $$
> 
> where 
> $\gamma := |R| / 2^n$.
> We also have $\Pr[H_0 | r \notin R] = \Pr[H_1 | r \notin R]$,
> thus
> 
> $$
> \begin{align*}
> \Pr[H_0]
> & \le \gamma + \Pr[H_1 | r \notin R] \cdot (1 - \gamma)\\
> & = \gamma + \Pr[H_1 \cap r \notin R]\\
> & \le \gamma + \Pr[H_1].
> \end{align*}
> $$
> 
> Given that $|R|$ is polynomial in $n$ for any NUPPT $A$, 
> it follows that $\gamma$ is negligible in $n$, which concludes the proof.

Notice that we could have constructed an efficient CPA-secure encryption from PRG, 
but using a PRF significantly simplified the construction and the proof.


Hard-Core Bits from any OWF 
---------------------------

So far we have not yet have a candidate construction of PRG (with 1-bit expansion).
We will next construct a PRG from one-way *permutations*.

The construct of PRG comes from two properties of OWF:
- The output of $f(x)$ must be sufficiently random when the input $x$ is uniform; 
  otherwise, $f$ is constant (for most $x$), then we can invert easily.
- A sufficiently random $f(x)$ can still be easily inverted (such as indentity func).
  By hard to invert, there must be *some bits* of $x$ that are hard to guess when $f(x)$ is given.

Suppose $f$ is OWP, then we have "fully random" $f(x)$ (that is stronger than the first propery).
Additionally utilizing the second property, it seems we can take "some bits" from $x$
to obtain a 1-bit PRG.

#### **Definition:** One-way Permutations

{: .defn}
> An OWF $f: \bit^n \to \bit^n$ for all $n\in\N$ is called a *one-way permutations*
> if $f$ is a bijection.

#### **Definition:** Hard-core Bits

{: .defn}
> A predicate $h : \bit^\ast \to \bit$ is a *hard-core predicate* 
> for $f (x)$ if $h$ is efficiently computable given $x$, 
> and for any NUPPT adversary $A$, there exists a negligible $\eps$
> so that for all $n\in\N$,
> 
> $$
> \Pr[x \gets \bit^n: A(1^n, f(x)) = h(x)] \le \frac{1}{2} + \eps(n).
> $$

This is indeed the case for some OWPs.
If we construct OWP from the RSA assumption, 
then the least significant bit of $x$ is that "hard to guess" one,
and then we can obtain PRG from RSA assumption.

#### **Theorem:** PRG from OWP and hard-core predicate

{:.theorem}
> Suppose that $f: \bit^n \to \bit^n$ is a OWP and $h: \bit^n \to \bit$ is 
> a hard-core predicate for $f$ (for all $n\in\N$).
> Then, $g: \bit^n \to \bit^{n+1}$ to be defined below is a PRG:
> 
> $$
> g(x) := f(x) \| h(x).
> $$
> 
> (The proof is a standard reduction: if there exists a NUPPT distinguisher $D$ against $g$,
> then we can build a NUPPT adversary $A$ that inverts $f$ by running $D$.)

However, we want to obtain PRG from *any* OWP (without depending on specific assumptions)
or any OWF. That is unfortunately unclear.

Fortunately, Goldreich-Levin showed that for any OWF $f'$, 
we can obtain another OWF $f$ that we know its hard-core predicate.
The intuition is: given $f'$ is hard to invert, in the preimage of $f(x)$,
there must be at least $\omega(1)$ bits that are hard to guess
(otherwise, a poly-time adv can invert).
Hard-core predicate formalizes those bits.
Even we do not know which bits are hard, 
we can sample randomly and hope to obtain some of them.

#### **Theorem:** Goldreich-Levin, Hard-Core Lemma

{: .theorem}
> Let $f': \bit^n \to \bit^n$ for all $n\in\N$ be a OWF.
> Define functions $f: \bit^{2n}\to \bit^{2n}, h: \bit^{2n} \to \bit$ to be the following:
> 
> $$
> f(x,r) := f'(x) \| r, \text{ and }
> h(x,r) := x \odot r,
> $$
> 
> where $\odot$ denotes the inner product modulo 2.
> Then, $f$ is a OWF and $h$ is a hard-core predicate for $f$.

Note: in the above definition of $f$ and $h$, the thm says that
"even we are given the subset $r$ and $f'(x)$, because $f'(x)$ is hard to invert, 
we still do not know the parity of $x$ over $r$".
Since the subset $r$ is chosen uniformly, 
that implies that $f'$ has many hard-core bits out of $n$, 
and even we do not know where are them, 
$r$ hits some hard-core bits with overwhelming probability.
This is indeed consistent with the earlier intuition.

Clearly $f$ is a OWF, and $h$ is easy to compute.
The main challenge is to prove that $h$ is hard-core.
We assume for contra that $h$ is not hard-core, which is the following,
and then to reach contra, we want to construct another adversary $B$ that inverts $f'$.

#### **Full Assumption:**

{: .defn}
> There exists NUPPT $A$, polynomial $p$, such that for inf many $n\in\N$,
> 
> $$
> \Pr[x \gets \bit^n, r \gets \bit^n: A(1^{2n}, f(x,r)) = h(x,r)] \ge 1/2 + 1/p(n).
> $$

The construct and analysis of $B$ is involved, so we will start from a couple of warmups.

#### **Warmup Assumption 1:**

{: .defn}
> There exists NUPPT $A$, such that for inf many $n\in\N$,
> for all $r \in \bit^n$,
> 
> $$
> \Pr_{x}[A(1^{2n}, f(x,r)) = h(x,r)] = 1.
> $$

{: .proof}
> To invert $y \gets f'(x)$, the construction of $B_1(1^n, y)$ is simple:
> 1. For $i = 1, 2, ..., n$, do the following
>    1. Let $e_i$ be the $n$-bit string that only the $i$-th bit is 1 (0 otherwise)
>    2. Run $x'_i \gets A(1^{2n}, y \\| e_i)$
> 2. Output $x' := x'_1 x'_2 ... x'_n$
> To see why $B_1$ inverts $y \gets f'(x)$, observe that $x'_i = h(x) = x \odot e_i = x_i$,
> where $x = x_1 x_2 ... x_n$.
> Hence, $B_1$ succeeds w.p. 1, a contradiction.

Note: the above assumed "for all $r$" and "w.p. $=1$", both are much stronger than we wanted.

#### **Warmup Assumption 2:**

{: .defn}
> There exists NUPPT $A$, polynomial $p$, such that for inf many $n\in\N$,
> 
> $$
> \Pr_{x,r}[A(1^{2n}, f(x,r)) = h(x,r)] \ge 3/4 + 1/p(n).
> $$

{: .proof}
> We would like to use $e_i$ as before, 
> but now $A$ may always fail whenever the suffix of $f(x,r)$ is $e_i$.
> Hence, we randomize $e_i$ to $r$ and $r \oplus e_i$ and then recover the inner product $h$.
> 
> {:.theorem-title}
>> Fact
>> 
>> For all $n$, any strings $x, a, b \in \bit^n$, it holds that
>> $(x \odot a) \oplus (x \odot b) = x \odot (a \oplus b)$.
> 
> To invert $y \gets f'(x)$, the construction of $B_2(1^n, y)$ is below:
> 1. For each $i = 1, 2, ..., n$, do
>    1. For $j = 1$ to $m$, do
>       - $r \gets \bit^n$
>       - Run $z_{i,j} \gets A(1^{2n}, y \\| e_i\oplus r) \oplus A(1^{2n}, y \\| r)$
>    2. Let $x'\_i$ be the majority of $\set{z\_{i,j}}\_{j\in[m]}$
> 2. Output $x' := x'_1 x'_2 ... x'_n$
> 
> To prove $B_2$ succeeds with high prob., we first prove that there are many good $x$'s.
> 
> {: .theorem-title}
>> Good instances are plenty.
>> 
>> Define $G$ to be the set of good instances,
>> 
>> $$
>> G:= \set{
>> x \in \bit^n ~|~ \Pr_{r}[A(1^{2n}, f(x,r)) = h(x,r)] \ge 3/4 + \alpha / 2 },
>> $$
>> 
>> where $\alpha := 1/p(n)$.  
>> If the Warmup Assumption 2 holds, then
>> $|G| \ge 2^n \cdot \alpha / 2$.
> 
> {: .proof}
>> (This is actually a standard averaging argument or a Markov ineq.)
>> Suppose not, $|G| \lt 2^n \cdot \alpha / 2$.
>> Then,
>> 
>> $$
>> \begin{align*}
>> \Pr_{x,r}[A(f(x,r)) = h(x,r)]
>> & = \Pr[A=h \cap x \in G] + \Pr[A=h | x\notin G] \cdot \Pr[x \notin G]\\
>> & \lt \alpha/2 + \Pr[A=h | x\notin G]\\
>> & \le \alpha/2 + 3/4 + \alpha /2 = 3/4 + \alpha,
>> \end{align*}
>> $$
>> 
>> which contradicts Warmup Assumption 2.
> 
> Now, suppose that $x \in G$.
> $A$ fails to invert $y \\| e_i \oplus r$ or $y \\| r$ w.p. $\lt 1/2 - \alpha$ by union bound.
> So, for any fixed $i$, $\Pr[z_{i,j} = x_i] \ge 1/2 + \alpha$ for each $j$ independently.
> By Chernoff bound, the majority of $z_{i,j}$ is $x_i$ w.p. $\ge 1 - e^{-m\alpha^2 /2}$.
> Choosing $m = np^2(n)$, the probability is exponentially close to 1.
> By union bound over all $i\in[n]$, $B_2$ recovers $x$ w.p. close to 1.
> 
> Finally, $B_2$ succeeds w.p. $\ge \alpha / 4$ for all $x$ uniformly sampled
> by failing for all $x \notin G$.

To complete the full proof, We want to lower from $3/4$ to $1/2$.
The "good set" still holds when modified to $1/2$ (since it is a simple averaging).
The main challenges from the previous $3/4$ proof is:

- The union bound of inverting both $y \\| e_i \oplus r$ and $y \\| r$. 
  For $1/2$, that lowers to only $\alpha$, 
  and then that is too low for the following majority and Chernoff bound.

The first idea is to *guess* the inner product $x \oplus r$ uniformly at random, 
which is a correct guess w.p. $1/2$.
Suppose that $p(n)$ is a small constant and then $m(n) = O(n)$,
all $m$ guesses are correct w.p. $1/2^m = 1 / \poly(n)$, 
then conditioned on correct guesses, we have $A(y \\| e_i \oplus r)$ correct w.p. $1/2 + \alpha$ (when $x$ is good),
and then we can continue with Chernoff bound and finish the prove.
For large $p(n)$, the guesses are too many and $1/2^m$ approaches negligible.

The second idea is to use *pairwise independent* guesses.
Particularly, we have Chebychev's bound for the measure concentration of pairwise indep. r.v.
(instead of Chernoff bound for fully indep.).

#### **Theorem:** Chebychev's inequality

{:.theorem}
> Let $X_1, ..., X_m \in [0,1]$ be pairwise independent random variables such that for all $j$,
> $\E[X_j] = \mu$. Then,
>
> $$
> \Pr\left[ |X - m \mu| \ge m \delta m \right] \le \frac{1-\mu^2}{m \delta^2},
> $$
> 
> where $X := \sum_{j\in[m]} X_i$.

We can then reduce the number of guesses from  $m$ to $\log m$.

#### **Fact of pairwise independent random strings:**

{: .theorem}
> For any $n, m \in \N$, let $(u_i : u_i \gets \bit^n)_{i \in [\log m]}$ 
> be strings independently sampled uniformly at random 
> (we abuse notation and round up $\log m$ to the next integer).
> Define strings $r_I$ for each $I \subseteq [\log m]$ to be
> 
> $$
> r_I := \bigoplus_{i \in I} u_i.
> $$
> 
> The random variables $(r_1, r_2, ..., r_m)$ are pairwise independent,
> where $r_j$ denotes $r_I$ such that $I$ is the $j$-th subset of $[\log m]$.
> 
> (The proof is left as exercise.)

Now we are ready to prove the full theorem.

{: .proof-title}
> Proof of Hard-Core Lemma (Goldreich-Levin)
> 
> Given NUPPT $A$ in the (Full Assumption)[#full-assumption],
> we construct $B$ that inverts $y \gets f'(x)$ as follows.
> 
> {:.defn-title}
>> Algorithm $B(1^n, y)$
>> 
>> 1. For each $i=1,2, .., n$,
>>    1. Let $\ell := \log m$, $(u_1, ..., u_\ell)$ be fully independent and $(r_1,..., r_m)$ be pairwise independent
>>       $n$-bit random strings as in Fact of pairwise indep.
>>    2. For each $k \in [\ell]$, sample guess bit $b_k$ uniformly. For each $j \in [m]$, 
>>       compute the bit $g_{i,j}$ from $(b_1, ..., b_\ell)$ in the same way as $r_j$
>>       (so that for any $x$, $g_{i,j} = x \odot r_j$ and $b_k = x \odot u_k$ for all $k$).
>>    3. For each $j=1,2,..., m$,
>>       - Run $z_{i,j} \gets A(1^{2n}, y \\| e_i \oplus r_j) \oplus g_{i,j}$.
>>
>>       Let $x'\_i$ be the majority of $\set{z\_{i,j}}\_{j\in[m]}$
>> 2. Output $x' := x'_1 x'_2 ... x'_n$
> 
> We begin with claiming the number of good instances of $x$.
> 
> {: .theorem-title}
>> Good instances are plenty.
>> 
>> Define $G$ to be the set of good instances,
>> 
>> $$
>> G:= \set{
>> x \in \bit^n ~|~ \Pr_{r}[A(1^{2n}, f(x,r)) = h(x,r)] \ge 1/2 + \alpha / 2 },
>> $$
>> 
>> where $\alpha := 1/p(n)$. 
>> If the [Full Assumption](#full-assumption) holds, then
>> $|G| \ge 2^n \cdot \alpha / 2$.
>> 
>> (The proof is almost the same and omitted.)
> 
> We condition on the good event that $x \in G$.
> Next, we condition on the "lucky event" that 
> the guess $b_k$ equals to $x \odot u_k$ for all $k$, which happens w.p. $1/m$.
> That implies $(g_{i,1}, ..., g_{i,m})$ are all correct.
> With the conditioning, for any $j \neq j'$, $r_j$ and $r_{j'}$ are still pairwise indep.,
> and thus $(g_{i,j}, g_{i,j'})$ are pairwise indep. as well.
> Therefore, by Chebychev's ineq., the majority of $g_{i,j}$ equals to $x \odot e_i$
> w.p.
> 
> $$
> \Pr[ m (1 + \alpha)/2 - X \ge m \alpha/2] \le \frac{1}{m (\alpha/2)^2},
> $$
> 
> where $X = \sum_j X_j$, and $X_j$ denotes the event that $A$ outputs $x\odot(e_i \oplus r_j)$ correctly.
> Choosing $m(n) := 8n p^2(n)$, we have that $\Pr[x'_i \neq x_i] \le 1/2n$.
> Taking union bound for all $i$, $\Pr[x' = x] \ge 1/2$, conditioning on $x \in G$ and $b_i$'s are correct.
> Removing the conditional events\* takes $\alpha/2$ and $1/m$, but $B$ still inverts $y$
> w.p. $\ge 1/(4p(n)m(n)) = 1 / 32 n p^3(n)$, contradicting $f'$ is OWF.
> 
> (\*For any events $A,B,C$, 
> $\Pr[A] \ge \Pr[A \| B \cap C] \Pr[B \cap C]$.)

**Discuss**{:.label}
The number of bits we guessed is $\log m = O(\log p(n)) = O(\log n)$, 
where $p(n)$ depends on the (hypothetical) NUPPT $A$.
Since the guessed bits entails information about $x$,
the proof implies that there must be $\omega(\log n)$ bits 
that are hard to invert (from $f(x)$ to $x$).
This is non-trivial because we do not know which are the hard bits,
and ${n \choose c \log n} \ge (n/c \log n)^{c\log n}$ is a super-polynomial,
yet we have an efficient attack using pairwise indep.

**Discuss**{:.label}
How far does the Hard-core Lemma extend to? 
Suppose $f'$ is OWF, and suppose $h'$ is a hard-core predicate for $f'$.
- Is $f(x) := f'(x) \\| h'(x)$ a OWF?
- Let $f(x,t,r) := f'(x) \\| t \\| r$, and let $h(x,t,r) := x \odot r$. 
  Is $f$ a OWF? If so, is $h$ a hard-core predicate for $f$?
- Let $f(x,t,r) := f'(x) \\| t \\| x \odot t \\| r$, and let $h(x,t,r) := x \odot r$. 
  Is $f$ a OWF? If so, is $h$ a hard-core predicate for $f$?

The questions are highly relevant when we want to construct PRG from any one-way *function*.


<!-- #### **Definition:** Chose-Ciphertext-Attack Encryption (CCA 1/2) -->

