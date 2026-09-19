> 2026-09-19 · 博客系统正式上线，第一篇文章。

欢迎来到我的赛博角落。这个博客部署在 GitHub Pages 上，**纯静态、无后端** —— 所有文章都是仓库里的 Markdown 文件，渲染完全在浏览器完成。

## 这个博客支持什么？

- **完整 Markdown**：标题、列表、表格、引用、代码块（带语法高亮）……
- **数学公式**：由 KaTeX 渲染，行内用 `$...$`，独立公式块用 `$$...$$`
- **嵌入式 HTML**：Markdown 里可以直接写 HTML 标签，随便玩

## 数学公式演示

质能方程：

$E = mc^2$

算法复杂度是 $O(n \log n)$，欧拉公式 $e^{i\pi} + 1 = 0$ 是数学里最浪漫的一行。

高斯积分：

$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$

## 代码演示

```cpp
#include <iostream>

int main() {
    std::cout << "hello, world. -- 40404" << std::endl;
    return 0;
}
```

## 嵌入式 HTML 演示

下面这个霓虹小卡片就是直接写在 Markdown 里的原生 HTML：

<div style="border:1px solid #00f0ff; box-shadow:0 0 18px rgba(0,240,255,.4); padding:1rem 1.4rem; margin:1.2em 0; font-family:Consolas,monospace;">
  <strong style="color:#ff2a6d;">[SYSTEM]</strong> 这是一段嵌入式 HTML —— Markdown 原样放行，样式随你定义。
</div>

## 如何发布新文章

1. 在 `posts/` 目录新建一个 Markdown 文件，比如 `my-post.md`
2. 在仓库根目录的 `posts.json` 里加一条记录：

```json
{
  "slug": "my-post",
  "title": "文章标题",
  "date": "2026-01-01",
  "tag": "DEVLOG"
}
```

3. commit & push，GitHub Pages 自动更新，主页博客列表按日期排序展示

> `slug` 就是文件名（去掉 `.md`），文章链接为 `post.html?p=slug`。
> tag 常用值：`META` / `DEVLOG` / `CPP` / `PYTHON`（当然也可以自定义）。

---

下一个目标：把 Chemical-World 的开发日志写起来。Stay tuned.
