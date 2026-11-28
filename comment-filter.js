/* ============================================================
   CodeJ-40404.github.io — 评论内容过滤模块
   规则来源：blocked-words.json（内置兜底）
   性能：全部规则编译为一条正则，单次正则扫描完成检测与屏蔽
   ============================================================ */
(function (global) {
  'use strict';

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
    regex: null
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

  /* ---------- 加载 ---------- */
  function load() {
    return fetch('blocked-words.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .catch(function () { return null; })
      .then(function (data) {
        var base = data && Array.isArray(data.words) && data.words.length ? data.words : DEFAULT_WORDS;
        var prot = data && Array.isArray(data.protected) ? PROTECTED_WORDS.concat(data.protected) : PROTECTED_WORDS;
        setWords(base, prot);
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

  global.CommentFilter = {
    load: load,
    mask: mask
  };
})(window);
