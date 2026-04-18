import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, Copy, Trash2, Download, Upload,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Code, Link, Image as ImageIcon, Undo2, Redo2, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export function ContentEditor({ content, onContentChange, title, onTitleChange }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onContentChange(value);
    setWordCount(value.replace(/\s/g, '').length);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newText = content.substring(0, start) + before + selected + after + content.substring(end);
    onContentChange(newText);
    setWordCount(newText.replace(/\s/g, '').length);
  };

  const clearContent = () => {
    onContentChange('');
    onTitleChange('');
    setWordCount(0);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content);
  };

  const exportContent = () => {
    const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || '文章'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importContent = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          onContentChange(text);
          setWordCount(text.replace(/\s/g, '').length);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-foreground">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/50 pl-4 py-1 my-2 bg-primary/5 italic text-muted-foreground">$1</blockquote>')
      .replace(/`(.*?)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc my-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal my-1">$1</li>')
      .split('\n').map((line, i) => {
        if (line.trim() === '') return '<div class="h-3"></div>';
        if (line.startsWith('<li')) return line;
        if (line.startsWith('<blockquote')) return line;
        if (line.startsWith('<h')) return line;
        return `<p class="mb-2 leading-relaxed text-foreground">${line}</p>`;
      }).join('');
  };

  const platforms = [
    { value: 'all', label: '全平台通用' },
    { value: 'wechat', label: '微信公众号' },
    { value: 'toutiao', label: '今日头条' },
    { value: 'zhihu', label: '知乎' },
    { value: 'xiaohongshu', label: '小红书' },
    { value: 'douyin', label: '抖音图文' },
    { value: 'baijia', label: '百家号' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">内容编辑器</CardTitle>
                <p className="text-sm text-muted-foreground">撰写或粘贴你的自媒体内容</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {wordCount} 字
              </Badge>
              <Select defaultValue="all">
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">文章标题</Label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="请输入文章标题..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg flex-wrap">
            <button onClick={() => insertText('# ', '')} className="p-2 rounded hover:bg-muted transition-colors" title="一级标题">
              <Heading1 className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('## ', '')} className="p-2 rounded hover:bg-muted transition-colors" title="二级标题">
              <Heading2 className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('### ', '')} className="p-2 rounded hover:bg-muted transition-colors" title="三级标题">
              <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button onClick={() => insertText('**', '**')} className="p-2 rounded hover:bg-muted transition-colors" title="加粗">
              <Bold className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('*', '*')} className="p-2 rounded hover:bg-muted transition-colors" title="斜体">
              <Italic className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('`', '`')} className="p-2 rounded hover:bg-muted transition-colors" title="代码">
              <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button onClick={() => insertText('\n> ', '')} className="p-2 rounded hover:bg-muted transition-colors" title="引用">
              <Quote className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('\n- ', '')} className="p-2 rounded hover:bg-muted transition-colors" title="无序列表">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('\n1. ', '')} className="p-2 rounded hover:bg-muted transition-colors" title="有序列表">
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button onClick={() => insertText('[', '](url)')} className="p-2 rounded hover:bg-muted transition-colors" title="链接">
              <Link className="w-4 h-4" />
            </button>
            <button onClick={() => insertText('![图片描述](图片链接)', '')} className="p-2 rounded hover:bg-muted transition-colors" title="图片">
              <ImageIcon className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button onClick={() => {}} className="p-2 rounded hover:bg-muted transition-colors" title="撤销">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={() => {}} className="p-2 rounded hover:bg-muted transition-colors" title="重做">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                编辑
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                预览
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-2">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder={"在此输入或粘贴你的文章内容...\n\n支持 Markdown 格式工具栏，可以快速添加标题、列表、加粗等格式。\n\n提示：内容越丰富，检测结果越准确。建议至少输入200字以上。"}
                className="min-h-[350px] text-sm leading-relaxed resize-y font-mono"
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-2">
              <div className="min-h-[350px] p-6 bg-background border border-border rounded-lg">
                {content ? (
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                  />
                ) : (
                  <div className="text-muted-foreground text-center py-20">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>暂无内容可预览</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>字数：{wordCount}</span>
              <span>段落：{content.split(/\n+/).filter(p => p.trim()).length}</span>
              <span>句子：{content.split(/[。！？.!?]/).filter(s => s.trim()).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={importContent} className="p-2 rounded hover:bg-muted transition-colors text-xs flex items-center gap-1" title="导入">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">导入</span>
              </button>
              <button onClick={exportContent} className="p-2 rounded hover:bg-muted transition-colors text-xs flex items-center gap-1" title="导出">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">导出</span>
              </button>
              <button onClick={copyContent} className="p-2 rounded hover:bg-muted transition-colors text-xs flex items-center gap-1" title="复制">
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">复制</span>
              </button>
              <button onClick={clearContent} className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors text-xs flex items-center gap-1" title="清空">
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">清空</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
