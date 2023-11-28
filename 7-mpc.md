---
layout: page
title: 7. Multi-Party Computation
nav_order: 7
nav_exclude: false
---

$$
\newcommand{\Enc}{\mathsf{Enc}}
\newcommand{\Dec}{\mathsf{Dec}}
\newcommand{\LWE}{\mathsf{LWE}}
\newcommand{\Add}{\mathsf{Add}}
\newcommand{\Mul}{\mathsf{Mul}}
\newcommand{\Eval}{\mathsf{Eval}}
\newcommand{\Query}{\mathsf{Query}}
\newcommand{\Resp}{\mathsf{Resp}}
\newcommand{\Share}{\mathsf{Share}}
\newcommand{\Recon}{\mathsf{Recon}}
\newcommand{\ek}{\mathsf{ek}}
\newcommand{\st}{\mathsf{st}}
\newcommand{\norm}[1]{\| #1 \|}
$$
{: .d-none}

Multi-Party Computation
=====================

Like the "match-making" game, computation often consists of two or more parties,
and often each party has its own privacy or security concern.
This section discusses generic approaches.

Secret Sharing
--------------

#### **Definition**: Secret Sharing

{:.defn}
> A $(k, n)$ Secret Sharing scheme consists of a pair of PPT algorithms 
> $(\Share, \Recon)$ if it satisfies the following correctness and security.
> 
> 1. $\Share(x)$ produces an $n$-tuple $(s_1, . . . , s_n)$, and
> 2. $\Recon(s'\_{i\_1} , . . . , s'\_{i\_k} )$ is such that 
>    if $\set{s'\_{i\_1} , . . . , s'\_{i\_k} } \subseteq \set{s\_1, . . . , s_n}$ then $\Recon$ outputs $x$.
> 
> Security: For any two $x$ and $x'$, and for any subset of at most $k-1$ indicies 
> $S' \subset [1, n], |S'| < k$, the following two distributions are statistically close:
> 
> - $\set{(s_1, . . . , s_n) \gets \Share(x) : (s_i)_{i \in S'}}$ and 
> - $\set{(s_1, . . . , s_n) \gets \Share(x') : (s_i)_{i \in S'}}$
> 
> Note: we say that two ensembles $\set{X\_\lambda}\_{\lambda\in\N}$ and $\set{Y\_\lambda}\_{\lambda\in\N}$ are statistically
> iff there exists a negligible function $\eps$ such that 
> the statistical difference $\Delta(X\_\lambda, Y\_\lambda) \le \eps(\lambda)$ for all $\lambda\in\N$.

Example:
one-time pad is a $(2,2)$ secret sharing.

#### **Protocol**: Shamir Secret Sharing

{:.defn}
> $\Share_{k,n}(x)$:
> 
> 1. Let $p$ be a prime such that $p \gt n$. Choose $k - 1$ random coefficients, $a_1, . . . , a_{k−1}$ where $a_i \in Z_p$. 
> 2. Let $s(t) = x + a_1 t + a_2t^2 + · · · + a_{k-1}t^{k-1}$. Output the shares $s_1:=(1,s(1)), . . . , s_n := (n,s(n))$.
> 
> $\Recon_{k,n}((x_{i_1} , y_{i_1} ), . . . , (x_{i_k} , y_{i_k} ))$: 
> 
> 1. Interpolate the unique polynomial $P$ that passes through all $k$ points given as input.
>    (using the Lagrange formula). Output the value $P(0)$.

The correctness follows by that Lagrange interpolation is unique.
The security holds because for both $x,x'$, for any $|S'| \le k-1$,
we will sample the same $(s_i)_{i\in S'}$ with identical probability (by modifying $\Share$ w.r.t. $S'$).

#### **Lemma:** Lagrange interpolation

{:.theorem}
> Given $n + 1$ points $(x_0, y_0), . . . , (x_n, y_n)$ in which $x_0, . . . , x_n$ are distinct.
> Let 
> 
> $$
> p_i(x) := \prod_{j=0, j\neq i}^n \frac{x-x_j}{x_i-x_j}.
> $$
> 
> The unique degree-$n$ polynomial that interpolates these $n+1$ points is
> 
> $$
> P(x) = \sum_{i=0}^n y_i \cdot p_i(x).
> $$

Notice that $p_i$ depends only on $x_i$'s. 
Specifically in $\Recon$, $x_i$'s are public information, 
and thus the output is a linear combination of $y_i$'s.

We next show that Shamir secret sharing yields secure addition and multiplication.

#### **Protocol**: Addition of Shares

{:.defn}
> Let $n$ be the number of parties.
> Let $a, b \in \Z_p$ for prime $p > n$.
> Let $a(x), b(x)$ be degree $k$ polynomials (abusing notation) such that 
> 
> - $a(0) = a$, $s^a_{i} = (i,a(i))$ for all $i \in [n]$
> - $b(0) = b$, and $s^b_{i} = (i, b(i))$ analogously
> 
> Then, two shares $s^a_{i}, s^b_{i}$ can be added by
> 
> - $s^{a+b}_{i} := (i, a(i) + b(i))$,
> 
> and moreover, $s^{a+b}_{i}$ for all $i \in [n]$ is a $(k,n)$ secret sharing of $a+b$.

We can extend this addition protocol to compute multiplication by a public constant 
(that is known to all $n$ parties).

The multiplication of two secrets is more involved.
Let $\pi(x) := a(x) \cdot b(x)$.
We have $\pi(0) = a(0) \cdot b(0) = a \cdot b$, but there are two challenges:

1. Since $a(x)$ and $b(x)$ are degree $k$, $\pi(x)$ is degree $2k$.
   That is, to reconstruct $a \cdot b$, we need $2k$ shares instead of $k$.
2. $\pi(x)$ is not a random polynomial of degree $2k$ (such that $\pi(0) = a\cdot b$)
   because a random polynomial is unlikely to be decomposible to two polynomials.
   This could be a security issue: $(i,\pi(i)=a(i)\cdot b(i))$ is not $(2k, n)$ a secret share.

To overcome them, the first idea is that, 
if we want to $\Recon$ immediately after multiplication and we have more than $2k$ shares,
we can still perform interpolation to fully reconstruct (all the coefficients of) $\pi(x)$
and thus $a \cdot b$.
Or equivalently, just dropping the higer degree coefficients of $\pi(x)$.
However, we may not have $2k$ shares. 
Moreover, we really want to obtain shares (rather than $\Recon$), so that we can
continue with further addition and multiplication.

The second idea is to re-randomize $pi(x)$, so that it becomes a random $2k$-degree polynomial $pi'(x)$.
Then, we can perform $\Recon$ on $\pi'(x)$ *using secret sharing again*,
so that the resulting coefficients of $\pi'(x)$ are again $(k,n)$ shares.
See the protocol below.

#### **Protocol**: Multiplication of Shares

{:.defn}
> Let $n$ be the number of parties. Let $a, b \in \Z_p$ for prime $p > n$.
> Let $a(x), b(x)$ be degree $k < n/2$ polynomials (abusing notation) such that 
> 
> - $a(0) = a$, $s^a_{i} = (i,a(i))$ for all $i \in [n]$
> - $b(0) = b$, and $s^b_{i} = (i, b(i))$ analogously
> 
> Two shares $s^a_{i}, s^b_{i}$ can be multiplied by
> 
> 1. For all party $i \in [n]$, compute $(i, \pi(i) = a(i) \cdot b(i))$
> 2. For all party $i \in [n]$, compute $(2k,n)$ share of 0 by $(r_{i,1},..., r_{i,n} \gets \Share_{2k,n}(0)$, 
>    and then send $r_{i,j}$ from $i$ to $j$, 
>    where $r_{i,j} := (j, r_i(j))$ for random $2k$-degree polynomial s.t. $r_i(0) = 0$
> 3. All parties locally compute the shares $(i,\pi'(i))$, where 
>    
>    $$
>    \pi'(x) := \pi(x) + \sum_{i} r_i(x)
>    $$
>    
> 4. All parties jointly perform $\Recon$ using the addition of secret shares to obtain the new shares of $\pi'(0) = a\cdot b$;
>    that is, do the following:
>    
>    1. For all party $i$, $((1,s_{i,1}),...,(n,s_{i,n})) \gets \Share(\pi'(i))$ to all $n$ parties
>    2. All parties locally compute $\Recon_{k,n}$ using shares; 
>       that is, party $j$ takes the shares $(s_{1,j}, s_{2,j} ..., s_{n,j})$, 
>       lets $(x_t, y_t) := (t, s_{t,j})$ for all $t$, and run the Lagrange interpolation using all $(x_t,y_t)$ pairs,
>       and then let $S_j(x)$ be the resulting polynomial.
>    
>    The value $(j,S_j(0))$ is the new $(k,n)$ share of $a \cdot b$.

The security proof (for multiplication) is omitted due to involved notation.
The efficiency is not great: each party sends and receives $O(n)$ messages.
It requires $n > 2k$ to work, and it assumes that all parties are *honest but curious*,
meaning that they always follow the prescribed protocol.
The strength is that it achieves *perfect security*, that is,
any (unbounded) adversary that corrupts $\lt k$ parties learns nothing more than the output.

Discuss:
- How about FHE?

[Ref: Ps, Sec 6.1]
[Arora@Princeton](https://www.cs.princeton.edu/courses/archive/fall16/cos521/Lectures/lec21.pdf)


Yao's Garbling
--------------

For *computationally bounded* adversaries, we use *garbled circuits* to achieve MPC.
Consider the truth table of any Boolean gate.

| $a$ | $b$ | AND |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

The idea of Yao's garbling is to use two different keys to represent the 0-or-1 wire value. 

| $a$ | $b$ | AND, $c$ |
|---|---|---|
| $k^a_0$ | $k^b_0$ | $\Enc_{k^a_0}(\Enc_{k^b_0}(k^c_0))$ |
| $k^a_0$ | $k^b_1$ | $\Enc_{k^a_0}(\Enc_{k^b_1}(k^c_0))$ |
| $k^a_1$ | $k^b_0$ | $\Enc_{k^a_1}(\Enc_{k^b_0}(k^c_0))$ |
| $k^a_1$ | $k^b_1$ | $\Enc_{k^a_1}(\Enc_{k^b_1}(k^c_1))$ |

We sample all key $k$'s (for all super- and sub-scripts) independently using $\Gen$,
and we perform all $\Enc$ using a secure (symmetric-key) encryption scheme.
Any NUPPT adversary that is given only the ciphertexts can not know the table is an AND gate,
as long as we permute the rows uniformly at random:

| $a$ | $b$ | $c$ |
|---|---|---|
|  |  | $\Enc_{k^a_0}(\Enc_{k^b_0}(k^c_0))$ |
|  |  | $\Enc_{k^a_1}(\Enc_{k^b_1}(k^c_1))$ |
|  |  | $\Enc_{k^a_1}(\Enc_{k^b_0}(k^c_0))$ |
|  |  | $\Enc_{k^a_0}(\Enc_{k^b_1}(k^c_0))$ |

Moreover, when an evaluator is given the above 4 rows and additionally the keys $(k^a_0, k^b_0)$, 
the evaluator can decrypt exactly 1 row and then obtain $k^c_0$.
Since $k^a_0, k^b_0, k^c_0$ are representing the values of the wires $a, b, c$,
the evaluator can perform any computation *without knowing the values and logic gates*.

A minor issue is that the evaluator needs to know *which row* decrypts correctly.
This can be solved by either one of the two below:

- Use an encryption scheme such that if the key is incorrect, $\Dec$ outputs $\bot$ with overwhelming probability
  (so that the evaluator knows which row is correct)
- Mark the 4 rows uniformly at random, and then attach the mark to the corresponding $k^a$'s and $k^b$'s
  (so that the marks indicate which row to decrypt)

Composing the garbled Boolean gates, we can perform the following one-sided secure two-party computation.

|Alice, input $x_1$    | Public computation, circuit $C$    |  Bob, private input $x_2$  |
|----------------------|------------------------------------|----------------------------|
| | | For each wire $w \in C$, sample wire keys $k^w_b \gets \Gen$ for $b = 0,1$ |
| | | For each gate $g \in C$, compute 4 encrypted rows using the corresponding wire keys, and let $\set{\tilde g}_{g\in C}$ be the result|
| | | Send $\set{\tilde g}_{g \in C}$ to Alice. For each input wire corresponding to $x_2$, send the garbled input, $\tilde x_2$, to Alice. |
| Send $x_1$ to Bob | | |
| | | For each input wire corresponding to $x_1$, send the garbled input, $\tilde x_1$, to Alice. |
| Gate by gate evaluate $\tilde g$'s, and obtain $C(x_1, x_2)$ | | |

Notice that one-sided security is actually trivial: Alice gives out $x_1$, and thus Bob can simply compute $C(x_1, x_2)$.
Thus, *oblivious transfer* is typically used.
