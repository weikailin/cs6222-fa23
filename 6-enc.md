---
layout: page
title: 6. Encryptions
nav_order: 6
nav_exclude: false
---

$$
\newcommand{\Enc}{\mathsf{Enc}}
\newcommand{\Dec}{\mathsf{Dec}}
$$
{: .d-none}

Encryptions
=====================

We introduced private-key encrytion earlier, but public-key encryption is deferred to this section.
It is because the hardness assumption: private-key encryption and other primitives can be based on 
the existence of OWFs, but we need other assumptions to obtain PKE. 

#### **Definition:** Public-key encryption.

{: .defn}
> $(\Gen,\Enc,\Dec)$ is said to be a *public-key encryption scheme* 
> if the following syntax, correctness, and security holds.
> 
> 1. $\Gen$ is a PPT algorithm, $(\pk, \sk) \gets \Gen(1^n)$
> 2. $\Enc$ is a PPT algorithm, for all $\pk$ and all $m \in \bit$, $c \gets \Enc_\pk(m)$
> 3. $\Dec$ is a deterministic algorithm, for all $\sk$ and $c$, $m \gets \Dec_\sk(c)$ such that $m \in \bit \cup \bot$.
> 
> Correctness: For all $n \in \N, m \in \bit$,
>
> $$
> \Pr[(\pk, \sk) \gets \Gen(1^n) : \Dec_\sk(\Enc_\pk(m)) = m] = 1.
> $$  
> 
> Security:
> For all NUPPT $D$, there exists a negligible function $\eps(\cdot)$ such that
> for all $n\in\N$, $m_0, m_1 \in \bit$, $D$ distinguishes between the following distributions 
> with probability at most $\eps(n)$:
> 
> - $\set{(\pk, \sk)\gets \Gen(1^n) : (\pk, \Enc_\pk(m_0))}_n$
> - $\set{(\pk, \sk)\gets \Gen(1^n) : (\pk, \Enc_\pk(m_1))}_n$


With this definitions, there are some immediate impossibility results:

- Perfect secrecy is impossible: given $\pk$, the adversary can try to encrypt all messages with all randomness. 
- Deterministic encryption is also impossible: the adversary can try to encrypt the same message and get the same ciphertext.
- IND-CPA security is implied directly.

Ref: [KL, 14.3]


