/* Animated scenes for the story, the eight case files, and a generated flow for every other project.
   Each scene is a fixed-size canvas scaled to fit its host. Choreography is declarative:
     data-in="n"      visible from step n        data-out="n"  hidden from step n
     data-lit="n"     gets .lit from step n      data-on="a b" gets .on at exactly those steps
     data-zone="a b"  gets .focus at those steps (others dim)
   The canvas also carries cumulative classes s1..sN and data-step="N".
   All documents, names, IDs and numbers are synthetic. */
(function () {
  const P = (x, y, w, h) => `left:${x}px;top:${y}px;` + (w != null ? `width:${w}px;` : '') + (h != null ? `height:${h}px;` : '');
  const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');
  const SCENES = {};

  /* ---------------------------------------------------------------- STORY: page 26 */
  SCENES.story = {
    W: 640, H: 560,
    steps: [{ t: 'Symptom' }, { t: 'No evidence' }, { t: 'Sections' }, { t: 'Tables' }, { t: 'Lineage' }, { t: 'Evidence' }],
    html() {
      let pg = '';
      for (let i = 0; i < 300; i++) {
        const c = i % 20, r = (i / 20) | 0;
        const sec = r < 2 ? 'a' : r < 8 ? 'b' : r < 12 ? 'c' : 'd';
        let cl = 'pg sec-' + sec;
        if (i < 25) cl += ' early';
        if (i === 25) cl += ' p26';
        if (i === 211) cl += ' p212';
        if (i >= 139 && i <= 142) cl += ' ptab';
        pg += `<i class="${cl}" style="left:${62 + c * 26}px;top:${64 + r * 30}px;--i:${i}"></i>`;
      }
      const tmRows = (hd) => (hd ? '<div class="tm-t hd"><i></i><i></i><i></i></div>' : '') + rep(hd ? 4 : 5, () => '<div class="tm-t"><i></i><i></i><i></i></div>');
      return `
      <div class="a sty-head mono" style="${P(62, 26, 516)}"><span>tender.pdf · 300 pages · synthetic</span><span class="sty-count"><b class="c-a">25</b><b class="c-b">300</b> / 300 pages read</span></div>
      ${pg}
      <div class="a sty-tag red" data-in="1" data-out="3" style="${P(222, 95)}--d:.5s">← p.26: never read</div>
      <div class="a sty-ghost mono" data-in="1" data-out="3" style="${P(62, 262, 516)}--d:.8s">pages 26–300 · never processed</div>

      <div class="a sty-q" data-in="2" data-out="3" style="${P(250, 150, 330)}"><span class="mono">Q</span> What is the warranty period?</div>
      <div class="a sty-bad" data-in="2" data-out="3" style="${P(250, 204, 330)}--d:.8s"><span>“12 months.”</span><b class="mono">✖ no evidence · no page</b></div>
      <div class="a sty-ring" data-in="2" data-out="3" style="${P(337, 353)}--d:.3s"></div>
      <div class="a sty-tag" data-in="2" data-out="3" style="${P(386, 369)}--d:.45s">the answer is on p.212, never read</div>

      <div class="a sty-sec a" data-in="3" style="${P(594, 64, null, 56)}--d:.3s"><span>Scope</span></div>
      <div class="a sty-sec b" data-in="3" style="${P(594, 124, null, 176)}--d:.5s"><span>Technical</span></div>
      <div class="a sty-sec c" data-in="3" style="${P(594, 304, null, 116)}--d:.7s"><span>Commercial</span></div>
      <div class="a sty-sec d" data-in="3" style="${P(594, 424, null, 86)}--d:.9s"><span>Annexures</span></div>
      <div class="a sty-legend mono" data-in="3" style="${P(62, 524, 516)}--d:1s">pages grouped into sections · processed in parallel</div>

      <div class="a sty-ov sty-tm" data-in="4" data-out="5" style="${P(96, 140, 448, 250)}">
        <div class="sty-oh mono">p.140 → p.143 · one table across four pages</div>
        <div class="tm-p" style="left:14px;--dx:18px"><b class="mono">p.140</b>${tmRows(true)}</div>
        <div class="tm-p" style="left:122px;--dx:6px"><b class="mono">p.141</b>${tmRows(false)}</div>
        <div class="tm-p" style="left:230px;--dx:-6px"><b class="mono">p.142</b>${tmRows(false)}</div>
        <div class="tm-p" style="left:338px;--dx:-18px"><b class="mono">p.143</b>${tmRows(false)}</div>
        <div class="tm-ol"></div>
        <div class="tm-done mono">4 fragments → 1 table ✓</div>
      </div>

      <div class="a sty-ov sty-lin" data-in="5" data-out="6" style="${P(76, 128, 488, 290)}">
        <div class="sty-oh mono">record trail · every stage writes three records</div>
        <table class="lin-t mono"><thead><tr><th>stage</th><th>input audit</th><th>result</th><th>output audit</th></tr></thead><tbody>
          ${['layout', 'sections', 'extract', 'validate'].map((s, r) => `<tr><td>${s}</td>${rep(3, (k) => `<td><i style="--d:${(0.25 + r * 0.3 + k * 0.1).toFixed(2)}s">✓</i></td>`)}</tr>`).join('')}
        </tbody></table>
        <div class="lin-cols mono">${['run_id', 'batch_id', 'source_file', 'tenant', 'created_at', 'prev_stage_id'].map((c, k) => `<span style="--d:${(1.5 + k * 0.08).toFixed(2)}s">${c}</span>`).join('')}</div>
        <div class="lin-note mono">immutable · never overwritten · replayable</div>
      </div>

      <div class="a sty-q" data-in="6" style="${P(250, 150, 330)}"><span class="mono">Q</span> What is the warranty period?</div>
      <svg class="a sty-link" data-in="6" style="${P(0, 0, 640, 560)}--d:.5s" viewBox="0 0 640 560" aria-hidden="true"><path d="M368 386 C 392 404, 402 418, 412 436"/></svg>
      <div class="a sty-ans" data-in="6" style="${P(370, 436, 216)}--d:.9s"><b>24 months</b><span class="mono">p.212 · Commercial › Warranty ✓</span></div>`;
    }
  };

  /* ---------------------------------------------------------------- 01 · BID ESTIMATION */
  SCENES.bid = {
    W: 960, H: 460,
    steps: [
      { t: 'Email in', c: 'A bid request arrives by email. Attachments are converted to PDF, blank pages removed, and everything merges into one readable document.' },
      { t: 'Classify', c: 'One prompt per category runs in parallel: RFI, quote request, negotiation, confirmation, win, loss, other. This one is a quote request.' },
      { t: 'Extract', c: 'Bid fields come out of the email: markets, audience, completes, interview length (LOI) and incidence rate (IR).' },
      { t: 'Validate', c: 'A missing field is flagged for a human instead of being guessed.' },
      { t: 'Decompose', c: 'A multi-market request is split into market × audience sub-queries.' },
      { t: 'Retrieve + rerank', c: 'Filters with tolerance ranges plus vector search over past bids, then a dedicated reranker keeps the closest projects.' },
      { t: 'Allocate vendors', c: 'A blend of panel vendors covers the required completes. The total must add up exactly, so that rule lives in code, not in a prompt.' },
      { t: 'Price', c: 'A ReAct agent decides what to calculate; code tools do the maths: weighted cost per interview, then net and gross.' },
      { t: 'Explain', c: 'The estimate ships with an explanation and a confidence score per stage. Human edits are saved as data and feed the evaluation set.' }
    ],
    html() {
      const reel = ['RFI', 'Negotiation', 'Confirmation', 'Win', 'Loss', 'Other'].map((s) => `<span>${s}</span>`).join('') + '<span class="hit">Quote request ✓</span>';
      const chips = [['market', 'US, UK'], ['audience', 'parents 30–50'], ['completes', '1,200 · 600'], ['LOI', '20 min'], ['IR', '35%']]
        .map(([k, v], i) => `<span class="s-chip pop" style="--d:${(0.15 + i * 0.16).toFixed(2)}s"><em>${k}</em>${v}</span>`).join('');
      const tiles = (keep) => keep.map((h, i) => (h ? `<i class="keep" style="--h:${h}%;--k:${i}"></i>` : `<i class="drop" style="--k:${i}"></i>`)).join('');
      const track = [['Classify', 2], ['Extract', 3], ['Validate', 4], ['Enrich', 5], ['Decompose', 5], ['Retrieve', 6], ['Allocate', 7], ['Price', 8], ['Summary', 9]]
        .map(([t, n], i) => `<span data-lit="${n}"><b>${String(i + 1).padStart(2, '0')}</b>${t}</span>`).join('');
      return `
      <div class="a bid-ghost mono" data-in="1" data-out="2" style="${P(260, 70, 660, 150)}"><div class="g-h">THE PIPELINE THIS BID WILL GO THROUGH</div><div class="g-row">${['Email in','Classify','Extract','Validate','Decompose','Retrieve','Allocate','Price','Explain'].map((t, i) => `<span><b>${String(i + 1).padStart(2, '0')}</b>${t}</span>`).join('<i>→</i>')}</div><div class="g-f">agents for judgement · code for maths and rules · evals for drift</div></div>
      <div class="a s-doc bid-mail" data-in="1" data-zone="1 2 9" style="${P(24, 28, 200, 178)}">
        <div class="mail-h"><b>✉ Bid request</b><span class="mono">09:42</span></div>
        <div class="mail-f"><span>From</span>client bid desk</div>
        <div class="mail-f"><span>Subj</span>Quote · parents · US + UK</div>
        <div class="s-ln" style="width:94%"></div><div class="s-ln" style="width:80%"></div><div class="s-ln" style="width:88%"></div><div class="s-ln" style="width:56%"></div>
        <div class="mail-att mono"><span class="att-a">▤ brief.docx</span><span class="att-b">→ merged PDF ✓</span></div>
      </div>
      <div class="a s-panel bid-cls" data-in="2" data-zone="2 9" style="${P(24, 222, 200, 120)}">
        <div class="s-h">Classify · 7 prompts in parallel</div>
        <div class="cls-dots">${rep(7, (k) => `<i style="--k:${k}"></i>`)}</div>
        <div class="cls-win"><div class="cls-reel">${reel}</div></div>
      </div>
      <div class="a s-arrow" data-lit="3" style="${P(229, 172)}">→</div>
      <div class="a s-panel bid-ext" data-in="3" data-zone="3 4 9" style="${P(248, 28, 220, 314)}">
        <div class="s-h">Extract · bid fields</div>
        <div class="ext-list">${chips}<span class="s-chip pop meth" data-lit="4" style="--d:.95s"><em>methodology</em><b class="m1">—</b><b class="m2">missing → flagged</b></span></div>
        <div class="s-flag" data-in="4" style="--d:.3s">👤 flagged for a human</div>
      </div>
      <div class="a s-arrow" data-lit="5" style="${P(473, 172)}">→</div>
      <div class="a s-panel bid-sub" data-in="5" data-zone="5 6 9" style="${P(492, 28, 220, 150)}">
        <div class="s-h">Sub-query 1</div><div class="sub-t">US × parents 30–50</div><div class="sub-s mono">1,200 completes</div>
        <div class="tiles" data-in="6">${tiles([92, 0, 84, 0, 0, 77])}</div>
      </div>
      <div class="a s-panel bid-sub" data-in="5" data-zone="5 6 9" style="${P(492, 192, 220, 150)}--d:.25s">
        <div class="s-h">Sub-query 2</div><div class="sub-t">UK × parents 30–50</div><div class="sub-s mono">600 completes</div>
        <div class="tiles" data-in="6" style="--d:.2s">${tiles([0, 88, 0, 81, 74, 0])}</div>
      </div>
      <div class="a s-cap" data-in="6" style="${P(492, 352, 220)}--d:.6s">filters + vectors → rerank → top 3</div>
      <div class="a s-arrow" data-lit="7" style="${P(717, 172)}">→</div>
      <div class="a s-panel bid-alloc" data-in="7" data-zone="7 9" style="${P(736, 28, 200, 126)}">
        <div class="s-h">Allocate vendors</div>
        <div class="al-row"><span class="mono">US</span><div class="al-bar"><i class="va" style="--w:58.3%;--d:.2s">A 700</i><i class="vb" style="--w:41.7%;--d:.7s">B 500</i></div><b class="mono">1,200 ✓</b></div>
        <div class="al-row"><span class="mono">UK</span><div class="al-bar"><i class="vc" style="--w:100%;--d:1.1s">C 600</i></div><b class="mono">600 ✓</b></div>
        <div class="s-cap">sum = completes · enforced in code</div>
      </div>
      <div class="a s-panel bid-price" data-in="8" data-zone="8 9" style="${P(736, 166, 200, 106)}">
        <div class="s-h">Price · ReAct + code tools</div>
        <div class="pr-l mono" style="--d:.15s">ƒ weighted_cpi()</div>
        <div class="pr-l mono" style="--d:.6s">ƒ net_cost()</div>
        <div class="pr-l mono" style="--d:1.05s">ƒ gross_cost() <b>✓</b></div>
      </div>
      <div class="a s-panel bid-sum" data-in="9" data-zone="9" style="${P(736, 284, 200, 118)}">
        <div class="s-h">Estimate · explained</div>
        <div class="cf"><span>retrieval</span><b class="mono">●●●○</b></div>
        <div class="cf"><span>vendors</span><b class="mono">●●●●</b></div>
        <div class="cf"><span>pricing</span><b class="mono">●●●○</b></div>
        <div class="s-cap warn">3/4: methodology flagged</div>
      </div>
      <div class="a s-toast" data-in="9" style="${P(492, 382, 220)}--d:1.3s">✎ human edit saved → eval set</div>
      <div class="a bid-track" style="${P(24, 418, 912)}">${track}</div>`;
    }
  };

  /* ---------------------------------------------------------------- 02 · knowledge layers */
  const layer = (cy, name, on) => {
    const cx = 220, hw = 170, hh = 44, t = 12;
    return `<g class="ly" data-on="${on}">
      <polygon class="sd l" points="${cx - hw},${cy} ${cx},${cy + hh} ${cx},${cy + hh + t} ${cx - hw},${cy + t}"/>
      <polygon class="sd r" points="${cx},${cy + hh} ${cx + hw},${cy} ${cx + hw},${cy + t} ${cx},${cy + hh + t}"/>
      <polygon class="tp" points="${cx - hw},${cy} ${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh}"/>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle">${name}</text></g>`;
  };
  SCENES.largedocs = {
    W: 960, H: 460,
    steps: [
      { t: 'Asset', c: 'A file enters the Asset layer: normalised intake with clear ownership, composition vs aggregation decided explicitly, and no circular ownership.' },
      { t: 'Document layer', c: 'The file becomes structure: document → logical section → sub-section → page. Pages are extracted in parallel; cross-page enrichment rebuilds tables and sections.' },
      { t: 'Candidates', c: 'In the knowledge layer, vision retrieval finds candidate values; keys are inferred and entities linked to evidence.' },
      { t: 'Promoter–critic', c: 'A promoter proposes, a critic decides: proceed, retry, or escalate to a human. Only validated knowledge moves up.' },
      { t: 'Graph', c: 'Validated values enter the knowledge graph, each with an evidence edge back to its page.' },
      { t: 'Extraction layer', c: 'Validated knowledge is formatted as key-value, table or paragraph. Formatting never re-interprets a value.' },
      { t: 'Business layer', c: 'A decision-ready output for the domain, still carrying its evidence.' }
    ],
    html() {
      return `
      <svg class="a iris-svg" style="${P(20, 6, 440, 440)}" viewBox="0 0 440 440" aria-hidden="true">
        <line class="spine" x1="220" y1="40" x2="220" y2="430"/>
        ${layer(372, 'ASSET', '1')}${layer(304, 'DOCUMENT', '2')}${layer(236, 'KNOWLEDGE', '3 4 5')}${layer(168, 'EXTRACTION', '6')}${layer(100, 'BUSINESS', '7')}
      </svg>
      <div class="a iris-file" data-in="1" data-out="2" style="${P(222, -60, 36, 46)}"></div>
      <div class="a iris-dot"></div>
      <div class="a iris-rule mono" style="${P(24, 424, 440)}">each layer depends only on the one below</div>

      <div class="a s-panel iris-p" data-in="1" data-out="2" style="${P(480, 44, 456, 300)}">
        <div class="s-h">Layer 1 · Asset</div><h4>Normalised intake, clear ownership</h4>
        <div class="iris-own"><span class="s-chip pop" style="--d:.2s">file</span><i>→</i><span class="s-chip pop" style="--d:.45s">document stack</span><i>→</i><span class="s-chip pop" style="--d:.7s">project</span></div>
        <ul class="iris-ul"><li class="pop" style="--d:.9s">composition vs aggregation, decided explicitly</li><li class="pop" style="--d:1.1s">no circular ownership</li></ul>
      </div>
      <div class="a s-panel iris-p" data-in="2" data-out="3" style="${P(480, 44, 456, 300)}">
        <div class="s-h">Layer 2 · Document</div><h4>Structure before meaning</h4>
        <div class="tree mono">
          <div class="pop" style="--d:.1s">▣ tender.pdf</div>
          <div class="pop t1" style="--d:.35s">└ § Commercial</div>
          <div class="pop t2" style="--d:.6s">└ § Warranty</div>
          <div class="t3"><span class="pop" style="--d:.9s">p.211 ✓</span><span class="pop" style="--d:.95s">p.212 ✓</span><span class="pop" style="--d:1s">p.213 ✓</span><em>extracted in parallel</em></div>
        </div>
        <div class="s-cap pop" style="--d:1.3s">cross-page enrichment rebuilds continuous tables and sections</div>
      </div>
      <div class="a s-panel iris-p iris-k" data-in="3" data-out="5" style="${P(480, 44, 456, 300)}">
        <div class="s-h">Layer 3 · Knowledge</div><h4>Candidates → promoter ⇄ critic</h4>
        <div class="cand-row"><span class="s-chip cand" style="--d:.1s">warranty = 24 months</span><b class="vd ok" data-in="4" style="--d:.2s">proceed ✓</b></div>
        <div class="cand-row"><span class="s-chip cand" style="--d:.35s">notice = 15 days</span><b class="vd warn" data-in="4" style="--d:.65s">retry ↻</b></div>
        <div class="cand-row"><span class="s-chip cand" style="--d:.6s">penalty cap = ambiguous</span><b class="vd hum" data-in="4" style="--d:1.1s">escalate 👤</b></div>
        <div class="pc mono" data-in="4" style="--d:1.4s"><span class="pc-a">P</span><i>⇄</i><span class="pc-b">C</span>only validated knowledge moves up</div>
      </div>
      <div class="a s-panel iris-p" data-in="5" data-out="6" style="${P(480, 44, 456, 300)}">
        <div class="s-h">Knowledge graph</div><h4>Every value keeps an evidence edge</h4>
        <svg class="kg" viewBox="0 0 420 210" aria-hidden="true">
          <path class="e" style="--d:.2s" d="M86 112 L196 58"/><path class="e" style="--d:.4s" d="M222 58 L304 58"/>
          <path class="e ev" style="--d:.7s" d="M330 84 L330 140"/><path class="e dash" style="--d:.5s" d="M86 112 L196 164"/>
          <g class="nd" style="--d:.05s" transform="translate(60,112)"><circle r="30"/><text>Tender</text></g>
          <g class="nd" style="--d:.25s" transform="translate(222,58)"><circle r="30"/><text>Warranty</text></g>
          <g class="nd val" style="--d:.45s" transform="translate(330,58)"><circle r="30"/><text>24 mo</text></g>
          <g class="nd evn" style="--d:.75s" transform="translate(330,160)"><rect x="-38" y="-17" width="76" height="34" rx="9"/><text>p.212</text></g>
          <g class="nd pend" style="--d:.55s" transform="translate(222,164)"><circle r="30"/><text>Notice</text></g>
        </svg>
      </div>
      <div class="a s-panel iris-p" data-in="6" data-out="7" style="${P(480, 44, 456, 300)}">
        <div class="s-h">Layer 4 · Extraction</div><h4>Formats. Never re-interprets.</h4>
        <table class="xt mono"><tr><th>key</th><th>value</th><th>evidence</th></tr>
          <tr class="pop" style="--d:.2s"><td>warranty_period</td><td>24 months</td><td>p.212</td></tr>
          <tr class="pop pending" style="--d:.45s"><td>notice_period</td><td>retrying…</td><td>—</td></tr></table>
        <div class="s-cap pop" style="--d:.8s">key-value · table · paragraph</div>
      </div>
      <div class="a s-panel iris-p" data-in="7" style="${P(480, 44, 456, 300)}">
        <div class="s-h">Layer 5 · Business</div><h4>Decision-ready, still carrying evidence</h4>
        <div class="biz pop" style="--d:.2s"><b>Warranty meets requirement ✓</b><span class="mono">evidence · p.212 · Commercial › Warranty</span></div>
        <div class="s-cap pop" style="--d:.6s">truth was created once, in the knowledge layer</div>
      </div>`;
    }
  };

  /* ---------------------------------------------------------------- 03 · CO-LENDING */
  SCENES.nbfc = {
    W: 960, H: 460,
    steps: [
      { t: 'Upload', c: 'A 1 GB+ loan-pool file is split into dynamically sized chunks, each with a SHA-256 checksum, sent in parallel and re-joined with an integrity check.', ms: 3800 },
      { t: 'Protect', c: 'Sensitive columns are encrypted at column level (RSA-OAEP / AES), with Dask for very large files.' },
      { t: 'Filter', c: 'Business rules run on PySpark in parallel groups, and the impact of each rule on the pool is shown.', ms: 3600 },
      { t: 'Cash flow', c: 'Fixed-EMI schedules with moratoriums, and due dates that fall on holidays moved to the next working day.' },
      { t: 'Access', c: 'Every API call is checked against permission data. No permission: 401.' }
    ],
    html() {
      const rows = [['L-1001', 'A. Rao', '0045 1182', '240,000', '2'], ['L-1002', 'S. Iyer', '0071 9034', '185,500', '3'], ['L-1003', 'M. Das', '0019 4471', '96,000', '1'], ['L-1004', 'P. Nair', '0088 2310', '310,250', '2']];
      const ci = ['9f3a…e1', 'c07b…4d', 'e2d9…7a', '51ac…0f', '7b1e…c2', 'a4f0…93', '0d6c…b8', 'f19e…5a'];
      let k = 0;
      const sens = (v) => { const i = k++; return `<td class="sens" style="--k:${i}"><span class="pl">${v}</span><span class="ci">🔒 ${ci[i]}</span></td>`; };
      const tbody = rows.map((r) => `<tr><td>${r[0]}</td>${sens(r[1])}${sens(r[2])}<td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');
      const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      return `
      <div class="a nb-file" data-out="5" data-zone="1" style="${P(24, 36, 118, 124)}"><b>▤</b><span>pool.parquet</span><em class="mono">1.2 GB · synthetic</em></div>
      <div class="a nb-lane" data-in="1" data-out="5" data-zone="1" style="${P(166, 52, 480, 92)}">${rep(8, (i) => `<i class="ck" style="left:${i * 60}px;--k:${i}"><b class="mono">${i + 1}</b><span class="mono">sha256 ✓</span></i>`)}</div>
      <div class="a nb-srv" data-out="5" data-zone="1" style="${P(664, 48, 112, 100)}"><b>⛁</b><span>document server</span></div>
      <div class="a nb-sent mono" data-in="1" data-out="5" data-zone="1" style="${P(166, 150, 480)}--d:2.4s">8 chunks · sent in parallel · checksums verified</div>
      <div class="a nb-join" data-in="1" data-out="5" data-zone="1" style="${P(800, 36, 136, 124)}--d:2.5s"><b>▤</b><span>re-joined</span><em class="mono">integrity verified ✓</em></div>

      <div class="a s-panel nb-acc" data-in="5" data-zone="5" style="${P(24, 28, 912, 150)}">
        <div class="s-h">Every API call → permission middleware</div>
        <div class="acc-row r1"><span class="mono req">POST /pools/42/filters · user without permission</span><i class="dot"></i><span class="gate">⛨</span><b class="res bad mono">401</b></div>
        <div class="acc-row r2"><span class="mono req">POST /pools/42/filters · permitted user</span><i class="dot"></i><span class="gate">⛨</span><b class="res ok mono">200 ✓</b></div>
      </div>

      <div class="a s-panel nb-tbl" data-in="2" data-out="4" data-zone="2" style="${P(24, 196, 446, 240)}">
        <div class="s-h">Uploaded pool · column-level encryption</div>
        <table class="mono"><thead><tr><th>loan_id</th><th>borrower</th><th>account_no</th><th>principal</th><th>cycle</th></tr></thead><tbody>${tbody}</tbody></table>
        <div class="s-cap">RSA-OAEP / AES · managed key files · Dask for big files</div>
      </div>
      <div class="a s-panel nb-cf" data-in="4" data-zone="4" style="${P(24, 196, 446, 240)}">
        <div class="s-h">Cash flow · fixed EMI</div>
        <div class="cf-bars">${months.map((m, i) => `<i class="${i === 2 || i === 3 ? 'mor' : ''}${i === 7 ? ' hol' : ''}" style="--k:${i}"><span class="mono">${m}</span></i>`).join('')}</div>
        <div class="cf-note mor-n mono">moratorium · 0 EMI</div>
        <div class="cf-note hol-n mono">due date on a holiday → next working day</div>
      </div>
      <div class="a s-panel nb-flt" data-in="3" data-zone="3" style="${P(494, 196, 442, 240)}">
        <div class="s-h">Filters · PySpark · parallel groups</div>
        <div class="pool"><span class="mono">loans in pool</span><b class="pool-n">20,000</b></div>
        <div class="rule pop" style="--d:.4s"><span class="s-chip">holding period ≥ 6 months</span><i class="imp" style="--w:72%"></i><em class="mono">−3,600</em></div>
        <div class="rule pop" style="--d:1.1s"><span class="s-chip">loan cycle ≥ 2</span><i class="imp" style="--w:30%"></i><em class="mono">−1,500</em></div>
        <div class="rule pop" style="--d:1.8s"><span class="s-chip">age 21–60</span><i class="imp" style="--w:14%"></i><em class="mono">−700</em></div>
        <div class="s-cap">impact per rule · group vs one-by-one</div>
      </div>`;
    },
    onStep(k, cv, sc) {
      const n = cv.querySelector('.pool-n');
      if (!n) return;
      if (k < 3) n.textContent = '20,000';
      else if (k > 3 || sc.reduced) n.textContent = '14,200';
      else {
        n.textContent = '20,000';
        [['16,400', 700], ['14,900', 1400], ['14,200', 2100]].forEach(([v, t]) => sc.later(() => { n.textContent = v; n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick'); }, t));
      }
    }
  };

  /* ---------------------------------------------------------------- 04 · ENGINEERING COPILOT */
  SCENES.copilot = {
    W: 960, H: 460,
    steps: [
      { t: 'Spec in', c: 'A long customer specification arrives and is split into individual requirements.' },
      { t: 'Agent graph', c: 'For each requirement the agent graph expands the query, searches for evidence, reasons and decides, saving a checkpoint after every node.', ms: 3600 },
      { t: 'Verdicts', c: 'Each requirement gets Compliant, Deviation or Exception, linked to the evidence behind it.' },
      { t: 'Diagram', c: 'An engineering diagram is tiled; symbols are detected and labelled.' },
      { t: 'Ask', c: 'Questions about the diagram are answered with the region highlighted.' },
      { t: 'Human review', c: 'Low-confidence items go to a reviewer before anything reaches integration.' }
    ],
    html() {
      const reqs = [['Switchboard rated 4000 A', 'ok', 'Compliant ✓'], ['Enclosure IP54', 'warn', 'Deviation ⚠'], ['Copper busbars', 'ok', 'Compliant ✓'], ['Front access only', 'ok', 'Compliant ✓'], ['UPS backup 15 min', 'bad', 'Exception ✖'], ['Form 4b segregation', 'ok', 'Compliant ✓']];
      const rows = reqs.map(([t, c, v], i) => `<div class="a cp-req" data-in="1" style="${P(132, 28 + i * 40, 300, 34)}--d:${(0.2 + i * 0.12).toFixed(2)}s"><b class="mono">R${i + 1}</b><span>${t}</span><em class="vd ${c}" data-in="3" style="--d:${(0.15 + i * 0.18).toFixed(2)}s">${v}</em></div>`).join('');
      const nodes = [['Expand', 8, 34], ['Search', 108, 34], ['Reason', 108, 140], ['Decide', 8, 140]]
        .map(([t, x, y], i) => `<div class="cp-n" style="left:${x}px;top:${y}px;--k:${i}"><b class="mono">${String(i + 1).padStart(2, '0')}</b>${t}<span class="ck mono">⛁ ckpt</span></div>`).join('');
      return `
      <div class="a s-doc cp-spec" data-in="1" data-zone="1" style="${P(24, 28, 96, 134)}"><b class="mono">SPEC</b><span class="mono">60 pp · synthetic</span>${rep(6, () => '<div class="s-ln"></div>')}</div>
      ${rows}
      <div class="a s-panel cp-graph" data-in="2" data-zone="2 3" style="${P(448, 24, 196, 224)}">
        <div class="s-h">Agent graph · checkpointed</div>
        <svg class="cp-wires" viewBox="0 0 196 224" aria-hidden="true"><path d="M88 62 H108"/><path d="M148 90 V140"/><path d="M108 168 H88"/><path d="M48 140 V90"/></svg>
        ${nodes}
      </div>
      <div class="a s-panel cp-ev" data-in="3" data-zone="3" style="${P(132, 274, 300, 78)}--d:.9s">
        <div class="s-h">R2 · evidence</div>
        <p>Product datasheet §4.2: enclosure rated <b>IP42</b>. Specification requires <b>IP54</b>.</p>
      </div>
      <div class="a s-panel cp-dia" data-in="4" data-zone="4 5" style="${P(660, 24, 276, 280)}">
        <div class="s-h">Single-line diagram · tiled</div>
        <svg viewBox="0 0 256 232" aria-hidden="true">
          <g class="tiles">${rep(9, (i) => `<rect x="${4 + (i % 3) * 83}" y="${4 + ((i / 3) | 0) * 75}" width="81" height="73"/>`)}</g>
          <g class="dia">
            <circle cx="128" cy="30" r="14"/><circle cx="128" cy="50" r="14"/>
            <line x1="128" y1="64" x2="128" y2="96"/><line class="bus" x1="22" y1="98" x2="234" y2="98"/>
            ${[56, 128, 200].map((x) => `<line x1="${x}" y1="98" x2="${x}" y2="122"/><rect x="${x - 9}" y="122" width="18" height="18"/><line x1="${x - 9}" y1="140" x2="${x + 9}" y2="122"/><line x1="${x}" y1="140" x2="${x}" y2="186"/><path d="M${x - 6} 180 L${x} 190 L${x + 6} 180"/>`).join('')}
          </g>
          <g class="sym" style="--k:0"><rect x="108" y="10" width="40" height="60" rx="3"/><text x="152" y="22">transformer</text></g>
          <g class="sym" style="--k:1"><rect x="16" y="91" width="224" height="14" rx="3"/><text x="18" y="86">busbar</text></g>
          ${[56, 128, 200].map((x, i) => `<g class="sym brk" data-lit="5" style="--k:${2 + i}"><rect x="${x - 15}" y="116" width="30" height="30" rx="3"/><text x="${x - 16}" y="160">breaker</text></g>`).join('')}
        </svg>
      </div>
      <div class="a s-panel cp-chat" data-in="5" data-zone="5" style="${P(660, 316, 276, 120)}">
        <div class="q">How many outgoing breakers are on the main busbar?</div>
        <div class="a2 pop" style="--d:.8s"><b>3</b> · highlighted on the diagram</div>
      </div>
      <div class="a s-panel cp-rev" data-in="6" data-zone="6" style="${P(24, 366, 408, 70)}">
        <div class="s-h">Review queue</div>
        <div class="rv-track mono"><span>R5 · low confidence</span><i>→</i><span>👤 reviewer</span><i>→</i><span class="ok">approved ✓</span><i>→</i><span>integration</span></div>
        <b class="rv-dot"></b>
      </div>`;
    }
  };

  /* ---------------------------------------------------------------- 05 · HEALTH INSURER */
  SCENES.health = {
    W: 960, H: 460,
    steps: [
      { t: 'Fax in', c: 'A prior-authorization fax arrives: noisy, skewed, partly handwritten. Synthetic sample: fake names and IDs.' },
      { t: 'Sections', c: 'The page is deskewed and split into sections: member, requesting provider, servicing provider, facility and service.' },
      { t: 'Per-section extraction', c: 'Each section has its own prompt with inclusion and exclusion rules. Values come back with their boxes, and the secondary ID is ignored.', ms: 3600 },
      { t: 'Rules', c: 'Domain rules and post-processing: ID format checks, name clean-up, servicing kept apart from requesting.' },
      { t: 'Touch level', c: 'The document is scored by how much human correction it needs. This one is low-touch: one field to confirm.' },
      { t: 'Dashboard', c: 'Per-field accuracy against control data, and the touch-level mix the client can track.' }
    ],
    html() {
      const sec = (top, h, label, inner) => `<div class="hl-sec" style="top:${top}px;height:${h}px"><span class="hl-lab mono">${label}</span>${inner}</div>`;
      const box = (top, h, label, d) => `<div class="hl-box" data-in="2" style="top:${top - 4}px;height:${h + 8}px;--d:${d}s"><span class="mono">${label}</span></div>`;
      const row = (k, v, extra, d, attrs = '') => `<div class="hx pop" style="--d:${d}s" ${attrs}><span class="mono k">${k}</span><span class="v">${v}</span>${extra || ''}</div>`;
      return `
      <div class="a s-doc hl-fax" data-in="1" style="${P(36, 22, 404, 416)}">
        <div class="hl-head mono"><span>FAX ▸ 03/14 09:12</span><span>PRIOR AUTHORIZATION REQUEST</span><span>p.1/2</span></div>
        ${sec(44, 92, 'MEMBER', '<div class="hl-f"><span>Name</span><b class="hand">DOE, JOHN A</b></div><div class="hl-f"><span>Member ID</span><b>XYZ123456789</b></div><div class="hl-f"><span>Secondary ID</span><b>SEC-55-0192</b></div><div class="hl-f"><span>DOB</span><b class="hand">04/12/1980</b></div>')}
        ${sec(146, 50, 'REQUESTING PROVIDER', '<div class="hl-f"><span>Name</span><b>Dr. A. Smith · PRV-2231</b></div>')}
        ${sec(206, 50, 'SERVICING PROVIDER', '<div class="hl-f"><span>Name</span><b>Lakeside Imaging Ctr · PRV-4410</b></div>')}
        ${sec(266, 42, 'FACILITY', '<div class="hl-f"><span>Site</span><b>Lakeside Imaging, Unit 2</b></div>')}
        ${sec(318, 58, 'SERVICE', '<div class="hl-f"><span>Request</span><b>MRI lumbar spine · ICD-10 M54.5</b></div><div class="hl-f"><span></span><b class="mono">☐ Urgent &nbsp; ☑ Routine</b></div>')}
        <div class="hl-sign hand">A. Smith</div>
        ${box(44, 92, 'member', 0.1)}${box(146, 50, 'requesting', 0.3)}${box(206, 50, 'servicing', 0.5)}${box(266, 42, 'facility', 0.7)}${box(318, 58, 'service', 0.9)}
        <div class="hl-grain"></div>
      </div>
      <div class="a hl-stamp" data-in="5" style="${P(214, 268)}">LOW-TOUCH<small>1 field to confirm</small></div>

      <div class="a s-panel hl-out" data-in="3" data-out="6" style="${P(476, 22, 460, 416)}">
        <div class="s-h">Extracted · one prompt per section</div>
        ${row('member.name', '<span class="nm"><span class="o">DOE, JOHN A</span><b class="n">John Doe</b></span>', '<em class="bd" data-in="4">clean-up</em>', 0.15, 'data-lit="4"')}
        ${row('member.id', 'XYZ123456789', '<em class="bd ok">primary ✓</em><em class="bd" data-in="4" style="--d:.2s">format ✓</em>', 0.35)}
        ${row('member.secondary_id', '<s>SEC-55-0192</s>', '<em class="bd mute">ignored · secondary ID</em>', 0.55, 'data-x="ign"')}
        ${row('member.dob', '04/12/1980', '<em class="bd mute">handwritten</em><em class="bd warn" data-in="5">confirm 👤</em>', 0.75)}
        ${row('requesting.provider', 'Dr. A. Smith', '', 0.95)}
        ${row('servicing.provider', 'Lakeside Imaging Ctr', '<em class="bd" data-in="4" style="--d:.4s">≠ requesting</em>', 1.15)}
        ${row('service.diagnosis', 'ICD-10 M54.5', '', 1.35)}
      </div>
      <div class="a s-panel hl-dash" data-in="6" style="${P(476, 22, 460, 416)}">
        <div class="s-h">Per-field accuracy vs control set · illustrative</div>
        ${['member.id', 'member.name', 'requesting.provider', 'servicing.provider', 'service.diagnosis', 'member.dob'].map((f, i) => `<div class="db-row"><span class="mono">${f}</span><i style="--w:${[92, 88, 84, 80, 86, 70][i]}%;--d:${(0.1 + i * 0.12).toFixed(2)}s"></i></div>`).join('')}
        <div class="s-h" style="margin-top:18px">Touch-level mix · illustrative</div>
        <div class="tl-bar"><i class="no" style="--w:46%"></i><i class="lo" style="--w:30%"></i><i class="one" style="--w:16%"></i><i class="hi" style="--w:8%"></i></div>
        <div class="tl-leg mono"><span class="no">no-touch</span><span class="lo">low</span><span class="one">one</span><span class="hi">high</span></div>
      </div>`;
    }
  };

  /* ---------------------------------------------------------------- 06 · PLATFORM EVOLUTION */
  SCENES.platform = {
    W: 960, H: 460,
    steps: [
      { t: '2022 · Forms', c: 'Form extraction with per-field models: key-value pairs found and read. I started on the UI, then moved to model work.' },
      { t: '2022–23 · Templates', c: 'Template-based extraction: tables with DETR, checkboxes with VGG16, object detection.' },
      { t: '2023 · General IDP', c: 'General-purpose extraction: handwriting, faces and QR codes, behind a FastAPI backend.' },
      { t: 'Checkbox detector', c: 'No public dataset had checkboxes. I built one, fixed the annotation bugs, and trained a Faster R-CNN detector with a separate state model.' },
      { t: '2024–25 · Agentic', c: 'Layout analysis, an agentic page filter, key-values, tables and checkboxes in parallel, and LLM / VLM extraction served on Triton and vLLM.', ms: 3800 }
    ],
    html() {
      const eras = [['2022', 'Forms'], ['2022–23', 'Templates'], ['2023', 'General IDP'], ['mid-2023', 'Checkbox detector'], ['2024–25', 'Agentic']];
      const eraList = eras.map(([y, t], i) => `<div class="a pf-era" data-on="${i + 1}" data-lit="${i + 2}" style="${P(24, 30 + i * 70, 164, 58)}"><b class="mono">${y}</b><span>${t}</span></div>`).join('');
      const out = (n, lines) => `<div class="a s-panel pf-out" data-in="${n}" data-out="${n + 1}" style="${P(728, 30, 208, 330)}"><div class="s-h">output.json</div><pre class="mono">${lines}</pre></div>`;
      const tick = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0];
      return `
      ${eraList}
      <div class="a s-doc pf-doc pf-form" data-in="1" data-out="2" style="${P(212, 30, 492, 330)}">
        <div class="pf-title mono">CLAIM FORM · synthetic</div>
        <div class="pf-f"><span>Name</span><b class="hand fxb" style="--d:.5s">John Doe</b></div>
        <div class="pf-f"><span>Date</span><b class="fxb" style="--d:.8s">03/14/2022</b></div>
        <div class="pf-f"><span>Policy no.</span><b class="fxb" style="--d:1.1s">P-20931</b></div>
        <div class="pf-f"><span>Signature</span><b class="hand fxb" style="--d:1.4s">J. Doe</b></div>
      </div>
      <div class="a s-doc pf-doc pf-inv" data-in="2" data-out="3" style="${P(212, 30, 492, 330)}">
        <div class="pf-title mono">INVOICE #4471 · synthetic</div>
        <div class="pf-table fxb" style="--d:.4s"><span class="lbl mono">table · DETR</span>${rep(4, (r) => `<div class="tr">${rep(3, () => '<i></i>')}</div>`)}</div>
        <div class="pf-cbs"><span class="cb fxb" style="--d:1s">☑ Paid<span class="lbl mono">checked</span></span><span class="cb fxb" style="--d:1.25s">☐ Pending<span class="lbl mono">unchecked</span></span><span class="mono pf-by">checkbox · VGG16</span></div>
      </div>
      <div class="a s-doc pf-doc pf-id" data-in="3" data-out="4" style="${P(212, 30, 492, 330)}">
        <div class="pf-title mono">ID-STYLE DOCUMENT · synthetic</div>
        <div class="pf-photo fxb" style="--d:.4s"><span class="lbl mono">face</span></div>
        <div class="pf-qr fxb" style="--d:.8s">${rep(25, (i) => `<i class="${[0, 2, 4, 6, 8, 10, 12, 13, 15, 17, 19, 21, 22, 24].includes(i) ? 'on' : ''}"></i>`)}<span class="lbl mono">qr</span></div>
        <div class="pf-hw hand fxb" style="--d:1.2s">J. Doe<span class="lbl mono">handwriting</span></div>
        <div class="pf-lines"><div class="s-ln" style="width:90%"></div><div class="s-ln" style="width:70%"></div><div class="s-ln" style="width:80%"></div></div>
      </div>
      <div class="a s-doc pf-doc pf-scan" data-in="4" data-out="5" style="${P(212, 30, 492, 330)}">
        <div class="pf-title mono">SCANNED FORM · noisy · synthetic</div>
        <div class="pf-cgrid">${tick.map((t, i) => `<span class="cbx ${t ? 't' : ''}" style="--k:${i}"><i></i><u></u><em class="mono">${t ? 'ticked' : 'empty'}</em></span>`).join('')}</div>
        <div class="pf-note mono">own dataset · Faster R-CNN + checkbox-state model · FastAPI</div>
      </div>
      <div class="a pf-ag" data-in="5" style="${P(212, 30, 492, 330)}">
        <div class="pf-pages"><i></i><i></i><i class="x"></i></div>
        <div class="pf-st st1 mono">layout</div>
        <div class="pf-st st2 mono">page filter · agent<small>2 of 3 pages kept</small></div>
        <div class="pf-lanes">${['key-values', 'tables', 'checkboxes'].map((l, i) => `<div style="--k:${i}"><span class="mono">${l}</span><i></i></div>`).join('')}</div>
        <div class="pf-llm"><b>LLM / VLM extraction</b><span class="mono">served on Triton · vLLM</span></div>
      </div>
      ${out(1, '{\n  "name": "John Doe",\n  "date": "03/14/2022",\n  "policy_no": "P-20931",\n  "signature": true\n}')}
      ${out(2, '{\n  "table": "4 × 3",\n  "paid": true,\n  "pending": false\n}')}
      ${out(3, '{\n  "face": "found",\n  "qr": "decoded",\n  "handwriting": "J. Doe"\n}')}
      ${out(4, '{\n  "checkboxes": 12,\n  "ticked": 5,\n  "empty": 7\n}')}
      <div class="a s-panel pf-out" data-in="5" style="${P(728, 30, 208, 330)}"><div class="s-h">output.json</div><pre class="mono">{\n  "pages": 3,\n  "kept": 2,\n  "lanes": ["kv", "tables",\n            "checkboxes"],\n  "served_by": "vLLM"\n}</pre></div>
      <div class="a pf-time" style="${P(24, 394, 912)}"><div class="pf-fill"></div>${eras.map(([y], i) => `<span data-lit="${i + 1}" class="mono" style="left:${[0, 23, 46, 69, 90][i]}%">${y}</span>`).join('')}</div>`;
    }
  };

  /* ---------------------------------------------------------------- 07 · PRIOR-AUTH PLATFORM: PRODUCTION READINESS */
  SCENES.pbm = {
    W: 960, H: 460,
    steps: [
      { t: '50-file run', c: 'A test run of prior-auth faxes across many payer templates, printed and handwritten. Synthetic sample.' },
      { t: 'Page filter', c: 'An agentic page filter keeps the request pages and drops cover sheets and notes.' },
      { t: 'Extract', c: 'A quantized vision-language model reads member, prescriber, provider, drug, strength, quantity and NPI.' },
      { t: 'Rules', c: 'Prompt rules settle the look-alikes: prescriber vs provider, member-header priority, strength vs quantity, NPI format.' },
      { t: 'Confidence', c: 'Each field’s confidence comes from token log-probabilities, so weak fields go to review.' },
      { t: 'Engine', c: 'vLLM and transformers compared on the same 20 files. vLLM was more accurate, so serving moved to vLLM.', ms: 3600 },
      { t: 'Operate', c: 'Per-PDF timing, a cost sheet, a managed serverless GPU budget, load tests and Grafana + Prometheus. A 7–10% accuracy drop was found and fixed.', ms: 3800 }
    ],
    html() {
      const faxes = ['A', 'B', 'C', 'D', 'E'].map((t, i) => `<i class="fx7${i === 1 || i === 4 ? ' drop' : ''}" data-lit="2" style="left:${i * 52}px;--k:${i}"><b class="mono">${t}</b><u></u><u></u><u></u><em class="mono" data-in="2" style="--d:${(0.5 + i * 0.1).toFixed(2)}s">${i === 1 || i === 4 ? 'cover' : '✓'}</em></i>`).join('');
      const rows = [
        ['member', 'Jane Roe', 'header: Patient → member', 96],
        ['prescriber', 'Dr. R. Patel', 'prescriber ≠ provider', 91],
        ['provider', 'City Clinic', '', 89],
        ['drug', 'Atorvastatin', '', 97],
        ['strength', '20 mg', 'strength, not quantity', 93],
        ['quantity', '30 tablets', '', 64],
        ['npi', '1234567890', 'format ✓', 98]
      ].map(([k, v, rule, w], i) => `<div class="pr7 pop" style="--d:${(0.15 + i * 0.12).toFixed(2)}s"><span class="mono k">${k}</span><span class="v">${v}</span>${rule ? `<em class="rb" data-in="4" style="--d:${(0.2 + i * 0.12).toFixed(2)}s">${rule}</em>` : ''}<i class="cb7${w < 70 ? ' low' : ''}" data-in="5" style="--w:${w}%;--d:${(0.1 + i * 0.1).toFixed(2)}s"></i>${w < 70 ? '<em class="rv7" data-in="5" style="--d:1s">review 👤</em>' : ''}</div>`).join('');
      const log = [['run 1 · 50 files queued', 1], ['page filter · cover sheets dropped', 2], ['VLM · AWQ-quantized · on GPU', 3], ['rules · 4 applied', 4], ['confidence · token log-probs', 5], ['engine · vLLM (measured)', 6], ['monitor · Grafana + Prometheus', 7]]
        .map(([t, n]) => `<div class="lg7" data-in="${n}"><span>›</span>${t}</div>`).join('');
      return `
      <div class="a s7-head mono" style="${P(24, 20, 260)}">50-file test run · synthetic faxes</div>
      <div class="a fx7-row" data-in="1" data-zone="1 2" style="${P(24, 46, 260, 130)}">${faxes}</div>
      <div class="a s-cap" data-in="2" data-zone="2" style="${P(24, 186, 260)}--d:.6s">agentic page filter · 3 of 5 pages kept</div>
      <div class="a s-panel lg7-box mono" data-in="1" style="${P(24, 222, 260, 214)}"><div class="s-h">Run log</div>${log}</div>
      <div class="a s-panel ex7" data-in="3" data-zone="3 4 5" style="${P(304, 20, 320, 416)}"><div class="s-h">Extract · quantized vision-language model</div>${rows}</div>
      <div class="a s-panel sv7" data-in="6" data-zone="6" style="${P(644, 20, 292, 196)}">
        <div class="s-h">Same 20 files · two engines</div>
        <div class="eng"><span class="mono">transformers</span><i style="--w:62%"></i></div>
        <div class="eng hi"><span class="mono">vLLM</span><i style="--w:86%;--d:.5s"></i></div>
        <div class="s-cap" style="margin-top:10px">accuracy · illustrative bars</div>
        <div class="sw7 mono" data-in="6" style="--d:1.4s">more accurate → serving moved to vLLM ✓</div>
      </div>
      <div class="a s-panel op7" data-in="7" data-zone="7" style="${P(644, 230, 292, 206)}">
        <div class="s-h">Operate</div>
        <svg class="spark" viewBox="0 0 260 70" aria-hidden="true"><path class="sp-base" d="M0 20 H260"/><path class="sp" d="M0 22 L40 20 L80 21 L110 24 L130 44 L150 46 L170 40 L190 24 L220 21 L260 20"/><circle class="sp-dot" cx="148" cy="46" r="4"/></svg>
        <div class="dip mono">7–10% accuracy drop · found and fixed</div>
        <div class="ops">${['per-PDF timing', 'cost sheet', 'GPU budget', 'load tests', 'Grafana + Prometheus'].map((t, i) => `<span class="s-chip pop" style="--d:${(0.9 + i * 0.12).toFixed(2)}s">${t}</span>`).join('')}</div>
      </div>`;
    }
  };

  /* ---------------------------------------------------------------- 08 · TENDER INTELLIGENCE (PILOT) */
  SCENES.tender = {
    W: 960, H: 460,
    steps: [
      { t: 'Itemise', c: 'An 800+ page RFP and its amendments are split into pages and items. Synthetic sample.' },
      { t: 'Index', c: 'A small layout model finds the structure, vision-language OCR reads each page, and page and element data goes into Elasticsearch.' },
      { t: 'Decompose + search', c: 'The question becomes 3–5 sub-queries. Hybrid BM25 + vector search runs for each, then a dedicated reranker orders the results.', ms: 3800 },
      { t: 'Answer + evidence', c: 'The answer carries its page and element id, so a reviewer can check the source.' },
      { t: 'Diff', c: 'Two document ids in: element-level changes and a business-impact summary out.' },
      { t: 'Risks', c: 'Pages are cross-checked against the specifications and risks are flagged for review.' }
    ],
    html() {
      const tiles = rep(24, (i) => `<i style="--k:${i}"></i>`);
      const els = [['title', 'p.12'], ['clause 7.3.2', 'p.412'], ['table', 'p.233'], ['spec row', 'p.233'], ['drawing', 'p.590']].map(([t, pg], i) => `<span class="s-chip pop" style="--d:${(0.4 + i * 0.15).toFixed(2)}s">${t}<em>${pg}</em></span>`).join('');
      const res = [['p.88 · mentions “delay”', 0], ['p.412 · clause 7.3.2', 1], ['p.17 · glossary', 0], ['p.415 · LD cap', 1], ['p.301 · schedule', 0]]
        .map(([t, top], i) => `<div class="rs8${top ? ' top' : ''}" style="--k:${i}"><span class="mono">${t}</span><i></i></div>`).join('');
      return `
      <div class="a s-doc dc8" data-in="1" data-zone="1" style="${P(48, 30, 200, 186)}">
        <div class="amd a2 mono">Amd 2</div><div class="amd a1 mono">Amd 1</div>
        <div class="rfp"><b>RFP</b><span class="mono">800+ pages · synthetic</span>${rep(6, () => '<div class="s-ln"></div>')}</div>
      </div>
      <div class="a it8" data-in="1" data-zone="1 2" style="${P(24, 236, 250, 200)}--d:.9s"><div class="s-h">Itemised · pages → items</div><div class="tl8">${tiles}</div></div>
      <div class="a s-panel ix8" data-in="2" data-zone="2" style="${P(294, 20, 330, 200)}"><div class="s-h">Layout → VLM OCR → page &amp; element index</div><div class="els">${els}</div><div class="es mono">Elasticsearch · BM25 + vectors</div></div>
      <div class="a s-panel q8" data-in="3" data-zone="3" style="${P(294, 234, 330, 202)}">
        <div class="qq">What are the liquidated damages for delay?</div>
        <div class="sq">${['LD clause', 'delay penalty rate', 'LD cap'].map((t, i) => `<span class="s-chip pop" style="--d:${(0.3 + i * 0.15).toFixed(2)}s">${t}</span>`).join('')}</div>
        <div class="rsl">${res}</div>
        <div class="s-cap rr mono">hybrid search → dedicated reranker</div>
      </div>
      <div class="a an8" data-in="4" data-zone="4" style="${P(644, 20, 292, 150)}"><div class="s-h">Answer</div><b>0.5% per week of delay, capped at 10%</b><span class="mono">p.412 · clause 7.3.2 ✓ evidence</span></div>
      <div class="a s-panel df8" data-in="5" data-zone="5" style="${P(644, 184, 292, 124)}"><div class="s-h">Amendment 2 vs original</div>
        <div class="dr pop" style="--d:.2s"><span>LD cap</span><s>10%</s><b>7.5%</b></div>
        <div class="dr pop" style="--d:.45s"><span>Completion</span><s>18 mo</s><b>16 mo</b></div>
        <div class="imp mono pop" style="--d:.8s">impact: tighter schedule, lower penalty cap</div></div>
      <div class="a s-panel rk8" data-in="6" data-zone="6" style="${P(644, 322, 292, 114)}"><div class="s-h">Spec cross-check</div>
        <div class="rr8 pop" style="--d:.2s"><em>⚠</em>cable cross-section below spec<span class="mono">p.233</span></div>
        <div class="rr8 pop" style="--d:.5s"><em>⚠</em>warranty shorter than required<span class="mono">p.501</span></div></div>`;
    }
  };

  /* ---------------------------------------------------------------- generic project flow
     Projects without a hand-built scene get one generated from their data: p.flow = { title, steps: [{ t, c, o, human, warn }] }.
     A token travels station to station, each station lights up and leaves its output chip, and a log keeps the trail. */
  function flowScene(p) {
    const st = p.flow.steps, n = st.length, W = 960, H = 460, x0 = 92, x1 = 868, TY = 178;
    const X = (i) => Math.round(n > 1 ? x0 + (i * (x1 - x0)) / (n - 1) : (x0 + x1) / 2);
    const kind = (s) => (s.human ? ' hum' : s.warn ? ' warn' : '');
    const nn = (i) => String(i + 1).padStart(2, '0');
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return {
      W, H, gen: true,
      steps: st.map((s) => ({ t: s.t, c: s.c })),
      html() {
        const segs = st.slice(1).map((s, i) => `<line class="fl-seg" data-lit="${i + 2}" x1="${X(i) + 36}" y1="${TY}" x2="${X(i + 1) - 36}" y2="${TY}"/>`).join('');
        return `
        <div class="a fl-head mono" style="${P(40, 26, 880)}"><span>pipeline · <b>${esc(p.flow.title)}</b></span><span>synthetic sample · ${n} steps</span></div>
        <svg class="a fl-svg" style="${P(0, 0, W, H)}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><line class="fl-base" x1="${X(0)}" y1="${TY}" x2="${X(n - 1)}" y2="${TY}"/>${segs}</svg>
        ${st.map((s, i) => `
          <div class="a fl-node${kind(s)}" data-lit="${i + 1}" data-zone="${i + 1}" style="${P(X(i) - 34, TY - 34)}"><span>${s.human ? '👤' : nn(i)}</span></div>
          <div class="a fl-lab" data-lit="${i + 1}" style="${P(X(i) - 66, TY + 48, 132)}">${esc(s.t)}</div>
          <div class="a fl-out pop${kind(s)}" data-in="${i + 1}" style="${P(X(i) - 68, TY + 92, 136)}--d:.25s"><span>${esc(s.o || '✓')}</span></div>`).join('')}
        <div class="a fl-tok off" style="${P(X(0) - 13, TY - 84)}" aria-hidden="true"></div>
        <div class="a fl-log mono" style="${P(40, 332, 880, 104)}">${st.map((s, i) => `<div class="fl-ln${kind(s)}" data-in="${i + 1}"><b>›</b> ${nn(i)} <em>${esc(s.t.toLowerCase())}</em> · ${esc(s.o || 'done')} <b>${s.human ? '· human' : s.warn ? '· check' : '✓'}</b></div>`).join('')}</div>`;
      },
      onStep(k, cv) {
        const tok = cv.querySelector('.fl-tok');
        if (!tok) return;
        tok.classList.toggle('off', k < 1);
        if (k >= 1) tok.style.left = X(k - 1) - 13 + 'px';
      }
    };
  }

  /* ---------------------------------------------------------------- engine */
  class Scene {
    constructor(host, id, opts = {}) {
      this.host = host; this.id = id; this.def = SCENES[id]; this.opts = opts;
      this.W = this.def.W || 960; this.H = this.def.H || 460;
      this.n = this.def.steps.length; this.step = -1; this.timer = null; this.timers = []; this.playing = false;
      this.reduced = !!opts.reduced;
      host.classList.add('scene-host');
      host.innerHTML = `<div class="scn-wrap"><div class="scn scn-${id}${this.def.gen ? ' scn-flow' : ''}" style="width:${this.W}px;height:${this.H}px">${this.def.html()}</div></div>`;
      this.wrap = host.firstElementChild; this.cv = this.wrap.firstElementChild;
      if (this.reduced) this.cv.classList.add('rm');
      this.els = [...this.cv.querySelectorAll('[data-in],[data-out],[data-lit],[data-on],[data-zone]')].map((el) => ({
        el,
        inn: el.dataset.in ? +el.dataset.in : null,
        out: el.dataset.out ? +el.dataset.out : null,
        lit: el.dataset.lit ? +el.dataset.lit : null,
        on: el.dataset.on ? el.dataset.on.split(/\s+/).map(Number) : null,
        zone: el.dataset.zone ? el.dataset.zone.split(/\s+/).map(Number) : null
      }));
      this.fit = this.fit.bind(this);
      if ('ResizeObserver' in window) { this.ro = new ResizeObserver(() => this.fit()); this.ro.observe(host); }
      else window.addEventListener('resize', this.fit);
      this.fit();
      this.go(opts.start || 0);
    }
    fit() {
      const w = this.host.clientWidth || this.W;
      let s = Math.min(this.opts.maxScale || 1.3, w / this.W);
      if (this.opts.fitHeight) s = Math.min(s, this.opts.fitHeight() / this.H);
      s = Math.max(s, this.opts.minScale || 0.05);
      this.scale = s;
      this.cv.style.transform = `scale(${s})`;
      this.wrap.style.width = this.W * s + 'px';
      this.wrap.style.height = this.H * s + 'px';
    }
    go(k) {
      k = Math.max(0, Math.min(this.n, k | 0));
      this.clearTimers();
      this.step = k;
      const cv = this.cv;
      cv.dataset.step = k;
      for (let i = 1; i <= this.n; i++) cv.classList.toggle('s' + i, i <= k);
      for (const o of this.els) {
        if (o.inn !== null || o.out !== null) o.el.classList.toggle('v', (o.inn === null || k >= o.inn) && (o.out === null || k < o.out));
        if (o.lit !== null) o.el.classList.toggle('lit', k >= o.lit);
        if (o.on) o.el.classList.toggle('on', o.on.includes(k));
        if (o.zone) o.el.classList.toggle('focus', o.zone.includes(k));
      }
      if (this.def.onStep) this.def.onStep(k, cv, this);
      if (this.opts.onStep) this.opts.onStep(k, this);
    }
    later(fn, ms) { this.timers.push(setTimeout(fn, ms)); }
    clearTimers() { this.timers.forEach(clearTimeout); this.timers = []; }
    dur(k) {
      const s = this.def.steps[k - 1] || {};
      if (this.opts.fast) return s.fast || Math.max(1500, (s.ms || 3200) * 0.55);
      return s.ms || 3200;
    }
    play() {
      if (this.reduced) { this.go(this.n); return; }
      this.playing = true;
      clearTimeout(this.timer);
      if (this.step >= this.n) this._restart();
      else if (this.step === 0) this.timer = setTimeout(() => { this.go(1); this._sched(); }, 350);
      else this._sched();
      if (this.opts.onPlay) this.opts.onPlay(true);
    }
    _restart() {
      this.go(0);
      this.timer = setTimeout(() => { if (!this.playing) return; this.go(1); this._sched(); }, 500);
    }
    _sched() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.playing) return;
        if (this.step < this.n) { this.go(this.step + 1); this._sched(); }
        else if (this.opts.loop) this.timer = setTimeout(() => { if (this.playing) this._restart(); }, this.opts.loopPause || 1600);
        else { this.playing = false; if (this.opts.onPlay) this.opts.onPlay(false); }
      }, this.dur(this.step));
    }
    pause() { this.playing = false; clearTimeout(this.timer); if (this.opts.onPlay) this.opts.onPlay(false); }
    destroy() { this.pause(); this.clearTimers(); if (this.ro) this.ro.disconnect(); else window.removeEventListener('resize', this.fit); }
  }

  // every project with a flow and no hand-built scene gets a generated one
  (window.MORE || []).forEach((p) => { if (p.flow && !SCENES[p.id]) SCENES[p.id] = flowScene(p); });
  window.flowScene = flowScene;
  window.SCENES = SCENES;
  window.Scene = Scene;
})();
