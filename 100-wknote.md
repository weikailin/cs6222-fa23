---
layout: page
title: Wei-Kai's Notes
# nav_order: 0
nav_exclude: true
search_exclude: true
toc: true
---

This page maintains some of my personal and random thought's for this course.

1. TOC
{:toc}

### [Ps, Definition 26.1] Worst-case One-way Function.
The "hard to invert" property says that there is no adversary A such that 

$$
\forall x \Pr[A(f(x)) \in f^{-1}(f(x))] = 1
$$

The given equation $=1$ was not good since the next paragraph says that 

> assuming $NP \notin BPP$, one-way functions
> according to the above definition must exist. In fact, these two
> assumptions are equivalent (show this!).

However, to make the equivalence, the probability should be 

$$
\Pr[...] \ge 1 - 2^{-n}
$$

where 
$n:=|x|$ is the size of $x$.
Namely, if we want to prove that worst-case OWF imples $NP \notin BPP$, we want to construct a reduction
that uses a $BPP$ oracle to invert the OWF w.p. 1. 
This is open unless we have efficient derandomization, as pointed by Yanyi Liu.

### [Ps, Section 2.4.3, p.40] From weak to strong OWF
The analysis of $\Pr[A'(\vec y) \wedge x_j \notin G_n]$ is loose when we use it in the following union bound.
There factor is $m^2$, the first $m$ is from the random choice of index in $A_0$, 
and the second is from union bound.

We can split the event $A'(\vec y) \wedge \text{ some } x_i \notin G_n$ first, and then take union bound.
They are actually the same summation. This yields only one factor $m$. 

### [Ps, Theorem 12.3, p.12]
The probability

$$
\frac{\Pr_{k,m}[m=m' \cap \Enc_k(m)=c]}{\Pr_{k,m}[\Enc_k(m)=c]}
$$

does not seem to "be re-written as" the next one that exchanges $m$ and $m'$.
Particularly, in the nominator, $m$ is a random variable but $m'$ is fixed,
but in general the substitution shall be applied globally.

### [Ps, algorithm 64.2: A Universal One-way Function, p.64]

When $M$ terminates, it should output $M \| M(x)$.
If not, we have an easy way to invert: given an output $z$ that is short, 
we invert it to $(M', z)$ s.t. $M'(x)$ just output $x$.


Others
-------
Related courses:
- PHYS 5880 Introduction to Quantum Computing (Gia-Wei Chern, Fall 23)

Quizzes:
- What's your program / major? (for example, PhD, MCS, undergrad CS)
- Have you taken courses related to cryptography? (for example, blockchain, security, computation theory, complexity, probability, algebra, number theory) If you have any project / experience related to cryptography, you may describe it here.
- What's your expectation or goal for this course? Try to be specific, such as to fulfill program requirement X, to build an application Y, or to get a better CV for future job Z.


PRG from any OWF
----------------

#### **Definition:** Pairwise independent hash family.

{:.defn}
> A family of functions $\cH = \set{h : \bit^n \to \bit^m}$ is *pairwise independent* 
> if the following two conditions hold when $H \gets \cH$ is a function chosen uniformly at random from $\cH$:
> 
> 1. For all $x \in \bit^n$, the random variable $H(x)$ is uniform in $\bit^m$.
> 2. For all $x_1\neq x_2 \in \bit^n$, the random variables $H(x_1)$ and $H(x_2)$ are independent.
> 
> [V, Definition 3.21, p64]

#### **Lemma:** Pairwise independent hash from linear mapping.

{:.theorem}
> For any finite field $F$, define $\cH$ to be the following set:
> 
> $$
> \cH := \set{h_{a,b} : h_{a,b}(x) = a x + b \mod p, a,b\in F}.
> $$
> 
> $\cH$ is a pairwise independent hash family.
> 
> [V, Construction 3.23, p65]

If $m \ge n$,
choosing the field to be $F_{2^m}$ gives a construction such that 
each function takes $2m$ bits to describe.
If $m \lt n$,
choosing $F_{2^n}$ and chopping the output to $m$ bits is still pairwise independent.

#### **Corollary:**

{:.theorem}
> For any $n,m\in\N$, there exists a pairwise independent hash family $\cH_{n,m}$
> such that each $h \in \cH$ is $2 \max(n,m)$ bits.
> 
> [V, Theorem 3.26, p66]

#### **Theorem:** Leftover Hash Lemma

{:.theorem}
> If H = {h : {0, 1}n → {0, 1}m} is a pairwise independent (or even 2-universal) family of hash functions 
> where m = k − 2 log(1/ε), then Ext(x, h) def = h(x) is a strong (k, ε)-extractor. 
> Equivalently, Ext(x, h) = (h, h(x)) is a standard (k, ε)-extractor.
> 
> [V, Theorem 6.18, p179]

#### **Theorem:** Weak PEG from OWF

{: .theorem}
> Let $f: \bit^n \to \bit^n$ for all $n\in\N$ be a OWF,
> let $\cH$ be a pairwise independent hash family that for each $h \in \cH$, 
> $h : \bit^n \to \bit^n$ and $|h| = 2n$.
> Define function $f$ to be the following:
> 
> $$
> F(x,i,h,r) := (f(x), i, h, h_i(x), r, x \odot r), \text{ and }
> $$
> 
> where $h$ is abused to denote the description of $h \in \cH$, 
> $h_i(x)$ denotes the $i$-bit prefix of $h(x)$.
> Then, $f$ is a weak PEG.

Let random variables $Y,Z,Z_{i^*}'$ be the following

$$
Y := (f(x), i, h, h_i(x), r), ~ Z := x \odot r, \text{ and}
$$

$$
Z' := \begin{cases}
 \text{random bit} & \text{if } i = i^*\\
 x \odot r  & \text{otherwise.}
\end{cases}
$$

#### **Claim:**

{: .theorem}
> For each $x \in \bit^n$, let 
> $i^\ast(x) := \log |f^{-1}(f(x))|$.
> It holds that $\set{YZ}_n \approx \set{YZ'_{i^\ast(x)}}_n$.

{: .proof-title}
> Proof Sketch.
> 
> It is similar to the proof of Hard-core Lemma.
> Let $i^\ast$ to be $i^\ast(x)$ and $Z'$ to be $Z'_{i^\ast(x)}$ for short.
> Because $YZ, YZ'$ differ only when $i = i^\ast$, 
> assume for contradiction, there exists NUPPT $A$, polynomial $p$, such that for inf many $n$,
> 
> $$
> \Pr_{x,h,r} [A(f(x),i^*,h,h_{i^*}(x),r) = x\odot r] \ge 1/2 + \alpha,
> $$
> 
> where $alpha = 1/p(n)$.
> 
> We want to consturct $B$ that inverts $y \gets f(x)$.
> We have a similar claim of good $x$'s:
> let $G$ to be the set
> 
> $$
> G := \set{ x \in \bit^n ~|~ \Pr_{h,r}[A(f(x),i^*,h,h_i(x),r) = x \odot r] \ge 1/2 + \alpha / 2 }.
> $$
> 
> Then, 
> $|G| \ge 2^n \cdot \alpha / 2$.
> We can next fix $h$ similarly:
> for each $x\in G$,
> let $G_x$ to be the set
> 
> $$
> \cH_x := \set{ h \in \cH ~|~ \Pr_{r}[A(f(x),i^*,h,h_i(x),r) = x \odot r] \ge 1/2 + \alpha / 4 }.
> $$
> 
> Then, 
> $|\cH_x| \ge |\cH| \cdot \alpha / 2$.
> 
> Now, we can condition on $x \in G$ and $h \in \cH_x$.
> Namely, given $y \gets f(x)$, $B$ samples $i \gets [n], h \gets \cH$ uniformly,
> and we have that $i=i^\ast$ and $h \in \cH_x$ w.p. $1/q(n)$ for some poly $q$.
> It remains to find the correct $h(x)$ so that $B$ can run $A$ repeatedly using
> pairwise independent $r$'s.
> 
> Suppose that $x$ is fixed and $h$ is sampled uniformly and independently from $\cH$.
> Given $y = f(x)$, the min-entropy of $x$ is $i^\ast(x)$ because 
> each $x' \in f^{-1}(y)$ can be mapped to $y$.
> By Leftover Hash Lemma, 
> the first $i^\ast - d$ bits of $h(x)$ is $2^{-d}$-close to uniform.
> This implies that we can hit the prefix $i^\ast - d$ bits of $h_{i^*}(x)$
> w.p. $1 - 2^{-d}$ by sampling them uniformly at random.
> 
> However, we conditioned on $h \in \cH_x$.
> Choosing $d$ such that $2^{-d} \le 1/2q$,
> we can still hit w.p. $\ge 1/2$.
> With the above, we can try all remaining $d = O(\log n)$ bits and then 
> check if the outcome $x'$ satisfies $f(x') = y$.


#### **Theorem:** Hard-core function

{: .theorem}
> Let $f': \bit^n \to \bit^n$ for all $n\in\N$ be a OWF,
> and let $\ell := \ell(n) = c \log n$ for some constant $c$.
> Define functions $f: \bit^{3n}\to \bit^{3n}, h: \bit^{3n} \to \bit^{\ell}$ to be the following:
> 
> $$
> f(x,r) := f'(x) \| r, \text{ and }
> h(x,r) := h_1 h_2 ... h_\ell,
> $$
> 
> where $h_i$ denotes the inner product $x \odot r[i ... i+n-1]$.
> Then, $f$ is a OWF and $h$ is a hard-core function for $f$.
> 
> [G, Theorem 2.5.6, p74]



