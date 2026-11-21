# 笔记：Dijkstra

不知道大家听没听过这个算法，反正本人对这个是又爱又恨，爱点在于轮椅，恨点在于负权边就gg

## 引入

Dijkstra（跟我读，迪-杰-斯-特-拉！）算法是荷兰神犇**艾兹赫尔·迪杰斯彻**在1956年的咖啡馆里，仅用20分钟就构思出来的史诗级算法，最初这哥们以为是个普通工具，后来发现如此好用！直接发表了。

这玩意可以在**边权非负**的**带权图**中，计算从指定起点到所有其他节点的最短路径，缺德地图什么的都是用这个导航的（或者优化版本）


## 原理

其实这是个贪心，全程你需要维护两个节点集合：

集合 $S$ ：已确定最短路的节点
集合 $Q$ ：没计算的节点

### 步骤

- 初始化‌：起点距离设为棍木，其余所有节点的距离初始化为 $\infty$，所有节点标记为未访问。
- 选点：从未访问的节点中，选出距离起点最小的节点，将其移入集合 $S$，标记为已访问。
- 松弛：遍历该节点的所有邻接节点，若经过当前节点前往邻接节点的路径长度，比邻接节点当前记录的距离更短，就更新邻接节点的距离值。
- 终止：重复选点和松弛步骤，直到所有节点都被移入集合 $S$，或提前确定终点的最短路径即可停止。

### 复杂度
$O(E + V \log {V})$，其中 $E$ 是边数，$V$ 是节点数

### 实现

目前有很多个版本，其实你可以写的有自己的风格，比如用数组实现优先队列，用位图标记访问节点等。但是这些都只是优化，不会改变基本原理。

```cpp
struct edge {
  int v, w;
};

struct node {
  int dis, u;

  bool operator>(const node& a) const { return dis > a.dis; }
};

vector<edge> e[MAXN];
int dis[MAXN], vis[MAXN];
priority_queue<node, vector<node>, greater<node>> q;

void dijkstra(int n, int s) {
  memset(dis, 0x3f, (n + 1) * sizeof(int));
  memset(vis, 0, (n + 1) * sizeof(int));
  dis[s] = 0;
  q.push({0, s});
  while (!q.empty()) {
    int u = q.top().u;
    q.pop();
    if (vis[u]) continue;
    vis[u] = 1;
    for (auto ed : e[u]) {
      int v = ed.v, w = ed.w;
      if (dis[v] > dis[u] + w) {
        dis[v] = dis[u] + w;
        q.push({dis[v], v});
      }
    }
  }
}
```

## 坑点!!!!!

- 负权：这个姥爷算法在边权非负时成立，一旦图中有负权边，必须用 Bellman-Ford 或 SPFA ~~关于____，__了~~

- 溢出：INF值不能设为INT_MAX，否则dist[u] + w会溢出，通常设为INT_MAX/2就没有事了。

- 冗余：必须加`if (d > dist[u])`判断跳过过期数据，否则会重复计算。

- 重复：不能只加单向边

- 0/INF? ：必须将起点dist设为0，其余设为INF