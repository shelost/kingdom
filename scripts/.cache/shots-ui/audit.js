(() => {
  const W = innerWidth;
  const docOver = document.documentElement.scrollWidth - W;
  const R = (s) => document.querySelector(s)?.getBoundingClientRect();
  const res = R('.results'), ctl = R('.controls');
  const overlap = res && ctl && getComputedStyle(document.querySelector('.layout')).display === 'grid' ? Math.round(ctl.left - res.right) : null;
  const sel = '.controls button, .controls input, .controls a, .toc-toggle, .filters-toggle';
  const small = [...document.querySelectorAll(sel)].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden' && (b.height < 40);
  }).map((e) => `${e.className.split(' ')[0] || e.tagName}:${Math.round(e.getBoundingClientRect().height)}`);
  const wideKids = [...document.querySelectorAll('main *, .stack *')].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.right > W + 1 && !e.closest('.toc');
  }).slice(0, 4).map((e) => e.tagName + '.' + [...e.classList][0] + ':' + Math.round(e.getBoundingClientRect().right));
  return JSON.stringify({ W, docOver, gutter: overlap, small: [...new Set(small)].slice(0, 8), wideKids });
})()
