/* ============================================================
   CodeJ-40404.github.io — 文章评论（Supabase REST，无额外依赖）
   依赖：comment-filter.js（提供 CommentFilter.mask / openManager）
   ============================================================ */
(function () {
  'use strict';

  /* ====== 配置区：填入 Supabase 项目地址与 anon key 后即可启用 ====== */
  var SUPABASE_URL = 'https://mycivwimtxuimoinldbs.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_3amXrW3GqBUB677QUX5kFQ_JckiFWHn';

  var mount = document.getElementById('cm-body');
  var slug = '';
  try { slug = new URLSearchParams(location.search).get('p') || ''; } catch (e) { /* 老浏览器 */ }
  if (!mount || !slug) return;

  var countEl = document.getElementById('cm-count');
  var listEl = null;
  var liveEl = null;
  var lenEl = null;
  var submitBtn = null;
  var items = [];
  var lastPostAt = 0;
  var sending = false;

  function configured() {
    return /^https?:\/\//.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20;
  }

  function api(path, options) {
    var opt = options || {};
    opt.headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    };
    if (opt.body) opt.headers.Prefer = 'return=representation';
    return fetch(SUPABASE_URL + path, opt).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) {
          throw new Error(t || ('HTTP ' + r.status));
        });
      }
      return r.json();
    });
  }

  function fmt(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var p = function (n) { return n < 10 ? '0' + n : String(n); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function hue(name) {
    var h = 0;
    var s = String(name || '?');
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return h;
  }

  function maskText(text) {
    return window.CommentFilter ? window.CommentFilter.mask(text).text : String(text || '');
  }

  function updateCount() {
    if (!countEl) return;
    countEl.textContent = items.length ? '(' + items.length + ')' : '';
  }

  /* ---------- 列表 ---------- */
  function renderList() {
    if (!listEl) return;
    listEl.textContent = '';
    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'cm-tip';
      empty.textContent = '还没有评论，来抢沙发。';
      listEl.appendChild(empty);
      updateCount();
      return;
    }
    var frag = document.createDocumentFragment();
    items.forEach(function (it) { frag.appendChild(buildItem(it)); });
    listEl.appendChild(frag);
    updateCount();
  }

  function buildItem(item) {
    var wrap = document.createElement('div');
    wrap.className = 'cm-item';

    var av = document.createElement('div');
    av.className = 'cm-av';
    av.textContent = String(item.name || '?').trim().charAt(0).toUpperCase();
    av.style.background = 'hsl(' + hue(item.name) + ', 62%, 42%)';

    var main = document.createElement('div');
    main.className = 'cm-main';

    var head = document.createElement('div');
    head.className = 'cm-item-head';
    var name = document.createElement('span');
    name.className = 'cm-name';
    name.textContent = item.name || '匿名';
    var time = document.createElement('span');
    time.className = 'cm-time';
    time.textContent = fmt(item.created_at);
    head.appendChild(name);
    head.appendChild(time);

    var text = document.createElement('p');
    text.className = 'cm-text';
    // 展示时也过滤一遍，防止绕过前端写入的历史脏数据
    text.textContent = maskText(item.content);

    main.appendChild(head);
    main.appendChild(text);
    wrap.appendChild(av);
    wrap.appendChild(main);
    return wrap;
  }

  function setTip(text, isError) {
    if (!listEl) return;
    listEl.textContent = '';
    var p = document.createElement('p');
    p.className = 'cm-tip' + (isError ? ' cm-error' : '');
    p.textContent = text;
    listEl.appendChild(p);
  }

  /* ---------- 提交 ---------- */
  function bindForm(form) {
    var nameInput = form.querySelector('#cm-name');
    var contentInput = form.querySelector('#cm-content');
    liveEl = form.querySelector('#cm-live');
    lenEl = form.querySelector('#cm-len');
    submitBtn = form.querySelector('#cm-submit');

    try {
      var saved = localStorage.getItem('codej-comment-name');
      if (saved) nameInput.value = saved;
    } catch (e) { /* 忽略 */ }

    contentInput.addEventListener('input', function () {
      var v = contentInput.value;
      lenEl.textContent = v.length + ' / 500';
      if (window.CommentFilter && v) {
        var r = window.CommentFilter.mask(v);
        liveEl.textContent = r.hits ? '已自动屏蔽 ' + r.hits + ' 处不当内容' : '';
      } else {
        liveEl.textContent = '';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;

      var name = nameInput.value.trim();
      var raw = contentInput.value.trim();
      if (!name) { toast('先写个昵称'); nameInput.focus(); return; }
      if (!raw) { toast('评论不能为空'); contentInput.focus(); return; }

      var wait = 15000 - (Date.now() - lastPostAt);
      if (wait > 0) { toast('发得有点快，' + Math.ceil(wait / 1000) + ' 秒后再试'); return; }

      var masked = window.CommentFilter ? window.CommentFilter.mask(raw) : { text: raw, hits: 0 };
      var payload = {
        post_slug: slug,
        name: name.slice(0, 24),
        content: masked.text.slice(0, 500)
      };

      sending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = '发表中...';

      api('/rest/v1/comments', {
        method: 'POST',
        body: JSON.stringify(payload)
      }).then(function (rows) {
        var row = Array.isArray(rows) && rows[0] ? rows[0] : {
          id: 'local-' + Date.now(),
          name: payload.name,
          content: payload.content,
          created_at: new Date().toISOString()
        };
        items.unshift(row);
        lastPostAt = Date.now();
        try { localStorage.setItem('codej-comment-name', payload.name); } catch (e) {}
        contentInput.value = '';
        lenEl.textContent = '0 / 500';
        liveEl.textContent = '';
        renderList();
        toast(masked.hits ? '已发表（自动屏蔽 ' + masked.hits + ' 处）' : '已发表');
      }).catch(function (err) {
        console.warn('[comments] 发表失败', err);
        toast('发表失败，请稍后再试');
      }).then(function () {
        sending = false;
        submitBtn.disabled = false;
        submitBtn.textContent = '发表评论';
      });
    });
  }

  function toast(text) {
    var old = document.querySelector('.cm-toast');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var el = document.createElement('div');
    el.className = 'cm-toast';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2600);
  }

  /* ---------- 初始化 ---------- */
  function init() {
    mount.innerHTML =
      '<form class="cm-form" id="cm-form">' +
        '<div class="cm-row">' +
          '<input class="cm-input" id="cm-name" maxlength="24" placeholder="你的昵称" autocomplete="nickname" required>' +
          '<span class="cm-live" id="cm-live"></span>' +
        '</div>' +
        '<textarea class="cm-textarea" id="cm-content" maxlength="500" placeholder="说点什么…（纯文本，提交前会自动过滤不当内容）" required></textarea>' +
        '<div class="cm-form-foot">' +
          '<span class="cm-meta" id="cm-len">0 / 500</span>' +
          '<button class="cm-btn cm-btn-primary" id="cm-submit" type="submit">发表评论</button>' +
        '</div>' +
      '</form>' +
      '<div class="cm-list" id="cm-list"></div>';

    listEl = document.getElementById('cm-list');
    bindForm(document.getElementById('cm-form'));

    var filterBtn = document.getElementById('cm-filter-btn');
    if (filterBtn && window.CommentFilter) {
      filterBtn.addEventListener('click', function () { window.CommentFilter.openManager(); });
    }

    if (window.CommentFilter) {
      // 规则没加载完前先禁用提交，避免漏过滤
      if (submitBtn) submitBtn.disabled = true;
      window.CommentFilter.load().then(function () {
        window.CommentFilter.onChange(renderList);
        if (submitBtn) submitBtn.disabled = false;
      });
    } else {
      console.warn('[comments] comment-filter.js 未加载，过滤功能不可用');
    }

    if (!configured()) {
      console.warn('[comments] 未配置 Supabase：请填写 comments.js 顶部的 SUPABASE_URL 与 SUPABASE_ANON_KEY');
      setTip('评论功能暂未开放。');
      var form = document.getElementById('cm-form');
      if (form) form.style.display = 'none';
      return;
    }

    setTip('正在加载评论 ...');
    api('/rest/v1/comments?select=id,name,content,created_at' +
        '&post_slug=eq.' + encodeURIComponent(slug) +
        '&approved=eq.true&order=created_at.desc&limit=300')
      .then(function (rows) {
        items = Array.isArray(rows) ? rows : [];
        renderList();
      })
      .catch(function (err) {
        console.warn('[comments] 加载失败', err);
        setTip('评论加载失败，请稍后刷新重试。', true);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
