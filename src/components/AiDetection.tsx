import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Lightbulb, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AiDetectionResult, AiSegmentResult } from '@/lib/types';
import { analyzeAiDetection } from '@/lib/analysis';

interface AiDetectionProps {
  content: string;
}

export function AiDetection({ content }: AiDetectionProps) {
  const [result, setResult] = useState<AiDetectionResult | null>(null);
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeAiDetection(content);
      setResult(res);
    } catch (error) {
      console.error('AI 检测失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSegment = (index: number) => {
    const newSet = new Set(expandedSegments);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedSegments(newSet);
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-red-500';
    if (score > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getLabel = (score: number) => {
    if (score > 70) return { text: '高疑似AI生成', icon: <XCircle className="w-4 h-4 text-red-500" />, color: 'text-red-500' };
    if (score > 40) return { text: '疑似AI生成', icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />, color: 'text-yellow-500' };
    return { text: '疑似人工创作', icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, color: 'text-green-500' };
  };

  const getSegmentSuggestions = (segment: AiSegmentResult): string[] => {
    const suggestions: string[] = [];
    if (segment.aiProbability > 70) {
      suggestions.push('该段AI痕迹明显，建议完全重写');
      suggestions.push('加入个人真实经历或感受');
      suggestions.push('使用更口语化的表达方式');
      suggestions.push('添加反问句或感叹句增加变化');
    } else if (segment.aiProbability > 40) {
      suggestions.push('适当调整句式结构');
      suggestions.push('增加一些个人化的表达');
      suggestions.push('减少模板化连接词的使用');
    }
    return suggestions;
  };

  const paragraphs = content.split(/\n+/).filter(p => p.trim());

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">AI 检测</CardTitle>
              <CardDescription>检测内容是否由 AI 生成，支持分段检测</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是 AI 检测？</p>
            <p>AI 检测通过分析文本的句式规律、连接词密度、情感表达等特征，判断内容是否由 AI 生成。分数越高，AI 生成的可能性越大。</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>0-40%：疑似人工</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>40-70%：疑似AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>70%+：高疑似AI</span>
              </div>
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                分析中...
              </span>
            ) : (
              '开始 AI 检测'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">检测结果总览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={result.overallScore > 70 ? 'hsl(0 84% 60%)' : result.overallScore > 40 ? 'hsl(38 92% 50%)' : 'hsl(142 76% 36%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${result.overallScore * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-2xl font-bold', getScoreColor(result.overallScore))}>
                      {result.overallScore}%
                    </span>
                    <span className="text-xs text-muted-foreground">AI疑似度</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getLabel(result.overallScore).icon}
                    <span className={cn('font-medium', getLabel(result.overallScore).color)}>
                      {getLabel(result.overallScore).text}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    共检测 {result.segments.length} 个段落，平均 AI 疑似度为 {result.overallScore}%
                  </p>
                  <div className="flex gap-2">
                    <Badge variant={result.overallScore > 70 ? 'destructive' : result.overallScore > 40 ? 'default' : 'secondary'}>
                      {result.overallScore > 70 ? '需要优化' : result.overallScore > 40 ? '建议修改' : '通过'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">分段检测详情</CardTitle>
              <CardDescription>点击展开查看每段的详细分析和修改建议</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.segments.map((segment, index) => {
                const suggestions = getSegmentSuggestions(segment);
                return (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSegment(index)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          第 {index + 1} 段
                        </Badge>
                        <span className="text-sm truncate text-muted-foreground">
                          {segment.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn('text-sm font-medium', getScoreColor(segment.aiProbability))}>
                          {segment.aiProbability}%
                        </span>
                        {expandedSegments.has(index) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {expandedSegments.has(index) && (
                      <div className="px-3 pb-3 space-y-3 border-t border-border pt-2">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-2 rounded bg-muted/50">
                            <p className="text-xs text-muted-foreground">AI 概率</p>
                            <p className={cn('text-lg font-bold', getScoreColor(segment.aiProbability))}>
                              {segment.aiProbability}%
                            </p>
                          </div>
                          <div className="p-2 rounded bg-muted/50">
                            <p className="text-xs text-muted-foreground">判定结果</p>
                            <p className={cn('text-sm font-medium mt-1', getScoreColor(segment.aiProbability))}>
                              {segment.label}
                            </p>
                          </div>
                          <div className="p-2 rounded bg-muted/50">
                            <p className="text-xs text-muted-foreground">置信度</p>
                            <p className="text-lg font-bold text-muted-foreground">
                              {segment.confidence.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <Progress value={segment.aiProbability} className="h-2" />
                        {suggestions.length > 0 && (
                          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Edit3 className="w-4 h-4 text-blue-500" />
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">修改建议</p>
                            </div>
                            <ul className="space-y-1.5">
                              {suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Optimization Suggestions */}
          {result.overallScore > 40 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">整体优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>增加个人经历和真实案例，减少通用性描述</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>使用更口语化、情感化的表达方式</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>避免过度使用"首先、其次、最后"等模板化连接词</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>增加反问句、感叹句等变化句式</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>适当使用网络用语或个人化表达增强真实感</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>加入具体数据、时间、地点等细节增强可信度</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>使用"我觉得"、"我发现"、"我的经验是"等主观表达</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
