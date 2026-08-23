<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
  <title>CodeJ · 40404</title>
  <!-- Font Awesome 6 (免费图标库) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #0b0d15;
      font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1.5rem;
      color: #e3e7f0;
      line-height: 1.5;
    }

    /* 主卡片 —— 毛玻璃 + 微光边框 */
    .card {
      max-width: 800px;
      width: 100%;
      background: rgba(18, 22, 33, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 2.5rem;
      padding: 2.5rem 2.2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(88, 130, 255, 0.15);
      transition: transform 0.25s ease, box-shadow 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .card:hover {
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(88, 130, 255, 0.3);
      transform: translateY(-4px);
    }

    /* 头像 + 标识行 */
    .profile-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.2rem 1.8rem;
      margin-bottom: 2rem;
    }

    .avatar-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2c3e8f, #1b1f33);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.8rem;
      font-weight: 700;
      color: #b9cbff;
      box-shadow: 0 8px 20px rgba(0, 20, 80, 0.6), 0 0 0 2px rgba(70, 130, 255, 0.3);
      transition: all 0.2s;
      user-select: none;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .avatar-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #1e2b4f;
      border-radius: 40px;
      padding: 0.3rem 0.8rem;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #a0c0ff;
      border: 1px solid #3a5290;
      box-shadow: 0 2px 8px rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      white-space: nowrap;
    }

    .title-group {
      flex: 1;
    }

    .title-group h1 {
      font-size: 2.2rem;
      font-weight: 600;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #f0f5ff, #b6cbff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      display: inline-block;
      margin-bottom: 0.2rem;
      line-height: 1.2;
    }

    .title-group .handle {
      font-size: 1.1rem;
      color: #8fa4dd;
      background: rgba(30, 50, 100, 0.4);
      padding: 0.2rem 1rem;
      border-radius: 40px;
      display: inline-block;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(100, 150, 255, 0.15);
      font-weight: 400;
      letter-spacing: 0.3px;
      margin-top: 0.25rem;
    }

    .title-group .handle i {
      margin-right: 6px;
      color: #6d8ddb;
    }

    /* 动态标语 / 标签 */
    .tagline {
      background: rgba(20, 30, 60, 0.5);
      backdrop-filter: blur(4px);
      padding: 0.9rem 1.6rem;
      border-radius: 60px;
      border-left: 3px solid #4f7aff;
      margin: 1.5rem 0 2rem 0;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      border: 1px solid rgba(70, 130, 255, 0.2);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .tagline i {
      color: #6d93ff;
      font-size: 1.2rem;
    }

    .tagline span {
      font-weight: 300;
      font-size: 1.1rem;
      letter-spacing: 0.3px;
      color: #d2defa;
    }

    .tagline .highlight {
      background: #2c3f7a;
      padding: 0.2rem 1rem;
      border-radius: 40px;
      color: white;
      font-weight: 500;
      font-size: 0.9rem;
      border: 1px solid #4e71c0;
    }

    /* 分隔装饰 */
    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.3), transparent);
      margin: 1.8rem 0 2rem 0;
    }

    /* 项目 / 链接网格 */
    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.2rem;
      margin-top: 0.5rem;
    }

    .link-item {
      background: rgba(22, 30, 52, 0.6);
      backdrop-filter: blur(4px);
      padding: 1rem 1.2rem;
      border-radius: 1.8rem;
      display: flex;
      align-items: center;
      gap: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.03);
      transition: all 0.2s ease;
      text-decoration: none;
      color: #d3defa;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      font-weight: 450;
      letter-spacing: 0.2px;
    }

    .link-item i {
      font-size: 1.6rem;
      width: 2rem;
      text-align: center;
      color: #7a9bff;
      transition: color 0.2s;
    }

    .link-item span {
      flex: 1;
      font-size: 1rem;
    }

    .link-item:hover {
      background: rgba(40, 60, 120, 0.6);
      border-color: #4f7aff;
      transform: scale(1.02) translateY(-2px);
      box-shadow: 0 8px 20px rgba(30, 60, 180, 0.3);
      color: white;
    }

    .link-item:hover i {
      color: #b3cbff;
    }

    /* 特殊项目 — 突出显示 */
    .link-item.primary {
      background: linear-gradient(145deg, #1d2b5a, #172145);
      border-color: #3f68dd;
    }

    .link-item.primary i {
      color: #b8ceff;
    }

    /* 页脚 / 状态 */
    .footer-meta {
      margin-top: 2.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.9rem;
      color: #7486b5;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      padding-top: 1.8rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(0, 20, 40, 0.3);
      padding: 0.3rem 1rem 0.3rem 0.8rem;
      border-radius: 60px;
      border: 1px solid #2e427a;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #3aff8f;
      box-shadow: 0 0 12px #2aff7a;
      animation: pulse-dot 2s infinite;
    }

    @keyframes pulse-dot {
      0% { opacity: 0.6; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0.6; transform: scale(0.95); }
    }

    .footer-meta .copy {
      letter-spacing: 0.5px;
      font-weight: 300;
    }

    .footer-meta .copy i {
      margin: 0 4px;
      color: #5b79c7;
    }

    /* 响应式优化 */
    @media (max-width: 550px) {
      .card {
        padding: 1.8rem 1.2rem;
        border-radius: 2rem;
      }
      .profile-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .avatar {
        width: 78px;
        height: 78px;
        font-size: 2.2rem;
      }
      .title-group h1 {
        font-size: 1.8rem;
      }
      .tagline {
        padding: 0.7rem 1.2rem;
        font-size: 0.95rem;
        flex-wrap: wrap;
      }
      .links-grid {
        grid-template-columns: 1fr;
      }
    }

    /* 极简滚动条 (可选) */
    ::-webkit-scrollbar {
      width: 4px;
      background: #0f131f;
    }
    ::-webkit-scrollbar-thumb {
      background: #2e427a;
      border-radius: 20px;
    }

    /* 一些点缀 */
    .glow-text {
      color: #b4cbff;
    }

    .badge-404 {
      background: #1d1f30;
      padding: 0.2rem 1rem;
      border-radius: 40px;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid #4f6fb0;
      color: #a6beff;
    }
  </style>
</head>
<body>
  <div class="card" role="main">

    <!-- 头部：头像 + 名称 + 标识 -->
    <div class="profile-header">
      <div class="avatar-wrapper">
        <div class="avatar">CJ</div>
        <div class="avatar-badge"><i class="fas fa-code"></i> 40404</div>
      </div>
      <div class="title-group">
        <h1>CodeJ</h1>
        <div class="handle">
          <i class="fas fa-at"></i> CodeJ-40404
        </div>
        <div style="margin-top: 0.3rem; display: flex; gap: 0.3rem; flex-wrap: wrap;">
          <span class="badge-404"><i class="fas fa-hashtag"></i> 0x40404</span>
          <span class="badge-404" style="border-color: #3a5f9a;"><i class="fas fa-terminal"></i> dev·ops</span>
        </div>
      </div>
    </div>

    <!-- 动态标签 / 状态 slogan -->
    <div class="tagline">
      <i class="fas fa-bolt"></i>
      <span># 构建 · 探索 · 重构</span>
      <span class="highlight"><i class="far fa-clock"></i> 全栈 · 云原生</span>
      <i class="fas fa-chevron-right" style="color: #4f7aff; font-size: 0.8rem;"></i>
      <span style="font-weight: 300; color: #b0c4f0;">" 40404 不仅仅是数字 "</span>
    </div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 重要链接 / 项目卡片 -->
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem;">
      <h3 style="font-weight: 400; font-size: 1.1rem; letter-spacing: 0.3px; color: #a8beed;">
        <i class="fas fa-cube" style="margin-right: 8px;"></i> 快捷入口
      </h3>
      <span style="font-size: 0.8rem; color: #526a9e;"><i class="fas fa-arrow-right"></i> 持续迭代</span>
    </div>

    <div class="links-grid">
      <!-- GitHub  -->
      <a href="#" class="link-item" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i>
        <span>GitHub</span>
        <i class="fas fa-external-link-alt" style="font-size: 0.7rem; opacity: 0.6; margin-left: auto;"></i>
      </a>
      <!-- 博客 / 技术笔记 -->
      <a href="#" class="link-item primary" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-pen-fancy"></i>
        <span>技术笔记</span>
        <i class="fas fa-arrow-right" style="font-size: 0.7rem; opacity: 0.7;"></i>
      </a>
      <!-- 项目 showcase -->
      <a href="#" class="link-item" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-rocket"></i>
        <span>项目 · 实验室</span>
        <i class="fas fa-code-branch" style="font-size: 0.7rem; opacity: 0.6; margin-left: auto;"></i>
      </a>
      <!-- 个人简历 / 关于 -->
      <a href="#" class="link-item" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-user-astronaut"></i>
        <span>关于 · 简历</span>
        <i class="fas fa-chevron-circle-right" style="font-size: 0.7rem; opacity: 0.5; margin-left: auto;"></i>
      </a>
    </div>

    <!-- 第二行：额外社交 / 工具 (展示更多个性) -->
    <div style="display: flex; flex-wrap: wrap; gap: 0.8rem 1.2rem; margin-top: 1.2rem; padding: 0.2rem 0;">
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.2); padding: 0.2rem 1rem 0.2rem 0.8rem; border-radius: 30px; border: 1px solid #273b6b;">
        <i class="fas fa-laptop-code" style="color: #6d93ff;"></i> <span style="font-size: 0.9rem;">TypeScript · Go</span>
      </span>
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.2); padding: 0.2rem 1rem 0.2rem 0.8rem; border-radius: 30px; border: 1px solid #273b6b;">
        <i class="fas fa-cloud" style="color: #6d93ff;"></i> <span style="font-size: 0.9rem;">K8s · AWS</span>
      </span>
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.2); padding: 0.2rem 1rem 0.2rem 0.8rem; border-radius: 30px; border: 1px solid #273b6b;">
        <i class="fas fa-brain" style="color: #6d93ff;"></i> <span style="font-size: 0.9rem;">AI · 开源</span>
      </span>
    </div>

    <!-- 页脚信息 + 状态 -->
    <div class="footer-meta">
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span style="color: #b8cef0;"># 活跃 · 编码中</span>
      </div>
      <div class="copy">
        <i class="far fa-copyright"></i> 2026 · CodeJ-40404 
        <span style="margin: 0 6px; opacity: 0.2;">|</span> 
        <i class="fas fa-code"></i> 开源精神
      </div>
    </div>

    <!-- 微小的装饰签名 (极简) -->
    <div style="margin-top: 0.8rem; font-size: 0.7rem; color: #3b4e7a; text-align: right; letter-spacing: 1px; border-top: 1px dashed #1e2b4a; padding-top: 0.8rem; opacity: 0.5;">
      <i class="fas fa-robot"></i>  <span>build · 0x40404 · deploy</span>
    </div>
  </div>
</body>
</html>
