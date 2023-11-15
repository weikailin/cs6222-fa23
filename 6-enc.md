---
layout: page
title: 6. Encryptions
nav_order: 6
nav_exclude: false
---

$$
\newcommand{\Enc}{\mathsf{Enc}}
\newcommand{\Dec}{\mathsf{Dec}}
\newcommand{\LWE}{\mathsf{LWE}}
\newcommand{\Add}{\mathsf{Add}}
\newcommand{\Mul}{\mathsf{Mul}}
\newcommand{\Eval}{\mathsf{Eval}}
\newcommand{\norm}[1]{\| #1 \|}
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

Also, IND-CPA security is implied directly.
Yet another difference compared to secret-key encryptions is that,
the security for *long* messages is implied directly.

#### **Lemma:**

{:.theorem}
> If $(\Gen,\Enc,\Dec)$ is secure public-key encryption, then
> for any polynomial length $\ell(\cdot)$, for all $m_0, m_1 \in \bit^{\ell(n)}$,
> the two distributions are indistinguishable:
> 
> - $\set{(\pk, \sk)\gets \Gen(1^n) : (\pk, \Enc_\pk(m_{0,1}), ..., \Enc_\pk(m_{0,\ell(n)}))}_n$
> - $\set{(\pk, \sk)\gets \Gen(1^n) : (\pk, \Enc_\pk(m_{1,1}), ..., \Enc_\pk(m_{1,\ell(n)}))}_n$
> 
> where $m_{b,i}$ denotes the $i$-th bit of $m_b$.

Similarly, the adversary may *adaptively* choose $(m_{0,i}, m_{1,i})$ *depending on*
the earlier ciphertexts $\Enc_\pk(m_{b,i'}), i' \lt i$. 
That is called *multi-message* security and is also implied by single-message security.

Ref: [KL, 12.2]

Learning with Errors, LWE
-------------------------

In this section, we change the representation of $\Z_q$ so that

$$
\Z_q \equiv \set{ -\floor{\frac{q-1}{2}}, ..., 0, ..., \floor{\frac{q}{2}}}.
$$

The modular arithmetic is the same.
We also say that an element in $\Z_q$ is *small* if it is close to 0.

We consider matrix $A \in \Z_q^{m \times n}$ and vector $\vec{s} \in \Z_q^n$
such that $m \gg n$.
Let $\vec{t}' := A \cdot \vec{s} \in \Z_q^m$.
Using standard linear algebra, it is efficient to solve $A \cdot \vec{x} = \vec{t}'$
(when $A$ is full rank).

The LWE problem considers the following variant:
$A$ and $\vec{s}$ are chosen as before, but an additional error vector $\vec{e} \in \Z_q^m$
is sampled such that $\norm{\vec{e}} = \sqrt{\sum_i e_i^2}$ is *small*;
Then, the goal is to find $\vec{x}, \vec{y}$ such that

$$
A \cdot \vec{x} + \vec{y} = \vec{t},
$$

where $\vec{t} := A \cdot \vec{s} + \vec{e}$, $\vec{x} \in \Z_q^n$, and
$\vec{y} \in \Z_q^m$ is *small*.
The hardness of this problem, Learning with Errors,
is parameterized by $q, m, n$, and the bound of *small*.
When parameters are chosen appropriately, 
this problem is believed to be hard even for quantum algorithms
(the belief is established by reductions from *lattice problems* which is beyond the scope).

For our purpose, it is easier to use the *decision* variant of LWE, formalized next.

#### **Definition**: Learning with Errors (LWE) Assumption

{:.defn}
> We say the decisional $\LWE_{m,q,\psi}$ problem is quantum-hard 
> if for all quantum polynomial-time distinguisher $D$
> there is a negligible function $\eps$ such that for all $n\in\N$,
> 
> $$
> \begin{align*}
> \Pr[A \gets \Z^{m\times n}_q; \vec{s} \gets \psi^n ; \vec{e} \gets \psi^m : D(A, A \cdot \vec{s} + \vec{e}) = 1] \\
> - \Pr[A \gets \Z^{m\times n})_q ; \vec{t} \gets \Z^m_q : D(A,\vec{t}) = 1] \le \eps(n),
> \end{align*}
> $$
> 
> where $m, q \in \N$ are functions of $n$, and $\psi$ is an efficiently samplable distribution over $\Z_q$.

Discuss:

- Again, the hardness depend on the parameters $m,q,\psi$. 
  For example, when $\psi$ is uniform over $\Z_q$, the two distributions are identical (but useless).
- Notice that the above definition also samples $\vec{s}$ from $\psi$.
- The two distributions differ in entropy:
  $(A,\vec{t})$ consists of $mn + m$ uniform elements from $\Z_q$, 
  but $(A, A \cdot \vec{s} + \vec{e})$ is sampled from $mn$ uniform elements plus $(m+n)$ elements from $\psi$.

An useful set of parameter:

- $m(n) = \poly(n) \ge n^2$, the smaller the harder LWE
- $q(n) = n^{\poly(n)}$ so that we can write an element in $\poly(n)$ bits
- $\psi$ a distribution such that $\exists B = \poly(n)$, 
  $\psi$ outputs $|a| \le B$ except with negligible probability
  (think $\psi$ as a uniform dist);
  the larger $B$ compared to $q$ the harder LWE

Ref: [KL, 14.3]

An Encryption Based on LWE
--------------------------

If we have the following decisional $\LWE_{m,q,\psi}$:

$$
\set{A, A\cdot \vec{s} + \vec{e}} \approx \set{A, \vec{t}}
$$

Then, given $d \in \N$ such that $\gcd(d,q) = 1$, we also have

$$
\set{A, A\cdot \vec{s} + d\vec{e}} \approx \set{A, \vec{t}}
$$

by a simple reduction that multiply the former indisintinguishability by $d$
(because $A$ and $\vec{t}$ are both uniform over $\Z_q$).
Hence, we can construct a *secret-key* encryption.

#### **Construction**: Secret Key Encryption from LWE

{:.defn}
> Parameters: $m, q \in \N$ as a function of $n$, $\psi$ a distribution over $\Z_q$.
> 
> $\Gen(1^n)$:
> output $k := \vec{s} \gets \psi^n$
> 
> $\Enc_k(m)$:
> for binary message $m\in\bit$, sample $\vec{a} \gets \Z_q^n$ and $e \gets \phi$,
> output $c:=(\vec{a}, t = \vec{a} \cdot \vec{s} + 2e + m)$ (where the arithmetic is in $\Z_q$).
> 
> $\Dec_k(c)$:
> output
> 
> $$
> m' := (t - \vec{a}\cdot \vec{s} \mod 2)
> $$

The correctness is direct.
The (secret-key) CPA security can be proved by a reduction $R$ such that
when ever the adversary $A$ of the encryption asks for an encryption,
$R$ takes the next row from its LWE input and adds $m$.
The details are skipped here.

Homomorphic Encryption
--------------------------


#### **Definition:** Homomorphic encryption.

{: .defn}
> A (public or secret key) encryption scheme $(\Gen,\Enc,\Dec)$ is said to be homomorphic
> if the scheme provides efficient $(\Add, \Mul)$ operations that satisfies the syntax and correctness below.
> 
> - Addition: For any messages $m_0, m_1 \in \Z_2$,
>   
>   $$
>   \Pr_k[(c_i \gets \Enc_k(m_i))_{i\in\bit}; \Dec_k(\Add(c_0, c_1)) = m_0+m_1] = 1
>   $$
>   
> - Multiplication: For any messages $m_0, m_1 \in \Z_2$,
>   
>   $$
>   \Pr_k[(c_i \gets \Enc_k(m_i))_{i\in\bit}; \Dec_k(\Mul(c_0, c_1)) = m_0 \cdot m_1] = 1
>   $$
>   
> - Multiply by constant: For any messages $m_0, m_1 \in \Z_2$,
>   
>   $$
>   \Pr_k[c_0 \gets \Enc_k(m_0); \Dec_k(\Mul(c_0, m_1)) = m_0 \cdot m_1] = 1
>   $$
>   
> Here, the message space and the arithmetic operations $(+,\cdot)$ are in $\Z_2$, 
> but one may define similarly for other algebra.

[Ref: [Barak@Prinecton](https://www.cs.princeton.edu/courses/archive/spring10/cos433/)]

Discuss:

- The homomorphic operations are requiring *correctness* (not security).
- We sometimes relax the correctness to "except for negligible probability" due to technical construction
- The above definition requires only for "single hop" homomorphic operation, 
  which means that $\Add$ and $\Mul$ work for ciphertexts freshly encrypted by $\Enc$
- We may define $t$-hop operations so that $\Add$ or $\Mul$ work also for ciphertexts
  that is output by $(t-1)$-hop $\Add$ or $\Mul$
- Ideally, we want unlimited-hop operations. 
  Since $(+,\cdot)$ in $Z_2$ implement logical (XOR, AND), 
  that enables *any* boolean-circuit computation on ciphertexts.
  This is called *Fully Homomorphic Encryption, FHE*.
- Less ideally, if a scheme achieves unlimited-hop $\Add$ and multiply by constant,
  it is called *additive* homomorphic encryption (or linear homomorphic), which is still useful.
- Notice that $\Add$ and $\Mul$ need no key, which is essential 
  (otherwise, given key, it would be trivial to perform the operations)
- It is trivial and cheating to output $(\text{add}, c_0, c_1)$ as the output of $\Add$ (and $\Mul$ resp.),
  which belows up the size of the ciphertext and leaves the actual arithmetic to $\Dec$.
  However, in the above 1-hop Add and Mul definition, we have no way to require it
  (because one may always pad $c_0$ with unused bits).
  For more-than-constant hops, we require the ciphertext size to be small 
  even after homomorphic evaluations.

Alternatively, we define homomorphic encryption with respect to a class of circuits $\cC$.

#### **Definition:** Homomorphic encryption for class $\cC$.

{: .defn}
> Let $\cC$ be a class of circuits.
> We say the encryption scheme $(\Gen,\Enc,\Dec, \Eval)$ is homomorphic for $\cC$
> if for any $C \in \cC$, for any $m_1,...,m_\ell \in \bit$ where $\ell$ is the input size of $C$, 
> let $k \gets \Gen(1^n)$ be the encryption key,
>   
> $$
> \Pr_k[(c_i \gets \Enc_k(m_i))_{i\in[\ell]}; \Dec_k(\Eval(C, c_1,..., c_\ell)) = C(m_1,...,m_\ell)] = 1.
> $$
> 
> Moreover, we require the output size of $\Eval$ to be *compact*, that is, 
> bounded by $\ell' \cdot |\Enc_k(m_i)|$.


The above secret-key encryption based on LWE has a direct homomorphic addition.
To see why, consider two ciphertexts that is encrypted using the same key $\vec{s}$,

$$
c_0:=(\vec{a}_0, \vec{a}_0 \cdot \vec{s} + 2e_0 + m_0),
c_1:=(\vec{a}_1, \vec{a}_1 \cdot \vec{s} + 2e_1 + m_1) 
$$

The homomorphic $\Add(c_0, c_1)$ is defined to be the coordinate-wise addition:

$$
\begin{align*}
\Add(c_0, c_1) := 
& (\vec{a}_0+\vec{a}_1, (\vec{a}_0 \cdot \vec{s} + 2e_0 + m_0) + (\vec{a}_1 \cdot \vec{s} + 2e_1 + m_1))\\
= & (\vec{a}', \vec{a}'\cdot \vec{s} + 2e' + (m_0+m_1))
\end{align*}
$$

where $\vec{a}' = \vec{a}_0+\vec{a}_1$ and $e' = e_0+e_1$.
The multiplication by constant is also coordinate-wise multiply by plaintext $m_1$.
Notice that the correctness holds as long as $e' \le q / 4$ before modulo $q$.
Hence, we can perform $O(q/B)$ operations (of addition or multiply by constant)
and then still obtain the correct decrytion, where $B, q$ are the LWE parameters.

Multiplicative homomorphism is more involved.
We show an application of additive homomorphic encryption first.

Public-key Encryption from Additive Homomorphic Encryption
-----------------------------------

#### **Theorem:**

{: .defn}
> Let $(G, E, D, \Eval)$ be a secret-key homomorphic encryption scheme for 
> the class of inner product between $\ell$-bit binary vectors, 
> where $\ell:=\ell(n)$ to be chosen later is a polynomial of the security parameter $n$ given to $G$.
> Then, the following $(\Gen, \Enc, \Dec)$ is a public-key encryption scheme.
> 
> - $\Gen(1^n)$: let $\sk = k \gets G(1^n)$, sample $n$-bit string $r=(r_1,...,r_\ell) \gets \bit^\ell$ such that $r \neq 0^\ell$, 
>   compute $R_1 \gets E_k(r_1), ..., R_\ell \gets E_k(r_\ell)$.
>   Output $\sk$ and public key 
>   
>   $$
>   \pk = (r_1,..., r_\ell, R_1, ..., R_\ell).
>   $$
> 
> - $\Enc_\pk(m)$: sample $\ell$-bit string $u$ uniformly at random subject to $r \odot u = m$.
>   Output
>   
>   $$
>   c := \Eval(f_u, R_1, ..., R_\ell),
>   $$
>   
>   where $f_u$ is the inner product $f_u(x) := u \odot x$ for any $x \in \bit^\ell$.
> 
> - $\Dec_\sk(c)$: it simply output $D_\sk(c)$.

The correctness follows because $r \neq 0^n$ implies the existence of $u$ and then by the correctness of $\Eval$.
The efficiency is also direct (just need to sample $r$ and $u$ with care).
The security is sketched below.

{:.proof}
> Firstly, consider the hybrid scheme that in $\Gen$, we encrypt $R_i \gets \Enc_k(0)$
> instead of $\Enc_k(r_i)$.
> By CPA security of $(G,E,D)$, the hybrid is indistinguishable from the real $(\Gen, \Enc, \Dec)$.
> 
> Secondly in the hybrid, the ciphertext $c$ is an encryption of 0 of the $(G,E,D)$ scheme.
> It could be attemping to think we were finished, but unfortunately as written,
> $c$ depends on $u$ and then $u$ still depends on $m$ 
> (indeed, different encryptions of 0 might reveal something).
> To be formal, the key is to observe that $|c|$ is short.
> Let $t:=|c|$ be the output size of $\Eval$, and let $\ell := 4t$.
> Then, the adversary is given $(r, F_R(u))$ and aims to find $m = r \odot u$,
> where $R$ is independent of $r$ and $F_R(\cdot)$ denotes $\Eval(f_{(\odot)}, R_1, ...,R_n)$.
> Rewrite the computation as
> 
> $$
> Ext(r, u) := (r, F_R(u), m = r \odot u).
> $$
> 
> Notice that $r$ is uniform, $u$ is subject to $m$, and $F_R(u)$ is $t$-bits.
> Because the min-entropy of $u$ subject to any fixed $m$ and any fixed $F_R(u)$ is at least $\ell/2$,
> and because $h_r(u) = r \odot u$ is a universal hash family,
> $r \odot u$ is statistically close to a uniform bit (by statistical difference $2^{-\Omega(t)}$).

[Ref: Rothblum, TCC 2011, Homomorphic Encryption: From Private-Key to Public-Key](https://www.iacr.org/archive/tcc2011/65970216/65970216.pdf)

Homomorphic Multiplication
-----------------------------------

Consider the [encryption scheme for LWE](#construction-secret-key-encryption-from-lwe).
The ciphertext has format $c = (\vec a, b)$,
and the decrytion is done by $b - \vec a^T \vec s$, where $\vec s$ is the decryption key, and $\mod 2$ is skipped.
We can view the decryption as a function, 

$$
f_{\vec a, b}(\vec x) := b - \vec a^T \vec x,
$$

and the decryption is to compute $f_{\vec a, b}(\vec s)$.
To obtain additive homomorphism, we are exactly performing

$$
f_{\vec a', b'}(\vec x) := f_{\vec a_1, b_1}(\vec x) + f_{\vec a_2, b_2}(\vec x),
$$

so that the decryption works as

$$
f_{\vec a', b'}(\vec s) = f_{\vec a_1, b_1}(\vec s) + f_{\vec a_2, b_2}(\vec s).
$$

For multiplication, we would like to perform similarly,

$$
f_{\vec a', b'}(\vec x) := f_{\vec a_1, b_1}(\vec x) \cdot f_{\vec a_2, b_2}(\vec x).
$$

This would give a correct decrytion when we compute $f_{\vec a', b'}(\vec s)$.
However, we begin with *linear* functions $f_{\vec a_1, b_1}$, but we end with 

$$
(b_1 - \vec a_1^T \vec x)\cdot(b_2 - \vec a_2^T \vec x)
= b_1 b_2 - (b_1 \vec a_2^T + b_2 \vec a_1^T) \vec x + \sum_{i,j} a_{1,i} a_{2,j} x_i x_j,
$$

a quadratic function (degree 2 of $\vec x$). 
Moreover, the ciphertext size goes from $n+1$ to ~$n^2$.
This is far from ideal, and there are many techniques to resolve this.
One is known as "relinearization", and the trick is to provide the encryptions of

- $s_i$ for $i \in [n]$, where $s_i$ is the $i$-th coordinate of $\vec s$.
- $s_{i}\cdot s_{j}$ for $i,j\in[n]$.

Since the encryptions (of the above values $s_i\cdot s_j$) are another linear function $g_{c_{i,j}}(\vec y)$, 
the homomorphic multiplication can then 

1. Compute $f_{\vec a', b'}$ from $f_{\vec a_1, b_1}$ and $f_{\vec a_2, b_2}$
2. In $f_{\vec a', b'}$, substitute $x_i x_j$ with $g_{c_{i,j}}(\vec y)$, which yields
   $f_{\vec a'', b''}(\vec y)$, a linear function of size $n+1$.

The encryption of $s_{i}\cdot s_{j}$ are given as *public evaluation key* in such constructions.

Ref:
- [Brakerski and Vaikuntanathan, Efficient fully homomorphic encryption from (standard) LWE, FOCS 2011](https://eprint.iacr.org/2011/344.pdf),
- [Brakerski, Gentry, and Vaikuntanathan, (Leveled) fully homomorphic encryption without bootstrapping, ITCS 2012](https://people.csail.mit.edu/vinodv/6892-Fall2013/BGV.pdf)
- [Barak @ Princeton](https://www.cs.princeton.edu/courses/archive/spring10/cos433/lec21new.pdf)

