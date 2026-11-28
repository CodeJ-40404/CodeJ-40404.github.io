/* ============================================================
   CodeJ-40404.github.io — 评论内容过滤模块
   规则来源：blocked-words.json（内置兜底），本机修改可覆盖
   性能：全部规则编译为一条正则，单次 replace 完成检测与屏蔽
   ============================================================ */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'codej-comment-words';
  var MAX_SCAN = 4000; // 超长输入只扫描前 4000 字，避免极端情况拖慢页面

  // 内置兜底规则：只收录直接脏话，不收录缩写形式（sb / cnm / tmd / nm$l 等）
  var DEFAULT_WORDS = [
    '傻逼', '操你妈', '草你妈', '妈逼', '妈了个逼', '你妈的', '去你妈的',
    '滚你妈的', '他妈的', '干你娘', '日你妈', '草泥马', '操你', '贱人',
    '婊子', '贱货', '骚货', '杂种', '狗娘养的', '王八蛋', '操逼', '鸡巴', '蒋介石',
    '唐若钦', '王浩龙', '周一然', '周涛', '王子豪', '王梓豪', '孔祥雷','闫立','庞涵福',
    '操死','骚逼','约炮','卖逼','国民党','汪精卫',
    'fuck', 'fucking', 'shit', 'bitch', 'bastard'
  ];

  // 永久生效、任何入口都无法移除
  var PROTECTED_WORDS = ['刘诗杰'];

  // 检测时忽略的分隔符：防止「傻 逼」「傻*逼」这类简单拆字绕过
  var SKIP_RE = /[\s\u200b-\u200f\u2060\ufeff·•.,，。、;；:：!！?？'"“”‘’`~～\-—_*＊|/\\()（）\[\]【】{}<>《》]/;

  var state = {
    words: [],
    protected: PROTECTED_WORDS.slice(),
    regex: null,
    onChange: null
  };

  /* ---------- 规范化 ---------- */
  // 去掉分隔符并做 NFKC + 小写，同时记录每个字符对应的原文位置，便于回写屏蔽
  function canonicalize(text) {
    var chars = [];
    var map = [];
    var i, k, ch, low;
    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);
      if (SKIP_RE.test(ch)) continue;
      low = String(ch).normalize('NFKC').toLowerCase();
      for (k = 0; k < low.length; k++) {
        chars.push(low.charAt(k));
        map.push(i);
      }
    }
    return { s: chars.join(''), map: map };
  }

  function canonicalWord(word) {
    return canonicalize(String(word)).s;
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ---------- 编译规则 ---------- */
  function setWords(words, protectedWords) {
    var seen = {};
    var list = [];
    var prot = [];
    var all;

    (protectedWords || state.protected || []).forEach(function (w) {
      var c = canonicalWord(w);
      if (!c) return;
      w = String(w).trim();
      if (prot.indexOf(w) < 0) prot.push(w);
    });
    state.protected = prot.length ? prot : PROTECTED_WORDS.slice();

    all = (words || []).concat(state.protected);
    all.forEach(function (w) {
      if (typeof w !== 'string') return;
      w = w.trim();
      var c = canonicalWord(w);
      if (!c || seen[c]) return;
      seen[c] = 1;
      list.push(w);
    });

    state.words = list;
    // 长词优先，避免「操你妈」被「操你」抢先匹配成两个词
    var pattern = list
      .map(function (w) { return canonicalWord(w); })
      .sort(function (a, b) { return b.length - a.length; })
      .map(escapeRe)
      .join('|');
    state.regex = pattern ? new RegExp(pattern, 'g') : null;
  }

  /* ---------- 本机规则 ---------- */
  function readLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : null;
    } catch (e) {
      return null;
    }
  }

  function saveLocal(words) {
    var clean = (words || []).filter(function (w) {
      return typeof w === 'string' && w.trim();
    }).map(function (w) { return w.trim(); });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch (e) { /* 隐私模式忽略 */ }
    setWords(clean, state.protected);
    if (typeof state.onChange === 'function') state.onChange();
  }

  function resetLocal() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setWords(DEFAULT_WORDS, PROTECTED_WORDS);
    if (typeof state.onChange === 'function') state.onChange();
  }

  /* ---------- 加载 ---------- */
  function load() {
    return fetch('blocked-words.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .catch(function () { return null; })
      .then(function (data) {
        var base = data && Array.isArray(data.words) && data.words.length ? data.words : DEFAULT_WORDS;
        var prot = data && Array.isArray(data.protected) ? PROTECTED_WORDS.concat(data.protected) : PROTECTED_WORDS;
        var local = readLocal();
        setWords(local === null ? base : local, prot);
        return state.words;
      });
  }

  /* ---------- 核心：检测并屏蔽 ---------- */
  function mask(text) {
    var src = String(text == null ? '' : text);
    if (!src) return { text: '', hits: 0, words: [] };
    if (!state.regex) return { text: src, hits: 0, words: [] };

    var scan = src.length > MAX_SCAN ? src.slice(0, MAX_SCAN) : src;
    var can = canonicalize(scan);
    var chars = src.split('');
    var hitWords = [];
    var m;

    state.regex.lastIndex = 0;
    while ((m = state.regex.exec(can.s)) !== null) {
      hitWords.push(m[0]);
      for (var i = m.index; i < m.index + m[0].length; i++) {
        chars[can.map[i]] = '*';
      }
    }
    return {
      text: chars.join(''),
      hits: hitWords.length,
      words: Array.from(new Set(hitWords))
    };
  }

  /* ---------- 屏蔽词管理入口 ---------- */
  function openManager() {
    var old = document.querySelector('.cm-modal-mask');
    if (old) old.parentNode.removeChild(old);

    var wrap = document.createElement('div');
    wrap.className = 'cm-modal-mask';

    var modal = document.createElement('div');
    modal.className = 'cm-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '屏蔽词管理');

    var title = document.createElement('h3');
    title.innerHTML = '屏蔽词管理 <span class="cm-modal-sub">LOCAL</span>';

    var note = document.createElement('p');
    note.className = 'cm-modal-note';
    note.textContent = '一行一个词。受保护词（' + state.protected.join('、') +
      '）始终生效且无法移除；这里的修改只保存在当前浏览器，要全站生效请编辑 blocked-words.json 后提交。';

    var ta = document.createElement('textarea');
    ta.className = 'cm-words';
    ta.spellcheck = false;
    ta.value = state.words.filter(function (w) {
      return state.protected.indexOf(w) < 0;
    }).join('\n');

    var actions = document.createElement('div');
    actions.className = 'cm-modal-actions';
    actions.innerHTML =
      '<button class="cm-btn cm-btn-primary" type="button" data-act="save">保存并应用</button>' +
      '<button class="cm-btn" type="button" data-act="reset">恢复默认</button>' +
      '<button class="cm-btn cm-btn-ghost" type="button" data-act="close">取消</button>';

    modal.appendChild(title);
    modal.appendChild(note);
    modal.appendChild(ta);
    modal.appendChild(actions);
    wrap.appendChild(modal);
    document.body.appendChild(wrap);

    function close() {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) close();
    });
    actions.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      if (act === 'save') {
        var words = ta.value.split('\n').map(function (w) { return w.trim(); })
          .filter(function (w) { return w && state.protected.indexOf(w) < 0; });
        saveLocal(words);
        close();
      } else if (act === 'reset') {
        resetLocal();
        close();
      } else {
        close();
      }
    });

    ta.focus();
  }

  global.CommentFilter = {
    load: load,
    mask: mask,
    getWords: function () { return state.words.slice(); },
    getProtected: function () { return state.protected.slice(); },
    saveLocal: saveLocal,
    resetLocal: resetLocal,
    openManager: openManager,
    onChange: function (fn) { state.onChange = fn; }
  };
})(window);
