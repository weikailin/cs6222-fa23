---
layout: page
title: test
nav_exclude: true
---

Math tests
----------

$
\newcommand{\Enc}{\mathsf{Enc}}
\newcommand{\Dec}{\mathsf{Dec}}
\newcommand{\Gen}{\mathsf{Gen}}
$
{: .d-none}

inline $f(x) = 0$

Display

$$
\frac{1}{2}\cdot \sum_{i=0}^n x_i
$$

Long display

$$
\Pr[k \gets \Gen; m \gets D : m = m' \ | \  \Enc_k(m) = c] \quad = \quad \Pr[m \gets D : m = m']  \quad = \quad \Pr[m \gets D : m = m'] \quad = \quad \Pr[m \gets D : m = m'].
$$

quote display
> $$
> \frac{1}{2}\cdot \sum_{i=0}^n x_i
> $$

list display
- it holds that
  $$
  \frac{1}{2}\cdot \sum_{i=0}^n x_i
  $$

env align

$$
\begin{align}
3x-1 &= -10 \\
  3x &= -9 \\
   x &= -3
\end{align}
$$

env align*

$$
\begin{align*}
3x-1 &= -10 \\
  3x &= -9 \\
\end{align*}
$$

env cases (need config and include package)

$$
f_\mul(x,y) = \begin{cases}
1  & \text{if } x = 1 \text{ or } y = 1 \text{( to eliminate trivial inversion)}\\
x \cdot y & o.w.
\end{cases}
$$

test macro $\N$

Uncool "Kramdown" Renderer
------------------------

- Do we need to escape vertical pipes $| S |$? 
  Unfortunately need to escape vertical pipes $\vert S \vert$ due to over sensitive table in kramdown.

- However, table begins from a block so
  putting this on second line $| S |$ escapes it.

- Do we need to escape vertical pipes \\(| S |\\)? 
  Unfortunately need to escape vertical pipes $\vert S \vert$ due to over sensitive table in kramdown.
  
- Tricky escape? The display mode below did NOT escape vpipe but escaped backslash.

  $$
  H_i := U_i \\| s^{1} \| ...s^{\ell(n)-i}
  $$

- Unfortunately need to escape curly braces $\\{0,1\\}$ due to markdown escapes. Seems no better way than latex macro.

- Also need to escape "star $*$" unless there is only one in the block.

- Sometimes need to escape underscores especially in inline math, such as $H^0_n := g'(s), H^1_n := U_1$.
  Unclear when italic is triggered.

- oracle $O[t]_{i,j}(\cdot)$ such that is similar to $H_{i,j}$

- unfortunate, $O\_{i,j,t}[t](\cdot)$, can not use some in math

Kramdown tests
--------------

[Link to pdf](../../otherdocs/[SODA18]CacheOblivSort.pdf)

[Link to section](1-intro.md#a-toy-example-match-making)

**purple**{: .label .label-purple}
**red**{: .label .label-red}
Notice there is no space from span-level obj.

{:.wknote}
this is a note, block-level. 

#### **Definition:** Shannon Secrecy.

{: .defn}
> The private-key encryption scheme $(\Gen,\Enc,\Dec)$ is ....
> 
> $$
> \Pr[k \gets \Gen; m \gets D : \qquad m = m' \ | \  \Enc_k(m) = c] \quad = \quad \Pr[m \gets D : m = m'].
> $$
>
> An encryption scheme is said to be *Shannon secret* if ...


#### **Claim:**

{: .theorem}
> Perfect secrecy implies Shannon secrecy.

{: .proof}
> Suppose that $(\Gen,\Enc,\Dec)$ is perfectly secret. For any $D$, any $c$, and any $m'$, we have
> 
> $$
> \Pr_{k,m}[m = m' | \Enc_k(m) = c] = \Pr_{k,m}[m = m' \cap \Enc_k(m) = c] / \Pr_{k,m}[\Enc_k(m) = c].
> $$
> 

{: .proof-title}
> Proof of Theorem:
> 
> (customized title)

([^\\\$])\$([^\$])
\1\$\$\2