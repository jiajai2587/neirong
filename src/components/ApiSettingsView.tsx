import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Key, Globe, Save, Check, AlertTriangle, TestTube, Eye, EyeOff, MessageCircle, Bot, Shield, ScanFace } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApiConfig, AiDetectionConfig, ContentSafetyConfig, LlmProvider, AiDetectionProvider, ContentSafetyProvider } from '@/lib/types';
import {
  getAppConfig,
  saveAppConfig,
  getLlmConfig,
  saveLlmConfig,
  getAiDetectionConfig,
  saveAiDetectionConfig,
  getContentSafetyConfig,
  saveContentSafetyConfig,
  callAiApi,
  DEFAULT_LLM_CONFIGS,
  DEFAULT_AI_DETECTION_CONFIGS,
  DEFAULT_CONTENT_SAFETY_CONFIGS,
} from '@/lib/api';

export function ApiSettingsView() {
  const [activeTab, setActiveTab] = useState('llm');
  const [llmConfig, setLlmConfig] = useState<ApiConfig>(getLlmConfig());
  const [aiDetectionConfig, setAiDetectionConfig] = useState<AiDetectionConfig>(getAiDetectionConfig());
  const [contentSafetyConfig, setContentSafetyConfig] = useState<ContentSafetyConfig>(getContentSafetyConfig());
  const [showLlmKey, setShowLlmKey] = useState(false);
  const [showAiDetectionKey, setShowAiDetectionKey] = useState(false);
  const [showContentSafetyKey, setShowContentSafetyKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const llmPresets: Array<{ name: string; config: ApiConfig }> = [
    { name: '通义千问', config: DEFAULT_LLM_CONFIGS.dashscope },
    { name: 'OpenAI', config: DEFAULT_LLM_CONFIGS.openai },
    { name: 'Claude', config: DEFAULT_LLM_CONFIGS.anthropic },
    { name: 'DeepSeek', config: DEFAULT_LLM_CONFIGS.deepseek },
    { name: '豆包', config: DEFAULT_LLM_CONFIGS.doubao },
    { name: '智谱', config: DEFAULT_LLM_CONFIGS.zhipu },
    { name: '文心一言', config: DEFAULT_LLM_CONFIGS.wenxin },
    { name: 'Moonshot', config: DEFAULT_LLM_CONFIGS.moonshot },
    { name: 'Kimi', config: DEFAULT_LLM_CONFIGS.kimi },
    { name: '自定义', config: DEFAULT_LLM_CONFIGS['openai-compatible'] },
  ];

  const aiDetectionPresets: Array<{ name: string; config: AiDetectionConfig }> = [
    { name: '本地检测', config: DEFAULT_AI_DETECTION_CONFIGS.local },
    { name: 'Originality.ai', config: DEFAULT_AI_DETECTION_CONFIGS.originality },
    { name: 'Winston AI', config: DEFAULT_AI_DETECTION_CONFIGS.winston },
    { name: 'Copyscape', config: DEFAULT_AI_DETECTION_CONFIGS.copyscape },
    { name: 'GPTZero', config: DEFAULT_AI_DETECTION_CONFIGS.gptzero },
    { name: 'Content at Scale', config: DEFAULT_AI_DETECTION_CONFIGS.contentatscale },
    { name: 'Scribbr', config: DEFAULT_AI_DETECTION_CONFIGS.scribbr },
    { name: 'ZeroGPT', config: DEFAULT_AI_DETECTION_CONFIGS.zerogpt },
  ];

  const contentSafetyPresets: Array<{ name: string; config: ContentSafetyConfig }> = [
    { name: '本地检测', config: DEFAULT_CONTENT_SAFETY_CONFIGS.local },
    { name: '阿里云内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.aliyun },
    { name: '腾讯云内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.tencent },
    { name: '百度内容安全', config: DEFAULT_CONTENT_SAFETY_CONFIGS.baidu },
  ];

  const handleSave = useCallback(() => {
    saveLlmConfig(llmConfig);
    saveAiDetectionConfig(aiDetectionConfig);
    saveContentSafetyConfig(contentSafetyConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [llmConfig, aiDetectionConfig, contentSafetyConfig]);

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
              <CardDescription>配置大模型、AI 检测和内容安全服务</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
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
                <Label className="text-sm font-medium mb-2 block">快速选择服务商</Label>
                <div className="flex flex-wrap gap-2">
                  {llmPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => setLlmConfig(preset.config)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        llmConfig.provider === preset.config.provider
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
                <Label className="text-sm font-medium mb-2 block">选择检测服务</Label>
                <div className="flex flex-wrap gap-2">
                  {aiDetectionPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => setAiDetectionConfig(preset.config)}
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
            </TabsContent>

            <TabsContent value="content-safety" className="space-y-4 mt-4">
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground">🛡️ 内容安全检测配置</p>
                <p>配置用于检测敏感词、违规内容的服务。</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">选择内容安全服务</Label>
                <div className="flex flex-wrap gap-2">
                  {contentSafetyPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => setContentSafetyConfig(preset.config)}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">联系作者</CardTitle>
          <CardDescription>如有问题或建议，欢迎联系</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">微信</p>
              <p className="text-sm text-muted-foreground">xiaoqi19860607</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => navigator.clipboard.writeText('xiaoqi19860607')}
            >
              <Check className="w-3 h-3 mr-1" />
              复制
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
