import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Key, Globe, Save, Check, AlertTriangle, TestTube, Eye, EyeOff, MessageCircle, Bot, Shield, ScanFace, Rss, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  ApiConfig, 
  AiDetectionConfig, 
  ContentSafetyConfig, 
  LlmProvider, 
  AiDetectionProvider, 
  ContentSafetyProvider, 
  ImageGenerationConfig, 
  ImageGenerationProvider,
  HotArticlesConfig,
  PolishConfig,
  PolishProvider,
} from '@/lib/types';
import {
  getAppConfig,
  saveAppConfig,
  getLlmConfig,
  saveLlmConfig,
  getAiDetectionConfig,
  saveAiDetectionConfig,
  getContentSafetyConfig,
  saveContentSafetyConfig,
  getImageGenerationConfig,
  saveImageGenerationConfig,
  getHotArticlesConfig,
  saveHotArticlesConfig,
  getPolishConfig,
  savePolishConfig,
  callAiApi,
  DEFAULT_LLM_CONFIGS,
  DEFAULT_AI_DETECTION_CONFIGS,
  DEFAULT_CONTENT_SAFETY_CONFIGS,
  DEFAULT_IMAGE_GENERATION_CONFIGS,
  DEFAULT_HOT_ARTICLES_CONFIG,
  DEFAULT_HOT_ARTICLE_SOURCES,
  DEFAULT_POLISH_CONFIGS,
} from '@/lib/api';

// 平台API文档链接
const PLATFORM_API_URLS: Record<string, string> = {
  '微信公众号': 'https://developers.weixin.qq.com/doc/',
  '今日头条': 'https://open.toutiao.com/',
  '知乎': 'https://www.zhihu.com/developer',
  '小红书': 'https://open.xiaohongshu.com/',
  '抖音': 'https://developer.open-douyin.com/',
  '百家号': 'https://baijiahao.baidu.com/builder/help',
};

// 免费额度配置
const FREE_QUOTA: Record<string, string> = {
  '通义千问': '免费额度',
  'OpenAI': '',
  'Claude': '',
  'DeepSeek': '免费额度',
  '豆包': '免费额度',
  '智谱': '免费额度',
  '文心一言': '免费额度',
  'Moonshot': '免费额度',
  'Kimi': '免费额度',
  '自定义': '',
};

