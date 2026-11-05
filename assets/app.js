/* Portfolio behaviour. Vanilla JS, no build step, works from file:// and any static host.
   One script for every page. Each page says what it is on <body>:
     data-page  home | projects | project | writing | post | about | approach
     data-id    the project or post id (project and post pages)
     data-root  the path back to the site root: '' at the root, '../' one folder down
   Pages are built from assets/data.js; projects/*.html and writing/*.html are thin shells (tools/pages.cjs). */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const B = document.body, PAGE = B.dataset.page || 'home', ROOT = B.dataset.root || '';
  const CASES = window.CASES || [], MORE = window.MORE || [], BRIEFS = window.BRIEFS || [], ARTICLES = window.ARTICLES || [];
  const LAB = window.LAB || {}, TOOLS = window.TOOLS || [], SCENES = window.SCENES || {}, Scene = window.Scene;
  const FEATURED = ['bid', 'copilot', 'health', 'nbfc', 'largedocs'];
  [...CASES, ...MORE].forEach((c) => { c.featured = FEATURED.includes(c.id); });
  // newest first; on a tie the featured case file comes first
  const ALL = [...CASES, ...MORE].sort((a, b) => (a.end === b.end ? (b.featured ? 1 : 0) - (a.featured ? 1 : 0) : a.end < b.end ? 1 : -1));
  const byId = Object.fromEntries(ALL.map((p) => [p.id, p]));
  const postById = Object.fromEntries(ARTICLES.map((a) => [a.id, a]));
  const live = (a) => a.status === 'Published' || a.status === 'Publishing soon';
  const EMAIL = 'dineshk12102000@gmail.com', LINKEDIN = 'https://www.linkedin.com/in/dinesh-krishnamoorthy-35422217a/', GITHUB = 'https://github.com/DineshDinesh01', MEDIUM = 'https://medium.com/@dineshk12102000';
  const SHORT = {
    bid: 'bid-pricing agents', largedocs: 'large-document design', nbfc: 'co-lending platform', copilot: 'engineering copilot', health: 'healthcare document AI',
    platform: 'document AI platform', pbm: 'prior-auth platform', tender: 'tender pilot', rfq: 'RFQ → proposal', rfpflow: 'RFP workflow',
    survey: 'survey graph', filings: 'regulatory filings', drawings: 'drawing diff', timesheets: 'handwritten timesheets',
    serving: 'GPU serving', voice: 'voice agent', finetune: 'fine-tuning', invoices: 'partner invoices', idp: 'IDP release 3.0',
    templates: 'release 2.0', formx: 'first product'
  };
  const short = (id) => SHORT[id] || (byId[id] ? byId[id].title : id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const smooth = () => (RM ? 'auto' : 'smooth');
  const pad = (n) => String(n).padStart(2, '0');
  const U = {
    home: ROOT + 'index.html', projects: ROOT + 'projects.html', writing: ROOT + 'writing.html', about: ROOT + 'about.html', approach: ROOT + 'how-i-work.html',
    project: (id) => ROOT + 'projects/' + id + '.html', post: (id) => ROOT + 'writing/' + id + '.html'
  };
  const refUrl = (r) => (r.startsWith('post-') ? U.post(r) : r === 'journey' ? U.about + '#journey' : U.project(r));
  const refLabel = (r) => (r.startsWith('post-') ? 'post ' + (postById[r] ? postById[r].n : r.slice(5)) : r === 'journey' ? 'journey' : short(r));
  const cite = (r) => `<a class="cite" href="${refUrl(r)}">${esc(refLabel(r))}</a>`;
  const AREAS = [['agentic', 'Agentic AI'], ['rag', 'RAG & search'], ['document', 'Document AI'], ['architecture', 'Architecture'], ['backend', 'Backend & data'], ['serving', 'Models & serving'], ['early', 'Early products']];
  const areaName = Object.fromEntries(AREAS);

  /* ------------------------------------------------------------ chrome: header + footer on every page */
  const NAV = [['home', 'Home', U.home], ['projects', 'Projects', U.projects], ['about', 'About', U.about], ['approach', 'How I work', U.approach]];
  const SECTION = { home: 'home', projects: 'projects', project: 'projects', writing: 'writing', post: 'writing', about: 'about', approach: 'approach' }[PAGE];
  // the reading order: every page ends with a card to the next one
  const BOOK = [
    ['home', 'Home', 'Who I am and what I build, in ten seconds', U.home],
    ['projects', 'Projects', `All ${ALL.length} projects and ${BRIEFS.length} smaller builds, 2022 → now`, U.projects],
    ['about', 'About', 'The journey, the rules I design by, and the work beyond code', U.about],
    ['approach', 'How I work', 'One real engineering problem, how I run a pilot, the toolkit, and a small retrieval demo', U.approach]
  ];
  const topSlot = $('#siteTop');
  if (topSlot) topSlot.outerHTML = `
    <div class="progress" id="progress" aria-hidden="true"></div>
    <header class="nav" id="top"><div class="wrap nav-in">
      <a class="brand" href="${U.home}" aria-label="Dinesh Krishnamoorthy, home"><span class="brand-mark">DK</span><span class="brand-name">Dinesh Krishnamoorthy</span></a>
      <nav class="nav-links" id="navLinks" aria-label="Main">${NAV.map(([k, l, h]) => `<a href="${h}"${k === SECTION ? ' class="active" aria-current="page"' : ''}>${l}</a>`).join('')}<a class="nl-m" href="#contact">Contact</a></nav>
      <div class="nav-actions">
        <button class="k-btn" id="kBtn" type="button" aria-label="Search the site" title="Search the site (Ctrl / ⌘ + K)"><span aria-hidden="true">⌕</span><kbd>⌘K</kbd></button>
        <a class="nav-cta" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
        <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="navLinks" aria-label="Open menu">☰</button>
      </div>
    </div></header>`;
  const bottomSlot = $('#siteBottom');
  if (bottomSlot) {
    const bi = BOOK.findIndex((b) => b[0] === PAGE);
    const nx = bi >= 0 ? BOOK[(bi + 1) % BOOK.length] : null;
    bottomSlot.outerHTML = `
    ${nx ? `<nav class="next-page" aria-label="Next page"><div class="wrap np-in">
      <a class="np-card" href="${nx[3]}"><span class="np-k mono">Next page · ${pad(((bi + 1) % BOOK.length) + 1)} / ${pad(BOOK.length)}</span><b>${esc(nx[1])} <span aria-hidden="true">→</span></b><small>${esc(nx[2])}</small></a>
      <ol class="np-dots" aria-label="Pages">${BOOK.map((b, i) => `<li><a href="${b[3]}"${i === bi ? ' class="on" aria-current="page"' : ''}><span class="mono">${pad(i + 1)}</span>${esc(b[1])}</a></li>`).join('')}</ol>
    </div></nav>` : ''}
    <section class="contact dark" id="contact" aria-labelledby="ctTitle">
      <div class="wrap">
        <span class="eyebrow">Next conversation</span>
        <h2 class="ct-big" id="ctTitle">Get in <em class="it">touch.</em></h2>
        <div class="ct-row">
          <p class="lead">I like teams building real products with LLMs: agents, data platforms, voice and documents, where the engineering around the model matters as much as the model.</p>
          <div class="ct-actions">
            <button class="btn" type="button" data-action="email"><span>${EMAIL}</span> <span aria-hidden="true">⧉</span></button>
            <a class="btn ghost" href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn ↗</a>
            <a class="btn ghost" href="${GITHUB}" target="_blank" rel="noopener">GitHub ↗</a>
            <a class="btn ghost" href="${MEDIUM}" target="_blank" rel="noopener">Medium ↗</a>
          </div>
        </div>
        <footer class="foot mono">
          <span>© ${new Date().getFullYear()} Dinesh Krishnamoorthy</span>
          <nav class="foot-nav" aria-label="All pages">${BOOK.map(([k, l, , h]) => `<a href="${h}"${k === SECTION ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
          <span>Every document shown is synthetic · client names withheld on purpose</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </section>
    <div class="palette" id="palette" role="dialog" aria-modal="true" aria-label="Search the site" hidden>
      <div class="pal-box">
        <div class="pal-in"><span class="mono" aria-hidden="true">⌕</span><input id="palInput" type="text" placeholder="Jump to a page, a project or a post…" aria-label="Search pages, projects and posts" autocomplete="off" /><kbd>esc</kbd></div>
        <ul class="pal-list" id="palList" role="listbox"></ul>
      </div>
    </div>
    <div class="toast mono" id="toast" role="status" aria-live="polite"></div>`;
  }

  /* ------------------------------------------------------------ toast + email */
  const toastEl = $('#toast');
  let toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); toast('Copied ' + EMAIL); }
    catch (err) {
      const ta = document.createElement('textarea');
      ta.value = EMAIL; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? 'Copied ' + EMAIL : EMAIL);
    }
  }

  /* ------------------------------------------------------------ nav: menu, progress, scrolled */
  const nav = $('.nav'), progress = $('#progress'), navLinks = $('#navLinks'), menuBtn = $('#menuBtn');
  function setMenu(open) {
    if (!navLinks) return;
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.textContent = open ? '×' : '☰';
  }
  if (menuBtn) menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ------------------------------------------------------------ reveal + counters */
  function countUp(el) {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (RM) { el.textContent = to + suf; return; }
    const t0 = performance.now(), D = 1000;
    const f = (t) => {
      const p = Math.min(1, (t - t0) / D);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  const rvIO = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.num[data-count]', e.target).forEach(countUp);
    rvIO.unobserve(e.target);
  }), { threshold: 0.12 }) : null;
  function reveal(root = document) { $$('.rv:not(.in)', root).forEach((el) => (rvIO ? rvIO.observe(el) : el.classList.add('in'))); }

  /* ------------------------------------------------------------ post covers (small animated SVGs) */
  function cover(kind) {
    let b = '';
    if (kind === 'pages') {
      for (let i = 0; i < 72; i++) {
        const c = i % 12, r = (i / 12) | 0;
        b += `<rect class="pgc${i < 25 ? ' lit' : ''}${i === 25 ? ' p26' : ''}" x="${22 + c * 24}" y="${14 + r * 24}" width="18" height="20" rx="2" style="--i:${i}"/>`;
      }
      b += '<text x="22" y="170" class="cvt">p.26 → never read · data before models</text>';
    } else if (kind === 'layers') {
      const names = ['asset', 'document', 'knowledge', 'extraction', 'business'];
      for (let k = 0; k < 5; k++) {
        const cy = 140 - k * 24;
        b += `<polygon class="lyr${k === 2 ? ' mid' : ''}" points="62,${cy} 150,${cy - 26} 238,${cy} 150,${cy + 26}"/><text x="248" y="${cy + 4}" class="cvt">${names[k]}</text>`;
      }
      b += '<circle class="rise" cx="150" cy="140" r="5"/><text x="18" y="24" class="cvt ac">truth is made in one layer</text>';
    } else if (kind === 'voice') {
      const hs = [14, 30, 46, 22, 58, 36, 64, 40, 26, 52, 30, 44, 18, 34, 24, 12];
      hs.forEach((h, i) => { b += `<rect class="wv" x="${22 + i * 9}" y="${90 - h / 2}" width="5" height="${h}" rx="2.5" style="--i:${i}"/>`; });
      b += '<text x="166" y="97" class="cvt big">→</text><rect class="card" x="188" y="60" width="120" height="60" rx="8"/><text x="198" y="84" class="cvt dk">Login bug</text><text x="198" y="106" class="cvt ok">✓ moved to Done</text><text x="22" y="160" class="cvt">confirm before anything runs</text>';
    } else if (kind === 'agents') {
      b += '<line x1="30" y1="96" x2="290" y2="96" class="ln9"/>';
      for (let i = 0; i < 9; i++) {
        const x = 30 + i * 32.5;
        b += i === 6 || i === 7 ? `<rect class="nd9 code" x="${x - 9}" y="87" width="18" height="18" rx="3"/>` : `<circle class="nd9" cx="${x}" cy="96" r="9"/>`;
      }
      b += '<circle class="runner" cx="30" cy="96" r="4"/><text x="210" y="130" class="cvt ac">code tools</text><text x="30" y="56" class="cvt">agents + code tools · evals</text>';
    } else if (kind === 'rag') {
      const rows = [[0.9, 0], [0.6, 1], [0.75, 0], [0.42, 1], [0.82, 0]];
      rows.forEach(([w, bad], i) => {
        const y = 28 + i * 26;
        b += `<rect class="chunk${i === 0 ? ' sel' : ''}" x="28" y="${y}" width="${Math.round(200 * w)}" height="12" rx="4"/>`;
        if (bad) b += `<text x="${38 + Math.round(200 * w)}" y="${y + 10}" class="cvt bad">✖</text>`;
      });
      b += '<text x="246" y="40" class="cvt ac">rerank ↑</text><text x="28" y="170" class="cvt">what broke after the demo</text>';
    } else if (kind === 'boxes') {
      const t = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0];
      for (let i = 0; i < 12; i++) {
        const c = i % 4, r = (i / 4) | 0, x = 40 + c * 66, y = 32 + r * 44;
        b += `<rect class="cbx2" x="${x}" y="${y}" width="16" height="16" rx="2"/>${t[i] ? `<path class="tick" d="M${x + 3} ${y + 8} l4 4 l7 -9"/>` : ''}<rect class="dbox${t[i] ? ' t' : ''}" x="${x - 5}" y="${y - 5}" width="26" height="26" rx="3" style="--i:${i}"/><rect class="ln2" x="${x + 24}" y="${y + 6}" width="26" height="4" rx="2"/>`;
      }
    }
    return `<svg class="cv" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="320" height="180" fill="#0e0f15"/>${b}</svg>`;
  }
  function postRow(a) {
    return `<article class="post rv" data-post="${a.id}">
      <div class="post-cover">${cover(a.cover)}</div>
      <div class="post-txt">
        <div class="post-meta mono"><span>POST / ${a.n}</span><span class="tag">${esc(a.tag)}</span><span class="pst${live(a) ? ' soon' : ''}">${esc(a.url ? 'Published' : a.status)}</span></div>
        <h3><a class="post-link" href="${U.post(a.id)}">${esc(a.title)}</a></h3>
        <div class="post-foot"><span class="text-btn" aria-hidden="true">Read the summary →</span></div>
      </div>
    </article>`;
  }

  /* ------------------------------------------------------------ project cards with live thumbnails */
  function row(p) {
    return `<article class="case pj-row" data-id="${p.id}" data-cats="${p.cats.join(' ')}">
      <a class="pj-row-a" href="${U.project(p.id)}">
        <span class="pj-row-main"><b>${esc(p.title)}</b><span class="pj-row-sub">${esc(p.client)} · ${esc(p.catLabel)}</span></span>
        <span class="pj-row-side"><span class="status ${p.status}">${esc(p.statusLabel)}</span><span class="chips">${p.chips.slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('')}</span><span class="pj-row-go" aria-hidden="true">→</span></span>
      </a>
      <p class="case-hit" hidden></p>
    </article>`;
  }
  function card(p) {
    const def = SCENES[p.id], n = def ? def.steps.length : 0;
    return `<article class="case rv" data-id="${p.id}" data-cats="${p.cats.join(' ')}">
      <div class="case-thumb"><div class="case-scene" aria-hidden="true"></div><span class="thumb-live mono"><i></i>${p.featured ? 'featured' : 'live flow'}</span><span class="thumb-step mono">${n} steps</span></div>
      <div class="case-body">
        <div class="case-meta mono"><span>${p.yr}</span><span aria-hidden="true">·</span><span>${esc(p.catLabel)}</span><span class="status ${p.status}">${esc(p.statusLabel)}</span></div>
        <h3><a class="case-link" href="${U.project(p.id)}">${esc(p.title)}</a></h3>
        <p class="case-client">${esc(p.client)}</p>
        <p class="case-short">${esc(p.short)}</p>
        <p class="case-hit" hidden></p>
        <div class="case-foot"><div class="chips">${p.chips.slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('')}</div><span class="open-btn" aria-hidden="true">Open <span>→</span></span></div>
      </div>
    </article>`;
  }
  const thumbs = new Map();
  const thumbIO = 'IntersectionObserver' in window && Scene ? new IntersectionObserver((es) => es.forEach((e) => {
    const el = e.target, id = el.dataset.id;
    if (!SCENES[id]) return;
    let sc = thumbs.get(id);
    if (e.isIntersecting) {
      if (!sc) {
        const stepEl = $('.thumb-step', el);
        sc = new Scene($('.case-scene', el), id, {
          loop: true, fast: true, reduced: RM, maxScale: 1,
          onStep: (k, s) => { stepEl.textContent = k ? `${k}/${s.n} · ${s.def.steps[k - 1].t}` : 'starting…'; }
        });
        thumbs.set(id, sc);
        if (RM) sc.go(sc.n);
      }
      if (!RM) sc.play();
    } else if (sc) sc.pause();
  }), { rootMargin: '120px 0px' }) : null;
  function watchCards(root = document) { if (thumbIO) $$('.case', root).forEach((c) => thumbIO.observe(c)); }
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.case');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px');
    c.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });

  /* ------------------------------------------------------------ search: BM25 over every project, post and smaller build */
  const STOP = new Set(('a an and are as at be been but by can could did do does doing done for from had has have having how i if in into is it its me my of on or our so such than that the their them then there these they this those to was we were what when where which while who whom why will with would you your yours about any anything ever tell show give something some just also please much many more most very really know knew familiar experience experienced work worked working works use used using yourself myself ours dinesh based basically stop project projects').split(/\s+/));
  function stem(w) {
    if (w.length > 4 && w.endsWith('ies')) w = w.slice(0, -3) + 'y';
    else if (w.length > 4 && /(xes|ches|shes|sses)$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
    if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
    else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
    if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
    return w.slice(0, 7);
  }
  const tok = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)).map(stem).filter((w) => w.length > 1);
  const SYN_RAW = {
    agentic: 'agent', drift: 'diffed repeat evaluation', drifting: 'diffed repeat evaluation', evals: 'evaluation confusion', evaluate: 'evaluation confusion', evaluation: 'eval ragas',
    prem: 'vllm environment', deploy: 'serving environment', deployed: 'serving environment', serve: 'vllm triton', served: 'vllm triton', serving: 'vllm triton', gpu: 'vllm serverless',
    large: 'hundreds pages', huge: 'large gb', big: 'large', pdf: 'documents', pdfs: 'documents', docs: 'documents',
    upload: 'chunks checksum', uploads: 'chunks checksum',
    train: 'dataset detector fine', trained: 'dataset detector fine', training: 'dataset detector fine', finetune: 'fine tuning lora', tuning: 'fine lora',
    rag: 'retrieval ragas', search: 'retrieval', hundreds: 'large', retrieval: 'reranker hybrid',
    insurer: 'health prior', insurance: 'insurer health prior', healthcare: 'health', fax: 'prior section', faxes: 'prior section',
    checkbox: 'detector', checkboxes: 'detector', security: 'encryption permission', secure: 'encryption permission', encrypt: 'column',
    test: 'pytest coverage', testing: 'pytest coverage', price: 'pricing cost', voice: 'speech command whisper', graph: 'langgraph knowledge neo4j', kg: 'knowledge graph neo4j',
    evidence: 'lineage page', hallucinate: 'evidence validated', hallucination: 'evidence validated', llm: 'model', vlm: 'vision', vision: 'vlm',
    acp: 'attend copy parse extraction', attend: 'acp copy parse',
    handwriting: 'handwritten', handwritten: 'handwriting', drawing: 'drawings diagram', invoice: 'invoices table', kubernetes: 'cluster terraform',
    fail: 'broke', failure: 'broke', failures: 'broke', hardest: 'broke', biggest: 'large', architecture: 'design layers', design: 'architecture'
  };
  const SYN = {};
  Object.entries(SYN_RAW).forEach(([k, v]) => { SYN[stem(k)] = [...new Set(tok(v))].filter((x) => x !== stem(k)); });
  const CHUNKS = [];
  ALL.forEach((c) => {
    const L = (s) => `${short(c.id)} · ${s}`;
    CHUNKS.push({ ref: c.id, label: L('summary'), text: `${c.title}: ${c.short}` });
    CHUNKS.push({ ref: c.id, label: L('problem'), text: c.problem });
    CHUNKS.push({ ref: c.id, label: L('my role'), text: `${c.title}. Client: ${c.client}. ${c.fields.map(([k, v]) => `${k}: ${v}`).join('. ')}.` });
    c.approach.forEach(([k, v]) => CHUNKS.push({ ref: c.id, label: L('design'), text: `${k}: ${v}` }));
    c.fixes.forEach(([a, b]) => CHUNKS.push({ ref: c.id, label: L('broke → changed'), text: `${a}. ${b}` }));
    c.impact.forEach((x) => CHUNKS.push({ ref: c.id, label: L('impact'), text: x }));
    c.learned.forEach((x) => CHUNKS.push({ ref: c.id, label: L('learned'), text: x }));
    (c.pocs || []).forEach(([t, who, what]) => CHUNKS.push({ ref: c.id, label: L('POC'), text: `${t} (${who}): ${what}` }));
    CHUNKS.push({ ref: c.id, label: L('stack'), text: `Stack for the ${short(c.id)}: ${c.tech.join(', ')}. ${c.chips.join(', ')}.` });
  });
  BRIEFS.forEach((b, i) => CHUNKS.push({ ref: 'brief:' + i, label: `smaller build · ${b.title.toLowerCase()}`, text: `${b.title}: ${b.line} ${b.tags.join(', ')}.` }));
  ARTICLES.forEach((a) => {
    a.blocks.filter(([h]) => !/^who it/i.test(h)).forEach(([h, p]) => CHUNKS.push({ ref: a.id, label: `post ${a.n} · ${h.toLowerCase()}`, text: `${h}: ${p}` }));
    CHUNKS.push({ ref: a.id, label: `post ${a.n} · takeaway`, text: a.takeaway });
  });
  [
    'I started in January 2022 as an internship trainee, working as a Java developer on a form-extraction product: Vaadin UI and Spring Boot backend.',
    'In 2023 I worked as a Java and Python developer on the document platform, then joined an NBFC client’s team from July to December to build co-lending platform modules.',
    'In 2024, as a Software Engineer, I worked on SaaS-partner integrations, voice-agent POCs, a first LLM fine-tune, model serving on Triton and Kubernetes, and the start of the US health-insurer work.',
    'I was promoted to Senior Software Engineer in April 2025.',
    'In 2026 I designed a data foundation and knowledge layers for very large documents, and I lead the technical effort on a manufacturing client’s document-copilot pilot.',
    'I am an NVIDIA-Certified Professional: Agentic AI (NCP-AAI), passed in July 2026.'
  ].forEach((t) => CHUNKS.push({ ref: 'journey', label: 'journey', text: t }));
  const DOCS = CHUNKS.map((c) => { const t = tok(c.text); const tf = new Map(); t.forEach((w) => tf.set(w, (tf.get(w) || 0) + 1)); return { tf, len: t.length }; });
  const DF = new Map();
  DOCS.forEach((d) => d.tf.forEach((_, w) => DF.set(w, (DF.get(w) || 0) + 1)));
  const N = DOCS.length, AVG = DOCS.reduce((s, d) => s + d.len, 0) / N, K1 = 1.2, BB = 0.75, TAU = 3;
  const idf = (w) => { const df = DF.get(w) || 0; return Math.log(1 + (N - df + 0.5) / (df + 0.5)); };
  function search(q) {
    const terms = [], syn = [];
    tok(q).forEach((w) => { if (!terms.includes(w)) terms.push(w); });
    terms.forEach((w) => (SYN[w] || []).forEach((s) => { if (!terms.includes(s) && !syn.includes(s)) syn.push(s); }));
    const weighted = [...terms.map((w) => [w, 1]), ...syn.map((w) => [w, 0.5])];
    const scores = DOCS.map((d, i) => {
      let s = 0, direct = 0;
      const cov = terms.filter((t) => d.tf.has(t) || (SYN[t] || []).some((x) => d.tf.has(x))).length;
      weighted.forEach(([w, wt]) => {
        const f = d.tf.get(w);
        if (!f) return;
        if (wt === 1) direct++;
        s += wt * idf(w) * (f * (K1 + 1)) / (f + K1 * (1 - BB + (BB * d.len) / AVG));
      });
      return { i, s, direct, cov };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
    return { terms, syn, scores };
  }
  // best passage per project (or smaller build) for a query; needs a direct term match
  function rank(q) {
    const r = search(q), best = new Map();
    r.scores.forEach((x) => {
      if (!x.direct) return;
      const ref = CHUNKS[x.i].ref;
      if (!best.has(ref)) best.set(ref, x);
    });
    const top = r.scores.length ? r.scores[0].s : 1;
    return [...best.entries()].filter(([, x]) => x.s >= Math.min(1.2, top * 0.25)).map(([ref, x]) => ({ ref, s: x.s, text: CHUNKS[x.i].text, label: CHUNKS[x.i].label }));
  }

  /* ------------------------------------------------------------ scene player (project pages) */
  function playerHTML(id) {
    const def = SCENES[id];
    return `<div class="m-scene">
      <div class="m-stage" id="mStage" role="img" aria-label="Animated flow: ${esc(def.steps.map((s) => s.t).join(', '))}"></div>
      <div class="m-ctrl"><button class="m-play" type="button" aria-label="Play">▶</button><div class="m-steps" role="tablist" aria-label="Flow steps">${def.steps.map((s, i) => `<button class="m-step" type="button" role="tab" aria-selected="false"><b>${i + 1}</b>${esc(s.t)}</button>`).join('')}</div></div>
      <div class="m-prog" aria-hidden="true"><i></i></div>
      <p class="m-cap" aria-live="polite"></p>
      <p class="m-syn mono"><span class="m-swipe">SWIPE THE SCENE ↔ · </span>SYNTHETIC SAMPLE DATA · ILLUSTRATIVE FLOW · ← → STEP THROUGH IT</p>
    </div>`;
  }
  function player(box, id) {
    const def = SCENES[id];
    const stepsBox = $('.m-steps', box), stepsEl = $$('.m-step', box), cap = $('.m-cap', box), prog = $('.m-prog i', box), playBtn = $('.m-play', box);
    let userPaused = false;
    const sc = new Scene($('.m-stage', box), id, {
      reduced: RM, maxScale: 1.25, minScale: 0.62,
      onStep: (k, s) => {
        stepsEl.forEach((b, j) => { b.classList.toggle('on', j + 1 === k); b.classList.toggle('done', j + 1 < k); b.setAttribute('aria-selected', String(j + 1 === k)); });
        const st = def.steps[k - 1];
        cap.innerHTML = st ? `<b>${pad(k)} / ${pad(s.n)} · ${esc(st.t).toUpperCase()}</b>${esc(st.c || '')}` : '<b>READY</b>Press play, or pick a step.';
        prog.classList.remove('run', 'full');
        void prog.offsetWidth;
        if (s.playing && k > 0) { prog.style.setProperty('--dur', s.dur(k) + 'ms'); prog.classList.add('run'); } else if (k >= s.n) prog.classList.add('full');
        const on = stepsEl[k - 1];
        if (on) stepsBox.scrollLeft = on.offsetLeft - stepsBox.clientWidth / 2 + on.offsetWidth / 2;
      },
      onPlay: (p) => { playBtn.textContent = p ? '❚❚' : '▶'; playBtn.setAttribute('aria-label', p ? 'Pause' : 'Play'); if (!p) prog.classList.remove('run'); }
    });
    playBtn.addEventListener('click', () => { if (sc.playing) { userPaused = true; sc.pause(); } else { userPaused = false; sc.play(); } });
    stepsEl.forEach((b, j) => b.addEventListener('click', () => { userPaused = true; sc.pause(); sc.go(j + 1); }));
    if (RM) sc.go(sc.n);
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { if (!userPaused && !sc.playing) sc.play(); } else if (sc.playing) sc.pause();
      }), { threshold: 0.35 }).observe(box);
    } else sc.play();
    sc.step1 = (d) => { userPaused = true; sc.pause(); sc.go(sc.step + d); };
    return sc;
  }
  let pagePlayer = null;

  /* ------------------------------------------------------------ pages */
  function autoRelated(p) {
    return ALL.filter((x) => x !== p).map((x) => ({ x, s: x.cats.filter((c) => p.cats.includes(c)).length * 2 + x.tech.filter((t) => p.tech.includes(t)).length }))
      .sort((a, b) => b.s - a.s).slice(0, 3).map((o) => o.x.id);
  }
  function miniCard(p) {
    return `<a class="mini" href="${U.project(p.id)}"><span class="mono">${p.yr} · ${esc(p.catLabel)}</span><b>${esc(p.title)}</b><small>${esc(p.client)}</small></a>`;
  }

  function initHome() {
    // old single-page links (#case/bid, #post/post-01, #story …) now live on their own pages
    const h = location.hash, m = h.match(/^#(case|post)\/([\w-]+)$/);
    const moved = { '#work': U.projects, '#story': U.approach + '#story', '#method': U.approach + '#method', '#toolkit': U.approach + '#toolkit', '#ask': U.approach + '#ask', '#journey': U.about + '#journey', '#principles': U.about + '#principles', '#writing': U.projects };
    if (m && (m[1] === 'case' ? byId[m[2]] : postById[m[2]])) { location.replace(m[1] === 'case' ? U.project(m[2]) : U.post(m[2])); return; }
    if (moved[h]) { location.replace(moved[h]); return; }

    const HOME = ['copilot', 'largedocs', 'health', 'bid'];
    $('#featGrid').innerHTML = HOME.map((id) => byId[id]).filter(Boolean).map(card).join('');
    watchCards($('#featGrid'));
    const more = ALL.filter((p) => !p.featured);
    if ($('#moreList')) $('#moreList').innerHTML = more.map((p) => `<li class="rv"><a href="${U.project(p.id)}"><span class="ml-yr mono">${p.yr}</span><span class="ml-t"><b>${esc(p.title)}</b><small>${esc(p.client)}</small></span><span class="status ${p.status}">${esc(p.statusLabel)}</span><span class="ml-go" aria-hidden="true">→</span></a></li>`).join('');
    if ($('#areaLinks')) $('#areaLinks').innerHTML = AREAS.map(([k, l]) => `<a class="area" href="${U.projects}?area=${k}"><b>${ALL.filter((p) => p.cats.includes(k)).length}</b>${esc(l)}</a>`).join('');
    if ($('#postTeaser')) $('#postTeaser').innerHTML = ARTICLES.slice(0, 4).map(postRow).join('');
    initHero();
  }

  function initHero() {
    const heroGrid = $('#heroGrid'), heroDoc = $('#heroDoc'), beam = $('#beam'), jsonEl = $('#heroJson');
    if (!heroGrid) return;
    const fields = $$('.fx[data-k]', heroDoc), sysNodes = $$('.sys-node');
    jsonEl.innerHTML = [
      ['open', '{'],
      ['name', '  <i class="jk">"name"</i>: <i class="js" data-k="name">"Dinesh Krishnamoorthy"</i>,'],
      ['title', '  <i class="jk">"title"</i>: <i class="js" data-k="title">"SSDE | GenAI Engineer &amp; AI Systems Design | Agentic AI · RAG"</i>,'],
      ['thesis', '  <i class="jk">"thesis"</i>: <i class="js" data-k="thesis">"I design the system around the model."</i>,'],
      ['builds', '  <i class="jk">"builds"</i>: [<i class="js" data-k="b0">"document intelligence"</i>, <i class="js" data-k="b1">"RAG"</i>, <i class="js" data-k="b2">"agentic systems"</i>],'],
      ['evidence', `  <i class="jk">"projects"</i>: <a class="js" href="${U.projects}">"${ALL.length} projects + ${BRIEFS.length} smaller builds →"</a>`],
      ['close', '}']
    ].map(([k, h]) => `<span class="jl" data-line="${k}">${h}</span>`).join('');
    const lineFor = (k) => $(`.jl[data-line="${/^b\d$/.test(k) ? 'builds' : k}"]`, jsonEl);
    const targetFor = (k) => $(`.js[data-k="${k}"]`, jsonEl) || lineFor(k);
    let heroTimers = [], extracted = 0;
    const HT = (fn, ms) => heroTimers.push(setTimeout(fn, ms));
    const setStatus = (s) => { $('#sysStatus').textContent = s; };
    const setCount = (n) => { extracted = n; $('#jsonCount').textContent = `${n} / ${fields.length} values`; };
    function heroReset() {
      heroTimers.forEach(clearTimeout); heroTimers = [];
      $$('.fly', heroGrid).forEach((e) => e.remove());
      heroDoc.classList.add('raw'); beam.classList.remove('run');
      fields.forEach((f) => f.classList.remove('on'));
      $$('.jl', jsonEl).forEach((l) => l.classList.remove('show'));
      sysNodes.forEach((n) => n.classList.remove('on'));
      setCount(0); $('#docState').textContent = 'scanned · unread'; setStatus('waiting for document…');
    }
    function heroFinal() {
      heroDoc.classList.remove('raw');
      fields.forEach((f) => f.classList.add('on'));
      $$('.jl', jsonEl).forEach((l) => l.classList.add('show'));
      sysNodes.forEach((n, i) => n.classList.toggle('on', i === sysNodes.length - 1));
      setCount(fields.length); $('#docState').textContent = 'read ✓';
      setStatus(`✓ ${fields.length} values, each linked to its source on this page`);
    }
    function flyTo(f, done) {
      const target = targetFor(f.dataset.k);
      if (!target || window.innerWidth < 1100 || !heroGrid.animate) { setTimeout(done, 200); return; }
      const g = heroGrid.getBoundingClientRect(), a = f.getBoundingClientRect(), b = target.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'fly';
      el.textContent = f.dataset.field;
      heroGrid.appendChild(el);
      const x0 = a.left - g.left, y0 = a.top - g.top - 26, x1 = b.left - g.left, y1 = b.top - g.top;
      const anim = el.animate([
        { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { opacity: 1, offset: 0.82 },
        { transform: `translate(${x1}px, ${y1}px) scale(.85)`, opacity: 0 }
      ], { duration: 900, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'forwards' });
      anim.onfinish = () => { el.remove(); done(); };
    }
    function runHero() {
      heroReset();
      if (RM) { heroFinal(); return; }
      HT(() => { heroDoc.classList.remove('raw'); setStatus('deskew · denoise'); $('#docState').textContent = 'deskewing…'; }, 250);
      HT(() => $$('.jl[data-line="open"], .jl[data-line="close"], .jl[data-line="evidence"]', jsonEl).forEach((l) => l.classList.add('show')), 700);
      const T0 = 1100, SWEEP = 1700, H = heroDoc.offsetHeight || 1;
      HT(() => { void beam.offsetWidth; beam.classList.add('run'); setStatus('layout · reading fields'); $('#docState').textContent = 'reading…'; }, T0);
      fields.forEach((f) => {
        const y = f.offsetTop + f.offsetHeight / 2;
        HT(() => {
          f.classList.add('on');
          flyTo(f, () => { lineFor(f.dataset.k).classList.add('show'); setCount(extracted + 1); });
        }, T0 + Math.max(0, Math.min(1, y / H)) * SWEEP);
      });
      sysNodes.forEach((n, i) => HT(() => { sysNodes.forEach((x) => x.classList.remove('on')); n.classList.add('on'); }, T0 + 300 + i * 450));
      HT(() => setStatus('validate · link evidence'), T0 + SWEEP + 300);
      HT(() => { $('#docState').textContent = 'read ✓'; setStatus(`✓ ${fields.length} values, each linked to its source on this page`); }, T0 + SWEEP + 1300);
    }
    $('#replayHero').addEventListener('click', runHero);
    fields.forEach((f) => {
      f.addEventListener('mouseenter', () => { f.classList.add('hl'); const t = targetFor(f.dataset.k); if (t) t.classList.add('hl'); });
      f.addEventListener('mouseleave', () => { f.classList.remove('hl'); const t = targetFor(f.dataset.k); if (t) t.classList.remove('hl'); });
    });
    jsonEl.addEventListener('mouseover', (e) => { const t = e.target.closest('.js[data-k]'); if (t) { t.classList.add('hl'); const f = $(`.fx[data-k="${t.dataset.k}"]`, heroDoc); if (f) f.classList.add('hl'); } });
    jsonEl.addEventListener('mouseout', (e) => { const t = e.target.closest('.js[data-k]'); if (t) { t.classList.remove('hl'); const f = $(`.fx[data-k="${t.dataset.k}"]`, heroDoc); if (f) f.classList.remove('hl'); } });
    // the pipeline nodes open that stage on the How I work page
    const goStage = (n) => { location.href = U.approach + '?stage=' + n.dataset.stage + '#method'; };
    sysNodes.forEach((n) => { n.addEventListener('click', () => goStage(n)); n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStage(n); } }); });
    let started = false;
    const start = () => { if (!started) { started = true; runHero(); } };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(start, 150));
    setTimeout(start, 2500);
    window.__portfolio.runHero = runHero;
  }

  function initProjects() {
    const REST = ALL.filter((p) => !p.featured);
    const years = [...new Set(REST.map((p) => p.yr))].sort((a, b) => b - a);
    const yLabel = (y) => String(y);
    const groups = [['prod', 'in production'], ['delivered', 'delivered'], ['pilot', 'pilots'], ['proof', 'POCs'], ['design', 'designs'], ['internal', 'platform & R&D'], ['early', 'early releases']];
    const bucket = (p) => (p.status === 'ongoing' || p.status === 'stopped' ? 'pilot' : p.status);
    $('#pjStats').innerHTML = groups.map(([k, l]) => { const n = ALL.filter((p) => bucket(p) === k).length; return n ? `<span><b>${n}</b> ${l}</span>` : ''; }).join('');
    $('#pjFilters').innerHTML = [['all', 'All']].concat(AREAS).map(([k, l]) => `<button class="filter${k === 'all' ? ' active' : ''}" type="button" data-area="${k}" aria-pressed="${k === 'all'}">${esc(l)} <span>${k === 'all' ? REST.length : REST.filter((p) => p.cats.includes(k)).length}</span></button>`).join('');
    $('#pjFeat').innerHTML = FEATURED.map((id) => byId[id]).filter(Boolean).map(card).join('');
    $('#pjList').innerHTML = years.map((y) => {
      const ps = REST.filter((p) => p.yr === y);
      return `<section class="yr-group" id="y${y}" aria-labelledby="yh${y}"><h2 class="yr-h" id="yh${y}"><span>${yLabel(y)}</span><small class="mono"></small></h2><div class="pj-rows">${ps.map(row).join('')}</div></section>`;
    }).join('') + '<section class="yr-group" id="pjResults" aria-labelledby="yhR" hidden><h2 class="yr-h" id="yhR"><span>Results</span><small class="mono" id="pjResN"></small></h2><div class="pj-rows" id="pjResGrid"></div></section>';
    $('#briefList').innerHTML = BRIEFS.map((b, i) => `<li class="brief" data-i="${i}"><span class="br-yr mono">${b.yr}</span><span class="br-main"><b>${esc(b.title)}</b><span>${esc(b.line)}</span></span><span class="br-side"><span class="chips">${b.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</span>${b.rel ? `<a class="cite" href="${U.project(b.rel)}">${esc(short(b.rel))}</a>` : ''}</span></li>`).join('');
    watchCards($('#pjFeat'));
    const cardEls = Object.fromEntries($$('#pjList .case').map((c) => [c.dataset.id, c]));
    const homes = Object.fromEntries(years.map((y) => [y, $(`#y${y} .pj-rows`)]));
    const input = $('#pjSearch'), empty = $('#pjEmpty');
    const params = new URLSearchParams(location.search);
    let area = AREAS.some(([k]) => k === params.get('area')) ? params.get('area') : 'all';
    input.value = params.get('q') || '';
    function setArea(k) {
      area = k;
      $$('#pjFilters .filter').forEach((x) => { const on = x.dataset.area === k; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
      apply();
    }
    function apply() {
      const q = input.value.trim();
      const inArea = (p) => area === 'all' || p.cats.includes(area);
      let shown = 0;
      if (!q) {
        $('#pjResults').hidden = true;
        years.forEach((y) => {
          const g = $(`#y${y}`);
          let k = 0;
          REST.filter((p) => p.yr === y).forEach((p) => {
            const el = cardEls[p.id];
            homes[y].appendChild(el);
            el.hidden = !inArea(p);
            $('.case-hit', el).hidden = true;
            if (!el.hidden) k++;
          });
          g.hidden = !k;
          $('.yr-h small', g).textContent = `${k} project${k === 1 ? '' : 's'}`;
          shown += k;
        });
        $$('.brief').forEach((li) => { li.hidden = false; });
      } else {
        const hits = rank(q);
        years.forEach((y) => { $(`#y${y}`).hidden = true; });
        Object.values(cardEls).forEach((el) => { el.hidden = true; });
        const grid = $('#pjResGrid');
        hits.forEach((h) => {
          const p = byId[h.ref];
          if (!p || !inArea(p)) return;
          let el = cardEls[p.id];
          if (!el) { const t = document.createElement('div'); t.innerHTML = row(p); el = cardEls[p.id] = t.firstElementChild; }
          grid.appendChild(el);
          el.hidden = false;
          const hit = $('.case-hit', el);
          hit.innerHTML = `<b class="mono">MATCH · ${esc(h.label.split(' · ').pop())}</b>${esc(h.text.length > 170 ? h.text.slice(0, 168) + '…' : h.text)}`;
          hit.hidden = false;
          shown++;
        });
        $('#pjResults').hidden = !shown;
        $('#pjResN').textContent = `${shown} project${shown === 1 ? '' : 's'} for “${q}”${area !== 'all' ? ' in ' + areaName[area] : ''}`;
        const briefHit = new Set(hits.filter((h) => h.ref.startsWith('brief:')).map((h) => h.ref.slice(6)));
        $$('.brief').forEach((li) => { li.hidden = !briefHit.has(li.dataset.i); });
      }
      $('#pjFeatSec').hidden = !!q;
      empty.hidden = shown > 0;
      if (!shown) empty.innerHTML = `Nothing matched${q ? ` “${esc(q)}”` : ''}${area !== 'all' ? ` in ${esc(areaName[area])}` : ''}. <button class="linkish" type="button" data-reset>Show all ${ALL.length} projects</button>`;
      const vis = $$('.brief').filter((li) => !li.hidden).length;
      $('#briefN').textContent = q ? `${vis} of ${BRIEFS.length} match` : `${BRIEFS.length} builds`;
      $('#briefs').hidden = q && !vis; const bw = $('.briefs-wrap'); if (bw && q) bw.open = vis > 0;
      const u = new URLSearchParams();
      if (area !== 'all') u.set('area', area);
      if (q) u.set('q', q);
      try { history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : '') + (q ? '' : location.hash)); } catch (err) { /* some browsers refuse on file:// */ }
    }
    $('#pjFilters').addEventListener('click', (e) => { const b = e.target.closest('.filter'); if (b) setArea(b.dataset.area); });
    let t;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 140); });
    $('#pjSearchForm').addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(t); apply(); });
    $('#pjSugg').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) { input.value = b.dataset.q; apply(); } });
    document.addEventListener('click', (e) => { if (e.target.closest('[data-reset]')) { input.value = ''; setArea('all'); } });
    setArea(area);
    reveal();
    // a year link (#y2025) lands below the fixed nav once the list exists
    if (/^#y\d{4}$/.test(location.hash)) { const g = $(location.hash); if (g) requestAnimationFrame(() => g.scrollIntoView()); }
  }

  function initProject() {
    const id = B.dataset.id || new URLSearchParams(location.search).get('id');
    const p = byId[id], main = $('#main');
    if (!p) { main.innerHTML = `<section class="pj-hero dark"><div class="wrap"><h1>Project not found</h1><p class="pj-lede"><a class="btn" href="${U.projects}">See all ${ALL.length} projects</a></p></div></section>`; return; }
    if (!B.dataset.id) document.title = `${p.title} · Dinesh Krishnamoorthy`;
    const i = ALL.indexOf(p), prev = ALL[(i - 1 + ALL.length) % ALL.length], next = ALL[(i + 1) % ALL.length];
    const related = (p.related && p.related.length ? p.related : autoRelated(p)).map((r) => byId[r]).filter(Boolean).slice(0, 3);
    const briefs = BRIEFS.filter((b) => b.rel === p.id);
    const status = (p.fields.find(([k]) => k === 'Status') || [])[1];
    const role = (p.fields.find(([k]) => k === 'My role') || [])[1];
    main.innerHTML = `
      <section class="pj-hero dark" aria-labelledby="pjTitle">
        <div class="wrap">
          <nav class="crumbs mono" aria-label="Breadcrumb"><a href="${U.projects}">Projects</a><span aria-hidden="true">/</span><a href="${U.projects}#y${p.yr}">${p.yr}</a><span aria-hidden="true">/</span><span aria-current="page">${i + 1} of ${ALL.length}</span></nav>
          <div class="pj-tags mono"><span class="status ${p.status}">${esc(p.statusLabel)}</span><span>${esc(p.catLabel)}</span>${p.featured ? '<span class="pj-feat">★ Featured</span>' : ''}</div>
          <h1 id="pjTitle">${esc(p.title)}</h1>
          ${role ? `<p class="pj-role"><span class="mono">My role</span>${esc(role)}</p>` : ''}
          <p class="pj-lede">${esc(p.short)}</p>
          <dl class="pj-meta">
            <div><dt class="mono">Client</dt><dd>${esc(p.client)}</dd></div>
            ${p.fields.filter(([k]) => k !== 'Status' && k !== 'My role').map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
          </dl>
          ${SCENES[p.id] ? `<div class="pj-scene" id="pjScene">${playerHTML(p.id)}</div>` : ''}
        </div>
      </section>
      <section class="pj-body paper">
        <div class="wrap m-grid">
          <aside class="m-side">
            ${status ? `<div class="m-field"><span class="mono">Status</span><b>${esc(status)}</b></div>` : ''}
            <div class="m-tech"><span class="mono">STACK</span><div class="chips">${p.tech.map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>
            ${p.posts.length ? `<div class="m-posts"><span class="mono">RELATED WRITING</span><div class="m-postlist">${p.posts.map((r) => `<a class="m-postbtn" href="${U.post(r)}"><b class="mono">POST ${postById[r].n}</b>${esc(postById[r].title)}</a>`).join('')}</div></div>` : ''}
            <div class="m-posts"><span class="mono">RELATED PROJECTS</span><div class="m-postlist">${related.map(miniCard).join('')}</div></div>
          </aside>
          <article class="m-main">
            ${p.hardq ? `<p class="hardq pj-hardq"><b>THE HARD QUESTION</b>${esc(p.hardq)}</p>` : ''}
            <section><h2 class="mono">THE PROBLEM</h2><p>${esc(p.problem)}</p></section>
            <section><h2 class="mono">${p.status === 'design' ? 'THE DESIGN' : 'WHAT I BUILT'}</h2><ol class="m-appr">${p.approach.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ol></section>
            ${p.fixes.length ? `<section><h2 class="mono">WHAT BROKE → WHAT I CHANGED</h2><div class="m-fixes">${p.fixes.map(([a, b]) => `<div class="m-fix"><span class="br">${esc(a)}</span><span class="ar" aria-hidden="true">→</span><span class="ch">${esc(b)}</span></div>`).join('')}</div></section>` : ''}
            ${p.pocs ? `<section><h2 class="mono">THE ${p.pocs.length} CUSTOMER POCS · HOVER OR TAP A CARD</h2><div class="poc-grid">${p.pocs.map(([t, who, what, ic, link]) => `<div class="poc-cell"><button class="poc" type="button" aria-pressed="false" aria-label="${esc(t)} for ${esc(who)}: ${esc(what)}"><span class="poc-in"><span class="poc-f"><b class="poc-ic" aria-hidden="true">${esc(ic)}</b><strong>${esc(t)}</strong><small>${esc(who)}</small></span><span class="poc-b"><small class="mono">${esc(who)}</small>${esc(what)}</span></span></button>${link ? `<a class="poc-go mono" href="${U.project(link)}">Open: ${esc(short(link))} →</a>` : ''}</div>`).join('')}</div></section>` : ''}
            ${p.output ? `<section><h2 class="mono">WHAT COMES OUT</h2><div class="pj-out"><div class="pj-out-h mono">${esc(p.output.label)}</div><pre class="mono">${esc(p.output.json)}</pre></div></section>` : ''}
            <section><h2 class="mono">IMPACT · NO INVENTED NUMBERS</h2><ul class="m-list">${p.impact.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
            <section class="m-learn"><h2 class="mono">WHAT I LEARNED</h2>${p.learned.map((x) => `<p>${esc(x)}</p>`).join('')}</section>
            ${briefs.length ? `<section><h2 class="mono">SMALLER BUILDS THAT BELONG HERE</h2><ul class="m-list">${briefs.map((b) => `<li><b>${esc(b.title)}</b>: ${esc(b.line)}</li>`).join('')}</ul></section>` : ''}
            <p class="pj-note mono">Client anonymized · synthetic data only · no internal names</p>
          </article>
        </div>
      </section>
      <nav class="pager" aria-label="Previous and next project">
        <div class="wrap pager-in">
          <a class="pg-card" href="${U.project(prev.id)}" rel="prev"><span class="mono">← Previous project</span><b>${esc(prev.title)}</b><small>${prev.yr} · ${esc(prev.catLabel)}</small></a>
          <a class="pg-all mono" href="${U.projects}">All ${ALL.length}<br />projects</a>
          <a class="pg-card nx" href="${U.project(next.id)}" rel="next"><span class="mono">Next project →</span><b>${esc(next.title)}</b><small>${next.yr} · ${esc(next.catLabel)}</small></a>
        </div>
      </nav>`;
    const box = $('#pjScene');
    if (box) pagePlayer = player(box, p.id);
    main.addEventListener('click', (e) => {
      const poc = e.target.closest('.poc');
      if (poc) { const on = poc.classList.toggle('flip'); poc.setAttribute('aria-pressed', String(on)); }
    });
  }

  function initWriting() {
    $('#postGrid').innerHTML = ARTICLES.map((a) => `
      <article class="wpost rv">
        <div class="post-cover">${cover(a.cover)}</div>
        <div class="wpost-txt">
          <div class="post-meta mono"><span>POST / ${a.n}</span><span class="tag">${esc(a.tag)}</span><span class="pst${live(a) ? ' soon' : ''}">${esc(a.url ? 'Published' : a.status)}</span></div>
          <h2><a class="post-link" href="${U.post(a.id)}">${esc(a.title)}</a></h2>
          <p>${esc(a.lede)}</p>
          <div class="wpost-foot mono"><span>From: ${a.cases.map((c) => esc(short(c))).join(' · ')}</span><span class="text-btn" aria-hidden="true">Read the summary →</span></div>
        </div>
      </article>`).join('');
    reveal();
  }

  function initPost() {
    const id = B.dataset.id || new URLSearchParams(location.search).get('id');
    const a = postById[id], main = $('#main');
    if (!a) { main.innerHTML = `<section class="pj-hero dark"><div class="wrap"><h1>Post not found</h1><p class="pj-lede"><a class="btn" href="${U.writing}">All writing</a></p></div></section>`; return; }
    if (!B.dataset.id) document.title = `${a.title} · Dinesh Krishnamoorthy`;
    const i = ARTICLES.indexOf(a), prev = ARTICLES[(i - 1 + ARTICLES.length) % ARTICLES.length], next = ARTICLES[(i + 1) % ARTICLES.length];
    main.innerHTML = `
      <section class="pj-hero dark post-hero" aria-labelledby="postTitle">
        <div class="wrap">
          <nav class="crumbs mono" aria-label="Breadcrumb"><a href="${U.writing}">Writing</a><span aria-hidden="true">/</span><span aria-current="page">Post ${a.n} of ${pad(ARTICLES.length)}</span></nav>
          <div class="pj-tags mono"><span class="status ${a.url || live(a) ? 'prod' : 'ongoing'}">${esc(a.url ? 'Published' : a.status)}</span><span>${esc(a.tag)}</span></div>
          <h1 id="postTitle">${esc(a.title)}</h1>
          <p class="pj-lede">${esc(a.lede)}</p>
          <div class="art-cover">${cover(a.cover)}</div>
        </div>
      </section>
      <section class="pj-body paper">
        <div class="wrap post-wrap">
          <div class="art-grid">${a.blocks.map(([h, p]) => `<section class="art-b rv"><h2 class="mono">${esc(h)}</h2><p>${esc(p)}</p></section>`).join('')}</div>
          <p class="art-take"><b>TAKEAWAY</b>${esc(a.takeaway)}</p>
          <div class="post-from"><span class="mono">FROM THESE PROJECTS</span><div class="m-postlist">${a.cases.map((c) => byId[c]).filter(Boolean).map(miniCard).join('')}</div></div>
          <p class="post-medium mono">${a.url ? `<a class="btn" href="${esc(a.url)}" target="_blank" rel="noopener">Read the full post on Medium ↗</a>` : 'This is the summary. The full post is being published on Medium, one at a time.'}</p>
        </div>
      </section>
      <nav class="pager" aria-label="Previous and next post">
        <div class="wrap pager-in">
          <a class="pg-card" href="${U.post(prev.id)}" rel="prev"><span class="mono">← Previous post</span><b>${esc(prev.title)}</b><small>Post ${prev.n} · ${esc(prev.tag)}</small></a>
          <a class="pg-all mono" href="${U.writing}">All ${ARTICLES.length}<br />posts</a>
          <a class="pg-card nx" href="${U.post(next.id)}" rel="next"><span class="mono">Next post →</span><b>${esc(next.title)}</b><small>Post ${next.n} · ${esc(next.tag)}</small></a>
        </div>
      </nav>`;
    reveal();
  }

  /* about: journey line */
  const tl = $('#timeline');
  function updateTimeline() {
    if (!tl) return;
    const r = tl.getBoundingClientRect(), mark = window.innerHeight * 0.6;
    tl.style.setProperty('--p', Math.max(0, Math.min(1, (mark - r.top) / r.height)).toFixed(3));
    $$('.jr', tl).forEach((li) => li.classList.toggle('reached', li.getBoundingClientRect().top < mark));
  }

  /* how I work: story, pilot lab, toolkit, ask */
  let updateStory = () => {};
  function initApproach() {
    // pilot lab
    function chooseLab(key) {
      const d = LAB[key];
      if (!d) return;
      $$('.lab-tab').forEach((b) => { const on = b.dataset.lab === key; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
      $$('.lab-node').forEach((n) => n.classList.toggle('on', n.dataset.lab === key));
      $('#labPanel').setAttribute('aria-labelledby', 'tab-' + key);
      $('#labLabel').textContent = `STAGE ${d.n} / 05`;
      $('#labChip').textContent = d.chip;
      $('#labTitle').textContent = d.title;
      $('#labDesc').textContent = d.desc;
      $('#labTokens').innerHTML = d.tokens.map((t, i) => `${i ? '<span class="lab-arrow" aria-hidden="true">→</span>' : ''}<span class="lab-token${i === d.hot ? ' hot' : ''}" style="animation-delay:${i * 90}ms">${esc(t)}</span>`).join('');
      $('#labPoints').innerHTML = d.points.map(([k, v]) => `<div class="lab-point"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('') +
        `<div class="lab-point"><span>Learned on</span><div class="refs">${d.refs.map((r) => `<div>${cite(r)} <em>${esc(byId[r] ? byId[r].client : '')}</em></div>`).join('')}</div></div>`;
    }
    const labTabs = $$('.lab-tab');
    if (labTabs.length) {
      labTabs.forEach((b, i) => {
        b.addEventListener('click', () => chooseLab(b.dataset.lab));
        b.addEventListener('keydown', (e) => {
          const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
          const j = e.key === 'Home' ? 0 : e.key === 'End' ? labTabs.length - 1 : d ? (i + d + labTabs.length) % labTabs.length : -1;
          if (j < 0) return;
          e.preventDefault();
          const n = labTabs[j];
          n.focus(); chooseLab(n.dataset.lab);
        });
      });
      $$('.lab-node').forEach((n) => {
        n.addEventListener('click', () => chooseLab(n.dataset.lab));
        n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chooseLab(n.dataset.lab); } });
      });
      const st = new URLSearchParams(location.search).get('stage');
      chooseLab(LAB[st] ? st : 'intake');
    }
    // toolkit
    const toolRow = ([n, refs]) => `<li><b>${esc(n)}</b><span>${refs.map((r) => (r.startsWith('note:') ? esc(r.slice(5)) : byId[r] ? `<a href="${U.project(r)}">${esc(short(r))}</a>` : '')).filter(Boolean).join(' · ')}</span></li>`;
    const tk = $('#tkLayers');
    if (tk) {
      tk.innerHTML = TOOLS.map((g) => `<div class="tk-layer"><h3 class="mono">${esc(g.layer)}</h3><ul class="tk-list">${g.items.slice(0, 10).map(toolRow).join('')}</ul>${g.items.length > 10 ? `<p class="tk-more mono">Also used</p><ul class="tk-list tk-list-more">${g.items.slice(10).map(toolRow).join('')}</ul>` : ''}</div>`).join('');
      const showTool = (btn) => {
        $$('.tk-chip').forEach((b) => b.classList.toggle('on', b === btn));
        const refs = btn.dataset.refs.split('|');
        const titles = refs.filter((r) => byId[r]).map((r) => esc(byId[r].title));
        $('#tkRead').innerHTML = `<span class="mono small muted">USED IN</span><b>${esc(btn.textContent)}</b><div class="tk-refs">${refs.map((r) => (r.startsWith('note:') ? `<span class="tk-note">${esc(r.slice(5))}</span>` : cite(r))).join('')}</div>${titles.length ? `<p>${titles.join(' · ')}</p>` : ''}`;
      };
      $$('.tk-chip').forEach((b) => { ['mouseenter', 'focus', 'click'].forEach((ev) => b.addEventListener(ev, () => showTool(b))); });
    }
    initAsk();
    // a deep link (#story, #method …) lands again once web fonts have shifted the layout
    const landing = location.hash && document.getElementById(location.hash.slice(1));
    if (landing && document.fonts) document.fonts.ready.then(() => landing.scrollIntoView());
  }

  function initAsk() {
    const askInput = $('#askInput'), askAns = $('#askAns');
    if (!askInput) return;
    let typeTimers = [], askTouched = false;
    function typeOut(els) {
      typeTimers.forEach(clearTimeout); typeTimers = [];
      let delay = 0;
      els.forEach((p) => {
        const full = p.dataset.full;
        if (RM) { p.textContent = full; return; }
        p.textContent = '';
        const steps = Math.ceil(full.length / 4);
        for (let s = 1; s <= steps; s++) typeTimers.push(setTimeout(() => { p.textContent = full.slice(0, s * 4); }, delay + s * 12));
        delay += steps * 12 + 150;
      });
    }
    const srcLink = (ref) => (ref.startsWith('brief:') ? `<a class="cite" href="${U.projects}#briefs">smaller builds</a>` : cite(ref));
    function ask(q) {
      q = q.trim();
      if (!q) return;
      askInput.value = q;
      const r = search(q);
      const top = r.scores.slice(0, 6), max = top.length ? top[0].s : 1;
      const coverage = top.length && r.terms.length ? top[0].cov / r.terms.length : 0;
      const pass = top.length > 0 && top[0].s >= TAU && top[0].direct > 0 && coverage >= 0.5;
      const minDirect = Math.max(1, Math.ceil(r.terms.length / 2));
      const picked = pass ? [top[0], ...top.slice(1, 4).filter((x) => x.s >= top[0].s * 0.6 && x.direct >= minDirect && CHUNKS[x.i].text !== CHUNKS[top[0].i].text).slice(0, 1)] : [];
      $('#trTokens').innerHTML = r.terms.length
        ? r.terms.map((t, i) => `<span class="tok" style="animation-delay:${i * 50}ms">${esc(t)}</span>`).join('') + r.syn.map((t, i) => `<span class="tok syn" title="expanded synonym" style="animation-delay:${(r.terms.length + i) * 50}ms">+${esc(t)}</span>`).join('')
        : '<span class="muted mono small">no searchable terms</span>';
      $('#trBars').innerHTML = top.length
        ? top.map((x, j) => `<div class="trb${picked.includes(x) ? ' sel' : ''}"><span class="mono" title="${esc(CHUNKS[x.i].label)}">${esc(CHUNKS[x.i].label)}</span><i style="--w:${((x.s / max) * 100).toFixed(1)}%;--d:${150 + j * 70}ms"></i><b class="mono">${x.s.toFixed(2)}</b></div>`).join('')
        : '<span class="muted mono small">no passage matched</span>';
      $('#trN').textContent = `${N} passages`;
      $('#trDec').innerHTML = pass
        ? `answered with <b>${picked.length}</b> quoted passage${picked.length > 1 ? 's' : ''} · top score ${top[0].s.toFixed(2)} ≥ τ ${TAU}`
        : `<span class="abst">abstained</span> · ${top.length && top[0].s >= TAU ? `only ${Math.round(coverage * 100)}% of the question matched` : `best score ${top.length ? top[0].s.toFixed(2) : '0.00'} below τ ${TAU}`}`;
      askAns.innerHTML = `<p class="ans-q mono">› ${esc(q)}</p>` + (pass
        ? picked.map((x) => `<div class="ans-blk"><p data-full="${esc(CHUNKS[x.i].text)}"></p><div class="ans-src mono">source ${srcLink(CHUNKS[x.i].ref)}<span>${esc(CHUNKS[x.i].label)}</span></div></div>`).join('')
        : '<div class="ans-abstain">I couldn’t find that in my projects, so I won’t guess. Try a suggested question, or <a href="#contact">ask me directly</a>.</div>');
      typeOut($$('.ans-blk p', askAns));
    }
    $('#askSugg').innerHTML = (window.ASK_SUGGEST || []).map((s) => `<button class="sugg" type="button">${esc(s)}</button>`).join('');
    $('#askSugg').addEventListener('click', (e) => { const b = e.target.closest('.sugg'); if (b) { askTouched = true; ask(b.textContent); } });
    $('#askForm').addEventListener('submit', (e) => { e.preventDefault(); askTouched = true; ask(askInput.value); });
    askInput.addEventListener('focus', () => { askTouched = true; });
    const grid = $('#ask .ask-grid');
    if (grid && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (askTouched) return;
        const q = (window.ASK_SUGGEST || [])[0];
        if (!q) return;
        if (RM) { ask(q); return; }
        let i = 0;
        const t = setInterval(() => {
          if (askTouched) { clearInterval(t); return; }
          askInput.value = q.slice(0, ++i);
          if (i >= q.length) { clearInterval(t); setTimeout(() => { if (!askTouched) ask(q); }, 300); }
        }, 28);
      }, { threshold: 0.35 });
      io.observe(grid);
    }
    window.__portfolio.ask = ask;
  }

  /* ------------------------------------------------------------ search menu (⌘K) */
  const palette = $('#palette'), palInput = $('#palInput'), palList = $('#palList');
  const PAL = [
    ...BOOK.map(([, l, d, h]) => ({ k: 'page', l: `${l} · ${d}`, run: () => { location.href = h; } })),
    ...ALL.map((p) => ({ k: String(p.yr), l: p.title, s: `${p.client} ${p.catLabel} ${p.chips.join(' ')}`, run: () => { location.href = U.project(p.id); } })),
    ...ARTICLES.map((a) => ({ k: 'post ' + a.n, l: a.title, run: () => { location.href = U.post(a.id); } })),
    { k: 'action', l: 'Copy email address', run: () => copyEmail() },
    { k: 'link', l: 'Open LinkedIn', run: () => window.open(LINKEDIN, '_blank', 'noopener') },
    { k: 'link', l: 'Open GitHub', run: () => window.open(GITHUB, '_blank', 'noopener') },
    { k: 'link', l: 'Open Medium', run: () => window.open(MEDIUM, '_blank', 'noopener') }
  ];
  let palItems = [], palSel = 0, palFocus = null;
  function renderPal() {
    const q = palInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    palItems = PAL.filter((p) => { const h = (p.k + ' ' + p.l + ' ' + (p.s || '')).toLowerCase(); return q.every((w) => h.includes(w)); });
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    palList.innerHTML = palItems.length
      ? palItems.map((p, i) => `<li class="pal-item${i === palSel ? ' sel' : ''}" role="option" aria-selected="${i === palSel}" data-i="${i}"><span class="pal-k mono">${esc(p.k)}</span>${esc(p.l)}</li>`).join('')
      : '<li class="pal-empty">No match. Try “agents”, “vLLM”, “2024” or “post”.</li>';
    const sel = $('.pal-item.sel', palList);
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openPalette() { if (!palette) return; palFocus = document.activeElement; palette.hidden = false; palInput.value = ''; palSel = 0; renderPal(); palInput.focus(); }
  function closePalette() { if (!palette || palette.hidden) return; palette.hidden = true; if (palFocus && document.contains(palFocus)) palFocus.focus({ preventScroll: true }); }
  function runPal(i) { const p = palItems[i]; if (!p) return; closePalette(); p.run(); }
  if (palette) {
    $('#kBtn').addEventListener('click', openPalette);
    palInput.addEventListener('input', () => { palSel = 0; renderPal(); });
    palInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); renderPal(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(0, palSel - 1); renderPal(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
    });
    palList.addEventListener('click', (e) => { const li = e.target.closest('.pal-item'); if (li) runPal(+li.dataset.i); });
    palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });
  }

  /* ------------------------------------------------------------ global: actions, keys */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="email"]')) { copyEmail(); return; }
    const r = e.target.closest('[data-ref]');
    if (r) { e.preventDefault(); location.href = refUrl(r.dataset.ref); }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette && palette.hidden ? openPalette() : closePalette(); return; }
    if (palette && !palette.hidden) { if (e.key === 'Escape') closePalette(); return; }
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) { setMenu(false); return; }
    if (pagePlayer && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.altKey && !e.ctrlKey && !e.metaKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      const r = $('#pjScene').getBoundingClientRect();
      if (r.bottom > 60 && r.top < window.innerHeight * 0.7) { e.preventDefault(); pagePlayer.step1(e.key === 'ArrowRight' ? 1 : -1); }
    }
  });

  /* ------------------------------------------------------------ scroll loop */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
      updateStory();
      updateTimeline();
    });
  }

  /* ------------------------------------------------------------ boot */
  window.__portfolio = { PAGE, ALL, BRIEFS, search, rank, copyEmail };
  const INIT = { home: initHome, projects: initProjects, project: initProject, writing: initWriting, post: initPost, approach: initApproach };
  // counts written into the static pages stay right when a project is added
  $$('[data-count-all]').forEach((el) => { el.textContent = ALL.length; });
  $$('[data-count-more]').forEach((el) => { el.textContent = MORE.length; });
  $$('[data-count-briefs]').forEach((el) => { el.textContent = BRIEFS.length; });
  if (INIT[PAGE]) INIT[PAGE]();
  reveal();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  window.__portfolio.player = () => pagePlayer;
})();

/* home hero: a beam reads the profile card and each field lands in extracted.json */
(function () {
  const doc = document.getElementById('hsDoc'), out = document.getElementById('hsJson');
  if (!doc || !out) return;
  const $ = (q) => document.getElementById(q);
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const v = (k, t) => `<i class="jv" data-k="${k}">"${t}"</i>`;
  const LINES = [
    ['open', '{'],
    ['name', `  <i class="jk">"name"</i>: ${v('name', 'Dinesh Krishnamoorthy')},`],
    ['title', `  <i class="jk">"title"</i>: ${v('title', 'SSDE | GenAI Engineer &amp; AI Systems Design')},`],
    ['role', `  <i class="jk">"role"</i>: ${v('role', 'Senior Software Engineer')},`],
    ['w', `  <i class="jk">"works_with"</i>: [${v('w0', 'voice')}, ${v('w1', 'text')}, ${v('w2', 'documents')}, ${v('w3', 'business data')}],`],
    ['shipped', `  <i class="jk">"in_production"</i>: <i class="jn">["bid pricing agents", "NBFC co-lending platform", "prior-auth document AI"]</i>,`],
    ['projects', `  <i class="jk">"projects"</i>: <a class="jv" href="projects.html">"${(window.CASES || []).length + (window.MORE || []).length} →"</a>`],
    ['close', '}']
  ];
  out.innerHTML = LINES.map(([k, h]) => `<span class="jl" data-line="${k}">${h}</span>`).join('');
  const fields = [...doc.querySelectorAll('.hs-f[data-k]')];
  const line = (k) => out.querySelector(`.jl[data-line="${/^w\d$/.test(k) ? 'w' : k}"]`);
  const lines = [...out.querySelectorAll('.jl')];
  let T = [], n = 0;
  const set = (s, st) => { $('hsStatus').textContent = s; if (st) $('hsState').textContent = st; };
  const count = () => { $('hsCount').textContent = n + ' / ' + fields.length + ' fields'; };
  function final() { fields.forEach((f) => f.classList.add('on')); lines.forEach((l) => l.classList.add('show')); n = fields.length; count(); set('✓ read · hover a value to see its source', 'read ✓'); }
  function run() {
    T.forEach(clearTimeout); T = []; n = 0; count();
    fields.forEach((f) => f.classList.remove('on')); lines.forEach((l) => l.classList.remove('show'));
    const beam = $('hsBeam'); beam.classList.remove('run');
    if (RM) { final(); return; }
    set('layout · reading fields', 'reading…');
    const H = doc.offsetHeight || 1, SW = 1900, T0 = 400;
    doc.style.setProperty('--hsH', H + 'px'); void beam.offsetWidth; beam.classList.add('run');
    T.push(setTimeout(() => line('open').classList.add('show'), T0));
    fields.forEach((f) => {
      const y = f.getBoundingClientRect().top - doc.getBoundingClientRect().top;
      T.push(setTimeout(() => { f.classList.add('on'); line(f.dataset.k).classList.add('show'); n++; count(); }, T0 + Math.min(1, y / H) * SW));
    });
    T.push(setTimeout(() => { line('shipped').classList.add('show'); line('projects').classList.add('show'); line('close').classList.add('show'); set('validate · link evidence'); }, T0 + SW + 200));
    T.push(setTimeout(final, T0 + SW + 900));
  }
  $('hsReplay').addEventListener('click', run);
  const pair = (k, on) => { doc.querySelectorAll(`.hs-f[data-k="${k}"]`).forEach((e) => e.classList.toggle('hl', on)); out.querySelectorAll(`.jv[data-k="${k}"]`).forEach((e) => e.classList.toggle('hl', on)); };
  fields.forEach((f) => { f.addEventListener('mouseenter', () => pair(f.dataset.k, true)); f.addEventListener('mouseleave', () => pair(f.dataset.k, false)); });
  out.addEventListener('mouseover', (e) => { const t = e.target.closest('.jv[data-k]'); if (t) pair(t.dataset.k, true); });
  out.addEventListener('mouseout', (e) => { const t = e.target.closest('.jv[data-k]'); if (t) pair(t.dataset.k, false); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(run, 300));
})();
