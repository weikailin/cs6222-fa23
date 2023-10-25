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

### [Ps, algorithm 89.6: B(y) for the General case, p.89]

The sampling of $(b_1, r_1) ...$ pairs should be used for all $i$,
that is, to move it up and prior to any for loop.
This is necessary to ensure all $x_i$'s are correct w.h.p.,
and we use union bound anyways.

### [Ps, Definition 136.2]

$A$ shall be given $pk$ as input (in addition to $1^n$).

Others
-------
Related courses:
- PHYS 5880 Introduction to Quantum Computing (Gia-Wei Chern, Fall 23)

Quizzes:
- What's your program / major? (for example, PhD, MCS, undergrad CS)
- Have you taken courses related to cryptography? (for example, blockchain, security, computation theory, complexity, probability, algebra, number theory) If you have any project / experience related to cryptography, you may describe it here.
- What's your expectation or goal for this course? Try to be specific, such as to fulfill program requirement X, to build an application Y, or to get a better CV for future job Z.



<!-- 
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
 -->