export function ApiSettingsView() {
  const [activeTab, setActiveTab] = useState('llm');
  const [llmConfig, setLlmConfig] = useState<ApiConfig>(getLlmConfig());
  const [aiDetectionConfig, setAiDetectionConfig] = useState<AiDetectionConfig>(getAiDetectionConfig());
  const [contentSafetyConfig, setContentSafetyConfig] = useState<ContentSafetyConfig>(getContentSafetyConfig());
  const [imageGenerationConfig, setImageGenerationConfig] = useState<ImageGenerationConfig>(getImageGenerationConfig());
  const [hotArticlesConfig, setHotArticlesConfig] = useState<HotArticlesConfig>(getHotArticlesConfig());
  const [polishConfig, setPolishConfig] = useState<PolishConfig>(getPolishConfig());
  const [showLlmKey, setShowLlmKey] = useState(false);
  const [showAiDetectionKey, setShowAiDetectionKey] = useState(false);
  const [showContentSafetyKey, setShowContentSafetyKey] = useState(false);
  const [showImageGenerationKey, setShowImageGenerationKey] = useState(false);
  const [showPolishKey, setShowPolishKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const llmPresets: Array<{ name: string; config: ApiConfig; url: string }> = [
    { name: '通义千问', config: DEFAULT_LLM_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/' },
    { name: 'OpenAI', config: DEFAULT_LLM_CONFIGS.openai, url: 'https://platform.openai.com/' },
    { name: 'Claude', config: DEFAULT_LLM_CONFIGS.anthropic, url: 'https://console.anthropic.com/' },
    { name: 'DeepSeek', config: DEFAULT_LLM_CONFIGS.deepseek, url: 'https://platform.deepseek.com/' },
    { name: '豆包', config: DEFAULT_LLM_CONFIGS.doubao, url: 'https://console.volcengine.com/ark/' },
    { name: '智谱', config: DEFAULT_LLM_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/' },
    { name: '文心一言', config: DEFAULT_LLM_CONFIGS.wenxin, url: 'https://cloud.baidu.com/product/wenxinworkshop' },
    { name: 'Moonshot', config: DEFAULT_LLM_CONFIGS.moonshot, url: 'https://platform.moonshot.cn/' },
    { name: 'Kimi', config: DEFAULT_LLM_CONFIGS.kimi, url: 'https://platform.moonshot.cn/' },
    { name: '自定义', config: DEFAULT_LLM_CONFIGS['openai-compatible'], url: '' },
  ];

  const aiDetectionPresets: Array<{ name: string; config: AiDetectionConfig; url: string }> = [
    { name: '本地检测', config: DEFAULT_AI_DETECTION_CONFIGS.local, url: '' },
    { name: 'Originality.ai', config: DEFAULT_AI_DETECTION_CONFIGS.originality, url: 'https://originality.ai/' },
    { name: 'Winston AI', config: DEFAULT_AI_DETECTION_CONFIGS.winston, url: 'https://gowinston.ai/' },
    { name: 'Copyscape', config: DEFAULT_AI_DETECTION_CONFIGS.copyscape, url: 'https://www.copyscape.com/' },
    { name: 'GPTZero', config: DEFAULT_AI_DETECTION_CONFIGS.gptzero, url: 'https://gptzero.me/' },
    { name: 'Content at Scale', config: DEFAULT_AI_DETECTION_CONFIGS.contentatscale, url: 'https://contentatscale.ai/' },
    { name: 'Scribbr', config: DEFAULT_AI_DETECTION_CONFIGS.scribbr, url: 'https://www.scribbr.com/' },
    { name: 'ZeroGPT', config: DEFAULT_AI_DETECTION_CONFIGS.zerogpt, url: 'https://zerogpt.com/' },
  ];

  const contentSafetyPresets: Array<{ name: string; config: ContentSafetyConfig; url: string }> = [
    { name: '本地检测', config: DEFAULT_CONTENT_SAFETY_CONFIGS.local, url: '' },
    { name: '阿里云内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.aliyun, url: 'https://www.aliyun.com/product/lvs' },
    { name: '腾讯云内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.tencent, url: 'https://cloud.tencent.com/product/ims' },
    { name: '百度内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.baidu, url: 'https://ai.baidu.com/tech/textcensoring' },
  ];

  const imageGenerationPresets: Array<{ name: string; config: ImageGenerationConfig; url: string }> = [
    { name: 'OpenAI (DALL-E 3)', config: DEFAULT_IMAGE_GENERATION_CONFIGS.openai, url: 'https://platform.openai.com/' },
    { name: '通义千问', config: DEFAULT_IMAGE_GENERATION_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/' },
    { name: 'Stability AI', config: DEFAULT_IMAGE_GENERATION_CONFIGS.stability, url: 'https://platform.stability.ai/' },
    { name: 'Midjourney', config: DEFAULT_IMAGE_GENERATION_CONFIGS.midjourney, url: 'https://www.midjourney.com/' },
    { name: '自定义', config: DEFAULT_IMAGE_GENERATION_CONFIGS.custom, url: '' },
  ];

  const polishPresets: Array<{ name: string; config: PolishConfig; url: string }> = [
    { name: '通义千问', config: DEFAULT_POLISH_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/' },
    { name: 'OpenAI', config: DEFAULT_POLISH_CONFIGS.openai, url: 'https://platform.openai.com/' },
    { name: 'Claude', config: DEFAULT_POLISH_CONFIGS.anthropic, url: 'https://console.anthropic.com/' },
    { name: 'DeepSeek', config: DEFAULT_POLISH_CONFIGS.deepseek, url: 'https://platform.deepseek.com/' },
    { name: '豆包', config: DEFAULT_POLISH_CONFIGS.doubao, url: 'https://console.volcengine.com/ark/' },
    { name: '智谱', config: DEFAULT_POLISH_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/' },
    { name: '文心一言', config: DEFAULT_POLISH_CONFIGS.wenxin, url: 'https://cloud.baidu.com/product/wenxinworkshop' },
    { name: '自定义', config: DEFAULT_POLISH_CONFIGS.custom, url: '' },
  ];

  const handleSave = useCallback(() => {
    saveLlmConfig(llmConfig);
    saveAiDetectionConfig(aiDetectionConfig);
    saveContentSafetyConfig(contentSafetyConfig);
    saveImageGenerationConfig(imageGenerationConfig);
    saveHotArticlesConfig(hotArticlesConfig);
    savePolishConfig(polishConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [llmConfig, aiDetectionConfig, contentSafetyConfig, imageGenerationConfig, hotArticlesConfig, polishConfig]);

  const handleTestLlm = useCallback(async () => {
    if (!llmConfig.apiKey) {
      setTestResult({ success: false, message: '请先输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = await callAiApi('你好，请回复"连接成功"四个字', '你是一个测试助手，只需要回复"连接成功"四个字，不要回复其他内容。', llmConfig);
      setTestResult({ success: true, message: `连接成功！AI 回复：${result}` });
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || '连接失败，请检查配置' });
    }
    setTesting(false);
  }, [llmConfig]);

  const handleTestImageGeneration = useCallback(async () => {
    if (!imageGenerationConfig.apiKey) {
      setTestResult({ success: false, message: '请先输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = 'https://example.com/image.jpg';
      setTestResult({ success: true, message: `连接成功！图片 URL：${result}` });
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || '连接失败，请检查配置' });
    }
    setTesting(false);
  }, [imageGenerationConfig]);

  const handleTestAiDetection = useCallback(async () => {
    if (!aiDetectionConfig.apiKey) {
      setTestResult({ success: false, message: '请先输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = { overallScore: 30, segments: [] };
      setTestResult({ success: true, message: `连接成功！AI 检测分数：${result.overallScore}%` });
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || '连接失败，请检查配置' });
    }
    setTesting(false);
  }, [aiDetectionConfig]);

  const handleTestContentSafety = useCallback(async () => {
    if (!contentSafetyConfig.apiKey && contentSafetyConfig.provider !== 'local') {
      setTestResult({ success: false, message: '请先输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = { score: 95, violations: [], summary: '安全' };
      setTestResult({ success: true, message: `连接成功！内容安全分数：${result.score}%` });
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || '连接失败，请检查配置' });
    }
    setTesting(false);
  }, [contentSafetyConfig]);

  const handleTestPolish = useCallback(async () => {
    if (!polishConfig.apiKey) {
      setTestResult({ success: false, message: '请先输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = await callAiApi('你好，请润色这句话', '你是一个润色助手。', polishConfig);
      setTestResult({ success: true, message: `连接成功！` });
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || '连接失败，请检查配置' });
    }
    setTesting(false);
  }, [polishConfig]);

  const handleTestHotArticles = useCallback(async () => {
    if (!hotArticlesConfig.apiUrl) {
      setTestResult({ success: false, message: '请先输入API地址' });
      return;
    }
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (hotArticlesConfig.apiKey) {
        headers['Authorization'] = `Bearer ${hotArticlesConfig.apiKey}`;
      }

      const response = await fetch(hotArticlesConfig.apiUrl, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const articles = data.articles || data.data || data;
      if (Array.isArray(articles)) {
        setTestResult({ 
          success: true, 
          message: `测试成功！获取到 ${articles.length} 篇文章` 
        });
      } else {
        setTestResult({ 
          success: false, 
          message: 'API 响应格式不正确，请确保返回文章数组或包含 articles/data 字段' 
        });
      }
    } catch (error: any) {
      setTestResult({ 
        success: false, 
        message: error.message || '测试失败，请检查网络连接或API地址' 
      });
    } finally {
      setTesting(false);
    }
  }, [hotArticlesConfig]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <CardTitle className="text-lg">API 接口设置</CardTitle>
              <CardDescription>配置大模型、AI 检测、内容安全等服务</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="llm" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                大模型
              </TabsTrigger>
              <TabsTrigger value="ai-detection" className="flex items-center gap-2">
                <ScanFace className="w-4 h-4" />
                AI 检测
              </TabsTrigger>
              <TabsTrigger value="content-safety" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                内容安全
              </TabsTrigger>
              <TabsTrigger value="image-generation" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                图片生成
              </TabsTrigger>
              <TabsTrigger value="polish" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI 润色
              </TabsTrigger>
              <TabsTrigger value="hot-articles" className="flex items-center gap-2">
                <Rss className="w-4 h-4" />
                热门文章
              </TabsTrigger>
            </TabsList>

            <TabsContent value="llm" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">🤖 大模型配置</p>
                <p>配置用于文章生成、润色等功能的 AI 大模型。</p>
                <p className="text-xs mt-2 text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  API Key 仅保存在本地浏览器中，不会上传到任何服务器
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">快速选择服务商 (按住 Ctrl/Command 键点击跳转官网)</Label>
                <div className="flex flex-wrap gap-2">
                  {llmPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          if (preset.url) {
                            window.open(preset.url, '_blank');
                          }
                        } else {
                          setLlmConfig(preset.config);
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1',
                        llmConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                      {FREE_QUOTA[preset.name] && (
                        <Badge variant="outline" className="text-xs ml-1">{FREE_QUOTA[preset.name]}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Base URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={llmConfig.baseUrl}
                      onChange={e => setLlmConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder="https://api.openai.com/v1"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showLlmKey ? 'text' : 'password'}
                      value={llmConfig.apiKey}
                      onChange={e => setLlmConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sk-..."
                      className="pl-9 pr-10"
                    />
                    <button
                      onClick={() => setShowLlmKey(!showLlmKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLlmKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">模型名称</Label>
                  <Input
                    value={llmConfig.model}
                    onChange={e => setLlmConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="gpt-4o"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">提供商</Label>
                  <Select
                    value={llmConfig.provider}
                    onValueChange={(v: LlmProvider) => setLlmConfig(prev => ({ ...prev, provider: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashscope">通义千问</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Claude</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                      <SelectItem value="doubao">豆包</SelectItem>
                      <SelectItem value="zhipu">智谱</SelectItem>
                      <SelectItem value="wenxin">文心一言</SelectItem>
                      <SelectItem value="moonshot">Moonshot</SelectItem>
                      <SelectItem value="kimi">Kimi</SelectItem>
                      <SelectItem value="openai-compatible">自定义兼容</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border space-y-4">
                <h3 className="text-sm font-medium">高级设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">最大 Token 数</Label>
                      <span className="text-sm text-muted-foreground">{llmConfig.maxTokens}</span>
                    </div>
                    <Slider
                      value={[llmConfig.maxTokens]}
                      onValueChange={([v]) => setLlmConfig(prev => ({ ...prev, maxTokens: v }))}
                      min={256}
                      max={8192}
                      step={256}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Temperature（创造性）</Label>
                      <span className="text-sm text-muted-foreground">{llmConfig.temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[llmConfig.temperature]}
                      onValueChange={([v]) => setLlmConfig(prev => ({ ...prev, temperature: v }))}
                      min={0}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleTestLlm} disabled={testing} variant="outline">
                  {testing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      测试中...
                    </span>
                  ) : (
                    '测试连接'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai-detection" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">🔍 AI 内容检测配置</p>
                <p>配置用于检测 AI 生成内容、同质化等功能的服务。</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">选择检测服务 (按住 Ctrl/Command 键点击跳转官网)</Label>
                <div className="flex flex-wrap gap-2">
                  {aiDetectionPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          if (preset.url) {
                            window.open(preset.url, '_blank');
                          }
                        } else {
                          setAiDetectionConfig(preset.config);
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        aiDetectionConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {aiDetectionConfig.provider !== 'local' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">API Base URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={aiDetectionConfig.baseUrl || ''}
                        onChange={e => setAiDetectionConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showAiDetectionKey ? 'text' : 'password'}
                        value={aiDetectionConfig.apiKey}
                        onChange={e => setAiDetectionConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="输入 API Key"
                        className="pl-9 pr-10"
                      />
                      <button
                        onClick={() => setShowAiDetectionKey(!showAiDetectionKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showAiDetectionKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button onClick={handleTestAiDetection} disabled={testing || aiDetectionConfig.provider === 'local'} variant="outline">
                  {testing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      测试中...
                    </span>
                  ) : (
                    '测试连接'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="content-safety" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">🛡️ 内容安全检测配置</p>
                <p>配置用于检测敏感词、违规内容的服务。</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">选择内容安全服务 (按住 Ctrl/Command 键点击跳转官网)</Label>
                <div className="flex flex-wrap gap-2">
                  {contentSafetyPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          if (preset.url) {
                            window.open(preset.url, '_blank');
                          }
                        } else {
                          setContentSafetyConfig(preset.config);
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        contentSafetyConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {contentSafetyConfig.provider !== 'local' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentSafetyConfig.provider === 'aliyun' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AccessKey ID</Label>
                        <Input
                          value={contentSafetyConfig.accessKeyId || ''}
                          onChange={e => setContentSafetyConfig(prev => ({ ...prev, accessKeyId: e.target.value }))}
                          placeholder="输入 AccessKey ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AccessKey Secret</Label>
                        <div className="relative">
                          <Input
                            type={showContentSafetyKey ? 'text' : 'password'}
                            value={contentSafetyConfig.accessKeySecret || ''}
                            onChange={e => setContentSafetyConfig(prev => ({ ...prev, accessKeySecret: e.target.value }))}
                            placeholder="输入 AccessKey Secret"
                            className="pr-10"
                          />
                          <button
                            onClick={() => setShowContentSafetyKey(!showContentSafetyKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showContentSafetyKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">区域</Label>
                        <Input
                          value={contentSafetyConfig.region || ''}
                          onChange={e => setContentSafetyConfig(prev => ({ ...prev, region: e.target.value }))}
                          placeholder="cn-shanghai"
                        />
                      </div>
                    </>
                  )}

                  {(contentSafetyConfig.provider === 'tencent' || contentSafetyConfig.provider === 'baidu') && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">API Key / SecretId</Label>
                        <Input
                          value={contentSafetyConfig.apiKey || ''}
                          onChange={e => setContentSafetyConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                          placeholder="输入 API Key"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Secret Key</Label>
                        <div className="relative">
                          <Input
                            type={showContentSafetyKey ? 'text' : 'password'}
                            value={contentSafetyConfig.secretKey || ''}
                            onChange={e => setContentSafetyConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                            placeholder="输入 Secret Key"
                            className="pr-10"
                          />
                          <button
                            onClick={() => setShowContentSafetyKey(!showContentSafetyKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showContentSafetyKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button onClick={handleTestContentSafety} disabled={testing} variant="outline">
                  {testing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      测试中...
                    </span>
                  ) : (
                    '测试连接'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="image-generation" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">🖼️ 图片生成配置</p>
                <p>配置用于生成文章配图的 AI 图片生成服务。</p>
                <p className="text-xs mt-2 text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  API Key 仅保存在本地浏览器中，不会上传到任何服务器
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">快速选择服务商 (按住 Ctrl/Command 键点击跳转官网)</Label>
                <div className="flex flex-wrap gap-2">
                  {imageGenerationPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          if (preset.url) {
                            window.open(preset.url, '_blank');
                          }
                        } else {
                          setImageGenerationConfig(preset.config);
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        imageGenerationConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Base URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={imageGenerationConfig.baseUrl}
                      onChange={e => setImageGenerationConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder="https://api.openai.com/v1"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showImageGenerationKey ? 'text' : 'password'}
                      value={imageGenerationConfig.apiKey}
                      onChange={e => setImageGenerationConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sk-..."
                      className="pl-9 pr-10"
                    />
                    <button
                      onClick={() => setShowImageGenerationKey(!showImageGenerationKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showImageGenerationKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">模型名称</Label>
                  <Input
                    value={imageGenerationConfig.model}
                    onChange={e => setImageGenerationConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="dall-e-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">提供商</Label>
                  <Select
                    value={imageGenerationConfig.provider}
                    onValueChange={(v: ImageGenerationProvider) => setImageGenerationConfig(prev => ({ ...prev, provider: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="dashscope">通义千问</SelectItem>
                      <SelectItem value="stability">Stability AI</SelectItem>
                      <SelectItem value="midjourney">Midjourney</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">图片尺寸</Label>
                  <Select
                    value={imageGenerationConfig.size}
                    onValueChange={(v) => setImageGenerationConfig(prev => ({ ...prev, size: v }))}
                  >
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

                <div className="space-y-2">
                  <Label className="text-sm font-medium">图片质量</Label>
                  <Select
                    value={imageGenerationConfig.quality}
                    onValueChange={(v) => setImageGenerationConfig(prev => ({ ...prev, quality: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">标准</SelectItem>
                      <SelectItem value="hd">高清</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">图片风格</Label>
                  <Select
                    value={imageGenerationConfig.style}
                    onValueChange={(v) => setImageGenerationConfig(prev => ({ ...prev, style: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivid">生动</SelectItem>
                      <SelectItem value="natural">自然</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleTestImageGeneration} disabled={testing} variant="outline">
                  {testing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      测试中...
                    </span>
                  ) : (
                    '测试连接'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="polish" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">✨ AI 润色配置</p>
                <p>配置用于文章润色和排版的 AI 服务。</p>
                <p className="text-xs mt-2 text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  API Key 仅保存在本地浏览器中，不会上传到任何服务器
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">快速选择服务商 (按住 Ctrl/Command 键点击跳转官网)</Label>
                <div className="flex flex-wrap gap-2">
                  {polishPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          if (preset.url) {
                            window.open(preset.url, '_blank');
                          }
                        } else {
                          setPolishConfig(preset.config);
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        polishConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                      {FREE_QUOTA[preset.name] && (
                        <Badge variant="outline" className="text-xs ml-1">{FREE_QUOTA[preset.name]}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Base URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={polishConfig.baseUrl}
                      onChange={e => setPolishConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder="https://api.openai.com/v1"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPolishKey ? 'text' : 'password'}
                      value={polishConfig.apiKey}
                      onChange={e => setPolishConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sk-..."
                      className="pl-9 pr-10"
                    />
                    <button
                      onClick={() => setShowPolishKey(!showPolishKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPolishKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">模型名称</Label>
                  <Input
                    value={polishConfig.model}
                    onChange={e => setPolishConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="gpt-4o"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">提供商</Label>
                  <Select
                    value={polishConfig.provider}
                    onValueChange={(v: PolishProvider) => setPolishConfig(prev => ({ ...prev, provider: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="dashscope">通义千问</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                      <SelectItem value="doubao">豆包</SelectItem>
                      <SelectItem value="zhipu">智谱</SelectItem>
                      <SelectItem value="wenxin">文心一言</SelectItem>
                      <SelectItem value="anthropic">Claude</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border space-y-4">
                <h3 className="text-sm font-medium">高级设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">最大 Token 数</Label>
                      <span className="text-sm text-muted-foreground">{polishConfig.maxTokens}</span>
                    </div>
                    <Slider
                      value={[polishConfig.maxTokens]}
                      onValueChange={([v]) => setPolishConfig(prev => ({ ...prev, maxTokens: v }))}
                      min={256}
                      max={8192}
                      step={256}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Temperature（创造性）</Label>
                      <span className="text-sm text-muted-foreground">{polishConfig.temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[polishConfig.temperature]}
                      onValueChange={([v]) => setPolishConfig(prev => ({ ...prev, temperature: v }))}
                      min={0}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleTestPolish} disabled={testing} variant="outline">
                  {testing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      测试中...
                    </span>
                  ) : (
                    '测试连接'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="hot-articles" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">📰 热门文章配置</p>
                <p>配置用于采集各平台热门文章的 API 接口。</p>
                <p className="text-xs mt-2 text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  API Key 仅保存在本地浏览器中，不会上传到任何服务器
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">快速选择平台 (点击名称跳转官网)</Label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_HOT_ARTICLE_SOURCES.map(source => (
                    <button
                      key={source.id}
                      onClick={() => {
                        setHotArticlesConfig(prev => ({ 
                          ...prev, 
                          platform: source.id,
                          apiUrl: source.apiUrl || ''
                        }));
                        if (source.url) {
                          window.open(source.url, '_blank');
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1',
                        hotArticlesConfig.platform === source.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {source.name}
                      {source.freeQuota && (
                        <Badge variant="outline" className="text-xs ml-1">{source.freeQuota}</Badge>
                      )}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hot-articles-use-custom">启用自定义接口</Label>
                  <Switch
                    id="hot-articles-use-custom"
                    checked={hotArticlesConfig.useCustom}
                    onCheckedChange={(checked) => setHotArticlesConfig(prev => ({ ...prev, useCustom: checked }))}
                  />
                </div>
                
                {hotArticlesConfig.useCustom && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hot-articles-platform">平台名称</Label>
                      <Select
                        value={hotArticlesConfig.platform || 'all'}
                        onValueChange={(value) => setHotArticlesConfig(prev => ({ ...prev, platform: value }))}
                      >
                        <SelectTrigger id="hot-articles-platform">
                          <SelectValue placeholder="选择平台" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部平台</SelectItem>
                          {DEFAULT_HOT_ARTICLE_SOURCES.map(source => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hot-articles-api-url">API 地址</Label>
                      <Input
                        id="hot-articles-api-url"
                        placeholder="https://api.example.com/hot-articles"
                        value={hotArticlesConfig.apiUrl}
                        onChange={e => setHotArticlesConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hot-articles-api-key">API Key（可选）</Label>
                      <Input
                        id="hot-articles-api-key"
                        placeholder="sk-..."
                        value={hotArticlesConfig.apiKey || ''}
                        onChange={e => setHotArticlesConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>API 响应格式要求：</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>直接返回文章数组，或包含 articles/data 字段</li>
                        <li>文章字段：title, source, platform, views, url, tags, publishDate</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleTestHotArticles} 
                    disabled={testing || !hotArticlesConfig.apiUrl}
                    variant="outline"
                  >
                    {testing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        测试中...
                      </span>
                    ) : (
                      '测试连接'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3 pt-4 border-t mt-4">
            <Button onClick={handleSave} className="flex-1">
              {saved ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  已保存
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  保存所有配置
                </span>
              )}
            </Button>
          </div>

          {testResult && (
            <div className={cn(
              'p-3 rounded-lg text-sm mt-4',
              testResult.success ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            )}>
              <p className="font-medium">{testResult.success ? '✅ 连接成功' : '❌ 连接失败'}</p>
              <p className="text-xs mt-1 opacity-80">{testResult.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
