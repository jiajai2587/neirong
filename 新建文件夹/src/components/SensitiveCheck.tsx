import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, AlertCircle, ChevronDown, ChevronUp, Edit3, Lightbulb, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SensitiveCheckResult, SensitiveViolation } from '@/lib/types';
import { analyzeSensitive } from '@/lib/analysis';

interface SensitiveCheckProps {
  content: string;
}

export function SensitiveCheck({ content }: SensitiveCheckProps) {
  const [result, setResult] = useState<SensitiveCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedViolations, setExpandedViolations] = useState<Set<number>>(new Set());

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeSensitive(content);
      setResult(res);
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleViolation = (index: number) => {
    const newSet = new Set(expandedViolations);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setExpandedViolations(newSet);
  };

  const getSeverityInfo = (severity: string, type: string) => {
    const isViolation = type === 'violation';
    switch (severity) {
      case 'high': return {
        label: isViolation ? '违规' : '敏感',
        color: 'text-red-500',
        bg: 'bg-red-500/10 border-red-500/30 text-red-500',
        icon: isViolation ? <Shield className="w-4 h-4 text-red-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />
      };
      case 'medium': return {
        label: '注意',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
        icon: <AlertCircle className="w-4 h-4 text-yellow-500" />
      };
      case 'low': return {
        label: '提示',
        color: 'text-green-500',
        bg: 'bg-green-500/10 border-green-500/30 text-green-500',
        icon: <AlertCircle className="w-4 h-4 text-green-500" />
      };
      default: return { label: '未知', color: 'text-muted-foreground', bg: '', icon: null };
    }
  };

  const extractWord = (text: string): string => {
    const match = text.match(/"([^"]+)"/);
    return match ? match[1] : '';
  };

  const extractReason = (text: string): string => {
    const match = text.match(/—\s*(.+)$/);
    return match ? match[1] : '';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg">敏感与违规词检测</CardTitle>
              <CardDescription>检测内容中的敏感词、违规词和高风险表达</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是敏感与违规词检测？</p>
            <p>该功能扫描文章内容，识别可能触发平台审核机制的敏感词和违规词。包括：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>极限用语</strong>：如"最"、"第一"、"绝对"等违反广告法的表述</li>
              <li><strong>敏感话题</strong>：涉及政治、色情、赌博、毒品等违禁内容</li>
              <li><strong>引流话术</strong>：如"加微信"、"扫码关注"等平台限制的引流行为</li>
              <li><strong>虚假承诺</strong>：如"暴富"、"躺赚"、"稳赚不赔"等夸大表述</li>
            </ul>
            <p className="text-xs mt-2">检测到违规词可能导致文章被限流、下架甚至封号，务必重视。</p>
          </div>

          <Button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                检测中...
              </span>
            ) : (
              '开始敏感词检测'
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
                    <span className="text-xs text-muted-foreground">安全评分</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">{result.summary}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.violations.length > 0 ? 'destructive' : 'secondary'}>
                      {result.violations.length > 0 ? `发现 ${result.violations.length} 处问题` : '安全通过'}
                    </Badge>
                    {result.violations.filter(v => v.severity === 'high').length > 0 && (
                      <Badge variant="destructive">
                        {result.violations.filter(v => v.severity === 'high').length} 处高风险
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violations */}
          {result.violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">检测详情</CardTitle>
                <CardDescription>以下段落触发了敏感/违规检测，点击展开查看具体违禁词和修改建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.violations.map((violation, i) => {
                  const severityInfo = getSeverityInfo(violation.severity, violation.type);
                  const word = extractWord(violation.text);
                  const reason = extractReason(violation.text);

                  return (
                    <div key={i} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleViolation(i)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {severityInfo.icon}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {word && (
                                <Badge variant="destructive" className="text-xs">
                                  {word}
                                </Badge>
                              )}
                              <span className={cn('text-xs px-2 py-0.5 rounded-full border', severityInfo.bg)}>
                                {severityInfo.label}
                              </span>
                              {reason && (
                                <span className="text-xs text-muted-foreground">{reason}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {expandedViolations.has(i) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {expandedViolations.has(i) && (
                        <div className="px-3 pb-3 border-t border-border pt-3 space-y-3">
                          {/* Word Info */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
                              <p className="text-xs font-medium text-red-500 mb-1">违禁词</p>
                              <p className="text-lg font-bold text-red-600 dark:text-red-400">{word || '—'}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                              <p className="text-xs font-medium text-yellow-500 mb-1">风险等级</p>
                              <p className={cn('text-lg font-bold', severityInfo.color)}>
                                {violation.severity === 'high' ? '高风险' : violation.severity === 'medium' ? '中风险' : '低风险'}
                              </p>
                            </div>
                          </div>

                          {/* Trigger Text */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">触发这段话</p>
                            <div className="p-2.5 bg-red-500/5 rounded-lg border border-red-500/20">
                              <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                                {word ? violation.triggerText.replace(new RegExp(word, 'g'), `<mark class="bg-red-500/30 text-red-700 dark:text-red-300 px-0.5 rounded">${word}</mark>`) : violation.triggerText}
                              </p>
                            </div>
                          </div>

                          {/* Suggestion */}
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Edit3 className="w-4 h-4 text-green-500" />
                              <p className="text-sm font-medium text-green-600 dark:text-green-400">修改建议</p>
                            </div>
                            <p className="text-sm leading-relaxed">{violation.suggestion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {result.violations.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium">内容安全</p>
                <p className="text-xs text-muted-foreground mt-1">未检测到敏感词和违规内容，可以安全发布</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
