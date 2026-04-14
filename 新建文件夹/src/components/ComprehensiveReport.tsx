import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileCheck, AlertTriangle, CheckCircle2, ArrowRight, Lightbulb, Download, Sparkles, Edit3, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComprehensiveReport, OptimizationItem } from '@/lib/types';
import { generateComprehensiveReport } from '@/lib/analysis';

interface ComprehensiveReportViewProps {
  content: string;
  title: string;
}

export function ComprehensiveReportView({ content, title }: ComprehensiveReportViewProps) {
  const [report, setReport] = useState<ComprehensiveReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = generateComprehensiveReport(content);
      setReport(res);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high': return { label: '高优先级', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> };
      case 'medium': return { label: '中优先级', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: <Lightbulb className="w-4 h-4 text-yellow-500" /> };
      case 'low': return { label: '低优先级', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> };
      default: return { label: '', color: '', bg: '', icon: null };
    }
  };

  const getDetailedAdvice = (item: OptimizationItem): string[] => {
    const adviceMap: Record<string, string[]> = {
      'AI检测': [
        '增加个人真实经历和情感表达，用"我发现"、"我的经验是"等主观句式',
        '使用更口语化的表达方式，适当加入语气词如"啊"、"呢"、"吧"',
        '减少"首先、其次、最后"等模板化连接词，改用更自然的过渡',
        '增加反问句、感叹句等变化句式，打破AI常见的平铺直叙',
        '加入具体数据、时间、地点等细节增强可信度',
      ],
      '同质化': [
        '添加个人独特案例和数据，这是最难被复制的内容',
        '改变文章结构和叙述方式，尝试倒叙、插叙等',
        '加入最新行业动态，增加时效性和独特性',
        '表达个人观点而非泛泛而谈，增加主观评价',
        '使用自己的语言重新表述通用观点',
      ],
      '流量预测': [
        '优化标题，使用数字和悬念吸引点击',
        '增加热门关键词提升搜索曝光',
        '选择流量高峰时段发布（早8-9点、午12-13点、晚20-22点）',
        '搭配3-5张高质量配图可提升30%点击率',
        '在文末添加互动引导，提升评论和转发',
      ],
      '逻辑性': [
        '在段落之间添加过渡句，确保话题转换自然',
        '开头用故事、数据或问题吸引读者',
        '结尾添加总结段落和行动引导',
        '将长段落拆分为短段落，提升可读性',
        '使用小标题组织内容结构',
      ],
      '敏感词': [
        '立即删除所有违规词，尤其是极限用语和虚假承诺',
        '将敏感词替换为建议的替代表达',
        '检查是否有跨平台引流内容并删除',
        '确保不涉及政治、色情、赌博等违禁话题',
        '修改后重新检测确认所有问题已解决',
      ],
      '营销检测': [
        '减少促销话术和引流内容，增加价值分享',
        '用自然的推荐替代硬性广告',
        '删除"加微信"、"扫码关注"等引流话术',
        '将营销内容控制在全文15%以内',
        '分享真实使用体验而非空洞推荐',
      ],
      '内容长度': [
        '添加具体案例和故事充实内容',
        '补充数据支撑增强说服力',
        '增加不同角度的分析展现深度',
        '添加个人经验和见解增加独特性',
        '提供可操作的建议或步骤提升实用价值',
      ],
      '排版结构': [
        '添加3-5个小标题将内容分模块',
        '使用列表和引用框突出重点',
        '控制每段在3-5行以内',
        '使用加粗强调关键词句',
        '适当使用emoji增加活泼感',
      ],
    };
    return adviceMap[item.category] || ['参考检测报告中的具体建议进行修改'];
  };

  const exportReport = () => {
    if (!report) return;
    const reportText = `
# 综合检测报告
## ${title || '未命名文章'}

### 综合评分: ${report.overallScore}分

---

### AI 检测
- AI疑似度: ${report.aiDetection.overallScore}%
- 检测段落数: ${report.aiDetection.segments.length}

### 同质化检测
- 同质化指数: ${report.homogeneity.score}%
- 相似来源: ${report.homogeneity.similarSources.length}个

### 流量预测
- 综合评分: ${report.traffic.overallScore}分
- 推荐平台: ${report.traffic.platforms.filter(p => p.score >= 80).map(p => p.name).join('、') || '暂无强烈推荐'}

### 逻辑性检测
- 逻辑评分: ${report.logic.score}分
- 发现问题: ${report.logic.issues.length}个

### 敏感词检测
- 安全评分: ${report.sensitive.score}分
- 发现问题: ${report.sensitive.violations.length}处

### 营销文检测
- 内容评分: ${report.marketing.score}分
- 广告浓度: ${report.marketing.adDensity}%

---

### 优化清单
${report.optimizationList.map((item, i) => `${i + 1}. [${item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}] ${item.title}\n   ${item.description}\n   建议: ${item.action}`).join('\n\n')}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `检测报告_${title || '文章'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-lg">综合检测报告</CardTitle>
              <CardDescription>一键生成全方位的内容质量检测报告</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是综合检测报告？</p>
            <p>综合检测报告整合了所有检测模块的结果，包括 AI 检测、同质化、流量预测、逻辑性、敏感词和营销文检测，给出一个综合评分和详细的优化清单。</p>
            <p>优化清单按优先级排序，帮助你快速定位最需要改进的地方。</p>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                正在生成综合报告...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                一键生成检测报告
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-4 animate-fade-in">
          {/* Overall Score */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                综合评分
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={report.overallScore >= 80 ? 'hsl(142 76% 36%)' : report.overallScore >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${report.overallScore * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-3xl font-bold', getScoreColor(report.overallScore))}>
                      {report.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground">综合评分</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[
                    { label: 'AI检测', score: 100 - report.aiDetection.overallScore, color: report.aiDetection.overallScore > 70 ? 'text-red-500' : report.aiDetection.overallScore > 40 ? 'text-yellow-500' : 'text-green-500' },
                    { label: '原创度', score: 100 - report.homogeneity.score, color: report.homogeneity.score > 60 ? 'text-red-500' : report.homogeneity.score > 30 ? 'text-yellow-500' : 'text-green-500' },
                    { label: '流量预测', score: report.traffic.overallScore, color: report.traffic.overallScore >= 80 ? 'text-green-500' : report.traffic.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500' },
                    { label: '逻辑性', score: report.logic.score, color: report.logic.score >= 80 ? 'text-green-500' : report.logic.score >= 60 ? 'text-yellow-500' : 'text-red-500' },
                    { label: '安全性', score: report.sensitive.score, color: report.sensitive.score >= 80 ? 'text-green-500' : report.sensitive.score >= 60 ? 'text-yellow-500' : 'text-red-500' },
                    { label: '营销度', score: report.marketing.score, color: report.marketing.score >= 80 ? 'text-green-500' : report.marketing.score >= 60 ? 'text-yellow-500' : 'text-red-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className={cn('text-sm font-bold', item.color)}>{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Issues Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">问题汇总</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className={cn('p-3 rounded-lg border', report.aiDetection.overallScore > 50 ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5')}>
                  <p className="text-xs text-muted-foreground">AI 疑似度</p>
                  <p className={cn('text-xl font-bold', report.aiDetection.overallScore > 50 ? 'text-red-500' : 'text-green-500')}>{report.aiDetection.overallScore}%</p>
                </div>
                <div className={cn('p-3 rounded-lg border', report.homogeneity.score > 50 ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5')}>
                  <p className="text-xs text-muted-foreground">同质化</p>
                  <p className={cn('text-xl font-bold', report.homogeneity.score > 50 ? 'text-red-500' : 'text-green-500')}>{report.homogeneity.score}%</p>
                </div>
                <div className={cn('p-3 rounded-lg border', report.logic.issues.length > 0 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5')}>
                  <p className="text-xs text-muted-foreground">逻辑问题</p>
                  <p className={cn('text-xl font-bold', report.logic.issues.length > 0 ? 'text-yellow-500' : 'text-green-500')}>{report.logic.issues.length}个</p>
                </div>
                <div className={cn('p-3 rounded-lg border', report.sensitive.violations.length > 0 ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5')}>
                  <p className="text-xs text-muted-foreground">敏感违规</p>
                  <p className={cn('text-xl font-bold', report.sensitive.violations.length > 0 ? 'text-red-500' : 'text-green-500')}>{report.sensitive.violations.length}处</p>
                </div>
                <div className={cn('p-3 rounded-lg border', report.marketing.issues.length > 0 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5')}>
                  <p className="text-xs text-muted-foreground">营销特征</p>
                  <p className={cn('text-xl font-bold', report.marketing.issues.length > 0 ? 'text-yellow-500' : 'text-green-500')}>{report.marketing.issues.length}类</p>
                </div>
                <div className={cn('p-3 rounded-lg border', report.traffic.overallScore < 60 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5')}>
                  <p className="text-xs text-muted-foreground">流量评分</p>
                  <p className={cn('text-xl font-bold', report.traffic.overallScore < 60 ? 'text-yellow-500' : 'text-green-500')}>{report.traffic.overallScore}分</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization List */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  一键优化清单
                </CardTitle>
                <Button variant="outline" size="sm" onClick={exportReport} className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  导出报告
                </Button>
              </div>
              <CardDescription>按优先级排序的优化建议，从高到低依次处理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.optimizationList.length > 0 ? (
                report.optimizationList.map((item, i) => {
                  const priorityInfo = getPriorityInfo(item.priority);
                  const detailedAdvice = getDetailedAdvice(item);
                  return (
                    <div key={i} className={cn('p-4 rounded-lg border', priorityInfo.bg)}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 mt-0.5">{priorityInfo.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            <span className={cn('text-xs px-2 py-0.5 rounded-full border', priorityInfo.bg)}>
                              {priorityInfo.label}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>

                      {/* Detailed action */}
                      <div className="ml-7 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">具体修改方法</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.action}</p>
                        <div className="space-y-1.5">
                          {detailedAdvice.map((advice, j) => (
                            <div key={j} className="flex items-start gap-2 text-xs">
                              <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{advice}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-medium">内容质量优秀</p>
                  <p className="text-xs text-muted-foreground mt-1">暂未发现需要优化的项目</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
