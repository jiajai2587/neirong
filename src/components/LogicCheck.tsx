import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LogicCheckResult } from '@/lib/types';
import { analyzeLogic } from '@/lib/analysis';

interface LogicCheckProps {
  content: string;
}

export function LogicCheck({ content }: LogicCheckProps) {
  const [result, setResult] = useState<LogicCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeLogic(content);
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
      case 'high': return { label: '严重', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30 text-red-500', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> };
      case 'medium': return { label: '中等', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500', icon: <AlertTriangle className="w-4 h-4 text-yellow-500" /> };
      case 'low': return { label: '轻微', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30 text-green-500', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> };
      default: return { label: '未知', color: 'text-muted-foreground', bg: '', icon: null };
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-lg">内容逻辑与连贯性检测</CardTitle>
              <CardDescription>检查文章逻辑结构、段落过渡和内容连贯性</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是内容逻辑与连贯性检测？</p>
            <p>该功能分析文章的逻辑结构，包括：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>段落连贯性</strong>：检测相邻段落之间是否有合理的过渡，话题是否跳跃过大</li>
              <li><strong>开头吸引力</strong>：评估开头是否足够引人入胜，能否抓住读者注意力</li>
              <li><strong>结构完整性</strong>：检查文章是否有清晰的开头、主体和结尾结构</li>
              <li><strong>逻辑流畅度</strong>：整体阅读体验是否顺畅，是否存在逻辑断层</li>
            </ul>
            <p className="text-xs mt-2">分数越高表示逻辑结构越清晰，阅读体验越好。</p>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                检测中...
              </span>
            ) : (
              '开始逻辑性检测'
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
                    <span className="text-xs text-muted-foreground">逻辑评分</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">{result.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3 h-3" />
                    <span>共检测 {result.issues.length} 个问题</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          {result.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">问题详情</CardTitle>
                <CardDescription>点击展开查看每个问题的详细说明和修改建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.issues.map((issue, i) => {
                  const severityInfo = getSeverityInfo(issue.severity);
                  return (
                    <div key={i} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleIssue(i)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {severityInfo.icon}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{issue.type}</Badge>
                              <span className={cn('text-xs px-2 py-0.5 rounded-full border', severityInfo.bg)}>
                                {severityInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-0.5">{issue.description}</p>
                          </div>
                        </div>
                        {expandedIssues.has(i) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {expandedIssues.has(i) && (
                        <div className="px-3 pb-3 border-t border-border pt-2 space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">问题描述</p>
                            <p className="text-sm">{issue.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-green-500 mb-1">修改建议</p>
                            <p className="text-sm text-green-600 dark:text-green-400">{issue.suggestion}</p>
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
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium">文章逻辑结构清晰</p>
                <p className="text-xs text-muted-foreground mt-1">未发现明显的逻辑问题，段落过渡自然</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
