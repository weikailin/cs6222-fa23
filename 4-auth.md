---
layout: page
title: 4. Authentication
nav_order: 4
nav_exclude: false
---

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

Message Authentication Codes
-------------------------

#### **Definition:** MAC

{:.defn}
> $(Gen, Tag, Ver)$ is a message authentication code (MAC) over 
> the message space $\set{\cM_n}_n$ if the following syntax, correctness, and security hold:
> 
> - $Gen$ is a PPT algorithm that returns a key $k \gets Gen(1^n)$.
> - $Tag$ is a PPT algorithm that on input key $k$ and message $m$ outputs a tag $\sigma \gets Tag_k(m)$.
> - $Ver$ is a deterministic polynomial-time algorithm that on input $k, m$ and $\sigma$ 
>   outputs “accept” or “reject”.
> 
> Correctness: For all $n \in\N$, for all $m \in \cM_n$,
> 
> $$
> \Pr[k \gets Gen(1^n) : Ver_k(m, Tag_k(m)) = \text{accept}] = 1.
> $$
> 
> Security: for all NUPPT adversaries $A$, there exists a negligible function $\eps(n)$
> such that
> 
> $$
> \Pr\left[
> \begin{array}{l}
> k \gets Gen(1^n);\\
> (m, \sigma) \gets A^{Tag_k(\cdot)}(1^n)
> \end{array}
>  ~:~
> \begin{array}{l}
> A \text{ did not not query } m \text{, and }\\ 
> Ver_k(m, \sigma) = \taccept
> \end{array}
> \right] \le \eps(n)
> $$
