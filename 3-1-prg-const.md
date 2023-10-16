---
layout: page
title: 3.1. PRG from OWF
nav_order: 3.1
nav_exclude: false
---


PRG from any OWF
================

We assume that the OWF $f: \bit^n \to \bit^n$.
This is w.l.o.g.: if input is shorter, then we pad the input with unused random bits;
if the output is shorter, then we pad the output with fixed bits.
The same applies to the new notions in this section, namely weak PEG and PEG.

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
> -- <cite>Goldreich, Section 3.5</cite>

The only teaching material we found is
the lecture of [Barak](https://www.cs.princeton.edu/courses/archive/spr08/cos598D/scribe3.pdf).

We will use pairwise independent hash functions.
The following facts are borrowed from the book of Salil Vadhan, 
[*Pseudorandomness*](https://people.seas.harvard.edu/~salil/pseudorandomness/pseudorandomness-published-Dec12.pdf), cited as [V].

#### **Definition:** Pairwise independent hash family.

{:.defn}
> A family of functions $\cH = \set{h : \bit^n \to \bit^m}$ is *pairwise independent* 
> if the following two conditions hold when $h \gets \cH$ is a function chosen uniformly at random from $\cH$:
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
> \cH := \set{h_{a,b} : h_{a,b}(x) = a x + b, a,b\in F}.
> $$
> 
> $\cH$ is a pairwise independent hash family.
> We often abuse notation, denoting $h \in \cH$ to be the seed
> and $h(x)$ to be the evaluation of the hash function.
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

#### **Fact:**

{:.theorem}
> For any $n \in \N$, $\eps \ge 0$ and random variable $X$, 
> if $X$ is $\eps$-close to $U_n$, then $\Pr[ y \gets U_n: y \in \Supp(X)] \ge 1-\eps$,
> where $\Supp(X) := \set{x : \Pr[X = x] \gt 0}$ denotes the support of $X$.

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

#### **Corollary:** Guessing the hash value

{:.theorem}
> Let $\cH$ be a pairwise independent hash family, from $n$-bit strings to $n$-bit strings.
> For any random variable $X \in \bit^n$ such that $H_\infty(X) = k \le n$,
> 
> $$
> \Pr[h\gets \cH, y \gets U_{k-d}: \exists x \in \Supp(X), h_{k-d}(x) = y ] \ge 1-2^{-d/2}
> $$
> 
> where $h_t(x)$ denotes the prefix $t$ bits of $h(x)$.

Weak Pseudo-Entropy Generator (PEG)
----------------------------

The first step, a gap in Shannon entropy and pseudo-entropy.

#### **Definition:** weak PEG

{:.defn}
> A function $F : \bit^n \to \bit^m$ is called a *weak pseudo-entropy generator(PEG)*, 
> if there exists a $k$ such that
> 1. There exists $Y_n$ such that $\set{F(U\_n)}\_n \approx \set{Y\_n}\_n$ and
>  $H(Y_n) \ge k + \frac{1}{100n}$.
>  (This is called *pseudo Shannon entropy*.)
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

Intuition for the construct:
- $f(x), r, x \odot r$ is GL hardcore lemma, the starting point to obtain 
  a pseudo-random bit (i.e., pseudo-entropy). 
  However, $x \odot r$ gives no extra pseudo-entropy for many-to-one $f$.
- $f(x), r, x, h(x)$ is attempting to obtain PE by
  "identifying different" $x' \in f^{-1}(f(x))$ through $h(x)$.
  However, by randomizing $h$, any $x''$ may map to $h(x)$ (like OTP), bad identification.
- $f(x), r, x, h, h(x)$ is giving $h$, and we get good identification.
  However, too good to be easy to invert $x$ since solving $h(x) = a x + b$ is easy.
- $f(x), r, x, h, h_{i^\ast}(x), i^\ast$ is cutting $h(x)$ short to make inverting hard.
  For proper choice of $i^\ast(x)$, this works, but $i^\ast(x)$ is hard to compute.
- We end up with guessing random $i$. It works, the proof follows below.

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
> $H(YX) = H(Y) + H(X | Y)$ for all $X,Y$ (proof left as exercise).
> Hence, it suffices to show that 
> $H(Z' | Y) \ge H(Z | Y) + \frac{1}{2n}$.
> Conditioned on $i \neq i^\ast$, we have $H(Z' | Y) = H(Z | Y)$.
> We want to show that when conditioned on $i = i^\ast$, 
> $H(Z' | Y) = 1 \ge H(Z | Y) + \frac{1}{2}$, which happens w.p. $1/n$.
> It remains to show that $H(Z | Y) \le 1/2$.
> We will show that given $(f(x), i^\ast, h, h_i(x), r)$, w.h.p. it holds that $x$ is uniquely determined,
> and thus $Z = x \odot r$ is also determined (and gives 0 Shannon entropy).
> 
> For any $x \in \bit^n$ and $y \gets f(x)$, define the pre-image set 
> $S := f^{-1}(f(x)) \setminus \set{x}$.
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
> Because $YZ, YZ'$ differ only when $i = i^\ast$, 
> assume for contradiction, there exists NUPPT $A$, polynomial $p$, such that for inf many $n$,
> 
> $$
> \Pr_{x,h,r} [A(f(x),i^*,h,h_{i^*}(x),r) = x\odot r] \ge 1/2 + \alpha,
> $$
> 
> where $\alpha = 1/p(n)$.
> 
> We want to construct $B$ that inverts $y \gets f(x)$.
> We have a similar claim of good $x$'s:
> let $G$ to be the set
> 
> $$
> G := \set{ x \in \bit^n ~|~ \Pr_{h,r}[A(f(x),i^*,h,h_{i^*}(x),r) = x \odot r] \ge 1/2 + \alpha / 2 }.
> $$
> 
> Then, 
> $|G| \ge 2^n \cdot \alpha / 2$.
> We can next fix $h$ similarly:
> for each $x\in G$,
> let $G_x$ to be the set
> 
> $$
> \cH_x := \set{ h \in \cH ~|~ \Pr_{r}[A(f(x),i^*,h,h_{i^*}(x),r) = x \odot r] \ge 1/2 + \beta }.
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
> By the corollary of Leftover Hash Lemma, "guessing the hash value",
> the first $i^\ast - d$ bits of $h(x)$ is $2^{-(d-1)/2}$-close to uniform.
> This implies that we can hit the first $i^\ast - d$ bits of $h_{i^*}(x)$
> w.p. $1 - 2^{-(d-1)/2}$ by sampling them uniformly at random.
> 
> However, to apply $A$, we also conditioned on $h \in \cH_x$ (instead of uniform $h$).
> Hence, we need to take union bound:
> 
> - $h \notin \cH_x$ w.p. $\le 1 - \beta$
> - the guess is not the first $i^\ast - d$ bits of $h(x')$ for all $x' \in f^{-1}(y)$
>   w.p. $2^{-(d-1)/2}$.
> 
> Thus, choosing $d$ such that $2^{-(d-1)/2} \le \beta/2$,
> we will sample a "good" input $(y = f(x'), i^\ast, h, h_{i^\ast})$ to $A$ w.p. $\ge \beta/2$
> (only conditioned on $x \in G$).
> With the above, we can try all remaining $d = O(2 \log \beta) = O(\log n)$ bits 
> and then 
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
>>       - Let $t := t_1 \\| t_2$.
>>       - Run $x' \gets B_0(y, i, h, t)$.
>>       - Output $x'$ if $f(x') = y$.
>
> The subroutine $B_0$ performs almost identical to the standard Goldreich-Levin,
> and the only difference is that $A$ takes additional input $(i, h, h_i)$.
> 
> {: .defn-title}
>> Algorithm $B_0(y, i, h, h_i)$
>> 
>> 1. Let $\ell := \log m$, $(u_1, ..., u_\ell)$ be fully independent and 
>>    $(r_1,..., r_m)$ be pairwise independent $n$-bit random strings.
>> 2. For each $k \in [\ell]$, sample guess bit $b_k$ uniformly. For each $j \in [m]$, 
>>    compute the bit $g_{i,j}$ from $(b_1, ..., b_\ell)$ in the same way as $r_j$
>>    (so that for any $x$, $g_{i,j} = x \odot r_j$ and $b_k = x \odot u_k$ for all $k$).
>> 3. For each $i=1,2, .., n$,
>>    1. For each $j=1,2,..., m$,
>>       - Run $z_{i,j} \gets A(y, i, h, h_i, e_i \oplus r_j) \oplus g_{i,j}$.
>>
>>    2. Let $x'\_i$ be the majority of $\set{z\_{i,j}}\_{j\in[m]}$
>> 4. Output $x' := x'_1 x'_2 ... x'_n$
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

PEG from Weak PEG
----------------------------

#### **Definition:** Pseudo-entropy generator (PEG)

{:.defn}
> A function $g : \bit^m \to \bit^n$ is called a *pseudo-entropy generator(PEG)*, 
> if there exists a $k$ such that
> 1. There exists $Y_m$ such that $\set{g(U\_m)}\_m \approx \set{Y\_m}\_m$ and
>  $H\_\infty(Y_m) \ge k + m^\alpha$ for some constant $\alpha \gt 0$.
>  (This is called *pseudo min-entropy*.)
> 2. $H_\infty(g(U_m)) \le k$ with probability $1 − \eps(m)$ for negligible $\eps$. 
>    More precisely, there is a $Y' \subseteq g(U_m)$ 
>    such that $\Pr_x(g(x) \in Y') \ge 1 − \eps(m)$ and that
>    for all $a \in Y'$, $\Pr_x(g(x) = a) \ge 2^{-k}$.

Notice that compared to weak PEG, here for PEG, we require that the entropy gap to be min-entropy
(instead of Shannon entropy) and that the entropy gap to be much more than constant bits.

#### **Theorem:** PEG from Weak PEG

{:.theorem}
> Suppose $F: \bit^n \to \bit^n$ is a weak PEG.
> Let $g: \bit^{n\ell} \to \bit^{n\ell}$ to be the function
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
> This implies that $H_\infty(g(U_{n\ell})) \le k \ell (1 + \beta)$ for 
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
> = & \Pr_{y}\left[ \sum_{i\in[\ell]} -\log \gamma(y_i) \notin k\ell(1 \pm \beta) \right] \\
> = & \Pr_{y}\left[ \left| \sum_{i\in[\ell]} X_i - k\ell \right| \ge \pm \beta k \ell \right] \\
> \le & 2^{-\Omega(\beta^2 k \ell / n)},
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
> and that $Y$ is indistinguishable from $g(x)$, where $\alpha \gt 0$ is a constant.

{: .proof-title}
> Proof sketch.
> 
> By a non-uniform reduction, $g(U_{n\ell})$ is indistinguishable from $Z:=Y_1 ... Y_\ell$
> such that $Y_1, Y_2, ..., Y_\ell$ are sampled from $Y'$ independently (\* see caviate below).
> We have Shannon entropy $H(Z) \ge k \ell + \ell/100n$, but we want $Y$ with high *min-entropy*.
> By a Chernoff bound that is similar to the previous claim,
> we have that for all except for exponentially small probability,
> 
> $$
> \Pr_{y \gets Z}[ \gamma(y) \ge 2^{-(k \ell + \ell/100n)(1 \pm \beta)} ] \le 2^{-\Omega(\beta^2 \ell/ n)},
> $$
> 
> where $\gamma(y) := \Pr_{y' \gets Z}[y' = y]$ for all $y$.
> We simply get rid of those "bad $y$" from $Z$ and obtain the distribution $Y$
> by moving the probability mass $2^{-\Omega(\beta^2 \ell/ n)}$ to all strings in $\bit^{m\ell}$ uniformly,
> which yields $Y$ with min-entropy at most
> 
> $$
> -\log\left( 2^{-\ell \cdot (k + 1/100n) \cdot (1-\beta)} + 2^{-\ell n} \cdot 2^{-\Omega(\beta^2 \ell/ n)} \right)
> $$
> 
> which is at least $(k\ell + \Omega(\ell / n))(1 - \beta)$.
> Choosing $\beta(n) := 1/2n^2$ and $\ell(n) = n^9$, we have $\alpha \ge (\ell n)^{0.7} \gt 0$ for sufficiently large $n$.
> 
> Notice that the entropy gap is roughly $\Omega(\ell / n) - 2\beta k \ell$, which incurs a huge $\ell$.
> 
> \* Caviate on the non-uniform reduction:
> The reduction is non-trivial because the distribution $Y_i$ is only *existential* 
> by the definition of weak PEG $F$ (but the reduction needs to sample $Y_i$ efficiently).
> Using *non-uniform* reduction, we can hardwire the samples needed.
> It is more involved for *uniform* reduction: we need to rely on the construct of $F$ (from OWF $f$)
> so that we can invert $f(x)$ even we do not know the entropy $i^\ast(x)$. 
> 
> This is called *uniform* hard-core lemma.
> In the reduction, each $Y_i$ is sufficiently dense (with $1/n$ fraction we replace the inner product with a uniform bit)
> but maybe hard to sample ($i^\ast(x)$).
> Hence, if the reduction is equipped with an oracle that decides a potential sample,
> we can distinguish weak PEG (by calling a distinguisher of PEG in hybrids).
> Uniform HC lemma says that, given such reduction $A$ without the oracle,
> we can construct an adversary $B$ (without the oracle) that inverts OWF $f$.
> We skip the statement and proof of the uniform hard-core lemma as well as 
> the reduction,see [Holenstein'06, Barak'08, HRV'13, [BHK09](https://dl.acm.org/doi/pdf/10.5555/1496770.1496899)] for details.

PRG from PEG
----------------------------

#### **Theorem:** PRG from PEG of Known Min-Entropy

{:.theorem}
> Suppose $g: \bit^n \to \bit^n$ is a PEG such that $H_\infty(g(U_n)) = k$ is known,
> where $k \le n$.
> Let $h_1: \bit^n \to \bit^{l_1}, h_2 \bit^n \to \bit^{l_2}$ be pairwise independent hash functions
> sampled uniformly at random from $\cH_1, \cH_2$, where $l_1, l_2$ are chosen properly later.
> Let $G'$ to be the function
> 
> $$
> G'(x, h_1, h_2) := (h_1, h_1(x), h_2, h_2(g(x))).
> $$
> 
> Then, $g$ is a PRG.

{:.proof}
> It suffices to show that 
> 
> 1. $\cD_0 := G'(U_n, U_{l_1}, U_{l_2})$ is satistically close to $\cD_1 := (h_1, U_{l_1}, h_2, h_2(g(U_n)))$, and
> 2. $\cD_1$ is computationally indistinguishable from $\cD_2:= (h_1, U_{l_1}, h_2, h_2(Y))$, 
>    where $Y$ is indistinguishable from $g(U_n)$ and $H_\infty(Y) \ge k + n^\alpha$.
> 3. $\cD_2$ is statistically close to $\cD_3 := (h_1, U_{l_1}, h_2, U_{l_2})$.
> 
> For 1, observe that 
> $\cD_0$ is $2^{-d/2}$-close to $\cD_1$ by Leftover Hash Lemma
> when $l_1 \le n-k-d$ because $x$ has min-entropy at least $n-k$ given $g(x)$
> (the set $g^{-1}(g(x))$ is at least $2^{n-k}$ by the min-entropy of $g(x)$).
> 
> For 2, it follows by standard reduction (computational indistinguishability is closed under efficient operations).
> 
> For 3, observe that $k+n^\alpha \le n$ by $G$ is PEG.
> by Leftover Hash Lemma, 
> $\cD_2$ is $2^{-d/2}$-close to $\cD_3$
> when $l_2 \le k+n^\alpha - d$ because $Y$ has min-entropy.
> 
> We choose $d := n^\alpha / 4$ so that $2^{-d/2}$ in the above is negligible.
> The input size of $G'$ is $n + 2n + 2n$, while the output size is
> 
> $$
> 2n + l_1 + 2n + l_2
> = 2n+(n-k-d)+2n+(k+n^\alpha-d) = 3n + 2n + n^\alpha / 2,
> $$
> 
> which is expanding as wanted.

Finally, it remains to show that we can construct PRG from PEG
*without knowing* the min-entropy $k$.
We can achieve that by *enumerating all possible $k$*
from $1$ to $n$, that is

$$
G(x_1,...,x_n) := G'_1(x_1) \oplus  G'_2(x_2) \oplus ...G'_n(x_n),
$$

where each $G'_k$ assumes the given PEG gives min-entropy $k$.
Because the given PEG must give min-entropy $k$ for some $k$ (for all input),
the output of $G$ is pseudorandom even all other $k' \neq k$ are not.
This, unfortunately, shrinks the output length by $n$,
and that is *not acceptable* since we expanded only $n^\alpha = o(n)$ bits in PEG.

The trick is that for each $G'_k$, construct $\hat G_k$ such that 
expands to $\Omega(n^2)+1$ bits (which is exactly the same as 
expanding PRG from 1-bit to many-bit expansion), 
and then construct $G$ from XORing $\hat G_k$ for all $k \in [n]$.
Thus, the input is $O(n^2)$ while the output is $\Omega(n^2)+1$, expanding as wanted.

> **Discuss**{:.label}
> We can use less XORs to get better result.
> Observe that given entropy gap of PEG $g$ is $\Delta = n^\alpha$, 
> we can increment the possible $k$ by a fraction $\Delta / 2$.
> That is,
> 
> $$
> G(x_1,...,x_{2n/\Delta} := \bigoplus_{i\in[2n/\Delta]} G'_{1+i\Delta/2}(x_i).
> $$
> 
> Notice that for any $k\in[n]$ such that $g$ is PEG, 
> there exists $i$ such that $G'_{1+i\Delta/2}$ is also a PRG 
> by narrowing the gap in the construct of $G'$ by 1/2.
> The input length is $(3n+2n)\cdot 2n/\Delta$, and
> the output length is $3n+2n + \Delta$, which is still shrinking (but much better).
> 
> Also notice that the expansion calls the underlying PEG and thus OWF
> *sequentially*, which is also improved in later constructs [HRV'13].

This concludes the construction from OWF to PRG.

