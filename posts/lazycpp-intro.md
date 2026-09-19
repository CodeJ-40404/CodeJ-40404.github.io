> 2026-07-12 · 介绍我写的 C++ 懒人头文件。

**[lazycpp](https://github.com/CodeJ-40404/lazycpp)** 是一个 header-only 的 C++ "懒惰"头文件 —— 目标很简单：**让 C++ 写起来没那么啰嗦**。

## 为什么要偷懒？

C++ 的样板代码是出了名的多。每次写小工具或者算法题，都要重复一堆 `#include`、`using namespace std;`、类型声明……作为一个懒人，我受够了。

## 设计原则

1. **Header-only** —— 拖一个头文件进项目就能用，零配置
2. **不侵入** —— 不用 macro 污染全局，按需启用
3. **编译期优先** —— 能在编译期干的事绝不留到运行时

## 快速上手

```cpp
#include "lazy.h"

int main() {
    // 更短的类型别名 / 更顺手的小工具
    // 具体用法见仓库 README
    return 0;
}
```

## 一些实现笔记

惰性求值的核心是把「计算」推迟到真正需要结果的那一刻，配合 C++ 的模板可以在编译期完成很多分发：

$\text{lazy}(f) \equiv \lambda x.\, f(x) \ \text{evaluated on demand}$

模板元编程里常见的 `if constexpr` 分发、SFINAE 检测，都是让"懒"成立的基础设施。

## 链接

- 仓库：<https://github.com/CodeJ-40404/lazycpp>
- 欢迎 issue / PR，一起把 C++ 写得再懒一点
