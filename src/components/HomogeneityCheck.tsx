import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, FileText, AlertCircle, Lightbulb, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HomogeneityResult } from '@/lib/types';
import { analyzeHomogeneity } from '@/lib/analysis';

interface HomogeneityCheckProps {
  content: string;
}

export function HomogeneityCheck({ content }: HomogeneityCheckProps) {
  const [result, setResult] = useState<HomogeneityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeHomogeneity(content);
      setResult(res);
      setIsAnalyzing(false);
    }, 1800);
  };

  const getScoreInfo = (score: number) => {
    if (score > 60) return {
      label: '高度同质化',
      color: 'text-red-500',
      bg: 'bg-red-500',
      badge: 'destructive',
      desc: '内容与已有文章高度相似，建议大幅修改'
    };
    if (score > 30) return {
      label: '中度同质化',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500',
      badge: 'default',
      desc: '内容有一定相似度，建议增加独特观点'
    };
    return {
      label: '低同质化',
      color: 'text-green-500',
      bg: 'bg-green-500',
      badge: 'secondary',
      desc: '内容原创度较高，继续保持'
    };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg">同质化查询</CardTitle>
              <CardDescription>检测内容与网络上已有文章的相似度</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是同质化检测？</p>
            <p>同质化检测分析你的内容与互联网上已有文章的相似程度。同质化过高会导致平台降低推荐权重，影响文章曝光。</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>0-30%：原创度高</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>30-60%：中度相似</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>60%+：高度同质</span>
              </div>
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                检测中...
              </span>
            ) : (
              '开始同质化检测'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">检测结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={result.score > 60 ? 'hsl(0 84% 60%)' : result.score > 30 ? 'hsl(38 92% 50%)' : 'hsl(142 76% 36%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${result.score * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-2xl font-bold', getScoreInfo(result.score).color)}>
                      {result.score}%
                    </span>
                    <span className="text-xs text-muted-foreground">同质化</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={cn('w-4 h-4', getScoreInfo(result.score).color)} />
                    <span className={cn('font-medium', getScoreInfo(result.score).color)}>
                      {getScoreInfo(result.score).label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getScoreInfo(result.score).desc}</p>
                  <Badge variant={getScoreInfo(result.score).badge as any}>
                    {result.score > 60 ? '需要大幅修改' : result.score > 30 ? '建议优化' : '原创度高'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">相似内容来源</CardTitle>
              <CardDescription>以下文章与你的内容有较高相似度</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.similarSources.map((source, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">{source.title}</span>
                      <Badge variant="outline" className="text-xs">{source.similarity}% 相似</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{source.platform}</span>
                      <span>·</span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        查看原文 <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.score > 30 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">降低同质化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit3 className="w-4 h-4 text-blue-500" />
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">修改建议</p>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>添加个人独特的案例和经历，这是最难被复制的内容</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>改变文章结构，尝试倒叙、插叙等不同的叙述方式</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>使用自己的语言重新表述通用观点，避免套用常见模板</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>加入最新的行业数据或新闻，增加时效性和独特性</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>添加个人评价和观点，不要只是陈述事实</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
