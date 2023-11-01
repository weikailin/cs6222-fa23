---
layout: page
title: 4. Authentication
nav_order: 4
nav_exclude: false
---

$$
\newcommand{\Tag}{\mathsf{Tag}}
\newcommand{\Ver}{\mathsf{Ver}}
\newcommand{\Sign}{\mathsf{Sign}}
\newcommand{\taccept}{\text{accept}}
\newcommand{\twin}{\text{ win}}
$$
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
> $$(\Gen, \Tag, \Ver)$$ is a message authentication code (MAC) over 
> the message space $$\set{\cM_n}_n$$ if the following syntax, correctness, and security hold:
> 
> - $$\Gen$$ is a PPT algorithm that returns a key $$k \gets \Gen(1^n)$$.
> - $$\Tag$$ is a PPT algorithm that on input key $$k$$ and message $$m$$ outputs a tag $$\sigma \gets \Tag_k(m)$$.
> - $$\Ver$$ is a deterministic polynomial-time algorithm that on input $$k, m$$ and $$\sigma$$ 
>   outputs “accept” or “reject”.
> 
> Correctness: For all $$n \in\N$$, for all $$m \in \cM_n$$,
> 
> $$
> \Pr[k \gets \Gen(1^n) : \Ver_k(m, \Tag_k(m)) = \taccept] = 1.
> $$
> 
> Security: for all NUPPT adversaries $$A$$, there exists a negligible function $$\eps(n)$$
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

Discuss:

- The adversary $$A$$ is allowed to oracle query $$\Tag_k$$. Is that too strong as $$A$$ gets too much info? 
  What if we totally remove the oracle query?
  What if the adversary gets some $$(x, \Tag_k(x))$$ pairs but only for challenger-chosen $$x$$'s?
- The adversary $$A$$ aims to forge a tag for *arbitrary message* $$m$$. Is that too strong since useful messages are not arbitrary?
- Can we change the definition to that $$A$$ wins only if it outputs a good key?
- Can this definition defined against an adversary that *replay* a (message, tag) pair? 
  Replay can be a devastating attack in many applications, such as financial transactions.
- If we additionally give the adversary oracle access to verification $$\Ver_k$$, is the definition stronger?
- Does the existence of MAC imply the existence of OWF? If so, what's the construction?

#### **Construction:** MAC

{:.defn}
> Let $$F = \set{ f_s}$$ be a family of pseudorandom functions such that 
> $$f_s : \bit^{|s|} \to \bit^{|s|}$$.
> 
> - $$\Gen(1^n): k \gets \bit^n$$.
> - $$\Tag_k(m)$$: Output $$f_k(m)$$.
> - $$\Ver_k(m, \sigma)$$: Ouptut “accept” if and only if $$f_k(m) = \sigma$$.

#### **Theorem:**

{:.theorem}
> If there exists a pseudorandom function, then the above scheme is a 
> Message Authentication Code over the message space $$\bit^n$$.

{:.proof-title}
> Proof Sketch:
> 
> The correctness is direct, and the security is argued below.
> 
> Consider a hybrid scheme and the corresponding hybrid experiment such that
> a random function $$RF$$ is used instead of the PRF $$f_k$$.
> The hybrid scheme is indistinguishable from the real construction
> by the oracle indistinguishability of PRF and then by a standard reduction
> (for any NUPPT adversary).
> Next, in the hybrid experiment, we claim that any adversary 
> can only win with probability at most $$2^{-n}$$:
> if the adversary queries $$m$$, it is always rejected;
> otherwise, the adversary can only output $$\sigma = RF(m)$$ w.p. $$2^{-n}$$
> (for even unbounded adversaries).

#### From fixed-length to arbitrary length

The above definition and construction consider MAC for messages in space $$\cM_n$$ so that
the length is fixed.
Of course, to handle arbitrarily long messages,
we can instantiate the PRF in the construction with a PRF scheme of arbitrary length.
However, existing
practical pseudorandom functions (i.e., block ciphers) take short, ﬁxed-length inputs.
It is necessary in practice to handle some subtleties, and this is called "domain extension" in general.

1. Split a long message into a sequence of short "blocks" and then $$\Tag$$ each.
2. Include a sequence number into each block (to prevent reordering attack).
3. Append to every block the total length (to prevent truncation attack).

