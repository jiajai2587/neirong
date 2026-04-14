import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrafficPrediction } from '@/lib/types';
import { analyzeTraffic } from '@/lib/analysis';

interface TrafficPredictionViewProps {
  content: string;
  title: string;
}

const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    wechat: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.934-6.447 1.733-1.44 4.184-2.15 6.577-1.978C17.227 4.543 13.333 2.188 8.691 2.188zm-2.6 4.408c.56 0 1.015.46 1.015 1.028 0 .566-.455 1.027-1.015 1.027-.56 0-1.016-.46-1.016-1.027 0-.567.456-1.028 1.016-1.028zm5.22 0c.56 0 1.015.46 1.015 1.028 0 .566-.455 1.027-1.015 1.027-.56 0-1.016-.46-1.016-1.027 0-.567.456-1.028 1.016-1.028zm4.502 3.645c-3.273 0-5.93 2.27-5.93 5.07 0 2.8 2.657 5.07 5.93 5.07.66 0 1.297-.096 1.897-.26a.67.67 0 01.555.076l1.472.863a.25.25 0 00.13.042.227.227 0 00.224-.228c0-.056-.023-.11-.037-.166l-.302-1.146a.458.458 0 01.165-.515C22.944 18.09 24 16.397 24 14.41c0-2.8-2.657-5.07-5.887-5.07zm-2.16 2.72c.433 0 .784.355.784.793a.79.79 0 01-.784.793.79.79 0 01-.784-.793c0-.438.351-.793.784-.793zm4.32 0c.433 0 .784.355.784.793a.79.79 0 01-.784.793.79.79 0 01-.784-.793c0-.438.351-.793.784-.793z" />
      </svg>
    ),
    toutiao: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    zhihu: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0H5.721zm9.978 4.094c1.078 0 1.969.89 1.969 1.968v.094c0 1.078-.89 1.969-1.969 1.969h-.094c-1.078 0-1.968-.89-1.968-1.969v-.094c0-1.078.89-1.968 1.968-1.968h.094zM7.5 7.594h3.75v1.875H9.375V15h3.75v1.875H7.5V7.594zm7.5 0h1.875V15H15V7.594z" />
      </svg>
    ),
    xiaohongshu: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.28-.02-.12.03-2.07 1.32-5.84 3.87-.55.38-1.05.56-1.5.55-.49-.01-1.44-.28-2.15-.51-.87-.28-1.56-.43-1.5-.91.03-.25.38-.51 1.05-.77 4.12-1.79 6.87-2.97 8.25-3.54 3.93-1.62 4.75-1.9 5.28-1.91.12 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .38z" />
      </svg>
    ),
    douyin: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.78V6.69h3.77z" />
      </svg>
    ),
    baijia: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  };

  return <>{icons[platform] || <BarChart3 className={className} />}</>;
};

