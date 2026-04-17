import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Copy, Check, FileText, Loader2, Wand2, RefreshCw, AlertCircle, Image, Download } from 'lucide-react';
import { generateArticle } from '@/lib/analysis';
import { getApiConfig, getImageGenerationConfig, callImageGenerationApi } from '@/lib/api';

interface GenerateArticleProps {
  onContentGenerated: (content: string) => void;
}

export function GenerateArticleView({ onContentGenerated }: GenerateArticleProps) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('微信公众号');
  const [style, setStyle] = useState('干货教程');
  const [wordCount, setWordCount] = useState(1500);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => {
    const config = getApiConfig();
    return !!config.apiKey;
  });
  const [hasImageApiKey, setHasImageApiKey] = useState(() => {
    const config = getImageGenerationConfig();
    return !!config.apiKey;
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState('1024x1024');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setStreamingText('');
    setGeneratedContent('');

    try {
      const result = await generateArticle(topic, platform, style, wordCount, (chunk) => {
        setStreamingText(prev => prev + chunk);
      });

      if (result) {
        setGeneratedContent(result);
        // 自动生成图片提示词
        const autoPrompt = `为文章"${topic}"生成一张适合${platform}平台的配图，风格为${style}，图片需要与文章内容相关，吸引人且专业。`;
        setImagePrompt(autoPrompt);
      }
    } catch {
      // Fallback
      const result = await generateArticle(topic, platform, style, wordCount);
      setGeneratedContent(result);
      // 自动生成图片提示词
      const autoPrompt = `为文章"${topic}"生成一张适合${platform}平台的配图，风格为${style}，图片需要与文章内容相关，吸引人且专业。`;
      setImagePrompt(autoPrompt);
    }

    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGeneratedImage('');

    try {
      const imageUrl = await callImageGenerationApi(imagePrompt, {
        size: imageSize
      });
      setGeneratedImage(imageUrl);
    } catch (error: any) {
      console.error('图片生成失败:', error);
      alert('图片生成失败: ' + (error.message || '未知错误'));
    }

    setIsGeneratingImage(false);
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `article-image-${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent);
    }
  };

  const quickTopics = [
    'AI写作技巧', '自媒体运营', '短视频创作', '个人品牌',
    '内容营销', '流量增长', '用户增长', '产品推广',
    '职场技能', '学习方法', '时间管理', '效率工具',
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-lg">AI 生成文章</CardTitle>
              <CardDescription>输入主题，AI 自动为你创作高质量自媒体文章</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* API Status */}
          {!hasApiKey && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-600 dark:text-amber-400">
                <p className="font-medium">当前使用本地生成模式</p>
                <p className="text-xs mt-1 text-amber-500/80">
                  未配置 API Key，使用内置模板生成文章。如需更高质量的文章，请在"API 接口设置"中配置通义千问 API Key（qwen-turbo 有免费额度）。
                </p>
              </div>
            </div>
          )}
          {hasApiKey && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-600 dark:text-green-400">
                <p className="font-medium">AI API 已连接</p>
                <p className="text-xs mt-1 text-green-500/80">
                  已配置 API，将使用 AI 模型生成更高质量的文章。
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 如何使用？</p>
            <p>输入文章主题，选择目标平台和风格，AI 会自动生成适合该平台的高质量文章。生成后可以直接使用或进一步编辑。</p>
          </div>

          {/* Quick Topics */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">快捷主题</Label>
            <div className="flex flex-wrap gap-2">
              {quickTopics.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 transition-colors border border-border"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">文章主题 *</Label>
              <Input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="例如：AI写作技巧、自媒体运营攻略..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">目标平台</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="微信公众号">微信公众号</SelectItem>
                    <SelectItem value="今日头条">今日头条</SelectItem>
                    <SelectItem value="知乎">知乎</SelectItem>
                    <SelectItem value="小红书">小红书</SelectItem>
                    <SelectItem value="抖音图文">抖音图文</SelectItem>
                    <SelectItem value="百家号">百家号</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">文章风格</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="干货教程">📚 干货教程</SelectItem>
                    <SelectItem value="观点评论">💭 观点评论</SelectItem>
                    <SelectItem value="新闻资讯">📰 新闻资讯</SelectItem>
                    <SelectItem value="个人分享">👤 个人分享</SelectItem>
                    <SelectItem value="专业严肃">🎓 专业严肃</SelectItem>
                    <SelectItem value="轻松幽默">😄 轻松幽默</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">目标字数</Label>
                <span className="text-sm text-muted-foreground">{wordCount} 字</span>
              </div>
              <Slider
                value={[wordCount]}
                onValueChange={([v]) => setWordCount(v)}
                min={500}
                max={3000}
                step={100}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>500字</span>
                <span>3000字</span>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={!topic.trim() || isGenerating} className="w-full">
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI 正在创作中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  开始生成文章
                </span>
              )}
            </Button>
          </div>

          {/* Streaming output */}
          {isGenerating && streamingText && (
            <div className="mt-4 p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm font-medium">AI 正在创作...</span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{streamingText}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  生成结果
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? '已复制' : '复制'}
                  </Button>
                  <Button size="sm" onClick={handleApply} className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    发送到编辑器
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate} className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    重新生成
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="outline" className="text-xs">{platform}</Badge>
                <Badge variant="outline" className="text-xs">{style}</Badge>
                <Badge variant="outline" className="text-xs">{generatedContent.replace(/\s/g, '').length} 字</Badge>
              </div>
              <Textarea
                value={generatedContent}
                readOnly
                className="min-h-[400px] text-sm leading-relaxed font-mono mb-4"
              />

              {/* 图片生成 */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="w-4 h-4 text-violet-500" />
                  <h3 className="text-base font-medium">AI 生成配图</h3>
                </div>
                
                {!hasImageApiKey && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-600 dark:text-amber-400">
                      <p className="font-medium">未配置图片生成 API Key</p>
                      <p className="text-xs mt-1 text-amber-500/80">
                        请在"API 接口设置"中配置图片生成 API Key，推荐使用 OpenAI DALL-E 3 或通义千问。
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">图片提示词</Label>
                    <Textarea
                      value={imagePrompt}
                      onChange={e => setImagePrompt(e.target.value)}
                      placeholder="描述你想要的图片内容，例如：为文章'AI写作技巧'生成一张适合微信公众号的配图，风格为干货教程，图片需要与文章内容相关，吸引人且专业。"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">图片尺寸</Label>
                      <Select value={imageSize} onValueChange={setImageSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512x512">512x512</SelectItem>
                          <SelectItem value="1024x1024">1024x1024</SelectItem>
                          <SelectItem value="1024x1792">1024x1792</SelectItem>
                          <SelectItem value="1792x1024">1792x1024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        onClick={handleGenerateImage} 
                        disabled={!imagePrompt.trim() || !hasImageApiKey || isGeneratingImage}
                        className="w-full"
                      >
                        {isGeneratingImage ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            生成图片中...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            生成图片
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>

                  {generatedImage && (
                    <div className="mt-4 border border-border rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">生成结果</h4>
                      <div className="flex flex-col items-center">
                        <img 
                          src={generatedImage} 
                          alt="Generated image" 
                          className="max-w-full max-h-[400px] rounded-lg object-contain"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadImage}
                          className="mt-4 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          下载图片
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