There are other approaches, such as CBC-MAC (which is *only secure when* 
the message length is "ﬁxed and agreed upon in advance", see [KL, Exercise 4.13]).
We skip the details of the constructs.

Digital Signature Schemes
-------------------------

> With message authentication codes, both the signer and verifier need to share a secret key.
> In contrast, digital signatures mirror real-life signatures in that anyone who knows Alice 
> (but not necessarily her secrets) can verify a signature generated by Alice.
> Moreover, digital signatures possess the property of *non-repudiability*, 
> i.e., if Alice signs a message and sends it to Bob, 
> then Bob can prove to a third party (who also knows Alice) the validity of the signature. 
> Hence, digital signatures can be used as certificates in a public key infrastructure.
> 
> -- [Ps, Section 5.3]

Ref: [KL 13.1, 13.2, 13.6]

#### **Definition:** Digital Signatures

{:.defn}
> $$(\Gen, \Sign, \Ver)$$ is a digital signature scheme over the message space $$\set{\cM_n}_n$$ 
> if the following syntax, correctness, and security are satisfied:
> 
> - $$\Gen(1^n)$$ is a PPT which on input $$n$$ outputs a public key $$\pk$$ and a secret key $$\sk$$: $$\pk, \sk \gets \Gen(1^n)$$. 
> - $$\Sign$$ is PPT algorithm which on input a secret key $$\sk$$ and message $$m \in \cM_n$$ 
>   outputs a signature $$\sigma$$: $$\sigma \gets \Sign_\sk(m)$$.
> - $$\Ver$$ is a deterministic poly-time algorithm which on input a public key $$\pk$$, 
>   a message $$m$$ and a signature $$\sigma$$ returns either “accept” or “reject”.
> 
> Correctness:
> For all $$n \in \N$$, for all $$m \in \cM_n$$,
> 
> $$ 
> \Pr[\pk, \sk \gets \Gen(1^n) : \Ver_\pk(m, \Sign_\sk(m)) = \taccept] = 1
> $$
> 
> Security:
> For all NUPPT adversaries $$A$$, there exists a negligible function $$\eps(n)$$ such that
> $$\forall n \in \N$$,
> 
> $$
> \Pr\left[
> \begin{array}{l}
> \pk,\sk \gets \Gen(1^n);\\
> (m, \sigma) \gets A^{\Sign_\sk(\cdot)}(1^n, \pk)
> \end{array}
>  ~:~
> \begin{array}{l}
> A \text{ did not not query } m \text{, and }\\ 
> \Ver_\pk(m, \sigma) = \taccept
> \end{array}
> \right] \le \eps(n)
> $$

Discuss:

- $\pk$ must be sent to the verifier through an athenticated way (by definition in the above).
  If we have that authenticated way, why do we need DS then?
- Would it be meaningful if $A$ gets no oracle access to $\Sign_\sk$, since $A$ is given $\pk$ as input?
- Would it be meaningful if $A$ gets oracle access to $\Sign_\sk$ but *only once*?
- The definition is a public-key version of MAC.
- Since the verification uses only public key, $$A$$ can perform verification without oracle queries.
- Hence, it is clear that DS implies MAC, and then it implies OWF.
- Can we obtain a digital signature from (public-key) encryption?

Lamport’s Signature Scheme
-------------------------

