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

We assume that the OWF $f: \bit^n \to \bit^n$.
This is w.l.o.g.: if input is shorter, then we pad the input with unused random bits;
if the output is shorter, then we pad the output with fixed bits.

Historically, the first construction of PRG from OWF is given by [HILL'99](https://epubs.siam.org/doi/10.1137/S0097539793244708),
which was initiated by [IL'89](https://ieeexplore.ieee.org/document/63483) and [ILL'89](https://dl.acm.org/doi/10.1145/73007.73009).
The construction here is presented by [a lecture of Barak at Princeton](https://www.cs.princeton.edu/courses/archive/spr08/cos598D/scribe3.pdf),
which followed the paper of [Holenstein'06](https://link.springer.com/chapter/10.1007/11681878_23).
Later, [HRV'13](https://epubs.siam.org/doi/10.1137/100814421) and [VZ'12](https://dl.acm.org/doi/10.1145/2213977.2214051) improved the efficiency.
Interestingly in constructions of PRG, 
there are several novel tools that are useful later, e.g.,
the Leftover Hash Lemma, due to [ILL'89].

Even the result is impactful, the full construction is often skipped in textbooks
and graduate-level cryptography.
Many books and courses cover the Goldreich-Levin hard-core lemma [Ps, KL], 
but only few of them goes beyond that
(such as [the lecture of Bellare, 1999](https://cseweb.ucsd.edu/~mihir/papers/gl.pdf)).
The book of [Goldreich, Section 3.5](https://doi.org/10.1017/CBO9780511546891)
is one that goes much deeper, which constructs PRG from any "regular" OWF,
where regular means that for the same length $x$, 
the pre-image set $f^{-1}(f(x))$ is the same cardinality.
Still, the full construction

> ... is even more complex and is not suitable for a book of this nature.
> 
> --<cite>Goldreich, Section 3.5</cite>

The only teaching material we found is
the lecture of [Barak](https://www.cs.princeton.edu/courses/archive/spr08/cos598D/scribe3.pdf).

We will use pairwise independent hash functions.

#### **Definition:** Pairwise independent hash family.

{:.defn}
> A family of functions $\cH = \set{h : \bit^n \to \bit^m}$ is *pairwise independent* 
> if the following two conditions hold when $H \gets \cH$ is a function chosen uniformly at random from $\cH$:
> 
> 1. For all $x \in \bit^n$, the random variable $h(x)$ is uniform in $\bit^m$.
> 2. For all $x_1\neq x_2 \in \bit^n$, the random variables $h(x_1)$ and $h(x_2)$ are independent.
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

#### **Definition:** statistical difference

{:.defn}
> For random variables $X$ and $Y$ taking values in $U$, 
> their *statistical difference* (also known as *variation distance*) is 
> $\Delta(X, Y) := \max_{T \subseteq U} | \Pr[X \in T ] − \Pr[Y \in T]|$. 
> We say that $X$ and $Y$ are $\eps$-close if $\Delta(X, Y ) \leq \eps$.
> 
> [V, Definition 6.2, p169]

#### **Definition:** entropy measures

{:.defn}
> Let $X$ be a random variable. Then
> 
> - the Shannon entropy of $X$ is:
>   
>   $$
>   H(X) = \E_{x \gets X}\left[\log \frac{1}{\Pr[X=x]}\right].
>   $$
>   
> - the min-entropy of $X$ is:
> 
>   $$
>   H_\infty(X) = \min_{x}\left\{\log \frac{1}{\Pr[X=x]}\right\}.
>   $$
>   
> where all logs are base 2.
> 
> [V, Definition 6.7, p171]


#### **Definition:** $k$-source

{:.defn}
> A random variable $X$ is a $k$-source if 
> $H_\infty(X) \ge k$, i.e., if $\Pr [X = x] \le 2^{-k}$.
> 
> [V, Definition 6.9, p173]

#### **Definition:** $(k,\eps)$-extractor

{:.defn}
> A function $\mathrm{Ext} : \bit^n \times \bit^d \to\bit^m$ is a 
> $(k, \eps)$-extractor if for every $k$-source $X$ on $\bit^n$,
> $\mathrm{Ext}(X, U_d)$ is $\eps$-close to $U_m$.
> 
> [V, Definition 6.13, p176]

#### **Theorem:** Leftover Hash Lemma

{:.theorem}
> If $\cH = \set{h : \bit^n \to \bit^m}$ is a pairwise independent family of hash functions 
> where $m = k − 2 \log(1/\eps)$, then $\mathrm{Ext}(x, h) = (h, h(x))$ is a standard $(k, \eps)$-extractor.
> 
> [V, Theorem 6.18, p179]

#### **Corollary:**

{:.theorem}
> For any $n \in \N$, $\eps \ge 0$ and random variable $X$, 
> if $X$ is $\eps$-close to $U_n$, then $\Pr[ y \gets U_n: y \in \Supp(X)] \ge 1-\eps$,
> where $\Supp(X) := \set{x : \Pr[X = x] \gt 0}$ denotes the support of $X$.

### Weak Pseudo-Entropy Generator (PEG)

The first step, a gap in Shannon entropy and pseudo-entropy.

#### **Definition:** weak PEG

{:.defn}
> A function $F : \bit^n \to \bit^m$ is called a *weak pseudo-entropy generator(PEG)*, 
> if there exists a $k$ such that
> 1. There exists $Y_n$ such that $\set{F(U\_n)}\_n \approx \set{Y\_n}\_n$ and
>	 $H(Y_n) \ge k + \frac{1}{100n}$.
>	 (This is called *pseudo Shannon entropy*.)
> 2. $H(F(U_n)) \le k$.


**Discuss**{:.label}
Is a weak PEG also a weak OWF?

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

For each $x \in \bit^n$, let 
$i^\ast(x) := \ceil{\log |f^{-1}(f(x))|}+1$.
Let $i^\ast$ to be $i^\ast(x)$ and $Z'$ to be $Z'\_{i^\ast(x)}$ for short.
Let random variables $Y,Z,Z\_{i^\ast}'$ be the following

$$
Y := (f(x), i, h, h_i(x), r), ~ Z := x \odot r, \text{ and}
$$

$$
Z' := \begin{cases}
 \text{random bit} & \text{if } i = i^*\\
 x \odot r  & \text{otherwise.}
\end{cases}
$$

#### **Claim:** Low Shannon entropy

{: .theorem}
> $$
> H(YZ') \ge H(YZ) + \frac{1}{2n}
> $$

{:.proof}
> We have 
> $H(YX) = H(Y) + H(X | Y)$ for all $X,Y$.
> Hence, it suffices to show that 
> $H(Z' | Y) \ge H(Z | Y) + \frac{1}{2n}$.
> Conditioned on $i \neq i^\ast$, we have $H(Z' | Y) = H(Z | Y)$.
> We want to show that when conditioned on $i = i^\ast$, 
> $H(Z' | Y) = 1 \ge H(Z | Y) + \frac{1}{2}$, which happens w.p. $1/n$.
> It remains to show that $H(Z | Y) \le 1/2$.
> We will show that given $f(x), i=i^\ast, h, h_i(x), r$, $x$ is uniquely determined w.h.p.,
> and thus $Z = x \odot r$ is also determined (and gives 0 entropy).
> 
> For any $x \in \bit^n$ and $y \gets f(x)$, define the pre-image
> $S := \set{ x' \in \bit^n : f(x') = y, x' \neq x}$.
> Notice that $|S| \le 2^{i^\ast -1}$.
> By $h$ is pairwise independent, for any $x' \in S$,
> 
> $$
> \Pr_h[h_i(x') = h_i(x)] = 1/2^{i^\ast}.
> $$
> 
> To see $x$ is determined over the random $h$,
> 
> $$
> \begin{align*}
> \Pr_h[\nexists x' \in S \text{ s.t. }  h(x') = h(x)]
> & = 1 - \Pr[\exists x' \in S \text{ s.t. } h(x') = h(x)] \\
> & \ge 1 - |S|/2^{i^\ast} \ge 1/2,
> \end{align*}
> $$
> by union bound and then by $|S|$.
> 
> (The calculation of conditional entropy is left as exercise.)

#### **Claim:** High pseudo-entropy

{: .theorem}
> $$
> \set{YZ}_n \approx \set{YZ'_{i^\ast(x)}}_n.
> $$

{: .proof-title}
> Proof Sketch.
> 
> It is similar to the proof of Hard-core Lemma.
> Because $YZ, YZ'$ differ only when $i = i^\ast$, 
> assume for contradiction, there exists NUPPT $A$, polynomial $p$, such that for inf many $n$,
> 
> $$
> \Pr_{x,h,r} [A(f(x),i^*,h,h_{i^*}(x),r) = x\odot r] \ge 1/2 + \alpha,
> $$
> 
> where $\alpha = 1/p(n)$.
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
> \cH_x := \set{ h \in \cH ~|~ \Pr_{r}[A(f(x),i^*,h,h_i(x),r) = x \odot r] \ge 1/2 + \beta }.
> $$
> 
> Then, 
> $|\cH_x| \ge |\cH| \cdot \beta$, where $\beta := \alpha/4$.
> 
> Now, we can condition on $x \in G$ and $h \in \cH_x$.
> Namely, given $y \gets f(x)$, $B$ tries all $i \gets [n]$ and samples $h \gets \cH$ uniformly,
> and we have that $i=i^\ast$ and $h \in \cH_x$ w.p. $\beta$.
> It remains to find the correct $h(x)$ so that $B$ can run $A$ repeatedly using
> pairwise independent $r$'s.
> 
> Suppose that $x$ is fixed and $h$ is sampled uniformly and independently from $\cH$.
> Given $y = f(x)$, the min-entropy of $x$ is $\ge i^\ast(x)-1$ because 
> each $x' \in f^{-1}(y)$ can be mapped to $y$.
> By Leftover Hash Lemma, 
> the first $i^\ast - d$ bits of $h(x)$ is $2^{-d+1}$-close to uniform.
> This implies that we can hit the prefix $i^\ast - d$ bits of $h_{i^*}(x)$
> w.p. $1 - 2^{-d+1}$ by sampling them uniformly at random.
> 
> However, we conditioned on $x \in G$ (instead of uniform $x$).
> Thus, choosing $d$ such that $2^{-d+1} \le \alpha / 4$,
> we can still hit w.p. $\ge 1/2$.
> With the above, we can try all remaining $d = O(\log n)$ bits and then 
> check if the outcome $x'$ satisfies $f(x') = y$.
> 
> {: .defn-title}
>> Algorithm $B(y)$:
>> 
>> 1. $h \gets \cH$
>> 2. $d := -\log (\alpha / 4) + 1$
>> 3. For each $i=1,...,n$,
>>    1. $t_1 \gets \bit^{i - d}$
>>    2. For each $t_2 \in \bit^d$,
>>       - Let $t := t_1 \| t_2$.
>>       - Run $x' \gets B_0(y, i, h, t)$.
>>       - Output $x'$ if $f(x') = y$.
>
> The subroutine $B_0$ performs almost identical to the standard Goldreich-Levin,
> and the only difference is that $A$ takes additional input $(i, h, h_i)$.
> 
> {: .defn-title}
>> Algorithm $B_0(y, i, h, h_i)$
>> 
>> 1. For each $i=1,2, .., n$,
>>    1. Let $\ell := \log m$, $(u_1, ..., u_\ell)$ be fully independent and 
>>       $(r_1,..., r_m)$ be pairwise independent $n$-bit random strings.
>>    2. For each $k \in [\ell]$, sample guess bit $b_k$ uniformly. For each $j \in [m]$, 
>>       compute the bit $g_{i,j}$ from $(b_1, ..., b_\ell)$ in the same way as $r_j$
>>       (so that for any $x$, $g_{i,j} = x \odot r_j$ and $b_k = x \odot u_k$ for all $k$).
>>    3. For each $j=1,2,..., m$,
>>       - Run $z_{i,j} \gets A(y, i, h, h_i, e_i \oplus r_j) \oplus g_{i,j}$.
>>
>>       Let $x'\_i$ be the majority of $\set{z\_{i,j}}\_{j\in[m]}$
>> 2. Output $x' := x'_1 x'_2 ... x'_n$
> 
> The parameter $m$ is choosen according to the success probability of $A$
> conditioned on $x \in G$ and $h\in \cH_x$ and $(i, h_i)$ are consistent.
> Notice that conditioned on $x \in G$, the events $h \in \cH_x$ and $t_1$ hits $h_i(x)$
> are independent, w.p. $\beta$ and $1/2$.
> Also, $B$ runs over all possible $i$ and $t_2$.
> Hence, the overall success probability is $\poly(1/n, 1/p(n))$.

**Discuss**{: .label}
Is $F$ a OWF?
No, consider the case $i=n$, which happens w.p. $1/n$,
and then w.h.p. over $h$, we can solve $x$ from $(h,h_i(x))$.
However, the above claim also showed that $F$ is hard to invert when $i = i^\ast(x)$,
i.e., $F$ is a *weak* OWF.

### PEG from Weak PEG

#### **Definition:** Pseudo-entropy generator (PEG)

{:.defn}
> A function $g : \bit^m \to \bit^n$ is called a *pseudo-entropy generator(PEG)*, 
> if there exists a $k$ such that
> 1. There exists $Y_m$ such that $\set{g(U\_m)}\_m \approx \set{Y\_m}\_m$ and
>	 $H\_\infty(Y_m) \ge k + n^\alpha$ for some constant $\alpha \gt 0$.
>	 (This is called *pseudo min-entropy*.)
> 2. $H_\infty(g(U_m)) \le k$ with probability $1 − \eps(m)$ for negligible $\eps$. 
> 	 More precisely, there is a $Y' \subseteq g(U_n)$ 
> 	 with $H_\infty(Y') \le k$ such that $\Pr_x(g(x) \in Y') \ge 1 − \eps(n)$.

Notice that compared to weak PEG, here for PEG, we require that the entropy gap to be min-entropy
(instead of Shannon entropy) and that the entropy gap to be much more than constant bits.

#### **Theorem:** PEG from Weak PEG

{:.theorem}
> Suppose $F: \bit^n \to \bit^m$ is a weak PEG.
> Let $g: \bit^{n\ell} \to \bit^{m\ell}$ to be the function
> 
> $$
> g(x_1 ... x_\ell) := F(x_1) ... F(x_\ell),
> $$
> 
> where $x_i \in \bit^n$ for all $i$, and $\ell:=\ell(n)$ is a polynomial (to be chosen later). 
> Then, $g$ is a PEG.

**Discuss**{:.label}
The construction of $g$ is identical to that from weak OWF to strong OWF.
Also recall that the weak PEG is also a weak OWF.

Let $k$ be the Shannon entropy of $F(U_n)$.

#### **Claim:** Low min-entropy

{: .theorem}
> Let $S := \Supp(g(x_1 ... x_\ell))$ be the support of $g$.
> Define $T$ to be the set 
> 
> $$
> T := \set{y \in S | \Pr[g(x_1 ... x_\ell) = y] \in 2^{-k\ell \cdot (1\pm \beta)}},
> $$
> 
> where the probability is over $x_1 ... x_\ell$ that are sampled uniformly,
> and $\beta \gt 0$.
> Then
> 
> $$
> \Pr_{x}[g(x) \notin T] \le 2^{-\Omega(\beta^2 k \ell / n)}.
> $$
> 
> This implies that $H_\infty(g(U_{n\ell})) \le k \ell (1 - \beta)$ for 
> all but $2^{-\Omega(n)}$ fraction of $x$'s.

{:.proof}
> In general, min-entropy is less than the Shannon entropy of the same variable.
> Here, we want to show the opposite by relaxing a $\beta$ fraction in entropy
> and by skipping a small fraction of $y$'s.
> 
> The idea is that repeating $F$ for $\ell(n)$ times independently "smooths"
> the overall distribution.
> Because $H(F(U_n)) = k$ is an average notion, 
> a majority of $y' \in \Supp(F(U_n))$ satisfy that $\Pr[F(U_n) = y'] \in 2^{-k(1 \pm \beta)}$,
> where the majority is measured in probability mass.
> Repeating independently, the majority is further concentrated to an overwhelming
> probability mass by Chernoff bound of the following form.
> 
> Let $X_1 ... X_\ell \in [0, n]$ be independent random variables,
> let $X := \sum_{i\in [\ell]} X_i$, and let $\mu := \E[X]$. 
> For any $0 \lt \delta \lt 1$,
> 
> $$
> \Pr[|X - \mu| \ge \delta \mu] \le 2e^{-\mu \delta^2 / 3n}.
> $$
> 
> The calculation is as follows.
> Let $\gamma(y') := \Pr[F(U_n) = y']$ for any $y' \in \bit^m$.
> 
> $$
> \begin{align*}
> & \Pr_{y=(y_1 ... y_\ell) \gets g(x)}\left[\Pr_{z}[g(z) = y] \notin 2^{-k\ell(1 \pm \beta)} \right] \\
> = & \Pr_{y}\left[ \prod_{i\in[\ell]} \gamma(y_i) \notin 2^{-k\ell(1 \pm \beta)} \right] \\
> = & \Pr_{y}\left[ \sum{i\in[\ell]} -\log \gamma(y_i) \notin k\ell(1 \pm \beta) \right] \\
> = & \Pr_{y}\left[ \left| \sum{i\in[\ell]} X_i - k\ell \right| \ge \pm \beta k \ell \right] \\
> \le & 2^{-\Omega(\beta k \ell / n)},
> \end{align*}
> $$
> 
> where $X_i := -\log \gamma(y_i)$ by definition, and 
> $\E[X_i] = H(F(U_n)) = k$ by definition of Shannon entropy and weak PEG.

#### **Claim:** High pseudo-min-entropy

{: .theorem}
> Let $Y'$ be the distribution such that is indistinguishable from $F(U_n)$ 
> but $H(Y') \ge k + \frac{1}{100n}$.
> There exists a distribution $Y$ such that $H_\infty \ge k \ell (1-\beta) + n^\alpha$
> and that $Y$ is indistinguishable from $g(x)$, where $\alpha > 0$ is a constant.

{: .proof}
> By a non-uniform reduction, $g(U_{n\ell})$ is indistinguishable from $Z:=Y_1 ... Y_\ell$
> such that $Y_1, Y_2, ..., Y_\ell$ are sampled from $Y'$ independently.
> We have Shannon entropy $H(Z) \ge k \ell + \ell/100n$, but we want $Y$ with high *min-entropy*.
> By a Chernoff bound that is similar to the previous claim,
> we have that for all except for exponentially small probability,
> 
> $$
> \Pr_{y \gets Z}[ \gamma(y) \ge 2^{-(k \ell + \ell/100n)(1 \pm \beta)} ] \le 2^{-\Omega(\beta \ell/ n)},
> $$
> 
> where $\gamma(y) := \Pr_{y' \gets Z}[y' = y]$ for all $y$.
> We simply get rid of those "bad $y$" from $Z$ and obtain the distribution $Y$
> by moving the probability mass $2^{-\Omega(\beta \ell/ n)}$ to all strings in $\bit^{m\ell}$ uniformly,
> which yields $Y$ with min-entropy at most
> 
> $$
> -\log\left( 2^{-\ell \cdot (k + 1/100n) \cdot (1-\beta)} + 2^{-\ell m} \cdot 2^{-\Omega(\beta \ell/ n)} \right)
> $$
> 
> which is at least $k\ell + \Omega(\ell / n)$.
> Choosing $\ell(n) = n^9$, we have $\alpha \ge 1$ for sufficiently large $n$.


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


