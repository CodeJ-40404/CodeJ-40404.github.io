// 每日由 GitHub Actions 运行，抓取用户公开数据生成 stats.json
// 数据源：GitHub GraphQL API（一次请求拿全：仓库/星数/关注者/贡献日历/语言字节）
import { writeFileSync } from 'node:fs';

const user = process.env.GITHUB_USER || 'CodeJ-40404';
const token = process.env.GITHUB_TOKEN;

const query = `
query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    repositories(ownerAffiliations: OWNER, first: 100, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 20) { edges { size node { name } } }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date } }
      }
    }
  }
}`;

async function main() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'stats-updater'
    },
    body: JSON.stringify({ query, variables: { login: user } })
  });

  if (!res.ok) {
    console.error('HTTP', res.status, await res.text());
    process.exit(1);
  }
  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', JSON.stringify(json.errors));
    process.exit(1);
  }

  const u = json.data.user;

  // 语言占比（按字节）
  const bytes = {};
  for (const repo of u.repositories.nodes) {
    for (const e of repo.languages?.edges ?? []) {
      const name = e.node.name;
      bytes[name] = (bytes[name] ?? 0) + e.size;
    }
  }
  const totalBytes = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(bytes)
    .map(([name, size]) => ({ name, pct: +(size / totalBytes * 100).toFixed(1) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  // 星数
  const stars = u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0);

  // 贡献连击（weeks 顺序天然按日期排列，切勿排序 —— “连续”依赖时间顺序）
  const days = u.contributionsCollection.contributionCalendar.weeks
    .flatMap(w => w.contributionDays)
    .map(d => d.contributionCount);

  let longest = 0, run = 0;
  for (const c of days) {
    if (c > 0) { run++; longest = Math.max(longest, run); }
    else run = 0;
  }
  // 当前连击：从今天往前数；今天为 0 则从昨天起算
  let i = days.length - 1;
  if (days[i] === 0) i--;
  let current = 0;
  while (i >= 0 && days[i] > 0) { current++; i--; }

  const out = {
    updated_at: new Date().toISOString(),
    user: {
      login: user,
      repos: u.repositories.totalCount,
      followers: u.followers.totalCount,
      stars
    },
    contributions: {
      total: u.contributionsCollection.contributionCalendar.totalContributions,
      currentStreak: current,
      longestStreak: longest
    },
    langs
  };

  writeFileSync('stats.json', JSON.stringify(out, null, 2) + '\n');
  console.log('stats.json written:', JSON.stringify(out));
}

main().catch(e => { console.error(e); process.exit(1); });
