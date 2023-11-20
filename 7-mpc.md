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
> 2. $\Recon(s'_{i_1} , . . . , s'_{i_k} )$ is such that 
>    if $\set{s'_{i_1} , . . . , s'_{i_k} } \subseteq \set{s_1, . . . , s_n}$ then $\Recon$ outputs $x$.
> 
> Security: For any two $x$ and $x'$, and for any subset of at most $k-1$ indicies 
> $S' \subset [1, n], |S'| < k$, the following two distributions are statistically close:
> 
> - $\set{(s_1, . . . , s_n) \gets \Share(x) : (s_i | i \in S')}$ and 
> - $\set{(s_1, . . . , s_n) \gets \Share(x') : (s_i | i \in S')}$
> 
> Note: we say that two ensembles $\set{X_\lambda}_{\lambda\in\N}$ and $\set{Y_\lambda}_{\lambda\in\N}$ are statistically
> iff there exists a negligible function $\eps$ such that 
> the statistical difference $\Delta(X_\lambda, Y_\lambda) \le \eps(\lambda)$ for all $\lambda\in\N$.

Example:
one-time pad is a $(2,2)$ secret sharing.

#### **Protocol**: Shamir Secret Sharing

{:.defn}
> $\Share_{k,n}(x)$:
> 
> 1. Let $p$ be a prime such that $p \gt n$. Choose $k - 1$ random coefficients, $a_1, . . . , a_{k−1}$ where $a_i \in Z_p$. 
> 2. Let $s(t) = x + a_1 t + a_2t^2 + · · · + a_{k-1}t^{k-1}$. Output the shares $s_1:=(1,s(1)), . . . , s_n := (n,s(n))$.
> 
> $\Recon((x_{i_1} , y_{i_1} ), . . . , (x_{i_k} , y_{i_k} ))$: 
> 
> 1. Interpolate the unique polynomial $P$ that passes through all $k$ points given as input.
>    (using the Lagrange formula). Output the value $P(0)$.

