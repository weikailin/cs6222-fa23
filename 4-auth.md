---
layout: page
title: 4. Authentication
nav_order: 4
nav_exclude: false
---

$
\newcommand{\Tag}{\mathsf{Tag}}
\newcommand{\Ver}{\mathsf{Ver}}
\newcommand{\taccept}{\text{accept}}
$
{: .d-none}

Authentication
================

In this section, we will discuss digital methods which make
it difficult to “forge” a “signature.” Just as with encryption, there
are two different approaches to the problem based on whether
private keys are allowed: message authentication codes and digital
signatures. Message Authentication Codes (MACs) are used in
the private key setting. Only people who know the secret key
can check if a message is valid. Digital Signatures extend this
idea to the public key setting. Anyone who knows the public key
of Alice can verify a signature issued by Alice, and only those
who know the secret key can issue signatures. [Ps, p133]

Message Authentication Codes (MAC)
-------------------------

#### **Definition:** MAC

{:.defn}
> $(\Gen, \Tag, \Ver)$ is a message authentication code (MAC) over 
> the message space $\set{\cM_n}_n$ if the following syntax, correctness, and security hold:
> 
> - $\Gen$ is a PPT algorithm that returns a key $k \gets \Gen(1^n)$.
> - $\Tag$ is a PPT algorithm that on input key $k$ and message $m$ outputs a tag $\sigma \gets \Tag_k(m)$.
> - $\Ver$ is a deterministic polynomial-time algorithm that on input $k, m$ and $\sigma$ 
>   outputs “accept” or “reject”.
> 
> Correctness: For all $n \in\N$, for all $m \in \cM_n$,
> 
> $$
> \Pr[k \gets \Gen(1^n) : \Ver_k(m, \Tag_k(m)) = \taccept] = 1.
> $$
> 
> Security: for all NUPPT adversaries $A$, there exists a negligible function $\eps(n)$
> such that
> 
> $$
> \Pr\left[
> \begin{array}{l}
> k \gets \Gen(1^n);\\
> (m, \sigma) \gets A^{\Tag_k(\cdot)}(1^n)
> \end{array}
>  ~:~
> \begin{array}{l}
> A \text{ did not not query } m \text{, and }\\ 
> \Ver_k(m, \sigma) = \taccept
> \end{array}
> \right] \le \eps(n)
> $$

#### **Construction:** MAC

{:.defn}
> Let $F = \set{ f_s}$ be a family of pseudorandom functions such that 
> $f_s : \bit^{|s|} \to \bit^{|s|}$.
> 
> - $\Gen(1^n): k \gets \bit^n$.
> - $\Tag_k(m)$: Output $f_k(m)$.
> - $\Ver_k(m, \sigma)$: Ouptut “accept” if and only if $f_k(m) = \sigma$.

#### **Theorem:**

{:.theorem}
> If there exists a pseudorandom function, then the above scheme is a 
> Message Authentication Code over the message space $\bit^n$.

{:.proof-title}
> Proof Sketch:
> 
> The correctness is direct, and the security is argued below.
> 
> Consider a hybrid scheme and the corresponding hybrid experiment such that
> a random function $RF$ is used instead of the PRF $f_k$.
> The hybrid scheme is indistinguishable from the real construction
> by the oracle indistinguishability of PRF and then by a standard reduction
> (for any NUPPT adversary).
> Next, in the hybrid experiment, we claim that any adversary 
> can only win with probability at most $2^{-n}$:
> if the adversary queries $m$, it is rejected;
> otherwise, the adversary can only output $\sigma = RF(m)$ w.p. $2^{-n}$
> (for even unbounded adversaries).

