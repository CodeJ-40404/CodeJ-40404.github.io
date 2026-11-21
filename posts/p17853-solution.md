> 2026-11-21 · 洛谷 P17853 [LBA-OI R6 A] Su通ki信yu题ri 个人题解。

## 注

$S\setminus\{x\}$：从集合 $S$ 中删去 $x$ 后得到的集合。

## 题意

给定大小 $m$ 的集合 $A$，对于每个 $x\in A$，判断：

> 设 $S=A\setminus\{x\}$，按照策略从 $S$ 算出来的「加入数」是否 $=x$？

如果是，输出所有可能的 $x$。

> **提示**
>
> 因为 $x$ 是可比豆最后加入的，所以一开始只可能给出 $S=A\setminus\{x\}$。

## 思路

~~先让我们恭喜这个区做出来 A 了~~

要判一下 $A$ 中的每个数有没有可能是 $x$。

先固定一个 $x$，能够参与配对的数是所有不在 $S$ 中的数，设一个 $C=\{1,2,\ldots,n\}\setminus S$。

每次都取当前最小的、没匹配的数；$S$ 中一共有 $m-1$ 个数，也就是说会匹配掉 $C$ 中最小的 $m-1$ 个数。

肉眼瞪一下，最终的数就是 $C$ 中第 $m$ 小的数。

历经千辛万苦，**$x$ 在 $C$ 中排名第 $m$。**

## 化简

$S=A\setminus\{x\}$，集合 $C$ 中小于 $x$ 的数，正好是小于 $x$ 同时 $\notin A$ 的数。

设 $A$ 为 `a[0], a[1], ..., a[m-1]`。当前是 `a[i]`，那么它之前有 $i$ 个 $A$ 中的数。所以小于 `a[i]` 且 $\notin A$ 的数有 $(a[i]-1)-i$ 个。

要 `a[i]` 在 $C$ 中排第 $m$，那它前面必须有 $m-1$ 个数：$(a[i]-1)-i=m-1$，也就是 $a[i]=i+m$。

遍历 `a[i]`，保留满足 `a[i]==i+m` 的数就 _大功告成_ 了。

## 复杂度

$O(m)$，稳的一批（`https://www.luogu.com.cn/record/308580030`）。

## ~~大家最喜欢的~~ 代码环节

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	int t;
	cin>>t;
	while(t--){
		int n,m;
		cin>>n>>m;
		vector<int> a(m),ans;
		for(int &x:a){cin>>x;} for(int i=0;i<m;++i)if(a[i]==m+i)ans.push_back(a[i]);
		cout<<ans.size()<<'\n';
		for (int i=0;i<(int)ans.size(); ++i) {
			if(i)cout<<' ';
			cout<<ans[i];
		}
		cout<< '\n';
	}
	return 0;
}
```
