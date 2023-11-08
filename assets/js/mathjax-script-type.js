// Copied from https://docs.mathjax.org/en/latest/upgrading/v2.html#changes-in-the-mathjax-api
// "In version 2, the mathematics that is located by MathJax is ..."
MathJax = {
  options: {
    renderActions: {
      findScript: [10, function (doc) {
        for (const node of document.querySelectorAll('script[type^="math/tex"]')) {
          const display = !!node.type.match(/; *mode=display/);
          const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
          const text = document.createTextNode('');
          node.parentNode.replaceChild(text, node);
          math.start = {node: text, delim: '', n: 0};
          math.end = {node: text, delim: '', n: 0};
          doc.math.push(math);
        }
      }, '']
    }
  },
//---- WK's customize
  loader: {
    load: ['[tex]/cases']
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    packages: {'[+]': ['cases']},
    macros: {
      // RR: "{\\bf R}",
      // bold: ["{\\bf #1}", 1],
      set: ["\\{#1\\}", 1],
      bit: "\\set{0,1}",
      bits: "\\bit^\\ast",
      N: "\\mathbb{N}",
      Z: "\\mathbb{Z}",
      eps: "\\epsilon",
      poly: "\\mathrm{poly}",
      Supp: "\\mathrm{Supp}",
      E: "\\mathop{\\mathbb{E}}",
      ceil: ["{\\left\\lceil #1 \\right\\rceil}", 1],
      floor: ["{\\left\\lfloor #1 \\right\\rfloor}", 1],
      brackets: ["{\\left[ #1 \\right]}", 1],
      cA: "\\mathcal{A}",
      cB: "\\mathcal{B}",
      cC: "\\mathcal{C}",
      cD: "\\mathcal{D}",
      cH: "\\mathcal{H}",
      cK: "\\mathcal{K}",
      cM: "\\mathcal{M}",
      cO: "\\mathcal{O}",
      cX: "\\mathcal{X}",
      cY: "\\mathcal{Y}",
      cZ: "\\mathcal{Z}",
      Gen: "\\mathsf{Gen}",
      pk: "\\mathit{pk}",
      sk: "\\mathit{sk}",
    },
  },
  autoload: {
    cases: [[], ['cases', 'numcases', 'subnumcases']]
  },
//----
};
