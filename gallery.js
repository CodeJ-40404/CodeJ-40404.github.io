/* ============================================================
   CodeJ-40404.github.io — 无聊彩蛋画廊
   页脚入口 → 全屏弹窗 → 4 个纯 Canvas 动态场景
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ================= 场景一：梵高 · 星空 ================= */
  function starryScene() {
    var PAL = ['#3b5bd6', '#2e49b8', '#5a7de0', '#7f9cf5', '#ffd966', '#ffb347', '#c3d3ff'];
    var strokes = [], stars = [], houses = [];
    var initialized = false;

    function field(x, y, t) {
      return Math.sin(x * 0.011 + t * 0.5) + Math.cos(y * 0.014 - t * 0.35) + Math.sin((x + y) * 0.007 + t * 0.2);
    }

    function drawGround(ctx, w, h, t) {
      // 丘陵
      ctx.fillStyle = '#0c1428';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.74);
      ctx.quadraticCurveTo(w * 0.25, h * 0.64, w * 0.5, h * 0.72);
      ctx.quadraticCurveTo(w * 0.75, h * 0.79, w, h * 0.71);
      ctx.lineTo(w, h); ctx.lineTo(0, h);
      ctx.closePath(); ctx.fill();

      // 柏树（右侧火焰形，微微摇曳）
      var cx = w * 0.89, sway = Math.sin(t * 0.7) * 6;
      ctx.fillStyle = '#0a1122';
      ctx.beginPath();
      ctx.moveTo(cx - 4, h);
      ctx.bezierCurveTo(cx - 30 + sway, h * 0.8, cx - 16, h * 0.6, cx - 10 + sway * 0.5, h * 0.42);
      ctx.bezierCurveTo(cx - 4, h * 0.3, cx + 8, h * 0.34, cx + 13, h * 0.46);
      ctx.bezierCurveTo(cx + 22, h * 0.62, cx + 24, h * 0.8, cx + 16, h);
      ctx.closePath(); ctx.fill();

      // 村庄
      for (var i = 0; i < houses.length; i++) {
        var hs = houses[i];
        ctx.fillStyle = '#0a1122';
        ctx.fillRect(hs.x, hs.y, hs.w, hs.h);
        // 屋顶
        ctx.beginPath();
        ctx.moveTo(hs.x - 3, hs.y);
        ctx.lineTo(hs.x + hs.w / 2, hs.y - hs.h * 0.4);
        ctx.lineTo(hs.x + hs.w + 3, hs.y);
        ctx.closePath(); ctx.fill();
        // 窗灯
        for (var j = 0; j < hs.win.length; j++) {
          var wd = hs.win[j];
          var a = 0.35 + 0.45 * Math.max(0, Math.sin(t * 1.3 + wd.ph));
          ctx.fillStyle = 'rgba(255, 205, 110,' + a.toFixed(3) + ')';
          ctx.fillRect(hs.x + wd.ox, hs.y + wd.oy, 4, 5);
        }
      }
    }

    return {
      init: function (ctx, w, h) {
        strokes = []; stars = []; houses = [];
        for (var i = 0; i < 650; i++) {
          strokes.push({
            x: rand(0, w), y: rand(0, h * 0.66),
            c: PAL[Math.floor(Math.random() * PAL.length)],
            w: rand(1.4, 3.4)
          });
        }
        for (var k = 0; k < 13; k++) {
          stars.push({ x: rand(0.05, 0.95) * w, y: rand(0.05, 0.5) * h, r: rand(6, 13), ph: rand(0, 6.28) });
        }
        var hx = w * 0.05;
        while (hx < w * 0.6) {
          var hw = rand(26, 52), hh = rand(22, 46);
          var win = [];
          var cols = Math.max(1, Math.floor(hw / 16)), rows = Math.max(1, Math.floor(hh / 20));
          for (var c = 0; c < cols; c++) {
            for (var r2 = 0; r2 < rows; r2++) {
              if (Math.random() < 0.55) {
                win.push({ ox: 7 + c * 14, oy: 8 + r2 * 18, ph: rand(0, 6.28) });
              }
            }
          }
          houses.push({ x: hx, y: h * 0.8 - hh, w: hw, h: hh, win: win });
          hx += hw + rand(10, 30);
        }
        // 教堂尖顶
        houses.push({ x: w * 0.32, y: h * 0.8 - 58, w: 16, h: 58, win: [] });

        ctx.fillStyle = '#131b45';
        ctx.fillRect(0, 0, w, h);
        initialized = true;
      },
      draw: function (ctx, w, h, t, dt) {
        if (!initialized) this.init(ctx, w, h);
        ctx.fillStyle = 'rgba(15, 22, 58, 0.075)';
        ctx.fillRect(0, 0, w, h);

        // 流动笔触
        ctx.lineCap = 'round';
        for (var i = 0; i < strokes.length; i++) {
          var s = strokes[i];
          var a = field(s.x, s.y, t) * 2.4;
          var step = 110 * dt;
          var nx = s.x + Math.cos(a) * step, ny = s.y + Math.sin(a) * step;
          ctx.strokeStyle = s.c;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = s.w;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(nx, ny); ctx.stroke();
          s.x = nx; s.y = ny;
          if (s.x < -10 || s.x > w + 10 || s.y < -10 || s.y > h * 0.7) {
            s.x = rand(0, w); s.y = rand(0, h * 0.66);
          }
        }
        ctx.globalAlpha = 1;

        // 旋转光环的星
        for (var k = 0; k < stars.length; k++) {
          var st = stars[k];
          var p = 0.7 + 0.3 * Math.sin(t * 2 + st.ph);
          var g = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, st.r * 2.4 * p);
          g.addColorStop(0, 'rgba(255,240,180,0.95)');
          g.addColorStop(0.4, 'rgba(255,215,102,0.35)');
          g.addColorStop(1, 'rgba(255,215,102,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(st.x, st.y, st.r * 2.4 * p, 0, 6.283); ctx.fill();
          ctx.strokeStyle = 'rgba(255,230,150,' + (0.22 * p).toFixed(3) + ')';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r * (0.9 + 0.25 * Math.sin(t + st.ph)), t + st.ph, t + st.ph + 4.4);
          ctx.stroke();
        }

        // 月亮
        var mx = w * 0.13, my = h * 0.12, mr = 20;
        var mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 4.5);
        mg.addColorStop(0, 'rgba(255,246,200,0.9)');
        mg.addColorStop(0.3, 'rgba(255,225,130,0.3)');
        mg.addColorStop(1, 'rgba(255,225,130,0)');
        ctx.fillStyle = mg;
        ctx.beginPath(); ctx.arc(mx, my, mr * 4.5, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#ffe9a8';
        ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();

        drawGround(ctx, w, h, t);
      }
    };
  }

  /* ================= 场景二：银河系 ================= */
  function galaxyScene() {
    var stars = [], nebulae = [], meteors = [];
    var TILT = 0.42;

    return {
      init: function (ctx, w, h) {
        stars = []; nebulae = []; meteors = [];
        var m = Math.min(w, h);
        for (var i = 0; i < 1600; i++) {
          var arm = Math.floor(rand(0, 2)) * Math.PI;
          var dist = Math.pow(Math.random(), 0.62) * m * 0.47;
          var spread = rand(-0.4, 0.4) * (0.3 + dist / (m * 0.4));
          var ang = arm + dist * 0.011 + spread;
          var core = Math.max(0, 1 - dist / (m * 0.2));
          var col;
          if (Math.random() < core * 0.85) col = pick(['#fff4d6', '#ffe9b0', '#ffd27a']);
          else col = pick(['#9fc4ff', '#7aa2ff', '#b48cff', '#e191ff', '#ffffff', '#8fb7ff']);
          stars.push({
            d: dist, ang: ang,
            sp: 0.9 / (0.35 + dist / (m * 0.22)),
            r: rand(0.4, 1.5) + core * 1.3,
            c: col, tw: rand(0, 6.28)
          });
        }
        for (var n = 0; n < 5; n++) {
          nebulae.push({
            d: rand(m * 0.1, m * 0.4), ang: rand(0, 6.28),
            r: rand(m * 0.12, m * 0.24),
            c: pick(['124, 77, 255', '225, 145, 255', '60, 120, 255', '255, 105, 180'])
          });
        }
        ctx.fillStyle = '#04020c';
        ctx.fillRect(0, 0, w, h);
      },
      draw: function (ctx, w, h, t, dt) {
        ctx.fillStyle = 'rgba(4, 2, 12, 0.22)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        // 星云雾霭
        for (var i = 0; i < nebulae.length; i++) {
          var nb = nebulae[i];
          nb.ang += dt * 0.05;
          var nx = w / 2 + Math.cos(nb.ang) * nb.d;
          var ny = h / 2 + Math.sin(nb.ang) * nb.d * TILT;
          var g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nb.r);
          g.addColorStop(0, 'rgba(' + nb.c + ',0.08)');
          g.addColorStop(1, 'rgba(' + nb.c + ',0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(nx, ny, nb.r, 0, 6.283); ctx.fill();
        }

        // 恒星
        for (var k = 0; k < stars.length; k++) {
          var s = stars[k];
          s.ang += s.sp * dt * 0.35;
          var x = w / 2 + Math.cos(s.ang) * s.d;
          var y = h / 2 + Math.sin(s.ang) * s.d * TILT;
          var tw = 0.6 + 0.4 * Math.sin(t * 3 + s.tw);
          ctx.globalAlpha = tw;
          ctx.fillStyle = s.c;
          ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // 核球
        var m2 = Math.min(w, h);
        var cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, m2 * 0.2);
        cg.addColorStop(0, 'rgba(255,240,200,0.9)');
        cg.addColorStop(0.3, 'rgba(255,220,150,0.3)');
        cg.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(w / 2, h / 2, m2 * 0.2, 0, 6.283); ctx.fill();

        // 流星
        if (Math.random() < 0.008 && meteors.length < 2) {
          meteors.push({ x: rand(0.1, 0.9) * w, y: -10, vx: rand(-2, 2), vy: rand(4, 7), life: 1 });
        }
        for (var j = meteors.length - 1; j >= 0; j--) {
          var mt = meteors[j];
          mt.x += mt.vx; mt.y += mt.vy; mt.life -= 0.015;
          if (mt.life <= 0 || mt.y > h + 30) { meteors.splice(j, 1); continue; }
          var lg = ctx.createLinearGradient(mt.x, mt.y, mt.x - mt.vx * 12, mt.y - mt.vy * 12);
          lg.addColorStop(0, 'rgba(255,255,255,' + (0.9 * mt.life) + ')');
          lg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = lg; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(mt.x, mt.y); ctx.lineTo(mt.x - mt.vx * 12, mt.y - mt.vy * 12); ctx.stroke();
        }

        ctx.globalCompositeOperation = 'source-over';
      }
    };
  }

  /* ================= 场景三：雨中霓虹城市 ================= */
  function rainScene() {
    var near = [], far = [], rain = [], signs = [], ripples = [];
    var flashT = 0, nextFlash = 0;

    function genSkyline(w, h, base, count, color) {
      var list = [], x = -20;
      while (x < w + 20 && list.length < count) {
        var bw = rand(w * 0.04, w * 0.09);
        var bh = rand(h * (base - 0.18), h * base);
        var wins = [];
        var cols = Math.floor(bw / 14), rows = Math.floor(bh / 18);
        for (var c = 0; c < cols; c++) {
          for (var r = 0; r < rows; r++) {
            if (Math.random() < 0.4) {
              wins.push({
                ox: 5 + c * 13, oy: 8 + r * 16,
                c: Math.random() < 0.72 ? '255, 200, 120' : pick(['0, 240, 255', '255, 42, 109', '179, 136, 255']),
                ph: rand(0, 6.28), on: Math.random() < 0.85
              });
            }
          }
        }
        list.push({ x: x, y: h * 0.88 - bh, w: bw, h: bh, c: color, win: wins });
        x += bw + rand(2, 14);
      }
      return list;
    }

    return {
      init: function (ctx, w, h) {
        far = genSkyline(w, h, 0.52, 16, '#141a33');
        near = genSkyline(w, h, 0.72, 14, '#070a16');
        rain = []; ripples = [];
        for (var i = 0; i < 230; i++) {
          rain.push({ x: rand(0, w), y: rand(0, h), l: rand(9, 18), v: rand(420, 760) });
        }
        signs = [];
        for (var k = 0; k < 7; k++) {
          var b = pick(near);
          signs.push({
            x: b.x + rand(4, Math.max(5, b.w - 10)),
            y: b.y + rand(10, Math.max(11, b.h * 0.4)),
            w2: rand(5, 8), h2: rand(28, 62),
            c: pick(['#ff2a6d', '#00f0ff', '#ffe600', '#39ff8e', '#b388ff', '#ff6b3d']),
            ph: rand(0, 6.28), offUntil: 0
          });
        }
        flashT = 0; nextFlash = rand(4, 9);
        ctx.fillStyle = '#05030f';
        ctx.fillRect(0, 0, w, h);
      },
      draw: function (ctx, w, h, t, dt) {
        // 天空
        var sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, '#05030f');
        sky.addColorStop(0.7, '#0d0620');
        sky.addColorStop(1, '#150a2e');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // 闪电
        nextFlash -= dt;
        if (nextFlash <= 0) { flashT = 0.28; nextFlash = rand(6, 14); }
        if (flashT > 0) {
          flashT -= dt;
          ctx.fillStyle = 'rgba(200, 215, 255,' + (flashT * 1.1).toFixed(3) + ')';
          ctx.fillRect(0, 0, w, h);
        }

        // 远景楼群
        for (var i = 0; i < far.length; i++) {
          var fb = far[i];
          ctx.fillStyle = fb.c;
          ctx.fillRect(fb.x, fb.y, fb.w, fb.h);
          ctx.fillStyle = 'rgba(180, 190, 230, 0.12)';
          for (var r = 0; r < fb.win.length; r++) {
            var fwin = fb.win[r];
            ctx.fillRect(fb.x + fwin.ox, fb.y + fwin.oy, 3, 4);
          }
        }

        // 近景楼群 + 窗灯
        for (var k = 0; k < near.length; k++) {
          var b = near[k];
          ctx.fillStyle = b.c;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          for (var j = 0; j < b.win.length; j++) {
            var win = b.win[j];
            if (Math.random() < 0.0015) win.on = !win.on;
            var a = win.on ? 0.25 + 0.45 * Math.max(0, Math.sin(t * 1.6 + win.ph)) : 0.04;
            ctx.fillStyle = 'rgba(' + win.c + ',' + a.toFixed(3) + ')';
            ctx.fillRect(b.x + win.ox, b.y + win.oy, 4, 5);
          }
        }

        // 霓虹招牌
        var groundY = h * 0.88;
        for (var s = 0; s < signs.length; s++) {
          var sg = signs[s];
          if (t < sg.offUntil) continue;
          if (Math.random() < 0.003) { sg.offUntil = t + rand(0.08, 0.3); continue; }
          var flick = 0.75 + 0.25 * Math.sin(t * 9 + sg.ph);
          ctx.save();
          ctx.globalAlpha = flick;
          ctx.shadowBlur = 14;
          ctx.shadowColor = sg.c;
          ctx.fillStyle = sg.c;
          ctx.fillRect(sg.x, sg.y, sg.w2, sg.h2);
          ctx.restore();
          // 倒影
          var rg = ctx.createLinearGradient(0, groundY, 0, h);
          rg.addColorStop(0, 'rgba(255,255,255,0.001)');
          var col = sg.c;
          rg.addColorStop(0.02, col);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.save();
          ctx.globalAlpha = 0.16 * flick;
          ctx.translate(sg.x * 2 + sg.w2, 0); ctx.scale(-1, 1);
          ctx.fillStyle = rg;
          ctx.fillRect(sg.x, groundY, sg.w2 * 1.6, (h - groundY) * (0.3 + 0.4 * Math.abs(Math.sin(sg.ph))));
          ctx.restore();
        }

        // 湿地路面
        var road = ctx.createLinearGradient(0, groundY, 0, h);
        road.addColorStop(0, '#0a0716');
        road.addColorStop(1, '#020108');
        ctx.fillStyle = road;
        ctx.fillRect(0, groundY, w, h - groundY);

        // 雨丝
        ctx.strokeStyle = 'rgba(170, 200, 255, 0.33)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var p = 0; p < rain.length; p++) {
          var rp = rain[p];
          rp.y += rp.v * dt; rp.x -= rp.v * dt * 0.12;
          if (rp.y > h) {
            if (rp.y - rp.v * dt < groundY && Math.random() < 0.4) {
              ripples.push({ x: rp.x, y: rand(groundY + 4, h - 4), r: 1, life: 1 });
            }
            rp.y = rand(-40, 0); rp.x = rand(0, w + 60);
          }
          ctx.moveTo(rp.x, rp.y);
          ctx.lineTo(rp.x + rp.l * 0.12, rp.y - rp.l);
        }
        ctx.stroke();

        // 涟漪
        for (var q = ripples.length - 1; q >= 0; q--) {
          var rr = ripples[q];
          rr.r += 26 * dt; rr.life -= 1.6 * dt;
          if (rr.life <= 0) { ripples.splice(q, 1); continue; }
          ctx.strokeStyle = 'rgba(150, 190, 255,' + (rr.life * 0.3).toFixed(3) + ')';
          ctx.beginPath();
          ctx.ellipse(rr.x, rr.y, rr.r, rr.r * 0.32, 0, 0, 6.283);
          ctx.stroke();
        }
      }
    };
  }

  /* ================= 场景四：随机变形电路网 ================= */
  function circuitScene() {
    var nodes = [], edges = [], pulses = [];
    var morphT = 0, PULSE_COLORS = ['#00ff9d', '#00f0ff', '#ff2a6d', '#ffe600'];

    function rewire() {
      edges = [];
      var seen = {};
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        // 连最近的 2~3 个节点
        var near = nodes.map(function (m, idx) {
          return { idx: idx, d: (m.x - n.x) * (m.x - n.x) + (m.y - n.y) * (m.y - n.y) };
        }).sort(function (a, b) { return a.d - b.d; });
        var k = 2 + Math.floor(Math.random() * 2);
        for (var j = 1; j <= k && j < near.length; j++) {
          var a = Math.min(i, near[j].idx), b = Math.max(i, near[j].idx);
          var key = a + '-' + b;
          if (!seen[key]) { seen[key] = 1; edges.push([a, b]); }
        }
      }
    }

    function morph() {
      for (var i = 0; i < nodes.length; i++) {
        if (Math.random() < 0.6) {
          nodes[i].tx = rand(0.05, 0.95) * nodes[i].W;
          nodes[i].ty = rand(0.05, 0.95) * nodes[i].H;
        }
      }
      rewire();
    }

    return {
      init: function (ctx, w, h) {
        nodes = []; pulses = []; morphT = 0;
        var count = Math.max(28, Math.min(52, Math.floor(w * h / 16000)));
        for (var i = 0; i < count; i++) {
          nodes.push({
            x: rand(0.05, 0.95) * w, y: rand(0.05, 0.95) * h,
            tx: 0, ty: 0, W: w, H: h,
            chip: Math.random() < 0.14
          });
        }
        for (var n = 0; n < nodes.length; n++) { nodes[n].tx = nodes[n].x; nodes[n].ty = nodes[n].y; }
        rewire();
        for (var p = 0; p < 26; p++) {
          pulses.push({
            e: Math.floor(Math.random() * edges.length),
            p: Math.random(), dir: Math.random() < 0.5 ? 1 : -1,
            sp: rand(0.5, 1.4), c: pick(PULSE_COLORS)
          });
        }
        ctx.fillStyle = '#020806';
        ctx.fillRect(0, 0, w, h);
      },
      draw: function (ctx, w, h, t, dt) {
        ctx.fillStyle = 'rgba(2, 8, 6, 0.26)';
        ctx.fillRect(0, 0, w, h);

        // 节点漂移
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          n.x += (n.tx - n.x) * Math.min(1, dt * 1.6);
          n.y += (n.ty - n.y) * Math.min(1, dt * 1.6);
          n.x += Math.sin(t * 0.8 + i) * 0.08;
          n.y += Math.cos(t * 0.7 + i * 1.3) * 0.08;
        }

        // 周期性随机变形
        morphT += dt;
        if (morphT > 4.5) { morphT = 0; morph(); }

        // 走线
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.17)';
        ctx.beginPath();
        for (var e = 0; e < edges.length; e++) {
          var a = nodes[edges[e][0]], b = nodes[edges[e][1]];
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();

        // 脉冲
        ctx.globalCompositeOperation = 'lighter';
        for (var p = 0; p < pulses.length; p++) {
          var pu = pulses[p];
          if (!edges[pu.e]) { pu.e = Math.floor(Math.random() * edges.length); continue; }
          var na = nodes[edges[pu.e][0]], nb = nodes[edges[pu.e][1]];
          pu.p += pu.sp * dt * pu.dir;
          if (pu.p > 1 || pu.p < 0) {
            pu.e = Math.floor(Math.random() * edges.length);
            pu.p = pu.dir > 0 ? 0 : 1;
            pu.c = pick(PULSE_COLORS);
            continue;
          }
          var x = na.x + (nb.x - na.x) * pu.p;
          var y = na.y + (nb.y - na.y) * pu.p;
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = pu.c;
          ctx.fillStyle = pu.c;
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283); ctx.fill();
          ctx.restore();
        }
        ctx.globalCompositeOperation = 'source-over';

        // 节点
        for (var k = 0; k < nodes.length; k++) {
          var nd = nodes[k];
          if (nd.chip) {
            ctx.strokeStyle = 'rgba(0, 255, 157, 0.55)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(nd.x - 6, nd.y - 6, 12, 12);
            ctx.fillStyle = 'rgba(0, 255, 157, 0.5)';
            ctx.fillRect(nd.x - 1.5, nd.y - 1.5, 3, 3);
          } else {
            ctx.strokeStyle = 'rgba(0, 255, 157, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(nd.x, nd.y, 3, 0, 6.283); ctx.stroke();
          }
        }
      }
    };
  }

  /* ================= 画廊弹窗 ================= */
  var SCENES = [
    { name: '星空之夜', cap: '梵高 · 星空 — 每一笔都在流动', make: starryScene },
    { name: '银河系', cap: '银河 — 一亿颗星辰的旋转木马', make: galaxyScene },
    { name: '霓虹雨城', cap: '雨中的霓虹城市 — 夜色会呼吸', make: rainScene },
    { name: '电路迷宫', cap: '大型电路网 — 它在不断地重连自己', make: circuitScene }
  ];

  var modal = null, canvas = null, ctx = null, captionEl = null;
  var rafId = 0, running = false, sceneIdx = 0, scene = null, lastT = 0;

  function buildModal() {
    modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'hidden';
    modal.innerHTML =
      '<div class="gallery-panel">' +
      '  <div class="gallery-bar">' +
      '    <span class="t-dot red"></span><span class="t-dot yellow"></span><span class="t-dot green"></span>' +
      '    <div class="gallery-tabs">' +
      SCENES.map(function (s, i) {
        return '<button type="button" class="gallery-tab" data-idx="' + i + '">' + s.name + '</button>';
      }).join('') +
      '    </div>' +
      '    <button type="button" class="gallery-close" title="关闭 (ESC)"><i class="fas fa-xmark"></i></button>' +
      '  </div>' +
      '  <canvas id="gallery-canvas"></canvas>' +
      '  <div class="gallery-caption"><span id="gallery-cap"></span><span>GALLERY.EXE // 40404</span></div>' +
      '</div>';
    document.body.appendChild(modal);

    canvas = document.getElementById('gallery-canvas');
    ctx = canvas.getContext('2d');
    captionEl = document.getElementById('gallery-cap');

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeGallery();
    });
    modal.querySelector('.gallery-close').addEventListener('click', closeGallery);
    modal.querySelectorAll('.gallery-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchScene(+tab.dataset.idx);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeGallery();
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') switchScene((sceneIdx + 1) % SCENES.length);
        if (e.key === 'ArrowLeft') switchScene((sceneIdx - 1 + SCENES.length) % SCENES.length);
      }
    });
    window.addEventListener('resize', function () {
      if (modal && !modal.classList.contains('hidden')) sizeCanvas();
    });
  }

  function sizeCanvas() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (scene) scene.init(ctx, w, h);
  }

  function switchScene(idx) {
    sceneIdx = idx;
    modal.querySelectorAll('.gallery-tab').forEach(function (tab, i) {
      tab.classList.toggle('active', i === idx);
    });
    captionEl.textContent = SCENES[idx].cap;
    scene = SCENES[idx].make();
    sizeCanvas();
    if (reduced) { // 减少动态偏好：只画一帧
      scene.draw(ctx, canvas.clientWidth, canvas.clientHeight, 0, 0.016);
    }
  }

  function loop(tms) {
    if (!running) return;
    var t = tms / 1000;
    var dt = Math.min(0.05, t - lastT || 0.016);
    lastT = t;
    scene.draw(ctx, canvas.clientWidth, canvas.clientHeight, t, dt);
    rafId = requestAnimationFrame(loop);
  }

  function openGallery(idx) {
    if (!modal) buildModal();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    switchScene(idx || 0);
    if (!reduced) {
      running = true;
      lastT = 0;
      rafId = requestAnimationFrame(loop);
    }
  }

  function closeGallery() {
    running = false;
    cancelAnimationFrame(rafId);
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.boring-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { openGallery(Math.floor(Math.random() * SCENES.length)); });
  });
})();
