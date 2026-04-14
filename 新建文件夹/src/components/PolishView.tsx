import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Check, FileText, Loader2, ArrowRightLeft, ChevronsLeftRight, Wand2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { polishContentLocal } from '@/lib/analysis';
import type { PolishResult } from '@/lib/types';

interface PolishViewProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function PolishView({ content, onContentChange }: PolishViewProps) {
  const [result, setResult] = useState<PolishResult | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [polishMode, setPolishMode] = useState('normal');
  const [activeTab, setActiveTab] = useState('split');
  const [inputText, setInputText] = useState('');
  const [progress, setProgress] = useState(0);

  const handlePolish = async () => {
    const textToPolish = inputText || content;
    if (!textToPolish.trim()) return;
    setIsPolishing(true);
    setProgress(0);
    setResult(null);

    // 模拟处理进度
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // 使用本地润色（立即生效）
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearInterval(progressInterval);
    setProgress(100);

    const polished = polishContentLocal(textToPolish, polishMode);

    setResult({
      original: textToPolish,
      polished,
      changes: getChangesDescription(polishMode),
    });

    setIsPolishing(false);
    setProgress(0);
  };

  const handleCopy = () => {
    if (result?.polished) {
      navigator.clipboard.writeText(result.polished);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (result?.polished) {
      onContentChange(result.polished);
    }
  };

  const highlightDifferences = (original: string, polished: string) => {
    const origLines = original.split('\n');
    const polLines = polished.split('\n');
    const maxLen = Math.max(origLines.length, polLines.length);

    return Array.from({ length: maxLen }, (_, i) => ({
      original: origLines[i] || '',
      polished: polLines[i] || '',
      isDifferent: origLines[i] !== polLines[i],
    }));
  };

  const modeDescriptions: Record<string, { name: string; desc: string; icon: string }> = {
    normal: { name: '普通润色', desc: '优化语言表达，使文章更流畅自然', icon: '✨' },
    reduce_ai: { name: '降低AI痕迹', desc: '重写文章使其更像人工创作', icon: '🤖' },
    enhance: { name: '内容增强', desc: '提升文章吸引力和传播性', icon: '🚀' },
    format: { name: '智能排版', desc: '优化文章结构和格式', icon: '📐' },
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <CardTitle className="text-lg">AI 润色与排版</CardTitle>
              <CardDescription>使用 AI 对内容进行润色、降重、优化和排版</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 什么是 AI 润色？</p>
            <p>AI 润色对文章进行智能优化，包括：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>普通润色</strong>：优化语言表达，使文章更流畅自然</li>
              <li><strong>降低AI痕迹</strong>：重写文章使其更像人工创作，降低AI检测分数</li>
              <li><strong>内容增强</strong>：提升文章吸引力和传播性，增加互动元素</li>
              <li><strong>智能排版</strong>：优化文章结构和格式，提升可读性</li>
            </ul>
          </div>

          {/* Input Area */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">输入内容</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    if (content) {
                      setInputText(content);
                    }
                  }}
                >
                  <ArrowRightLeft className="w-3 h-3 mr-1" />
                  使用编辑器内容
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    setInputText('');
                    setResult(null);
                  }}
                >
                  清空
                </Button>
              </div>
            </div>
            <Textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="在此输入需要润色的内容，或点击'使用编辑器内容'按钮自动填入编辑器中的内容..."
              className="min-h-[150px] text-sm leading-relaxed font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              已输入 {inputText.replace(/\s/g, '').length} 字
              {content && !inputText && '（编辑器中有内容，可一键导入）'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mb-4">
            <Select value={polishMode} onValueChange={setPolishMode}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">✨ 普通润色</SelectItem>
                <SelectItem value="reduce_ai">🤖 降低AI痕迹</SelectItem>
                <SelectItem value="enhance">🚀 内容增强</SelectItem>
                <SelectItem value="format">📐 智能排版</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePolish} disabled={!(inputText || content).trim() || isPolishing} className="flex-1">
              {isPolishing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {modeDescriptions[polishMode].name}中... {progress}%
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  {modeDescriptions[polishMode].name}
                </span>
              )}
            </Button>
          </div>

          {/* Progress bar */}
          {isPolishing && (
            <div className="mb-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Mode description */}
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 mb-2">
            <p className="text-sm text-cyan-600 dark:text-cyan-400">
              <strong>{modeDescriptions[polishMode].icon} {modeDescriptions[polishMode].name}</strong>
              <span className="text-muted-foreground ml-2">{modeDescriptions[polishMode].desc}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="split" className="flex-1">
                <ChevronsLeftRight className="w-3.5 h-3.5 mr-1.5" />
                对比视图
              </TabsTrigger>
              <TabsTrigger value="polished" className="flex-1">润色结果</TabsTrigger>
              <TabsTrigger value="original" className="flex-1">原文</TabsTrigger>
              <TabsTrigger value="changes" className="flex-1">修改说明</TabsTrigger>
            </TabsList>

            {/* Split View */}
            <TabsContent value="split" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">原文 vs 润色后对比</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copied ? '已复制' : '复制润色后'}
                      </Button>
                      <Button size="sm" onClick={handleApply} className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        应用到编辑器
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePolish} className="text-xs">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        重新润色
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">原文</Badge>
                        <span className="text-xs text-muted-foreground">{result.original.replace(/\s/g, '').length} 字</span>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border max-h-[500px] overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap leading-relaxed font-mono text-muted-foreground">
                          {result.original}
                        </pre>
                      </div>
                    </div>

                    {/* Polished */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="text-xs bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">润色后</Badge>
                        <span className="text-xs text-muted-foreground">{result.polished.replace(/\s/g, '').length} 字</span>
                      </div>
                      <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 max-h-[500px] overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap leading-relaxed font-mono">
                          {result.polished}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Line-by-line comparison */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-3">逐行对比（有变化的行已高亮）</h4>
                    <div className="space-y-0.5 max-h-[400px] overflow-y-auto border border-border rounded-lg divide-y divide-border/50">
                      {highlightDifferences(result.original, result.polished).map((line, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex gap-0 text-xs font-mono',
                            line.isDifferent ? 'bg-yellow-500/5' : 'bg-transparent'
                          )}
                        >
                          <div className="w-1/2 pr-3 py-1.5 border-r border-border/50">
                            <span className={cn(
                              'text-muted-foreground',
                              line.isDifferent && 'line-through text-red-400/70'
                            )}>
                              {line.original || <span className="text-muted-foreground/30">（空）</span>}
                            </span>
                          </div>
                          <div className="w-1/2 pl-3 py-1.5">
                            <span className={cn(
                              line.isDifferent ? 'text-cyan-600 dark:text-cyan-400' : 'text-muted-foreground'
                            )}>
                              {line.polished || <span className="text-muted-foreground/30">（空）</span>}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Polished Result */}
            <TabsContent value="polished" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">润色后内容</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copied ? '已复制' : '复制'}
                      </Button>
                      <Button size="sm" onClick={handleApply} className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        应用到编辑器
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={result.polished}
                    readOnly
                    className="min-h-[400px] text-sm leading-relaxed font-mono"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Original */}
            <TabsContent value="original" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">原文内容</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={result.original}
                    readOnly
                    className="min-h-[400px] text-sm leading-relaxed font-mono opacity-70"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Changes */}
            <TabsContent value="changes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">修改说明</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.changes.map((change, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{change}</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>原文字数</span>
                        <span className="font-medium">{result.original.replace(/\s/g, '').length} 字</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>润色后字数</span>
                        <span className="font-medium">{result.polished.replace(/\s/g, '').length} 字</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>字数变化</span>
                        <span className={cn(
                          'font-medium',
                          result.polished.length > result.original.length ? 'text-green-500' : 'text-yellow-500'
                        )}>
                          {result.polished.length > result.original.length ? '+' : ''}
                          {result.polished.replace(/\s/g, '').length - result.original.replace(/\s/g, '').length} 字
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function getChangesDescription(mode: string): string[] {
  switch (mode) {
    case 'normal':
      return [
        '优化了连接词，使表达更自然流畅',
        '替换了常用词汇的重复表达',
        '调整了部分句式结构',
        '增强了语言的自然度和可读性',
      ];
    case 'reduce_ai':
      return [
        '替换了AI常用的模板化连接词',
        '增加了口语化和个人化表达',
        '优化了句式多样性',
        '减少了AI常见的固定句式模式',
        '增加了语气词和自然过渡',
      ];
    case 'enhance':
      return [
        '优化了标题吸引力',
        '增强了开头的互动性和代入感',
        '添加了互动引导语',
        '优化了段落结构和节奏',
        '增加了结尾的互动引导',
      ];
    case 'format':
      return [
        '添加了标题层级结构',
        '优化了段落间距和分段',
        '将长段落拆分为易读短段落',
        '添加了小标题和列表格式',
        '整体排版更清晰易读',
      ];
    default:
      return ['已完成润色处理'];
  }
}