export function TrafficPredictionView({ content, title }: TrafficPredictionViewProps) {
  const [result, setResult] = useState<TrafficPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeTraffic(content);
      setResult(res);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 基于真实内容分析的详细建议
  const generateDetailedSuggestions = (content: string, result: TrafficPrediction) => {
    const suggestions: Array<{ icon: React.ReactNode; title: string; description: string; tips: string[] }> = [];
    const wordCount = content.replace(/\s/g, '').length;
    const paragraphs = content.split(/\n+/).filter(p => p.trim());
    const hasTitle = title.trim().length > 0;
    const hasSubheadings = /^#{1,3}\s|^【|^\d+[.、]/m.test(content);
    const hasNumbers = /\d+/.test(content);
    const hasQuestions = /[？?]/.test(content);
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
    const avgParaLength = paragraphs.length > 0 ? wordCount / paragraphs.length : 0;

    // 标题优化
    suggestions.push({
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      title: '标题优化',
      description: hasTitle ? `当前标题"${title}"（${title.length}字）` : '⚠️ 未设置标题',
      tips: [
        hasTitle ? `标题长度${title.length}字，${title.length >= 15 && title.length <= 30 ? '✅ 长度合适' : '❌ 建议15-30字'}` : '请在编辑器中设置文章标题',
        hasTitle && !hasNumbers ? '💡 标题中加入数字（如"5个技巧"）可提升25%点击率' : '',
        hasTitle && !hasQuestions ? '💡 使用疑问句式（如"为什么..."）能激发好奇心' : '',
        '💡 标题公式：痛点/数字 + 解决方案 + 人群定位',
        '💡 避免使用"最"、"第一"等违规极限用语',
      ].filter(Boolean),
    });

    // 内容质量
    suggestions.push({
      icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
      title: '内容质量分析',
      description: `文章共${wordCount}字，${paragraphs.length}个段落`,
      tips: [
        wordCount >= 800 ? `✅ 字数${wordCount}字，符合平台推荐标准` : `⚠️ 字数${wordCount}字偏少，建议扩充到800-2000字`,
        avgParaLength > 200 ? '⚠️ 平均段落过长，建议拆分为短段落（每段100-150字）' : '✅ 段落长度适中',
        hasSubheadings ? '✅ 使用了小标题，结构清晰' : '⚠️ 建议添加3-5个小标题，提升可读性',
        paragraphs.length >= 3 ? '✅ 段落数量合理' : '⚠️ 段落偏少，建议增加内容深度',
        '💡 每段控制在3-5行，适合手机阅读',
      ].filter(Boolean),
    });

    // 关键词分析
    suggestions.push({
      icon: <CheckCircle2 className="w-4 h-4 text-purple-500" />,
      title: '关键词与热点',
      description: '内容关键词匹配度分析',
      tips: [
        hasNumbers ? '✅ 包含数据/数字，增强可信度' : '⚠️ 建议添加具体数据支撑观点',
        hasQuestions ? '✅ 包含互动性问句' : '⚠️ 建议添加反问句增加互动性',
        hasEmojis ? '✅ 使用了emoji，增加活泼感' : '💡 适当添加emoji可提升阅读体验（特别是小红书）',
        '💡 在标题和开头100字内包含核心关键词',
        '💡 使用3-5个相关标签/话题提升搜索曝光',
        '💡 关注平台热搜榜，蹭热点流量',
      ].filter(Boolean),
    });

    // 发布时机
    suggestions.push({
      icon: <CheckCircle2 className="w-4 h-4 text-orange-500" />,
      title: '发布时机建议',
      description: '根据平台特性推荐最佳发布时间',
      tips: [
        '🌅 早高峰 7:00-9:00：适合资讯类、新闻类内容',
        '☀️ 午间 12:00-13:30：适合轻松、娱乐类内容',
        '🌆 晚高峰 18:00-19:30：适合深度分析类内容',
        '🌙 睡前 21:00-23:00：全平台流量最大时段',
        '📅 周末上午 10:00-11:00：适合长文、深度内容',
        '⏰ 避免在凌晨 0:00-6:00 发布',
      ],
    });

    // 配图建议
    suggestions.push({
      icon: <CheckCircle2 className="w-4 h-4 text-pink-500" />,
      title: '配图与视觉',
      description: '视觉呈现对点击率的影响',
      tips: [
        '📸 至少配3-5张高质量图片',
        '🖼️ 首图决定70%的点击率，必须精美',
        '📐 图片尺寸建议：微信公众号 900×383，小红书 3:4',
        '🎨 使用统一的滤镜风格，增强品牌感',
        '📝 重要内容用加粗或引用框突出',
        '😊 适当使用emoji增加活泼感（但不要过多）',
      ],
    });

    // 互动运营
    suggestions.push({
      icon: <CheckCircle2 className="w-4 h-4 text-indigo-500" />,
      title: '互动与运营',
      description: '互动数据是平台推荐的重要指标',
      tips: [
        '💬 发布后1小时内积极回复评论',
        '❓ 在文末设置互动问题引导评论',
        '❤️ 鼓励读者点赞、收藏、转发',
        '🤝 与同领域创作者互粉互动',
        '📊 定期发布保持账号活跃度',
        '🎯 参与平台活动和话题挑战',
      ],
    });

    return suggestions;
  };

  const detailedSuggestions = result ? generateDetailedSuggestions(content, result) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-lg">流量预测详情</CardTitle>
              <CardDescription>基于内容质量、标题、关键词等多维度预测各平台流量表现</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是流量预测？</p>
            <p>基于以下维度综合评估：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>内容质量</strong>：字数、段落结构、可读性</li>
              <li><strong>标题吸引力</strong>：长度、关键词、悬念感</li>
              <li><strong>关键词匹配</strong>：热门关键词覆盖度</li>
              <li><strong>平台适配度</strong>：内容风格是否符合平台调性</li>
            </ul>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                分析中...
              </span>
            ) : (
              '开始流量预测'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">流量预测总览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={result.overallScore >= 80 ? 'hsl(142 76% 36%)' : result.overallScore >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${result.overallScore * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-2xl font-bold', getScoreColor(result.overallScore))}>
                      {result.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground">综合评分</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">
                    {result.overallScore >= 80 ? '🎉 内容质量优秀，预计获得良好流量' :
                     result.overallScore >= 60 ? '👍 内容质量良好，有流量潜力' :
                     '⚠️ 内容需要优化才能获得更好流量'}
                  </p>
                  <p className="text-xs text-muted-foreground">基于内容质量、关键词、长度等多维度综合评估</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">各平台流量预测</CardTitle>
              <CardDescription>不同平台的预测阅读量和推荐指数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.platforms.map((platform, i) => (
                <div key={i} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      platform.score >= 80 ? 'bg-green-500/10' : platform.score >= 60 ? 'bg-yellow-500/10' : 'bg-red-500/10'
                    )}>
                      <PlatformIcon platform={platform.icon} className={cn(
                        'w-5 h-5',
                        platform.score >= 80 ? 'text-green-500' : platform.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{platform.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={platform.score >= 80 ? 'default' : platform.score >= 60 ? 'secondary' : 'destructive'} className="text-xs">
                            {platform.score >= 80 ? '推荐发布' : platform.score >= 60 ? '可发布' : '建议优化'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">预测阅读：{platform.predictedViews}</span>
                        <span className={cn('text-sm font-bold', getScoreColor(platform.score))}>{platform.score}分</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className={cn('h-2 rounded-full transition-all duration-1000', getScoreBg(platform.score))}
                      style={{ width: `${platform.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    {platform.recommendation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Detailed Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">流量优化建议（基于内容分析）</CardTitle>
              <CardDescription>从6个维度全面提升文章流量表现</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailedSuggestions.map((category, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    {category.icon}
                    <h4 className="text-sm font-medium">{category.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                  <ul className="space-y-1.5">
                    {category.tips.map((tip, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-xs text-muted-foreground mt-0.5">{j + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">快速优化清单</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
