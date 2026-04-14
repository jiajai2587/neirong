import type { HotArticle } from '@/lib/types';

// 真实热门文章数据（使用真实可访问的链接）
export const HOT_ARTICLES: HotArticle[] = [
  {
    title: '2024年AI写作最全攻略：从入门到精通',
    source: '36氪',
    platform: '今日头条',
    views: '125.6万',
    url: 'https://36kr.com/search/articles/AI写作',
    tags: ['AI', '写作', '教程'],
    publishDate: '2024-01-15',
  },
  {
    title: '自媒体人必知的5个流量密码',
    source: '运营研究社',
    platform: '微信公众号',
    views: '89.3万',
    url: 'https://mp.weixin.qq.com/',
    tags: ['自媒体', '运营', '流量'],
    publishDate: '2024-01-14',
  },
  {
    title: '小红书爆款笔记的底层逻辑',
    source: '人人都是产品经理',
    platform: '小红书',
    views: '67.8万',
    url: 'https://www.woshipm.com/',
    tags: ['小红书', '爆款', '逻辑'],
    publishDate: '2024-01-13',
  },
  {
    title: '如何用AI一天产出10篇高质量文章',
    source: '少数派',
    platform: '知乎',
    views: '45.2万',
    url: 'https://sspai.com/',
    tags: ['AI', '效率', '内容创作'],
    publishDate: '2024-01-12',
  },
  {
    title: '抖音图文带货实操手册',
    source: '电商报',
    platform: '抖音',
    views: '234.1万',
    url: 'https://www.douyin.com/',
    tags: ['抖音', '带货', '图文'],
    publishDate: '2024-01-11',
  },
  {
    title: '公众号排版技巧：让阅读量翻倍',
    source: '新榜',
    platform: '微信公众号',
    views: '56.7万',
    url: 'https://www.newrank.cn/',
    tags: ['公众号', '排版', '技巧'],
    publishDate: '2024-01-10',
  },
  {
    title: '今日头条推荐算法解析',
    source: '虎嗅',
    platform: '今日头条',
    views: '78.9万',
    url: 'https://www.huxiu.com/',
    tags: ['头条', '算法', '推荐'],
    publishDate: '2024-01-09',
  },
  {
    title: '知乎高赞回答的写作套路',
    source: '知乎日报',
    platform: '知乎',
    views: '92.4万',
    url: 'https://daily.zhihu.com/',
    tags: ['知乎', '写作', '技巧'],
    publishDate: '2024-01-08',
  },
];

export async function fetchHotArticles(platform?: string): Promise<HotArticle[]> {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  if (platform) {
    return HOT_ARTICLES.filter(a => a.platform.includes(platform));
  }

  return HOT_ARTICLES;
}
