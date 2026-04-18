import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Key, Globe, Save, Check, AlertTriangle, TestTube, Eye, EyeOff, MessageCircle, Bot, Shield, ScanFace, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApiConfig, AiDetectionConfig, ContentSafetyConfig, LlmProvider, AiDetectionProvider, ContentSafetyProvider, ImageGenerationConfig, ImageGenerationProvider, PolishConfig, PolishProvider } from '@/lib/types';
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
  getPolishConfig,
  savePolishConfig,
  callAiApi,
  DEFAULT_LLM_CONFIGS,
  DEFAULT_AI_DETECTION_CONFIGS,
  DEFAULT_CONTENT_SAFETY_CONFIGS,
  DEFAULT_IMAGE_GENERATION_CONFIGS,
  DEFAULT_POLISH_CONFIGS,
} from '@/lib/api';

export function ApiSettingsView() {
  const [activeTab, setActiveTab] = useState('llm');
  const [llmConfig, setLlmConfig] = useState<ApiConfig>(getLlmConfig());
  const [aiDetectionConfig, setAiDetectionConfig] = useState<AiDetectionConfig>(getAiDetectionConfig());
  const [contentSafetyConfig, setContentSafetyConfig] = useState<ContentSafetyConfig>(getContentSafetyConfig());
  const [imageGenerationConfig, setImageGenerationConfig] = useState<ImageGenerationConfig>(getImageGenerationConfig());
  const [polishConfig, setPolishConfig] = useState<PolishConfig>(getPolishConfig());
  const [showLlmKey, setShowLlmKey] = useState(false);
  const [showAiDetectionKey, setShowAiDetectionKey] = useState(false);
  const [showContentSafetyKey, setShowContentSafetyKey] = useState(false);
  const [showImageGenerationKey, setShowImageGenerationKey] = useState(false);
  const [showPolishKey, setShowPolishKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const llmPresets: Array<{ name: string; config: ApiConfig; url: string; freeTier: boolean }> = [
    { name: '通义千问', config: DEFAULT_LLM_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/', freeTier: true },
    { name: 'OpenAI', config: DEFAULT_LLM_CONFIGS.openai, url: 'https://platform.openai.com/', freeTier: false },
    { name: 'Claude', config: DEFAULT_LLM_CONFIGS.anthropic, url: 'https://console.anthropic.com/', freeTier: false },
    { name: 'DeepSeek', config: DEFAULT_LLM_CONFIGS.deepseek, url: 'https://platform.deepseek.com/', freeTier: true },
    { name: '豆包', config: DEFAULT_LLM_CONFIGS.doubao, url: 'https://console.volcengine.com/ark/', freeTier: true },
    { name: '智谱', config: DEFAULT_LLM_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/', freeTier: true },
    { name: '文心一言', config: DEFAULT_LLM_CONFIGS.wenxin, url: 'https://cloud.baidu.com/product/wenxinworkshop', freeTier: true },
    { name: 'Moonshot', config: DEFAULT_LLM_CONFIGS.moonshot, url: 'https://platform.moonshot.cn/', freeTier: true },
    { name: 'Kimi', config: DEFAULT_LLM_CONFIGS.kimi, url: 'https://platform.moonshot.cn/', freeTier: true },
    { name: '自定义', config: DEFAULT_LLM_CONFIGS['openai-compatible'], url: '', freeTier: false },
  ];

  const aiDetectionPresets: Array<{ name: string; config: AiDetectionConfig; url: string; freeTier: boolean }> = [
    { name: '本地检测', config: DEFAULT_AI_DETECTION_CONFIGS.local, url: '', freeTier: true },
    { name: '通义千问检测', config: DEFAULT_AI_DETECTION_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/', freeTier: true },
    { name: '智谱AI检测', config: DEFAULT_AI_DETECTION_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/', freeTier: true },
    { name: '文心检测', config: DEFAULT_AI_DETECTION_CONFIGS.wenxin, url: 'https://cloud.baidu.com/product/wenxinworkshop', freeTier: true },
    { name: 'Originality.ai', config: DEFAULT_AI_DETECTION_CONFIGS.originality, url: 'https://originality.ai/', freeTier: false },
    { name: 'Winston AI', config: DEFAULT_AI_DETECTION_CONFIGS.winston, url: 'https://gowinston.ai/', freeTier: false },
    { name: 'Copyscape', config: DEFAULT_AI_DETECTION_CONFIGS.copyscape, url: 'https://www.copyscape.com/', freeTier: false },
    { name: 'GPTZero', config: DEFAULT_AI_DETECTION_CONFIGS.gptzero, url: 'https://gptzero.me/', freeTier: false },
    { name: 'Content at Scale', config: DEFAULT_AI_DETECTION_CONFIGS.contentatscale, url: 'https://contentatscale.ai/', freeTier: false },
    { name: 'Scribbr', config: DEFAULT_AI_DETECTION_CONFIGS.scribbr, url: 'https://www.scribbr.com/', freeTier: false },
    { name: 'ZeroGPT', config: DEFAULT_AI_DETECTION_CONFIGS.zerogpt, url: 'https://zerogpt.com/', freeTier: false },
  ];

  const contentSafetyPresets: Array<{ name: string; config: ContentSafetyConfig; url: string; freeTier: boolean }> = [
    { name: '本地检测', config: DEFAULT_CONTENT_SAFETY_CONFIGS.local, url: '', freeTier: true },
    { name: '通义千问安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/', freeTier: true },
    { name: '智谱安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/', freeTier: true },
    { name: '华为内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.huawei, url: 'https://www.huaweicloud.com/product/contentmoderation.html', freeTier: false },
    { name: '阿里云内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.aliyun, url: 'https://www.aliyun.com/product/lvs', freeTier: false },
    { name: '腾讯云内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.tencent, url: 'https://cloud.tencent.com/product/ims', freeTier: false },
    { name: '百度内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.baidu, url: 'https://ai.baidu.com/tech/textcensoring', freeTier: false },
  ];

  const imageGenerationPresets: Array<{ name: string; config: ImageGenerationConfig; url: string; freeTier: boolean }> = [
    { name: '通义千问', config: DEFAULT_IMAGE_GENERATION_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/', freeTier: true },
    { name: '豆包图片', config: DEFAULT_IMAGE_GENERATION_CONFIGS.doubao, url: 'https://console.volcengine.com/ark/', freeTier: true },
    { name: '智谱图片', config: DEFAULT_IMAGE_GENERATION_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/', freeTier: true },
    { name: '文心图片', config: DEFAULT_IMAGE_GENERATION_CONFIGS.wenxin, url: 'https://cloud.baidu.com/product/wenxinworkshop', freeTier: true },
    { name: 'OpenAI (DALL-E 3)', config: DEFAULT_IMAGE_GENERATION_CONFIGS.openai, url: 'https://platform.openai.com/', freeTier: false },
    { name: 'Stability AI', config: DEFAULT_IMAGE_GENERATION_CONFIGS.stability, url: 'https://platform.stability.ai/', freeTier: false },
    { name: 'Midjourney', config: DEFAULT_IMAGE_GENERATION_CONFIGS.midjourney, url: 'https://www.midjourney.com/', freeTier: false },
    { name: '自定义', config: DEFAULT_IMAGE_GENERATION_CONFIGS.custom, url: '', freeTier: false },
  ];

  const polishPresets: Array<{ name: string; config: PolishConfig; url: string; freeTier: boolean }> = [
    { name: '通义千问', config: DEFAULT_POLISH_CONFIGS.dashscope, url: 'https://dashscope.console.aliyun.com/', freeTier: true },
    { name: '豆包润色', config: DEFAULT_POLISH_CONFIGS.doubao, url: 'https://console.volcengine.com/ark/', freeTier: true },
    { name: '智谱润色', config: DEFAULT_POLISH_CONFIGS.zhipu, url: 'https://open.bigmodel.cn/', freeTier: true },
    { name: '文心润色', config: DEFAULT_POLISH_CONFIGS.wenxin, url: 'https://cloud.baidu.com/product/wenxinworkshop', freeTier: true },
    { name: 'DeepSeek', config: DEFAULT_POLISH_CONFIGS.deepseek, url: 'https://platform.deepseek.com/', freeTier: true },
    { name: 'OpenAI', config: DEFAULT_POLISH_CONFIGS.openai, url: 'https://platform.openai.com/', freeTier: false },
    { name: 'Claude', config: DEFAULT_POLISH_CONFIGS.anthropic, url: 'https://console.anthropic.com/', freeTier: false },
    { name: '自定义', config: DEFAULT_POLISH_CONFIGS.custom, url: '', freeTier: false },
  ];

  const handleSave = useCallback(() => {
    saveLlmConfig(llmConfig);
    saveAiDetectionConfig(aiDetectionConfig);
    saveContentSafetyConfig(contentSafetyConfig);
    saveImageGenerationConfig(imageGenerationConfig);
    savePolishConfig(polishConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [llmConfig, aiDetectionConfig, contentSafetyConfig, imageGenerationConfig, polishConfig]);

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
              <CardDescription>配置大模型、AI 检测、内容安全、图片生成、AI 润色等服务</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
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
                <Edit3 className="w-4 h-4" />
                AI 润色
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
                      {preset.freeTier && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
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
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1',
                        aiDetectionConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                      {preset.freeTier && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
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
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1',
                        contentSafetyConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                      {preset.freeTier && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
                    </button>
                  ))}
                </div>
              </div>

              {contentSafetyConfig.provider !== 'local' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(contentSafetyConfig.provider === 'aliyun' || contentSafetyConfig.provider === 'tencent' || contentSafetyConfig.provider === 'baidu' || contentSafetyConfig.provider === 'huawei') && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AccessKey ID / API Key</Label>
                        <Input
                          value={contentSafetyConfig.accessKeyId || contentSafetyConfig.apiKey || ''}
                          onChange={e => {
                            if (contentSafetyConfig.provider === 'aliyun') {
                              setContentSafetyConfig(prev => ({ ...prev, accessKeyId: e.target.value }));
                            } else {
                              setContentSafetyConfig(prev => ({ ...prev, apiKey: e.target.value }));
                            }
                          }}
                          placeholder="输入 AccessKey ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AccessKey Secret</Label>
                        <div className="relative">
                          <Input
                            type={showContentSafetyKey ? 'text' : 'password'}
                            value={contentSafetyConfig.accessKeySecret || contentSafetyConfig.secretKey || ''}
                            onChange={e => {
                              if (contentSafetyConfig.provider === 'aliyun') {
                                setContentSafetyConfig(prev => ({ ...prev, accessKeySecret: e.target.value }));
                              } else {
                                setContentSafetyConfig(prev => ({ ...prev, secretKey: e.target.value }));
                              }
                            }}
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
                      {(contentSafetyConfig.provider === 'aliyun' || contentSafetyConfig.provider === 'huawei' || contentSafetyConfig.provider === 'tencent') && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">区域</Label>
                          <Input
                            value={contentSafetyConfig.region || ''}
                            onChange={e => setContentSafetyConfig(prev => ({ ...prev, region: e.target.value }))}
                            placeholder="cn-shanghai"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {(contentSafetyConfig.provider === 'dashscope' || contentSafetyConfig.provider === 'zhipu') && (
                    <div className="space-y-2 col-span-2">
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showContentSafetyKey ? 'text' : 'password'}
                          value={contentSafetyConfig.apiKey || ''}
                          onChange={e => setContentSafetyConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                          placeholder="输入 API Key"
                          className="pl-9 pr-10"
                        />
                        <button
                          onClick={() => setShowContentSafetyKey(!showContentSafetyKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showContentSafetyKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1',
                        imageGenerationConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                      {preset.freeTier && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
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
                      <SelectItem value="doubao">豆包</SelectItem>
                      <SelectItem value="zhipu">智谱</SelectItem>
                      <SelectItem value="wenxin">文心</SelectItem>
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
            </TabsContent>

            <TabsContent value="polish" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">✨ AI 润色配置</p>
                <p>配置用于文章润色、降重、排版等功能的 AI 服务。</p>
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
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1',
                        polishConfig.provider === preset.config.provider
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {preset.name}
                      {preset.freeTier && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
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
                      <SelectItem value="doubao">豆包</SelectItem>
                      <SelectItem value="zhipu">智谱</SelectItem>
                      <SelectItem value="wenxin">文心</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
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
