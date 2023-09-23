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

**Notice**{: .label}
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

**Notice:**{:.label}
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

#### **Definition:** Pseudo-random Functions (PRFs)

{:.defn}
> A family of functions $\set{f_s: \bit^{|s|} \to \bit^{|s|}}_{s \in \bits}$
> is *pseudo-random* if
> 
> - (Easy to compute): $f_s(x)$ can be computed by a PPT algo that is given input $s,x$.
> - (Pseudorandom): for any NUPPT $D$, there exists a negl function $\eps(\cdot)$ s.t.
>   
>   $$
>   \Pr[s\gets \bit^n : D^{f_s(\cdot)}(1^n) = 1] - \Pr[F\gets \RF_n : D^{F(\cdot)}(1^n) = 1] \le \eps(n).
>   $$
>   
>   This is often denoted as $\set{s\gets \bit^n : f_s}_n \approx \set{F \gets \RF_n : F}_n$.

Note: $D^{f(\cdot)}$ denotes that the TM $D$ may interact with the function $f$ 
through black-box input and output, while each input-output takes time to read/write 
but computing $f$ takes 0 time.

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

#### **Theorem:** CPA-Secure Encryption from PRF

{: .theorem}
> Let $\PRF = \set{f_k : \bit^{|s|} \to \bit^{|s|}}_{s\in\bit^\ast}$ be a family of PRFs.
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



Hard-Core Bits from any OWF 
---------------------------





<!-- #### **Definition:** Chose-Ciphertext-Attack Encryption (CCA 1/2) -->

