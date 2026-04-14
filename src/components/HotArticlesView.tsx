import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rss, ExternalLink, Search, Eye, Calendar, Tag, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import type { HotArticle } from '@/lib/types';
import { HOT_ARTICLES } from '@/lib/hotArticles';

// 模拟文章数据池（刷新时从中随机选取）
const ARTICLE_POOL: HotArticle[] = [
  ...HOT_ARTICLES,
  {
    title: '2024年自媒体变现的5种新方式',
    source: '新榜',
    platform: '微信公众号',
    views: '45.2万',
    url: 'https://www.newrank.cn/',
    tags: ['自媒体', '变现', '运营'],
    publishDate: '2024-01-16',
  },
  {
    title: 'AI工具推荐：这10个效率神器让你事半功倍',
    source: '少数派',
    platform: '知乎',
    views: '38.7万',
    url: 'https://sspai.com/',
    tags: ['AI', '工具', '效率'],
    publishDate: '2024-01-17',
  },
  {
    title: '小红书起号全流程：从0到1万粉',
    source: '运营研究社',
    platform: '小红书',
    views: '52.3万',
    url: 'https://www.woshipm.com/',
    tags: ['小红书', '起号', '涨粉'],
    publishDate: '2024-01-18',
  },
  {
    title: '今日头条推荐机制深度解析',
    source: '虎嗅',
    platform: '今日头条',
    views: '67.1万',
    url: 'https://www.huxiu.com/',
    tags: ['头条', '算法', '推荐'],
    publishDate: '2024-01-19',
  },
  {
    title: '抖音短视频脚本怎么写？万能公式来了',
    source: '电商报',
    platform: '抖音',
    views: '89.5万',
    url: 'https://www.douyin.com/',
    tags: ['抖音', '脚本', '短视频'],
    publishDate: '2024-01-20',
  },
  {
    title: '公众号排版审美升级：2024最新趋势',
    source: '新榜',
    platform: '微信公众号',
    views: '33.8万',
    url: 'https://www.newrank.cn/',
    tags: ['公众号', '排版', '设计'],
    publishDate: '2024-01-21',
  },
  {
    title: '内容创作者如何建立个人IP？',
    source: '36氪',
    platform: '今日头条',
    views: '41.6万',
    url: 'https://36kr.com/',
    tags: ['IP', '个人品牌', '内容'],
    publishDate: '2024-01-22',
  },
  {
    title: '知乎盐选专栏写作指南',
    source: '知乎日报',
    platform: '知乎',
    views: '28.9万',
    url: 'https://daily.zhihu.com/',
    tags: ['知乎', '写作', '盐选'],
    publishDate: '2024-01-23',
  },
  {
    title: '百家号新手入门：如何快速过新手期',
    source: '新榜',
    platform: '百家号',
    views: '19.4万',
    url: 'https://www.newrank.cn/',
    tags: ['百家号', '新手', '入门'],
    publishDate: '2024-01-24',
  },
  {
    title: '自媒体人如何做数据分析？',
    source: '运营研究社',
    platform: '微信公众号',
    views: '27.3万',
    url: 'https://mp.weixin.qq.com/',
    tags: ['数据分析', '运营', '自媒体'],
    publishDate: '2024-01-25',
  },
];

export function HotArticlesView() {
  const [articles, setArticles] = useState<HotArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('views');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [version, setVersion] = useState(0);

  // 从池中随机选取文章
  const loadArticles = useCallback((platform?: string) => {
    setIsLoading(true);

    // 模拟网络延迟
    setTimeout(() => {
      let pool = [...ARTICLE_POOL];

      // 随机打乱顺序
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      // 随机调整阅读量（模拟实时变化）
      pool = pool.map(a => {
        const num = parseFloat(a.views.replace(/[^0-9.]/g, ''));
        const unit = a.views.includes('万') ? '万' : a.views.includes('千') ? '千' : '';
        const variation = (Math.random() - 0.5) * 5; // ±2.5万变化
        const newNum = Math.max(1, num + variation);
        return {
          ...a,
          views: unit ? `${newNum.toFixed(1)}${unit}` : `${Math.round(newNum)}`,
        };
      });

      // 按平台筛选
      if (platform && platform !== 'all') {
        pool = pool.filter(a => a.platform.includes(platform));
      }

      // 取前8条
      setArticles(pool.slice(0, 8));
      setIsLoading(false);
    }, 500);
  }, []);

  // 初始加载和平台切换时加载
  useEffect(() => {
    loadArticles(platformFilter === 'all' ? undefined : platformFilter);
  }, [platformFilter, loadArticles, version]);

  const handleRefresh = () => {
    setVersion(v => v + 1);
    loadArticles(platformFilter === 'all' ? undefined : platformFilter);
  };

  const handleCopyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredArticles = articles
    .filter(a => !searchTerm || a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'views') {
        const parseViews = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) * (v.includes('万') ? 10000 : v.includes('千') ? 1000 : 1);
        return parseViews(b.views) - parseViews(a.views);
      }
      if (sortBy === 'date') return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      return 0;
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Rss className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg">热门文章采集</CardTitle>
              <CardDescription>采集各平台热门文章，获取创作灵感和选题方向</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是热门文章采集？</p>
            <p>该功能采集各平台的热门文章，帮助你：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>发现热点话题</strong>：了解当前什么内容最受欢迎</li>
              <li><strong>获取创作灵感</strong>：从爆款文章中学习写作技巧</li>
              <li><strong>分析爆款逻辑</strong>：理解高流量内容的共同特征</li>
              <li><strong>追踪平台趋势</strong>：了解不同平台的内容偏好</li>
            </ul>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文章标题或标签..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="平台筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部平台</SelectItem>
                <SelectItem value="头条">今日头条</SelectItem>
                <SelectItem value="微信">微信公众号</SelectItem>
                <SelectItem value="知乎">知乎</SelectItem>
                <SelectItem value="小红书">小红书</SelectItem>
                <SelectItem value="抖音">抖音</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">按阅读量</SelectItem>
                <SelectItem value="date">按发布时间</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              刷新
            </Button>
          </div>

          {/* Articles List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, i) => (
                  <div key={`${version}-${i}`} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleCopyTitle(article.title, i)}
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              title="复制标题"
                            >
                              {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              title="查看原文"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.publishDate}
                          </span>
                          <Badge variant="outline" className="text-xs">{article.platform}</Badge>
                          <span>{article.source}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {article.tags.map((tag, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              <Tag className="w-2.5 h-2.5 mr-0.5" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Rss className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">没有找到匹配的文章</p>
                  <p className="text-xs mt-1">试试其他搜索词或筛选条件</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
