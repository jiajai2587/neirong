import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, ChevronDown, ChevronUp, Edit3, Lightbulb, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MarketingCheckResult } from '@/lib/types';
import { analyzeMarketing } from '@/lib/analysis';

interface MarketingCheckProps {
  content: string;
}

export function MarketingCheck({ content }: MarketingCheckProps) {
  const [result, setResult] = useState<MarketingCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeMarketing(content);
      setResult(res);
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleIssue = (index: number) => {
    const newSet = new Set(expandedIssues);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setExpandedIssues(newSet);
  };

  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'high': return { label: '严重', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30 text-red-500' };
      case 'medium': return { label: '中等', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' };
      case 'low': return { label: '轻微', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30 text-green-500' };
      default: return { label: '未知', color: 'text-muted-foreground', bg: '' };
    }
  };

  const getAdDensityLabel = (density: number) => {
    if (density > 30) return { text: '广告浓度过高', color: 'text-red-500' };
    if (density > 15) return { text: '广告浓度偏高', color: 'text-yellow-500' };
    return { text: '广告浓度正常', color: 'text-green-500' };
  };

  const getMarketingAdvice = (type: string): string => {
    const adviceMap: Record<string, string> = {
      '促销话术': '促销话术会让文章像广告，降低读者信任度。建议：①将"限时抢购"改为"近期值得关注" ②将"打折优惠"改为"性价比不错的选择" ③用产品体验分享替代促销描述 ④如果确实要推荐产品，用"我个人使用感受是..."的方式表达',
      '引流话术': '引流话术是平台重点打击的对象。建议：①删除所有"加微信"、"扫码关注"等直接引流 ②改为"欢迎在评论区交流"、"关注我获取更多" ③通过内容价值自然吸引关注，而非强行引流 ④在个人简介中留下联系方式，而非正文中',
      '极限用语': '极限用语违反广告法，必须修改。建议：①"最"改为"非常"、"十分" ②"第一"改为"领先"、"优秀" ③"绝对"改为"基本"、"通常" ④"顶级"改为"高端"、"专业" ⑤"完美"改为"出色"、"优秀"',
      '营销诱导': '营销诱导会降低内容可信度。建议：①将"买一送一"改为"目前有不错的活动" ②将"免费领"改为"可以获取" ③将"0元购"改为"免费体验" ④用客观的产品介绍替代诱导性表述 ⑤增加真实使用体验分享',
      '收益承诺': '收益承诺容易触发平台审核和读者质疑。建议：①删除"暴富"、"躺赚"等夸张表述 ②将"日入"改为"日均" ③将"月入过万"改为"收入可观" ④添加风险提示"收益因人而异" ⑤用真实案例替代承诺性表述',
      '紧迫催促': '紧迫催促会让读者产生反感。建议：①将"赶紧"改为"推荐" ②将"立即"改为"可以" ③将"手慢无"改为"值得关注" ④将"错过等一年"改为"机会难得" ⑤给读者充分的决策空间，而非制造焦虑',
    };
    return adviceMap[type] || '建议减少此类营销特征，增加内容价值分享。';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <CardTitle className="text-lg">营销文与广告浓度检测</CardTitle>
              <CardDescription>检测内容的营销特征和广告浓度</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是营销文与广告浓度检测？</p>
            <p>该功能分析文章中的营销特征，包括促销话术、引流内容、极限用语等。广告浓度过高会导致：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>平台限流</strong>：算法识别为营销内容后降低推荐权重</li>
              <li><strong>用户反感</strong>：过度营销降低阅读体验和信任度</li>
              <li><strong>账号降权</strong>：频繁发布营销内容可能导致账号被标记</li>
            </ul>
            <p className="text-xs mt-2">建议广告浓度控制在15%以下，保持内容的价值属性。</p>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                检测中...
              </span>
            ) : (
              '开始营销文检测'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Score & Ad Density */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">检测结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={result.score >= 80 ? 'hsl(142 76% 36%)' : result.score >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.score * 2.64} 264`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn('text-2xl font-bold', result.score >= 80 ? 'text-green-500' : result.score >= 60 ? 'text-yellow-500' : 'text-red-500')}>
                        {result.score}
                      </span>
                      <span className="text-xs text-muted-foreground">内容评分</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={result.adDensity > 30 ? 'hsl(0 84% 60%)' : result.adDensity > 15 ? 'hsl(38 92% 50%)' : 'hsl(142 76% 36%)'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.adDensity * 2.64} 264`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn('text-xl font-bold', getAdDensityLabel(result.adDensity).color)}>
                        {result.adDensity}%
                      </span>
                    </div>
                  </div>
                  <span className={cn('text-sm font-medium', getAdDensityLabel(result.adDensity).color)}>
                    广告浓度
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          {result.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">营销特征详情</CardTitle>
                <CardDescription>以下营销特征被检测到，点击展开查看触发内容和修改建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.issues.map((issue, i) => {
                  const severityInfo = getSeverityInfo(issue.severity);
                  return (
                    <div key={i} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleIssue(i)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Megaphone className={cn('w-4 h-4 flex-shrink-0', severityInfo.color)} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{issue.type}</Badge>
                              <span className={cn('text-xs px-2 py-0.5 rounded-full border', severityInfo.bg)}>
                                {severityInfo.label}
                              </span>
                              <span className="text-xs text-muted-foreground">{issue.text}</span>
                            </div>
                          </div>
                        </div>
                        {expandedIssues.has(i) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {expandedIssues.has(i) && (
                        <div className="px-3 pb-3 border-t border-border pt-3 space-y-3">
                          {/* Trigger Text */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">触发这段话</p>
                            <div className="p-2.5 bg-pink-500/5 rounded-lg border border-pink-500/20">
                              <p className="text-sm text-pink-600 dark:text-pink-400 leading-relaxed">{issue.triggerText}</p>
                            </div>
                          </div>

                          {/* Marketing Advice */}
                          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Edit3 className="w-4 h-4 text-blue-500" />
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">修改建议</p>
                            </div>
                            <p className="text-sm leading-relaxed">{getMarketingAdvice(issue.type)}</p>
                          </div>

                          {/* Detailed suggestion */}
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="w-4 h-4 text-green-500" />
                              <p className="text-sm font-medium text-green-600 dark:text-green-400">通用建议</p>
                            </div>
                            <ul className="space-y-1.5">
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>用内容价值替代营销话术，让读者自发产生兴趣</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>分享真实体验和数据，而非空洞的推荐</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>保持客观中立的态度，适当提及缺点反而增加可信度</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {result.issues.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Megaphone className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium">内容营销浓度低</p>
                <p className="text-xs text-muted-foreground mt-1">未发现明显营销特征，阅读体验良好</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
