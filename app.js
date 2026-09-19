/* ============================================================
   CodeJ-40404.github.io — 共享脚本
   主题切换 / 鼠标轨迹 / 代码雨 / 星空 / 打字机 / 博客加载 / 文章渲染
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= 主题管理 ================= */
  var THEMES = [
    { id: 'modern', name: 'MODERN', icon: 'fa-feather' },
    { id: 'star',   name: 'STAR',   icon: 'fa-star' },
    { id: 'cyber',  name: 'CYBER',  icon: 'fa-bolt' }
  ];
  var themeBtn = document.getElementById('theme-toggle');

  function currentTheme() { return root.dataset.theme || 'cyber'; }

  function applyTheme(id) {
    root.dataset.theme = id;
    try { localStorage.setItem('codej-theme', id); } catch (e) { /* 隐私模式等 */ }
    var t = THEMES.find(function (x) { return x.id === id; });
    if (themeBtn && t) {
      themeBtn.innerHTML = '<i class="fas ' + t.icon + '"></i> ' + t.name;
      themeBtn.title = '切换主题 → ' + THEMES[(THEMES.indexOf(t) + 1) % THEMES.length].name;
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var idx = THEMES.findIndex(function (t) { return t.id === currentTheme(); });
      applyTheme(THEMES[(idx + 1) % THEMES.length].id);
    });
  }
  applyTheme(THEMES.some(function (t) { return t.id === currentTheme(); }) ? currentTheme() : 'cyber');

  /* ================= 鼠标轨迹粒子 ================= */
  var trail = document.getElementById('trail');
  if (trail && !reduced) {
    var tctx = trail.getContext('2d');
    var TW, TH;
    function sizeTrail() { TW = trail.width = window.innerWidth; TH = trail.height = window.innerHeight; }
    sizeTrail();
    window.addEventListener('resize', sizeTrail);

    var TRAIL_COLORS = {
      cyber: ['#00f0ff', '#ff2a6d', '#00f0ff'],
      star: ['#b388ff', '#ffffff', '#82b1ff'],
      modern: ['#4f6ef7']
    };
    var TRAIL_SIZE = { cyber: 2.6, star: 2.2, modern: 1.6 };

    var parts = [];
    var lx = -1, ly = -1;

    window.addEventListener('mousemove', function (e) {
      if (lx >= 0) {
        var dx = e.clientX - lx, dy = e.clientY - ly;
        if (dx * dx + dy * dy < 9) return; // 距离过近不生成
      }
      lx = e.clientX; ly = e.clientY;
      var th = currentTheme();
      var cols = TRAIL_COLORS[th] || TRAIL_COLORS.cyber;
      for (var i = 0; i < 2; i++) {
        parts.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - (th === 'star' ? 0.4 : 0),
          life: 1,
          decay: 0.02 + Math.random() * 0.02,
          c: cols[Math.floor(Math.random() * cols.length)],
          r: (TRAIL_SIZE[th] || 2) * (0.6 + Math.random() * 0.8)
        });
      }
      if (parts.length > 240) parts.splice(0, parts.length - 240);
    });

    (function loopTrail() {
      requestAnimationFrame(loopTrail);
      var th = currentTheme();
      tctx.clearRect(0, 0, TW, TH);
      tctx.globalCompositeOperation = th === 'modern' ? 'source-over' : 'lighter';
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.97; p.vy *= 0.97;
        tctx.globalAlpha = p.life * (th === 'modern' ? 0.4 : 0.9);
        if (th !== 'modern') { tctx.shadowBlur = 12; tctx.shadowColor = p.c; }
        tctx.beginPath();
        tctx.arc(p.x, p.y, p.r, 0, 6.283);
        tctx.fillStyle = p.c;
        tctx.fill();
        tctx.shadowBlur = 0;
      }
      tctx.globalAlpha = 1;
    })();
  }

  /* ================= Matrix 代码雨（仅赛博朋克主题） ================= */
  var matrix = document.getElementById('matrix');
  if (matrix && !reduced) {
    var mctx = matrix.getContext('2d');
    var mCols, mDrops;
    var mChars = 'アイウエオカキクケコサシスセソ01<>{}[]();=+-*/#$%&'.split('');
    function sizeMatrix() {
      matrix.width = window.innerWidth;
      matrix.height = window.innerHeight;
      mCols = Math.floor(matrix.width / 16);
      mDrops = [];
      for (var i = 0; i < mCols; i++) mDrops.push(Math.random() * -100);
    }
    sizeMatrix();
    window.addEventListener('resize', sizeMatrix);

    var mLast = 0;
    (function loopMatrix(t) {
      requestAnimationFrame(loopMatrix);
      if (currentTheme() !== 'cyber') return;
      if (t - mLast < 50) return; // ~20fps
      mLast = t;
      mctx.fillStyle = 'rgba(5, 6, 10, 0.12)';
      mctx.fillRect(0, 0, matrix.width, matrix.height);
      mctx.font = '14px monospace';
      for (var i = 0; i < mCols; i++) {
        var ch = mChars[Math.floor(Math.random() * mChars.length)];
        mctx.fillStyle = Math.random() < 0.08 ? '#ff2a6d' : '#00f0ff';
        mctx.fillText(ch, i * 16, mDrops[i] * 16);
        if (mDrops[i] * 16 > matrix.height && Math.random() > 0.975) mDrops[i] = 0;
        mDrops[i]++;
      }
    })(0);
  }

  /* ================= 星空（仅星空主题） ================= */
  var stars = document.getElementById('stars');
  if (stars && !reduced) {
    var sctx = stars.getContext('2d');
    var starsArr = [], meteors = [];
    function sizeStars() {
      stars.width = window.innerWidth;
      stars.height = window.innerHeight;
      var n = Math.floor(stars.width * stars.height / 4500);
      starsArr = [];
      for (var i = 0; i < n; i++) {
        starsArr.push({
          x: Math.random() * stars.width,
          y: Math.random() * stars.height,
          r: 0.4 + Math.random() * 1.3,
          a: 0.3 + Math.random() * 0.7,
          sp: 0.5 + Math.random() * 1.5,
          ph: Math.random() * 6.28,
          c: Math.random() < 0.75 ? '#ffffff' : (Math.random() < 0.5 ? '#b388ff' : '#82b1ff')
        });
      }
    }
    sizeStars();
    window.addEventListener('resize', sizeStars);

    (function loopStars(t) {
      requestAnimationFrame(loopStars);
      if (currentTheme() !== 'star') return;
      sctx.clearRect(0, 0, stars.width, stars.height);
      for (var i = 0; i < starsArr.length; i++) {
        var s = starsArr[i];
        sctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(t * 0.001 * s.sp + s.ph));
        sctx.fillStyle = s.c;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r, 0, 6.283);
        sctx.fill();
      }
      sctx.globalAlpha = 1;
      // 流星
      if (Math.random() < 0.006 && meteors.length < 2) {
        meteors.push({
          x: stars.width * (0.15 + Math.random() * 0.7),
          y: -20,
          vx: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2),
          vy: 3 + Math.random() * 2,
          life: 1
        });
      }
      for (var j = meteors.length - 1; j >= 0; j--) {
        var m = meteors[j];
        m.x += m.vx; m.y += m.vy; m.life -= 0.012;
        if (m.life <= 0 || m.y > stars.height + 40) { meteors.splice(j, 1); continue; }
        var grad = sctx.createLinearGradient(m.x, m.y, m.x - m.vx * 10, m.y - m.vy * 10);
        grad.addColorStop(0, 'rgba(255,255,255,' + (0.9 * m.life) + ')');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        sctx.strokeStyle = grad;
        sctx.lineWidth = 2;
        sctx.beginPath();
        sctx.moveTo(m.x, m.y);
        sctx.lineTo(m.x - m.vx * 10, m.y - m.vy * 10);
        sctx.stroke();
      }
    })(0);
  }

  /* ================= 打字机（仅主页） ================= */
  var typingEl = document.getElementById('typing');
  if (typingEl) {
    if (reduced) {
      typingEl.textContent = 'i am codej-40404.';
    } else {
      var phrases = [
        'whoami --verbose',
        'i am codej-40404.',
        'building Chemical-World...',
        'g++ -O2 -o world main.cpp',
        'stay lazy. stay hungry.'
      ];
      var pi = 0, ci = 0, deleting = false;
      var tick = function () {
        var cur = phrases[pi];
        if (!deleting) {
          typingEl.textContent = cur.slice(0, ++ci);
          if (ci === cur.length) { deleting = true; return setTimeout(tick, 1600); }
          setTimeout(tick, 65 + Math.random() * 60);
        } else {
          typingEl.textContent = cur.slice(0, --ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 400); }
          setTimeout(tick, 30);
        }
      };
      tick();
    }
  }

  /* ================= 工具 ================= */
  function tagClass(tag) {
    return 'tag-' + String(tag || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /* ================= 博客列表（仅主页） ================= */
  var postList = document.getElementById('post-list');
  if (postList) {
    fetch('posts.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (posts) {
        posts.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
        postList.innerHTML = posts.map(function (p) {
          return '<a class="post" href="post.html?p=' + encodeURIComponent(p.slug) + '">' +
            '<span class="post-date">[' + p.date + ']</span>' +
            '<span class="post-title">' + p.title + '</span>' +
            '<span class="post-tag ' + tagClass(p.tag) + '">' + (p.tag || 'POST') + '</span>' +
            '</a>';
        }).join('');
      })
      .catch(function () {
        postList.innerHTML = '<div class="term-line">ERROR: 无法加载 posts.json — 请通过 HTTP 访问并确认文件已部署</div>';
      });
  }

  /* ================= 文章渲染（仅文章页） ================= */
  var contentEl = document.getElementById('post-content');
  if (contentEl) {
    if (window.marked) marked.setOptions({ breaks: true, gfm: true });
    var slug = new URLSearchParams(location.search).get('p');
    Promise.all([
      fetch('posts.json').then(function (r) { return r.json(); }),
      fetch('posts/' + encodeURIComponent(slug) + '.md').then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
    ]).then(function (res) {
      var posts = res[0], md = res[1];
      var meta = posts.find(function (p) { return p.slug === slug; }) || {};
      document.getElementById('post-title').textContent = meta.title || slug;
      document.getElementById('post-date').textContent = '[' + (meta.date || '') + ']';
      var tagEl = document.getElementById('post-tag');
      tagEl.textContent = meta.tag || 'POST';
      tagEl.className = 'post-tag ' + tagClass(meta.tag);
      contentEl.innerHTML = window.marked ? marked.parse(md) : md;
      document.title = (meta.title || slug) + ' // CodeJ-40404';
      if (window.hljs) {
        contentEl.querySelectorAll('pre code').forEach(function (b) { hljs.highlightElement(b); });
      }
      if (window.renderMathInElement) {
        renderMathInElement(contentEl, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
    }).catch(function () {
      contentEl.innerHTML =
        '<p>ERROR 404: 文章未找到。</p>' +
        '<p><a href="index.html#blog">&lt;&lt; 返回博客列表</a></p>';
    });
  }
})();
