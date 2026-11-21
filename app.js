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
    { id: 'cyber',  name: 'CYBER',  icon: 'fa-bolt' },
    { id: 'glass',  name: 'GLASS',  icon: 'fa-droplet' },
    { id: 'pixel',  name: '8BIT',   icon: 'fa-terminal' }
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
      modern: ['#4f6ef7'],
      glass: ['#2f7cf6', '#a855f7', '#7dd3fc'],
      pixel: ['#33ff66', '#ffb000', '#33ff66']
    };
    var TRAIL_SIZE = { cyber: 2.6, star: 2.2, modern: 1.6, glass: 2.0, pixel: 2.4 };

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

  /* ================= GitHub 统计（stats.json 同源渲染） ================= */
  var LANG_COLORS = {
    'C++': '#f34b7d', C: '#555555', Python: '#3572A5', JavaScript: '#f1e05a',
    TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', 'Jupyter Notebook': '#DA5B0B',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Shell: '#89e051',
    Markdown: '#083fa1', Lua: '#000080', Vue: '#41b883', 'C#': '#178600',
    CMake: '#DA3434', Makefile: '#427819', PowerShell: '#012456', Batchfile: '#C1F12E',
    MATLAB: '#e16737', GDScript: '#355570', Swift: '#F05138', Kotlin: '#A97BFF',
    Dart: '#00B4AB', PHP: '#4F5D95', Ruby: '#701516', 'Objective-C': '#438eff'
  };

  var statOverview = document.getElementById('stat-overview');
  if (statOverview) {
    fetch('stats.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (s) {
        var d = s.user || {}, c = s.contributions || {}, langs = s.langs || [];

        statOverview.innerHTML =
          '<div class="stat-nums">' +
          '<div><span class="k">REPOS</span><span class="n">' + (d.repos != null ? d.repos : '-') + '</span></div>' +
          '<div><span class="k">STARS</span><span class="n warm">' + (d.stars != null ? d.stars : '-') + '</span></div>' +
          '<div><span class="k">FOLLOWERS</span><span class="n hot">' + (d.followers != null ? d.followers : '-') + '</span></div>' +
          '</div>' +
          '<div class="stat-updated">UPDATED ' + (s.updated_at ? s.updated_at.slice(0, 10) : '-') + '</div>';

        var contribs = document.getElementById('stat-contribs');
        if (contribs) {
          contribs.innerHTML =
            '<div class="stat-nums">' +
            '<div><span class="k">THIS_YEAR</span><span class="n">' + (c.total != null ? c.total : '-') + '</span></div>' +
            '<div><span class="k">STREAK</span><span class="n warm">' + (c.currentStreak != null ? c.currentStreak : '-') + '<small style="font-size:.5em;color:#8b98a5;"> D</small></span></div>' +
            '<div><span class="k">LONGEST</span><span class="n hot">' + (c.longestStreak != null ? c.longestStreak : '-') + '<small style="font-size:.5em;color:#8b98a5;"> D</small></span></div>' +
            '</div>' +
            '<div class="stat-updated">// COMMITS / ISSUES / PRS</div>';
        }

        var langEl = document.getElementById('stat-langs');
        if (langEl) {
          var maxPct = langs.length ? Math.max.apply(null, langs.map(function (l) { return l.pct; })) : 1;
          langEl.innerHTML = langs.map(function (l) {
            var color = LANG_COLORS[l.name] || '#8b98a5';
            var w = Math.max(2, Math.round(l.pct / maxPct * 100));
            return '<div class="lang-row" style="--dot:' + color + '">' +
              '<div class="top"><span class="name">' + l.name + '</span><span class="pct">' + l.pct + '%</span></div>' +
              '<div class="lang-bar"><i style="width:' + w + '%"></i></div>' +
              '</div>';
          }).join('') || '<div class="stat-loading">NO DATA</div>';
        }
      })
      .catch(function () {
        var msg = '<div class="stat-error">stats.json 尚未生成<br>' +
          '首次由 GitHub Actions 自动生成（push 后约 1-2 分钟）<br>' +
          '若长时间未生成，请检查仓库 Actions 运行记录</div>';
        statOverview.innerHTML = msg;
        var c1 = document.getElementById('stat-contribs'); if (c1) c1.innerHTML = msg;
        var c2 = document.getElementById('stat-langs'); if (c2) c2.innerHTML = msg;
      });
  }

  /* ================= 互动电路（仅主页 ABOUT 区） ================= */
  var circuit = document.getElementById('circuit');
  if (circuit) {
    var traces = Array.prototype.slice.call(circuit.querySelectorAll('.circuit-trace'));
    var pads = Array.prototype.slice.call(circuit.querySelectorAll('.circuit-pad'));
    var vias = Array.prototype.slice.call(circuit.querySelectorAll('.circuit-via'));
    var powered = false;

    // 预采样走线坐标 + 记录长度（用于通电描线动画）
    traces.forEach(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { /* 不可见时忽略 */ }
      if (len > 0) p.style.setProperty('--len', len.toFixed(1));
      var pts = [];
      for (var d = 0; d <= len; d += 8) {
        var pt = p.getPointAtLength(d);
        pts.push([pt.x, pt.y]);
      }
      p._pts = pts;
    });

    // 滚动进入视野 → 通电
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            circuit.classList.add('powered');
            powered = true;
            io.disconnect();
          }
        });
      }, { threshold: 0.35 });
      io.observe(circuit);
    } else {
      circuit.classList.add('powered');
      powered = true;
    }

    // 鼠标靠近走线 → 点亮发光
    var mx = -9999, my = -9999, pending = false;
    var RADIUS = 110; // SVG 用户坐标单位

    function toSvgPoint(cx, cy) {
      var pt = circuit.createSVGPoint();
      pt.x = cx; pt.y = cy;
      var m = circuit.getScreenCTM();
      return m ? pt.matrixTransform(m.inverse()) : null;
    }

    function update() {
      pending = false;
      if (!powered) return;
      var sp = toSvgPoint(mx, my);
      if (!sp) return;
      var px = sp.x, py = sp.y;

      traces.forEach(function (path) {
        var best = Infinity, pts = path._pts || [];
        for (var i = 0; i < pts.length; i += 2) {
          var dx = pts[i][0] - px, dy = pts[i][1] - py;
          var d = dx * dx + dy * dy;
          if (d < best) best = d;
        }
        var t = Math.max(0, 1 - Math.sqrt(best) / RADIUS);
        path.style.opacity = (0.22 + 0.78 * t).toFixed(3);
        path.style.strokeWidth = (1.5 + 1.4 * t).toFixed(2);
      });

      pads.forEach(function (pad) {
        var dx = +pad.getAttribute('cx') - px, dy = +pad.getAttribute('cy') - py;
        var t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS);
        pad.style.opacity = (0.35 + 0.65 * t).toFixed(3);
      });

      vias.forEach(function (via) {
        var dx = +via.getAttribute('cx') - px, dy = +via.getAttribute('cy') - py;
        var t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS);
        via.style.opacity = (0.25 + 0.75 * t).toFixed(3);
      });
    }

    circuit.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!pending) { pending = true; requestAnimationFrame(update); }
    });

    circuit.addEventListener('mouseleave', function () {
      mx = my = -9999;
      traces.forEach(function (p) { p.style.opacity = ''; p.style.strokeWidth = ''; });
      pads.forEach(function (p) { p.style.opacity = ''; });
      vias.forEach(function (p) { p.style.opacity = ''; });
    });
  }

  /* ================= 移动端折叠导航 ================= */
  var navHeader = document.querySelector('.nav');
  var navToggle = document.getElementById('nav-toggle');
  if (navHeader && navToggle) {
    function setNavOpen(open) {
      navHeader.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? '收起菜单' : '展开菜单');
      navToggle.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    }
    navToggle.addEventListener('click', function () {
      setNavOpen(!navHeader.classList.contains('nav-open'));
    });
    // 点击任意导航链接后自动收起
    navHeader.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setNavOpen(false); });
    });
  }

  /* ================= 生日彩蛋（每年 3 月 9 日） ================= */
  (function birthdayEgg() {
    var now = new Date();
    if (now.getMonth() !== 2 || now.getDate() !== 9) return;
    try {
      if (sessionStorage.getItem('codej-bday-seen')) return;
      sessionStorage.setItem('codej-bday-seen', '1');
    } catch (e) {}

    function start() {
      if (!document.body) return;

      var canvas = document.createElement('canvas');
      canvas.id = 'bday-canvas';
      document.body.appendChild(canvas);

      var card = document.createElement('div');
      card.className = 'bday-card';
      card.innerHTML =
        '<div class="bday-cake">🎂</div>' +
        '<div class="bday-kicker">SYSTEM NOTICE // 03 · 09</div>' +
        '<h2 class="bday-title">HAPPY BIRTHDAY</h2>' +
        '<p class="bday-sub">CodeJ-40404<br>今天不写 bug，只吃蛋糕。</p>' +
        '<button class="bday-close" type="button">收下祝福 ✕</button>';
      document.body.appendChild(card);

      var ctx = canvas.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0;

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      var cs = getComputedStyle(document.documentElement);
      var palette = ['--a1', '--a2', '--a3'].map(function (k) {
        return cs.getPropertyValue(k).trim() || '#ff2a6d';
      }).concat(['#ffe066', '#ffffff']);

      var parts = [];
      for (var i = 0; i < 140; i++) {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * -H,
          w: 4 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          vy: 70 + Math.random() * 130,
          vx: -30 + Math.random() * 60,
          rot: Math.random() * Math.PI,
          vr: -2.5 + Math.random() * 5,
          color: palette[(Math.random() * palette.length) | 0]
        });
      }

      var last = 0, raf = 0, running = true;
      function frame(t) {
        if (!running) return;
        if (!last) last = t;
        var dt = Math.min((t - last) / 1000, 0.05);
        last = t;
        ctx.clearRect(0, 0, W, H);
        parts.forEach(function (p) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
          if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);

      function close() {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        canvas.remove();
        card.remove();
      }
      card.querySelector('.bday-close').addEventListener('click', close);
      setTimeout(close, 12000);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();

  /* ================= 左侧工具栏 ================= */
  (function toolDock() {
    var dock = document.getElementById('dock');
    if (!dock) return;

    var toggle = document.getElementById('dock-toggle');
    var panel = document.getElementById('dock-panel');
    var musicBtn = document.getElementById('dock-music');
    var musicInput = document.getElementById('dock-music-file');
    var bgInput = document.getElementById('dock-bg-file');
    var items = dock.querySelectorAll('.dock-item');
    var activeTool = null;
    var audio = null;

    function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
    function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

    /* 折叠 */
    var collapsed = read('codej-dock-collapsed') === '1';
    if (window.matchMedia && window.matchMedia('(max-width: 760px)').matches) collapsed = true;

    function setCollapsed(v) {
      dock.classList.toggle('collapsed', v);
      toggle.setAttribute('aria-expanded', String(!v));
      store('codej-dock-collapsed', v ? '1' : '0');
    }
    setCollapsed(collapsed);
    toggle.addEventListener('click', function () {
      setCollapsed(!dock.classList.contains('collapsed'));
    });

    /* 面板 */
    function closePanel() {
      panel.hidden = true;
      panel.innerHTML = '';
      activeTool = null;
      items.forEach(function (b) { b.classList.remove('active'); });
    }

    function openPanel(btn, html, force) {
      var same = activeTool === btn.dataset.tool && !panel.hidden;
      if (same && !force) { closePanel(); return; }
      activeTool = btn.dataset.tool;
      items.forEach(function (b) { b.classList.toggle('active', b === btn); });
      panel.innerHTML = html;
      panel.hidden = false;
      panel.querySelectorAll('[data-close]').forEach(function (b) {
        b.addEventListener('click', closePanel);
      });
    }

    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      if (dock.contains(e.target) || panel.contains(e.target)) return;
      closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) closePanel();
    });

    /* ---------- 来张车票 ---------- */
    var TK_W = 900, TK_H = 380;

    /* 字体库：均为系统字体，无需联网加载 */
    var FONT_GROUPS = [
      { name: '默认', fonts: [
        { id: '',      name: '跟随主题',      css: '' },
        { id: 'mono',  name: '等宽 / 代码',   css: "'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace" },
        { id: 'sans',  name: '无衬线',        css: "'Segoe UI', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        { id: 'serif', name: '衬线',          css: "Georgia, 'Songti SC', 'SimSun', serif" },
        { id: 'round', name: '圆润',          css: "'Comic Sans MS', 'Yuanti SC', 'PingFang SC', sans-serif" }
      ]},
      { name: '中文字体', fonts: [
        { id: 'yahei',     name: '微软雅黑',      css: "'Microsoft YaHei', 'PingFang SC', sans-serif" },
        { id: 'pingfang',  name: '苹方',          css: "'PingFang SC', 'Microsoft YaHei', sans-serif" },
        { id: 'hiragino',  name: '冬青黑体',      css: "'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" },
        { id: 'heiti',     name: '黑体',          css: "'SimHei', 'Heiti SC', sans-serif" },
        { id: 'sthei',     name: '华文黑体',      css: "'STHeiti', 'Heiti SC', 'SimHei', sans-serif" },
        { id: 'sourcehan', name: '思源黑体',      css: "'Source Han Sans SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif" },
        { id: 'songti',    name: '宋体',          css: "'SimSun', 'Songti SC', serif" },
        { id: 'stsong',    name: '华文宋体',      css: "'STSong', 'Songti SC', 'SimSun', serif" },
        { id: 'notoserif', name: '思源宋体',      css: "'Source Han Serif SC', 'Noto Serif CJK SC', 'Songti SC', serif" },
        { id: 'kaiti',     name: '楷体',          css: "'KaiTi', 'STKaiti', 'Kaiti SC', serif" },
        { id: 'fangsong',  name: '仿宋',          css: "'FangSong', 'STFangsong', serif" },
        { id: 'yuanti',    name: '圆体',          css: "'YouYuan', 'Yuanti SC', 'PingFang SC', sans-serif" },
        { id: 'lisu',      name: '隶书',          css: "'LiSu', 'STLiti', 'Baoli SC', serif" },
        { id: 'xingkai',   name: '行楷',          css: "'STXingkai', 'Xingkai SC', 'KaiTi', cursive" },
        { id: 'hupo',      name: '琥珀',          css: "'STHupo', 'Hupo SC', 'YouYuan', fantasy" }
      ]},
      { name: '西文字体', fonts: [
        { id: 'georgia',  name: 'Georgia',         css: "Georgia, 'Times New Roman', serif" },
        { id: 'times',    name: 'Times New Roman', css: "'Times New Roman', Times, serif" },
        { id: 'garamond', name: 'Garamond',        css: "Garamond, 'Book Antiqua', serif" },
        { id: 'palatino', name: 'Palatino',        css: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" },
        { id: 'arial',    name: 'Arial',           css: "Arial, Helvetica, sans-serif" },
        { id: 'verdana',  name: 'Verdana',         css: "Verdana, Geneva, sans-serif" },
        { id: 'tahoma',   name: 'Tahoma',          css: "Tahoma, Geneva, sans-serif" },
        { id: 'trebuchet',name: 'Trebuchet MS',    css: "'Trebuchet MS', 'Lucida Grande', sans-serif" },
        { id: 'impact',   name: 'Impact',          css: "Impact, Haettenschweiler, sans-serif" },
        { id: 'comic',    name: 'Comic Sans',      css: "'Comic Sans MS', 'Chalkboard SE', cursive" }
      ]},
      { name: '等宽字体', fonts: [
        { id: 'consolas',  name: 'Consolas',       css: "Consolas, 'Courier New', monospace" },
        { id: 'courier',   name: 'Courier New',    css: "'Courier New', Courier, monospace" },
        { id: 'cascadia',  name: 'Cascadia Code',  css: "'Cascadia Code', Consolas, monospace" },
        { id: 'jetbrains', name: 'JetBrains Mono', css: "'JetBrains Mono', Consolas, monospace" },
        { id: 'lucida',    name: 'Lucida Console', css: "'Lucida Console', Monaco, monospace" }
      ]}
    ];

    function fontCss(id) {
      var out = '';
      FONT_GROUPS.forEach(function (grp) {
        grp.fonts.forEach(function (f) { if (f.id === id) out = f.css; });
      });
      return out;
    }

    function buildFontOptions(selected, noFollow) {
      var html = '';
      FONT_GROUPS.forEach(function (grp) {
        html += '<optgroup label="' + grp.name + '">';
        grp.fonts.forEach(function (f) {
          if (noFollow && f.id === '') return;
          html += '<option value="' + f.id + '"' +
            (selected === f.id ? ' selected' : '') + '>' + f.name + '</option>';
        });
        html += '</optgroup>';
      });
      return html;
    }

    var TICKET_STYLES = [
      { id: 'rail',    name: '高铁票',   desc: '蓝白票根 · 检票口', icon: 'fa-train-subway', sw: ['#ffffff', '#1e5fbf', '#3a9bea'] },
      { id: 'minimal', name: '极简几何', desc: '米白纸感 · 几何',   icon: 'fa-shapes',       sw: ['#f4f1ea', '#1b1a17', '#c4553b'] },
      { id: 'tech',    name: '科技感',   desc: '暗色 HUD · 霓虹',   icon: 'fa-microchip',    sw: ['#05080f', '#00f0ff', '#ff2a6d'] },
      { id: 'custom',  name: '自定义',   desc: '自选配色与站点',    icon: 'fa-palette',      sw: ['#f7f4ef', '#2f6fed', '#f43f5e'] }
    ];

    var tkSel = read('codej-ticket-style') || 'rail';
    var tkCustom = {
      bg: '#f7f4ef', a1: '#2f6fed', a2: '#f43f5e',
      from: '现实站', to: '开源站', who: 'CodeJ-40404'
    };
    try {
      var savedTk = JSON.parse(read('codej-ticket-custom') || '{}');
      Object.keys(tkCustom).forEach(function (k) {
        if (typeof savedTk[k] === 'string' && savedTk[k]) tkCustom[k] = savedTk[k];
      });
    } catch (e) {}
    if (!TICKET_STYLES.some(function (s) { return s.id === tkSel; })) tkSel = 'rail';

    var tkFont = read('codej-ticket-font') || 'yahei';
    if (!fontCss(tkFont)) tkFont = 'yahei';

    function pad2(n) { return n < 10 ? '0' + n : String(n); }
    function todayStr() {
      var d = new Date();
      return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    }

    // 圆角矩形路径
    function rrPath(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.lineTo(x + w - r, y);
      g.quadraticCurveTo(x + w, y, x + w, y + r);
      g.lineTo(x + w, y + h - r);
      g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      g.lineTo(x + r, y + h);
      g.quadraticCurveTo(x, y + h, x, y + h - r);
      g.lineTo(x, y + r);
      g.quadraticCurveTo(x, y, x + r, y);
      g.closePath();
    }

    // 把 #rrggbb 转成 rgba，用于半透明装饰
    function hexA(hex, a) {
      var h = toHex(hex).slice(1);
      return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' +
        parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
    }

    function lumOf(hex) {
      var h = toHex(hex).slice(1);
      var r = parseInt(h.slice(0, 2), 16) / 255;
      var gg = parseInt(h.slice(2, 4), 16) / 255;
      var b = parseInt(h.slice(4, 6), 16) / 255;
      return 0.2126 * r + 0.7152 * gg + 0.0722 * b;
    }

    // 按可用宽度自动缩小字号，避免站名过长时互相压字
    function fitFont(g, text, maxW, size, family, bold) {
      var s = size, pre = bold ? 'bold ' : '';
      g.font = pre + s + 'px ' + family;
      while (s > 16 && g.measureText(text).width > maxW) {
        s -= 2;
        g.font = pre + s + 'px ' + family;
      }
    }

    // 票根撕口：擦出两个半圆
    function drawNotches(g, x) {
      g.save();
      g.globalCompositeOperation = 'destination-out';
      g.beginPath();
      g.arc(x, 0, 12, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.arc(x, TK_H, 12, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }

    function drawBarcode(g, x, y, w, h, color, alpha) {
      g.save();
      g.fillStyle = color;
      g.globalAlpha = alpha === undefined ? 0.9 : alpha;
      var cx = x, seed = 20270309;
      while (cx < x + w) {
        seed = (seed * 9301 + 49297) % 233280;
        var bw = 1 + Math.round((seed / 233280) * 3);
        if (Math.floor(seed / 7000) % 3 !== 0) g.fillRect(cx, y, bw, h);
        cx += bw + 2;
      }
      g.restore();
    }

    // 装饰用伪二维码（不保证可扫，只为观感）
    function drawQR(g, x, y, size, fg, bg) {
      var n = 21, cell = size / n, i, j;
      g.save();
      g.fillStyle = bg;
      g.fillRect(x, y, size, size);
      g.fillStyle = fg;
      var seed = 40404;
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          if ((i < 7 && j < 7) || (i >= n - 7 && j < 7) || (i < 7 && j >= n - 7)) continue;
          seed = (seed * 1103515245 + 12345) % 2147483648;
          if (seed / 2147483648 > 0.52) g.fillRect(x + i * cell, y + j * cell, cell + 0.4, cell + 0.4);
        }
      }
      [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (p) {
        g.fillStyle = fg;
        g.fillRect(x + p[0] * cell, y + p[1] * cell, 7 * cell, 7 * cell);
        g.fillStyle = bg;
        g.fillRect(x + (p[0] + 1) * cell, y + (p[1] + 1) * cell, 5 * cell, 5 * cell);
        g.fillStyle = fg;
        g.fillRect(x + (p[0] + 2) * cell, y + (p[1] + 2) * cell, 3 * cell, 3 * cell);
      });
      g.restore();
    }

    function clipTicket(g, r) {
      rrPath(g, 0, 0, TK_W, TK_H, r);
      g.clip();
    }

    /* 高铁票：蓝白票面 + 右侧票根 */
    function drawRail(g, o, m) {
      var F_CN = m.font, F_MONO = m.font;
      g.save();
      clipTicket(g, 18);

      var base = g.createLinearGradient(0, 0, 0, TK_H);
      base.addColorStop(0, '#ffffff');
      base.addColorStop(1, '#eef5fd');
      g.fillStyle = base;
      g.fillRect(0, 0, TK_W, TK_H);

      var band = g.createLinearGradient(0, 0, TK_W, 0);
      band.addColorStop(0, '#14539e');
      band.addColorStop(0.6, '#1e6dc4');
      band.addColorStop(1, '#3a9bea');
      g.fillStyle = band;
      g.fillRect(0, 0, TK_W, 78);

      g.fillStyle = '#ffffff';
      g.font = 'bold 21px ' + F_CN;
      g.fillText('CODEJ EXPRESS', 40, 37);
      g.globalAlpha = 0.78;
      g.font = '11px ' + F_CN;
      g.fillText('高速铁路电子客票 · E-TICKET', 40, 60);
      g.globalAlpha = 1;

      g.textAlign = 'right';
      g.font = 'bold 26px ' + F_MONO;
      g.fillText(m.train, 860, 38);
      g.globalAlpha = 0.82;
      g.font = '11px ' + F_CN;
      g.fillText(m.klass + ' · ' + m.seat, 860, 61);
      g.globalAlpha = 1;
      g.textAlign = 'left';

      g.fillStyle = '#7b90ab';
      g.font = '10px ' + F_CN;
      g.fillText('出发站 DEPARTURE', 40, 126);
      g.fillText('到达站 ARRIVAL', 380, 126);

      g.fillStyle = '#102a52';
      fitFont(g, o.from, 182, 44, F_CN, true);
      g.fillText(o.from, 40, 178);
      fitFont(g, o.to, 216, 44, F_CN, true);
      g.fillText(o.to, 380, 178);

      g.strokeStyle = '#2f8de4';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(238, 158);
      g.lineTo(326, 158);
      g.moveTo(313, 147);
      g.lineTo(327, 158);
      g.lineTo(313, 169);
      g.stroke();

      var cells = [
        ['日期 DATE', m.date],
        ['车次 TRAIN', m.train],
        ['座位 SEAT', m.seat],
        ['等级 CLASS', m.klass]
      ];
      cells.forEach(function (c, i) {
        var cx = 40 + i * 150;
        g.fillStyle = '#8296b1';
        g.font = '10px ' + F_CN;
        g.fillText(c[0], cx, 236);
        g.fillStyle = '#163459';
        g.font = 'bold 15px ' + F_MONO;
        g.fillText(c[1], cx, 262);
      });

      g.fillStyle = '#8296b1';
      g.font = '10px ' + F_CN;
      g.fillText('请于开车前 30 分钟检票 · 仅限当日当次车有效', 40, 330);

      // 票根
      g.fillStyle = 'rgba(30,109,196,0.055)';
      g.fillRect(620, 0, 280, TK_H);

      g.strokeStyle = '#b9cde4';
      g.lineWidth = 1.5;
      g.setLineDash([6, 7]);
      g.beginPath();
      g.moveTo(620, 20);
      g.lineTo(620, TK_H - 20);
      g.stroke();
      g.setLineDash([]);

      g.fillStyle = '#7b90ab';
      g.font = '9px ' + F_MONO;
      g.fillText('SERIAL NO.', 648, 116);
      g.fillStyle = '#102a52';
      g.font = 'bold 15px ' + F_MONO;
      g.fillText(m.serial, 648, 138);

      drawQR(g, 648, 158, 102, '#102a52', '#ffffff');

      g.fillStyle = '#7b90ab';
      g.font = '9px ' + F_MONO;
      g.fillText('FARE', 772, 180);
      g.fillStyle = '#c0392b';
      g.font = 'bold 20px ' + F_MONO;
      g.fillText(m.fare, 772, 206);

      drawBarcode(g, 648, 296, 212, 32, '#102a52', 0.88);

      g.fillStyle = '#7b90ab';
      g.font = '9px ' + F_CN;
      g.fillText('ADMIT ONE · 检票后作废', 648, 352);

      g.restore();
      drawNotches(g, 620);
    }

    /* 极简几何：米白纸 + 几何线条 */
    function drawMinimal(g, o, m) {
      var F_CN = m.font, F_MONO = m.font;
      g.save();
      clipTicket(g, 8);

      g.fillStyle = '#f4f1ea';
      g.fillRect(0, 0, TK_W, TK_H);
      g.fillStyle = '#c4553b';
      g.fillRect(0, 0, 9, TK_H);

      g.strokeStyle = 'rgba(196,85,59,0.28)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(786, 30, 176, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(786, 30, 120, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = 'rgba(27,26,23,0.04)';
      g.beginPath();
      g.arc(700, 306, 88, 0, Math.PI * 2);
      g.fill();

      g.fillStyle = 'rgba(27,26,23,0.06)';
      g.font = 'bold 118px ' + F_MONO;
      g.textAlign = 'right';
      g.fillText('404', 858, 252);
      g.textAlign = 'left';

      g.fillStyle = '#1b1a17';
      g.font = 'bold 12px ' + F_MONO;
      g.fillText('CODEJ  /  BOARDING PASS', 48, 54);
      g.fillStyle = '#8a857b';
      g.font = '10px ' + F_MONO;
      g.fillText('NO. ' + m.serial, 48, 74);

      g.strokeStyle = 'rgba(27,26,23,0.16)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(48, 92);
      g.lineTo(852, 92);
      g.stroke();

      g.fillStyle = '#8a857b';
      g.font = '9px ' + F_MONO;
      g.fillText('DEPARTURE', 48, 124);
      g.fillText('ARRIVAL', 330, 124);

      g.fillStyle = '#1b1a17';
      fitFont(g, o.from, 168, 50, F_CN, true);
      g.fillText(o.from, 48, 180);
      fitFont(g, o.to, 250, 50, F_CN, true);
      g.fillText(o.to, 330, 180);

      g.strokeStyle = '#c4553b';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(228, 160);
      g.lineTo(300, 160);
      g.moveTo(288, 150);
      g.lineTo(300, 160);
      g.lineTo(288, 170);
      g.stroke();

      g.strokeStyle = 'rgba(27,26,23,0.16)';
      g.beginPath();
      g.moveTo(48, 206);
      g.lineTo(600, 206);
      g.stroke();

      var cells = [
        ['DATE', m.date],
        ['TRAIN', m.train],
        ['SEAT', m.seat],
        ['PASSENGER', o.who]
      ];
      cells.forEach(function (c, i) {
        var cx = 48 + i * 142;
        g.fillStyle = '#8a857b';
        g.font = '9px ' + F_MONO;
        g.fillText(c[0], cx, 236);
        g.fillStyle = '#1b1a17';
        g.font = 'bold 14px ' + F_MONO;
        g.fillText(c[1], cx, 260);
      });

      g.strokeStyle = 'rgba(27,26,23,0.16)';
      g.beginPath();
      g.moveTo(48, 288);
      g.lineTo(852, 288);
      g.stroke();

      drawBarcode(g, 48, 310, 250, 34, '#1b1a17', 0.85);

      g.fillStyle = '#8a857b';
      g.font = '9px ' + F_MONO;
      g.textAlign = 'right';
      g.fillText(m.serial + '  ·  ADMIT ONE', 852, 322);
      g.fillText(m.date + '  ·  NO REFUND', 852, 344);
      g.textAlign = 'left';

      g.fillStyle = '#b3ada2';
      g.fillText('CODEJ / 40404 / BUILT WITH CODE', 48, 360);

      g.restore();
    }

    /* 科技感：暗色 HUD + 霓虹 */
    function drawTech(g, o, m) {
      var F_CN = m.font, F_MONO = m.font;
      g.save();
      clipTicket(g, 14);
      var ink = '#d6e6ff';

      var base = g.createLinearGradient(0, 0, TK_W, TK_H);
      base.addColorStop(0, '#04070d');
      base.addColorStop(1, '#0b1524');
      g.fillStyle = base;
      g.fillRect(0, 0, TK_W, TK_H);

      g.strokeStyle = m.a1;
      g.globalAlpha = 0.07;
      g.lineWidth = 1;
      var gx, gy;
      for (gx = 0; gx <= TK_W; gx += 36) {
        g.beginPath();
        g.moveTo(gx, 0);
        g.lineTo(gx, TK_H);
        g.stroke();
      }
      for (gy = 0; gy <= TK_H; gy += 36) {
        g.beginPath();
        g.moveTo(0, gy);
        g.lineTo(TK_W, gy);
        g.stroke();
      }
      g.globalAlpha = 1;

      g.globalAlpha = 0.13;
      g.fillStyle = m.a2;
      g.beginPath();
      g.arc(806, 16, 240, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 0.1;
      g.fillStyle = m.a1;
      g.beginPath();
      g.arc(90, 360, 200, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;

      g.fillStyle = 'rgba(255,255,255,0.024)';
      for (gy = 0; gy < TK_H; gy += 4) g.fillRect(0, gy, TK_W, 1);

      g.globalAlpha = 0.4;
      g.strokeStyle = m.a1;
      g.lineWidth = 1;
      g.strokeRect(14.5, 14.5, TK_W - 29, TK_H - 29);
      g.globalAlpha = 1;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(14, 42); g.lineTo(14, 14); g.lineTo(42, 14);
      g.moveTo(TK_W - 42, 14); g.lineTo(TK_W - 14, 14); g.lineTo(TK_W - 14, 42);
      g.moveTo(TK_W - 14, TK_H - 42); g.lineTo(TK_W - 14, TK_H - 14); g.lineTo(TK_W - 42, TK_H - 14);
      g.moveTo(42, TK_H - 14); g.lineTo(14, TK_H - 14); g.lineTo(14, TK_H - 42);
      g.stroke();

      g.fillStyle = m.a1;
      g.font = '11px ' + F_MONO;
      g.fillText('// BOARDING PASS  v2.0', 40, 56);
      g.textAlign = 'right';
      g.fillStyle = m.a2;
      g.fillText('SYS.ONLINE  ●', 858, 56);
      g.textAlign = 'left';
      g.globalAlpha = 0.18;
      g.strokeStyle = '#ffffff';
      g.beginPath();
      g.moveTo(40, 74);
      g.lineTo(858, 74);
      g.stroke();
      g.globalAlpha = 1;

      g.fillStyle = 'rgba(190,220,240,0.5)';
      g.font = '9px ' + F_MONO;
      g.fillText('DEPARTURE', 42, 116);
      g.fillText('ARRIVAL', 362, 116);

      g.shadowBlur = 16;
      g.shadowColor = m.a1;
      g.fillStyle = m.a1;
      fitFont(g, o.from, 195, 42, F_CN, true);
      g.fillText(o.from, 40, 158);
      g.shadowColor = m.a2;
      g.fillStyle = m.a2;
      fitFont(g, o.to, 230, 42, F_CN, true);
      g.fillText(o.to, 360, 158);
      g.shadowBlur = 0;

      g.fillStyle = m.a2;
      g.font = 'bold 22px ' + F_MONO;
      g.fillText('>>', 250, 154);

      var cells = [
        ['DATE', m.date],
        ['TRAIN', m.train],
        ['SEAT', m.seat],
        ['CLASS', m.klass]
      ];
      cells.forEach(function (c, i) {
        var cx = 40 + i * 148;
        g.fillStyle = 'rgba(190,220,240,0.42)';
        g.font = '9px ' + F_MONO;
        g.fillText(c[0], cx, 214);
        g.fillStyle = ink;
        g.font = 'bold 14px ' + F_MONO;
        g.fillText(c[1], cx, 238);
        if (i > 0) {
          g.globalAlpha = 0.12;
          g.fillStyle = m.a1;
          g.fillRect(cx - 14, 200, 1, 46);
          g.globalAlpha = 1;
        }
      });

      g.shadowBlur = 10;
      g.shadowColor = m.a1;
      drawBarcode(g, 40, 292, 300, 32, m.a1, 0.95);
      g.shadowBlur = 0;

      g.fillStyle = 'rgba(150,190,215,0.45)';
      g.font = '9px ' + F_MONO;
      g.fillText('ADMIT ONE // CODEJ RAILWAY // NO REFUND', 40, 352);

      // 票根
      g.fillStyle = 'rgba(0,0,0,0.25)';
      g.fillRect(620, 0, 280, TK_H);
      g.strokeStyle = m.a2;
      g.globalAlpha = 0.55;
      g.lineWidth = 1.5;
      g.setLineDash([5, 6]);
      g.beginPath();
      g.moveTo(620, 22);
      g.lineTo(620, TK_H - 22);
      g.stroke();
      g.setLineDash([]);
      g.globalAlpha = 1;

      g.fillStyle = m.a2;
      g.font = '9px ' + F_MONO;
      g.fillText('SERIAL NO.', 648, 112);
      g.fillStyle = ink;
      g.font = 'bold 14px ' + F_MONO;
      g.fillText(m.serial, 648, 134);

      drawQR(g, 648, 154, 100, m.a1, '#05080f');

      g.fillStyle = m.a2;
      g.font = '9px ' + F_MONO;
      g.fillText('FARE', 768, 176);
      g.fillStyle = m.a1;
      g.font = 'bold 19px ' + F_MONO;
      g.fillText(m.fare, 768, 200);

      g.fillStyle = 'rgba(150,190,215,0.4)';
      g.font = '9px ' + F_MONO;
      g.fillText('TOKEN/QR READY', 648, 292);
      g.fillText('GATE 8BIT · SEAT ' + m.seat, 648, 312);
      g.fillText('KEEP CALM & SHIP IT', 648, 332);

      g.restore();
      drawNotches(g, 620);
    }

    /* 自定义：自选底色与双主色 */
    function drawCustom(g, o, m) {
      var F_CN = m.font, F_MONO = m.font;
      var bgc = toHex(o.bg);
      var c1 = toHex(o.a1);
      var c2 = toHex(o.a2);
      var light = lumOf(bgc) > 0.55;
      var ink = light ? '#1b1f2a' : '#eef3ff';
      var sub = light ? 'rgba(27,31,42,0.48)' : 'rgba(238,243,255,0.48)';
      var line = light ? 'rgba(27,31,42,0.14)' : 'rgba(238,243,255,0.16)';

      g.save();
      clipTicket(g, 14);
      g.fillStyle = bgc;
      g.fillRect(0, 0, TK_W, TK_H);

      var strip = g.createLinearGradient(0, 0, 0, TK_H);
      strip.addColorStop(0, c1);
      strip.addColorStop(1, c2);
      g.fillStyle = strip;
      g.fillRect(0, 0, 10, TK_H);

      g.globalAlpha = 0.1;
      g.fillStyle = c1;
      g.beginPath();
      g.arc(806, 24, 220, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = c2;
      g.beginPath();
      g.arc(120, 380, 180, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;

      g.fillStyle = c1;
      g.font = 'bold 13px ' + F_MONO;
      g.fillText('CODEJ EXPRESS', 42, 52);
      g.fillStyle = sub;
      g.font = '10px ' + F_MONO;
      g.textAlign = 'right';
      g.fillText(m.date + '  /  BOARDING PASS', 858, 52);
      g.textAlign = 'left';

      g.strokeStyle = line;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(42, 72);
      g.lineTo(858, 72);
      g.stroke();

      g.fillStyle = sub;
      g.font = '9px ' + F_MONO;
      g.fillText('DEPARTURE', 42, 108);
      g.fillText('ARRIVAL', 362, 108);

      g.fillStyle = ink;
      fitFont(g, o.from, 195, 42, F_CN, true);
      g.fillText(o.from, 40, 152);
      fitFont(g, o.to, 230, 42, F_CN, true);
      g.fillText(o.to, 360, 152);

      g.fillStyle = c2;
      g.font = 'bold 22px ' + F_MONO;
      g.fillText('>>', 250, 148);

      var cells = [
        ['DATE', m.date],
        ['TRAIN', m.train],
        ['SEAT', m.seat],
        ['PASSENGER', o.who]
      ];
      cells.forEach(function (c, i) {
        var cx = 42 + i * 148;
        g.fillStyle = sub;
        g.font = '9px ' + F_MONO;
        g.fillText(c[0], cx, 206);
        g.fillStyle = ink;
        g.font = 'bold 14px ' + F_MONO;
        g.fillText(c[1], cx, 230);
      });

      g.strokeStyle = line;
      g.beginPath();
      g.moveTo(42, 258);
      g.lineTo(600, 258);
      g.stroke();

      drawBarcode(g, 42, 288, 250, 34, ink, 0.85);

      g.fillStyle = sub;
      g.font = '9px ' + F_MONO;
      g.fillText('ADMIT ONE · NO REFUND · BUILT WITH CODE', 42, 352);

      // 票根
      g.fillStyle = hexA(c1, 0.08);
      g.fillRect(620, 0, 280, TK_H);
      g.strokeStyle = hexA(c1, 0.5);
      g.lineWidth = 1.5;
      g.setLineDash([6, 7]);
      g.beginPath();
      g.moveTo(620, 22);
      g.lineTo(620, TK_H - 22);
      g.stroke();
      g.setLineDash([]);

      g.fillStyle = sub;
      g.font = '9px ' + F_MONO;
      g.fillText('SERIAL NO.', 648, 112);
      g.fillStyle = ink;
      g.font = 'bold 14px ' + F_MONO;
      g.fillText(m.serial, 648, 134);

      drawQR(g, 648, 154, 100, '#141821', '#ffffff');

      g.fillStyle = c2;
      g.font = '9px ' + F_MONO;
      g.fillText('FARE', 768, 176);
      g.fillStyle = c1;
      g.font = 'bold 19px ' + F_MONO;
      g.fillText(m.fare, 768, 200);

      g.fillStyle = sub;
      g.font = '9px ' + F_MONO;
      g.fillText('GATE 8BIT', 648, 292);
      g.fillText('SEAT ' + m.seat, 648, 312);
      g.fillText('CLASS ' + m.klass, 648, 332);

      g.restore();
      drawNotches(g, 620);
    }

    function makeTicket() {
      var cv = document.createElement('canvas');
      cv.width = TK_W * 2;
      cv.height = TK_H * 2;
      var g = cv.getContext('2d');
      g.scale(2, 2);

      var cs = getComputedStyle(root);
      var m = {
        a1: cs.getPropertyValue('--a1').trim() || '#00f0ff',
        a2: cs.getPropertyValue('--a2').trim() || '#ff2a6d',
        font: fontCss(tkFont) || fontCss('yahei'),
        date: todayStr(),
        serial: 'K7X9-' + Math.floor(1000 + Math.random() * 9000),
        train: 'G0404',
        seat: '08车 12F',
        klass: '二等座',
        fare: '¥ 404.00'
      };
      var opt = {
        bg: tkCustom.bg,
        a1: tkCustom.a1,
        a2: tkCustom.a2,
        from: String(tkCustom.from || '').trim().slice(0, 8) || '现实站',
        to: String(tkCustom.to || '').trim().slice(0, 8) || '开源站',
        who: String(tkCustom.who || '').trim().slice(0, 12) || 'CodeJ-40404'
      };

      if (tkSel === 'minimal') drawMinimal(g, opt, m);
      else if (tkSel === 'tech') drawTech(g, opt, m);
      else if (tkSel === 'custom') drawCustom(g, opt, m);
      else drawRail(g, opt, m);

      var a = document.createElement('a');
      a.download = 'codej-ticket-' + tkSel + '-' + m.date + '.png';
      a.href = cv.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    function openTicketPanel(btn) {
      var cards = TICKET_STYLES.map(function (s) {
        return '<button class="ticket-card' + (tkSel === s.id ? ' active' : '') + '" type="button" data-tk="' + s.id + '">' +
          '<i class="fas ' + s.icon + '"></i>' +
          '<b>' + s.name + '</b>' +
          '<em>' + s.desc + '</em>' +
          '<span class="ticket-swatch">' +
          s.sw.map(function (c) { return '<span style="background:' + c + '"></span>'; }).join('') +
          '</span></button>';
      }).join('');

      openPanel(btn,
        '<div class="dock-panel-title"><span><i class="fas fa-ticket-alt"></i> 来张车票</span>' +
        '<button class="dock-x" type="button" data-close>✕</button></div>' +
        '<p class="dock-hint">挑一个样式，生成一张可以保存的车票图片。</p>' +
        '<div class="ticket-grid">' + cards + '</div>' +
        '<label class="tk-label">票面字体<select class="style-select" data-tkfont>' +
        buildFontOptions(tkFont, true) + '</select></label>' +
        '<div class="ticket-custom" id="tk-custom"' + (tkSel === 'custom' ? '' : ' hidden') + '>' +
        '<div class="tk-sub">配色</div>' +
        '<div class="ticket-colors">' +
        '<label class="style-color"><input type="color" data-tc="bg" value="' + toHex(tkCustom.bg) + '"><span>底色</span></label>' +
        '<label class="style-color"><input type="color" data-tc="a1" value="' + toHex(tkCustom.a1) + '"><span>主色</span></label>' +
        '<label class="style-color"><input type="color" data-tc="a2" value="' + toHex(tkCustom.a2) + '"><span>副色</span></label>' +
        '</div>' +
        '<div class="tk-fields">' +
        '<label class="tk-label">出发站<input class="tk-input" type="text" maxlength="8" data-f="from" value="' + esc(tkCustom.from) + '"></label>' +
        '<label class="tk-label">到达站<input class="tk-input" type="text" maxlength="8" data-f="to" value="' + esc(tkCustom.to) + '"></label>' +
        '</div>' +
        '<label class="tk-label">乘客<input class="tk-input" type="text" maxlength="12" data-f="who" value="' + esc(tkCustom.who) + '"></label>' +
        '</div>' +
        '<div class="dock-actions"><button class="dock-act primary" type="button" id="tk-gen">' +
        '<i class="fas fa-download"></i> 生成并下载</button></div>');

      if (panel.hidden) return;

      panel.querySelectorAll('[data-tk]').forEach(function (card) {
        card.addEventListener('click', function () {
          tkSel = card.dataset.tk;
          panel.querySelectorAll('[data-tk]').forEach(function (c) {
            c.classList.toggle('active', c === card);
          });
          var box = document.getElementById('tk-custom');
          if (box) box.hidden = tkSel !== 'custom';
          store('codej-ticket-style', tkSel);
        });
      });

      panel.querySelectorAll('input[type="color"][data-tc]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          tkCustom[inp.dataset.tc] = inp.value;
          store('codej-ticket-custom', JSON.stringify(tkCustom));
        });
      });

      var tkFontSel = panel.querySelector('[data-tkfont]');
      if (tkFontSel) {
        tkFontSel.addEventListener('change', function () {
          tkFont = tkFontSel.value || 'yahei';
          store('codej-ticket-font', tkFont);
        });
      }

      panel.querySelectorAll('[data-f]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          tkCustom[inp.dataset.f] = inp.value;
          store('codej-ticket-custom', JSON.stringify(tkCustom));
        });
      });

      var gen = document.getElementById('tk-gen');
      gen.addEventListener('click', function () {
        makeTicket();
        var old = gen.innerHTML;
        gen.innerHTML = '<i class="fas fa-check"></i> 已生成';
        setTimeout(function () { gen.innerHTML = old; }, 1200);
      });
    }

    /* ---------- 放首音乐 ---------- */
    musicInput.addEventListener('change', function () {
      var f = musicInput.files && musicInput.files[0];
      if (!f) return;
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
      audio = new Audio(URL.createObjectURL(f));
      audio.loop = true;
      musicBtn.querySelector('span').textContent = '暂停音乐';
      musicBtn.classList.add('playing');
      var p = audio.play();
      if (p && p.catch) p.catch(function () { /* 浏览器拦截时等用户再点 */ });
      musicInput.value = '';
    });

    function toggleMusic() {
      var span = musicBtn.querySelector('span');
      if (audio.paused) {
        audio.play();
        span.textContent = '暂停音乐';
        musicBtn.classList.add('playing');
      } else {
        audio.pause();
        span.textContent = '继续音乐';
        musicBtn.classList.remove('playing');
      }
    }

    /* ---------- 换个背景 ---------- */
    var savedPhoto = read('codej-glass-photo');
    if (savedPhoto) root.style.setProperty('--glass-photo', 'url("' + savedPhoto + '")');

    function openBgPanel(btn) {
      openPanel(btn,
        '<div class="dock-panel-title"><span><i class="fas fa-image"></i> GLASS BACKGROUND</span>' +
        '<button class="dock-x" type="button" data-close>✕</button></div>' +
        '<p class="dock-hint">选择一张图片替换液态玻璃背景，会自动压缩并保存在本地。</p>' +
        '<div class="dock-actions">' +
        '<button class="dock-act primary" type="button" id="dock-bg-pick">选择图片</button>' +
        '<button class="dock-act" type="button" id="dock-bg-reset">恢复默认</button>' +
        '</div>');
      if (panel.hidden) return;
      document.getElementById('dock-bg-pick').addEventListener('click', function () { bgInput.click(); });
      document.getElementById('dock-bg-reset').addEventListener('click', function () {
        try { localStorage.removeItem('codej-glass-photo'); } catch (e) {}
        root.style.removeProperty('--glass-photo');
        closePanel();
      });
    }

    bgInput.addEventListener('change', function () {
      var f = bgInput.files && bgInput.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 1920;
          var w = img.width, h = img.height;
          if (w > max || h > max) {
            var r = Math.min(max / w, max / h);
            w = Math.round(w * r);
            h = Math.round(h * r);
          }
          var cv = document.createElement('canvas');
          cv.width = w;
          cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          var url = cv.toDataURL('image/jpeg', 0.82);
          root.style.setProperty('--glass-photo', 'url("' + url + '")');
          if (currentTheme() !== 'glass') applyTheme('glass');
          store('codej-glass-photo', url);
          closePanel();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
      bgInput.value = '';
    });

    /* ---------- 调整样式 ---------- */
    var COLOR_KEYS = ['a1', 'a2', 'a3', 'text', 'bg'];

    function freshTweak() {
      return {
        a1: null, a2: null, a3: null, text: null, bg: null,
        font: null, fontSize: null, letter: null, radius: null,
        hue: 0, sat: 100, contrast: 100, bright: 100, css: ''
      };
    }

    var tweak = freshTweak();
    try {
      var savedTweak = JSON.parse(read('codej-style-tweak') || '{}');
      Object.keys(tweak).forEach(function (k) {
        if (savedTweak[k] !== undefined && savedTweak[k] !== null) tweak[k] = savedTweak[k];
        else if (savedTweak[k] === null) tweak[k] = null;
      });
    } catch (e) {}

    function cssVar(name) {
      return getComputedStyle(root).getPropertyValue(name).trim();
    }

    // 把主题里的颜色统一转成 #rrggbb，供颜色选择器使用
    function toHex(c) {
      c = String(c || '').trim();
      if (!c) return '#000000';
      if (c.charAt(0) === '#') {
        if (c.length === 4) return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
        return c.slice(0, 7);
      }
      var m = c.match(/\d+/g);
      if (!m) return '#000000';
      return '#' + m.slice(0, 3).map(function (n) {
        return ('0' + parseInt(n, 10).toString(16)).slice(-2);
      }).join('');
    }

    function esc(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    var saveTimer = null;
    function saveTweak() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { store('codej-style-tweak', JSON.stringify(tweak)); }, 220);
    }

    function applyTweak() {
      // 主题色覆盖
      COLOR_KEYS.forEach(function (k) {
        if (tweak[k]) root.style.setProperty('--' + k, tweak[k]);
        else root.style.removeProperty('--' + k);
      });

      // 字体
      if (tweak.font) root.style.setProperty('--font', fontCss(tweak.font) || tweak.font);
      else root.style.removeProperty('--font');

      // 字号 / 字间距
      if (tweak.fontSize === null) root.style.removeProperty('font-size');
      else root.style.fontSize = tweak.fontSize + 'px';
      document.body.style.letterSpacing = tweak.letter === null ? '' : tweak.letter + 'px';

      // 圆角
      if (tweak.radius === null) {
        root.style.removeProperty('--radius');
        root.style.removeProperty('--btn-radius');
      } else {
        root.style.setProperty('--radius', tweak.radius + 'px');
        root.style.setProperty('--btn-radius', Math.min(tweak.radius, 14) + 'px');
      }

      // 画面滤镜（只作用于内容区，避免影响工具栏与背景）
      var main = document.querySelector('main');
      if (main) {
        var f = [];
        if (tweak.hue !== 0) f.push('hue-rotate(' + tweak.hue + 'deg)');
        if (tweak.sat !== 100) f.push('saturate(' + tweak.sat + '%)');
        if (tweak.contrast !== 100) f.push('contrast(' + tweak.contrast + '%)');
        if (tweak.bright !== 100) f.push('brightness(' + tweak.bright + '%)');
        main.style.filter = f.join(' ');
      }

      // 高级 CSS：追加到全站样式之后，实时生效
      var styleEl = document.getElementById('dock-custom-css');
      if (tweak.css) {
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'dock-custom-css';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = tweak.css;
      } else if (styleEl) {
        styleEl.textContent = '';
      }

      saveTweak();
    }
    applyTweak();

    function themeRadius() {
      var v = parseFloat(cssVar('--radius'));
      return isNaN(v) ? 0 : Math.round(v);
    }

    function slider(key, label, min, max, value, unit, step) {
      return '<div class="dock-field"><label>' + label +
        ' <b data-out="' + key + '">' + value + unit + '</b></label>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" data-k="' + key +
        '" value="' + value + '"></div>';
    }

    function colorField(key, label) {
      var val = tweak[key] || toHex(cssVar('--' + key));
      return '<label class="style-color"><input type="color" data-c="' + key + '" value="' + val + '">' +
        '<span>' + label + '</span></label>';
    }

    function fontSelect() {
      return '<select class="style-select" data-font aria-label="字体">' +
        buildFontOptions(tweak.font || '') + '</select>';
    }

    function openStylePanel(btn, force) {
      var rv = tweak.radius === null ? themeRadius() : tweak.radius;
      var fs = tweak.fontSize === null ? 16 : tweak.fontSize;
      var ls = tweak.letter === null ? 0 : tweak.letter;

      openPanel(btn,
        '<div class="dock-panel-title"><span><i class="fas fa-sliders-h"></i> 样式工作台</span>' +
        '<button class="dock-x" type="button" data-close>✕</button></div>' +
        '<p class="dock-hint">改动即时生效并保存在本地；默认值跟随主题，换主题也不会丢。</p>' +

        '<div class="style-sec"><h5><i class="fas fa-palette"></i> 配色</h5>' +
        '<div class="style-colors">' +
        colorField('a1', '主色') + colorField('a2', '副色') + colorField('a3', '点缀') +
        colorField('text', '正文') + colorField('bg', '底色') +
        '</div></div>' +

        '<div class="style-sec"><h5><i class="fas fa-font"></i> 排版</h5>' +
        fontSelect() +
        '<div style="height:8px"></div>' +
        slider('fontSize', '字号', 12, 20, fs, 'px') +
        slider('letter', '字间距', 0, 2, ls, 'px', 0.1) +
        '</div>' +

        '<div class="style-sec"><h5><i class="fas fa-vector-square"></i> 形状</h5>' +
        slider('radius', '圆角', 0, 24, rv, 'px') +
        '</div>' +

        '<div class="style-sec"><h5><i class="fas fa-adjust"></i> 画面</h5>' +
        slider('hue', '色相', -180, 180, tweak.hue, '°') +
        slider('sat', '饱和度', 0, 200, tweak.sat, '%') +
        slider('contrast', '对比度', 50, 150, tweak.contrast, '%') +
        slider('bright', '亮度', 50, 150, tweak.bright, '%') +
        '</div>' +

        '<details class="style-adv"' + (tweak.css ? ' open' : '') + '>' +
        '<summary>高级 · 自定义 CSS</summary>' +
        '<textarea class="style-css" spellcheck="false" placeholder="/* 例：.hero h1 { letter-spacing: 2px; } */">' +
        esc(tweak.css) + '</textarea>' +
        '<p class="dock-hint" style="margin:6px 0 0">这里的 CSS 会追加到全站样式之后，实时生效。</p>' +
        '</details>' +

        '<div class="dock-actions"><button class="dock-act" type="button" id="dock-style-reset">全部恢复默认</button></div>',
        force);

      if (panel.hidden) return;

      // 颜色
      panel.querySelectorAll('input[type="color"]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          tweak[inp.dataset.c] = inp.value;
          applyTweak();
        });
      });

      // 字体
      var fontSel = panel.querySelector('[data-font]');
      if (fontSel) {
        fontSel.addEventListener('change', function () {
          tweak.font = fontSel.value || null;
          applyTweak();
        });
      }

      // 滑杆
      panel.querySelectorAll('input[type="range"]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          var k = inp.dataset.k;
          var v = k === 'letter' ? parseFloat(inp.value) : parseInt(inp.value, 10);
          tweak[k] = v;
          var out = panel.querySelector('[data-out="' + k + '"]');
          if (out) out.textContent = v + (k === 'hue' ? '°' : (k === 'radius' || k === 'fontSize' || k === 'letter' ? 'px' : '%'));
          applyTweak();
        });
      });

      // 自定义 CSS
      var ta = panel.querySelector('.style-css');
      if (ta) {
        ta.addEventListener('input', function () {
          tweak.css = ta.value;
          applyTweak();
        });
      }

      // 全部恢复默认
      document.getElementById('dock-style-reset').addEventListener('click', function () {
        tweak = freshTweak();
        applyTweak();
        openStylePanel(btn, true);
      });
    }

    /* ---------- 工具入口 ---------- */
    items.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tool = btn.dataset.tool;
        if (tool === 'ticket') { openTicketPanel(btn); return; }
        if (tool === 'music') {
          if (audio) toggleMusic();
          else musicInput.click();
          return;
        }
        if (tool === 'bg') { openBgPanel(btn); return; }
        if (tool === 'style') { openStylePanel(btn); }
      });
    });
  })();
})();