Refs: [KL 14.4], [Lamport'79](https://lamport.azurewebsites.net/pubs/dig-sig.pdf), [Goldwasser@Berkeley](https://inst.eecs.berkeley.edu/~cs276/fa20/slides/lec12.pdf)

#### **Definition:** One-Time Digital Signatures

{:.defn}
> $$(\Gen, \Sign, \Ver)$$ is a *one-time* digital signature scheme 
> the definition of DS is satisfied under the constraint that the adversary $$A$$ 
> is only allowed to query the signing oracle *once* (in $$A^{\Sign_\sk(\cdot)}$$).

#### **Construct:** Lamport's Digital Signature

{:.defn}
> Let $$f: \bit^\ast \to \bit^\ast$$ be a OWF.
> Given $$n \in \N$$, $$(\Gen, \Sign, \Ver)$$ is constructed as follows for $$\cM_n := \bit^n$$.
> 
> $$\Gen(1^n)$$:
> 
> 1. Sample strings $$x_b^i \gets \bit^n$$ for $$i \in [n], b \in \bit$$.
> 2. Compute $$y_b^i = f(x_b^i)$$ for all $$i, b$$
> 3. Output $$\pk := (y\_b^i)\_{i,b}$$ and $$\sk := (x\_b^i)\_{i,b}$$.
> 
> $$\Sign_\sk(m)$$:
> 
> 1. Output $$\sigma := (x_{m_i}^i)_{i\in[n]}$$, where $$m_i$$ denotes the $$i$$-th bit of $$m$$.
> 
> $$\Ver_\pk(\sigma)$$:
> 
> 1. Output $$\taccept$$ iff for all $$i \in [n]$$, it holds that
>    $$f(x_{m_i}^i) = y_{m_i}^i$$, where $$x_{m_i}^i$$ comes from $$\sigma$$ and $$y_{m_i}^i$$ comes from $$\pk$$.

#### **Theorem:**

{: .theorem}
> If $$f$$ is a one-way function, then [Lamport's Signature](#lamports-signature-scheme) is a secure one-time digital signature
> (for $$n$$-bit messages).
> 
> As a corollary, the construction extends to messages of $$\ell$$ bits such that
> $$\ell := \ell(n)$$ is a polynomial.

**Note**{:.label}
Many other public-key cryptographic schemes (such as public-key encryption)
relied on stronger assumptions (such as PKE from RSA assumption), 
and we do not know any construction from OWF.
Digital signature is a big surprise since we get it from OWF.

{:.proof-title}
> Proof sketch.
> 
> We want to prove by contradiction: 
> if there exists $$A$$ that makes one-time query $$m'$$ and 
> then forges the message and signature $$(m, \sigma)$$ with $$m \neq m'$$,
> then we want to construct another adversary $$\cB$$ that inverts $$f$$.
> The intuition is that given $$m \neq m'$$, there exists a bit $m_i \neq m'_i$ for some $i$,
> and then in order to pass the verification of $(m, \sigma)$, 
> $A$ must be able to find the pre-image of the $i$-th entry of $\pk$, which is inverting $f$.
> 
> The tricky step is that in the reduction, we need to give $\pk$ to $A$ up front.
> Since we have no idea about $i$ at that step, we are going to guess it.
> 
> More formally, assume for contradiction, there exists NUPPT adversary $A$ and polynomial $p$
> such that for infinitely many $n \in \N$, 
> 
> $$
> \Pr[A \twin] \ge 1/p(n),
> $$
> 
> where $A \twin$ denotes the event that $m \neq m'$ and $\Ver_\pk(m, \sigma) =$ accept in the security game.
> We want to construct $B$ that inverts $f$.
> 
> Let $z \gets f(x)$ and $x \gets \bit^n$. $B$ is constructed as below.
> 
> {:.defn-title}
>> Algorithm $B(1^n, z)$:
>> 
>> 1. Sample $\pk := (y\_b^i)\_{i,b}$ and $\sk := (x\_b^i)\_{i,b}$ as per Lamport's key generation.
>> 2. Sample $b^\ast \gets \bit, i^\ast \gets [n]$ uniformly at random.
>> 3. Modify $\pk$ by setting $y_{b^\ast}^{i^\ast} \gets z$.
>> 4. Run $A^{\Sign_\sk(\cdot)}(\pk)$: 
>>    if $A$ queries $m'$ such that $m'\_{i^\ast} = b^\ast$, then output $\bot$ ("fail" symbol);
>>    otherwise, respond to $A$ the signature as per $\Sign\_\sk$.
>>    Let the result be $(m, \sigma)$.
>> 5. If $m_{i^\ast} \neq m'_{i^\ast}$, then output $\sigma$ (as a candidate pre-image of $z$);
>>    output $\bot$ otherwise.
> 
> Notice that $A$ can not know $b^\ast$ nor $i^\ast$ 
> because all entries in $\pk$ are identically distributed.
> Hence, $\Pr[m'\_{i^\ast} \neq b^\ast] = 1/2$, and $\Pr[m\_{i^\ast} \neq m\_{i^\ast}] \geq 1/n$.

Tree-based Signatures
-------------------------

Ref: [KL 14.4.2, 14.4.3]

How to extend one-time signature to sign many messages?
When signing a message, we can *additionally generate the next pair of $(\pk_1,\sk_1)$*
and then sign and send the next $\pk_1$ with the current message, 
and so on for the next messages.
The verifier needs to verify and to keep the next $\pk_1$.
That is, both the signer and verifier need to keep states, 
or the signing / verification time is linear in the number of signed messages.

To improve it, we use tree-based approach.
That is, for each pair $(\pk, \sk)$, we sign *two* public keys $\pk_0, \pk_1$,
and then each $\pk_b$ (together with the corresponding $\sk_b$) can further sign two keys $\pk_{b0}, \pk_{b1}$,
and so on.
We build a tree of $2^n$ leaves so that we can sign up to $2^n$ messages,
and the first signature consists of $n$ one-time signatures:

$$
\sigma := (\pk, \sigma_0, (\pk_0, \pk_1), \sigma_1, (\pk_{00},\pk_{01}), ..., \sigma_{n-1}, (\pk_{0^n},\pk_{00...01}), \Sign_{\sk_{00...0}}(m)),
$$

where $\sigma_i \gets \Sign_{\sk_{0^i}}(\pk_{0^i 0},\pk_{0^i 1})$.
The second, thrid, and forth signatures and so on are moving the path from
$000...00$ to $000...01$ and then to $000...10$ and so on.
Because all the $(\pk_x, \sk_x)$ pairs are one-time, the signer keeps a state 
that counts the number of messages signed so far and all the $(\pk_x, \sk_x)$ pairs generated so far
so that the next message is signed consistently.
The verifier is stateless and keeps only $\pk$.

The above scheme can be further improved to achieve a *stateless signer* 
by using a PRF to generate the randomess needed by each tree node.
That is, let $x$ be a string of less then $n$ bits that indicates the tree node,
and let $f_k$ be a PRF with key $k$ sampled one-time up front,
and then we can use $f_k(x)$ be the randomness needed by node $x$
(since we need only two $\Gen$ and one $\Sign$ at each tree node).
Key $k$ is added to be part of the secret key, 
and signer can always generate the identical $(\pk_x, \sk_x)$ at node $x$.

Discuss:

- If the number of messages is not given in advance, how to build a DS?

**Notice**{:.label .label-blue}
If we plug Lamport's signature into the above composition, then
the length of the signature will *grow exponentially* because
the public key is *much longer* than the message (and we sign the $\pk$'s).
An easier "fix" is to shrink the message to a shorter "hash" and then sign the hash.
That is, the signer S and verifier V agree on a keyed hash function $h_k$,
S computes the (shorter) hash $h_k(m)$ from message $m$ so that S can sign the hash and V can verify.
Of course, we need a secure hash function so that any adversary given $k$ can not 
forge another $m' \neq m$ but $h_k(m') = h_k(m)$.
This property is called *targeted collision resistant hash functions* or *universal one-way **hash** functions* (UOWHF).
Such hash functions can be constructed from one-way functions.
We omit the proof here because UOWHF is implied by collision-resistant hash functions (CRHF),
which is also a standard abstract assumption.
Historically, [Naor and Yung](https://dl.acm.org/doi/10.1145/73007.73011 "Universal One-Way Hash Functions and their Cryptographic Application, STOC 1989") formalized UOWHF and constructed it from one-way permutations,
and then [Rompel](https://dl.acm.org/doi/10.1145/100216.100269 "One-Way Functions Are Necessary and Sufficient for Secure Signatures, STOC 1990") constructed UOWHF from any OWF.
[Goldreich, FoC, Vol 2, Section 6.4.3] shows the result of Naor and Yung, 
and Rompel's result is later proved formally by [Katz and Koo](https://eprint.iacr.org/2005/328 "On Constructing Universal One-Way Hash Functions from Arbitrary One-Way Functions").
Similar to PRG, it is still active research, e.g., 
[Mao, Nazor, and Zhang](https://eprint.iacr.org/2022/431 "Non-Adaptive Universal One-Way Hash Functions from Arbitrary One-Way Functions, Eurocrypt 2023")
improved the construction to be *non-adaptive* (ie parallel) calls to OWF.
<!-- 
"Winternitz one-time signature" is another approach, and it can be based on PRF (and thus OWF)
see [Zhang, Cui, and Yu](https://eprint.iacr.org/2023/850.pdf "Revisiting the Constant-Sum Winternitz One-Time Signature with Applications to SPHINCS+ and XMSS, Crypto 2023").
 -->
