import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Key, Globe, Save, Check, AlertTriangle, TestTube, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApiConfig } from '@/lib/types';
import { getApiConfig, saveApiConfig, callAiApi } from '@/lib/api';

export function ApiSettingsView() {
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const presets = [
    { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', provider: 'openai' },
    { name: 'Claude (Anthropic)', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-20241022', provider: 'anthropic' },
    { name: '智谱 AI', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4', provider: 'zhipu' },
    { name: '通义千问', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo', provider: 'dashscope' },
    { name: '文心一言', baseUrl: 'https://qianfan.baidubce.com/v2', model: 'ernie-4.0-8k', provider: 'baidu' },
    { name: 'Moonshot (Kimi)', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', provider: 'moonshot' },
    { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat', provider: 'deepseek' },
    { name: '豆包 (Doubao)', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', model: 'ep-20241201000000-xxxxx', provider: 'doubao' },
    { name: '自定义', baseUrl: '', model: '', provider: 'custom' },
  ];

  const handlePresetChange = useCallback((presetName: string) => {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
      setConfig(prev => ({
        ...prev,
        provider: preset.provider,
        baseUrl: preset.baseUrl,
        model: preset.model,
      }));
    }
  }, []);

  const handleSave = useCallback(() => {
    saveApiConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [config]);

  const handleTest = useCallback(async () => {
    if (!config.apiKey) {
      setTestResult({ success: false, message: '请先输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = await callAiApi('你好，请回复"连接成功"四个字', '你是一个测试助手，只需要回复"连接成功"四个字，不要回复其他内容。', config);
      setTestResult({ success: true, message: `连接成功！AI 回复：${result}` });
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || '连接失败，请检查配置' });
    }
    setTesting(false);
  }, [config]);

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
              <CardDescription>配置你的 AI 模型 API，支持多种主流 AI 服务</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">📋 如何配置 API？</p>
            <p>本平台支持对接多种 AI 大模型 API，配置后即可使用 AI 润色、智能分析等功能。</p>
            <p>步骤：</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>选择你要使用的 AI 服务商（预设或自定义）</li>
              <li>填入对应的 API Base URL</li>
              <li>填入你的 API Key（密钥）</li>
              <li>选择或输入模型名称</li>
              <li>点击"测试连接"验证配置是否正确</li>
              <li>点击"保存配置"保存设置</li>
            </ol>
            <p className="text-xs mt-2 text-amber-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              API Key 仅保存在本地浏览器中，不会上传到任何服务器
            </p>
          </div>

          {/* Preset Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">快速选择服务商</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetChange(preset.name)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      config.provider === preset.provider
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                    )}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* API Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">API Base URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={config.baseUrl}
                    onChange={e => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.openai.com/v1"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">API 请求的基础地址</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">API Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showKey ? 'text' : 'password'}
                    value={config.apiKey}
                    onChange={e => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="pl-9 pr-10"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">你的 API 密钥，仅保存在本地</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">模型名称</Label>
                <Input
                  value={config.model}
                  onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="gpt-4o"
                />
                <p className="text-xs text-muted-foreground">要使用的 AI 模型名称</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">提供商</Label>
                <Input
                  value={config.provider}
                  onChange={e => setConfig(prev => ({ ...prev, provider: e.target.value }))}
                  placeholder="openai"
                />
                <p className="text-xs text-muted-foreground">API 提供商标识</p>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="p-4 rounded-lg border border-border space-y-4">
              <h3 className="text-sm font-medium">高级设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">最大 Token 数</Label>
                    <span className="text-sm text-muted-foreground">{config.maxTokens}</span>
                  </div>
                  <Slider
                    value={[config.maxTokens]}
                    onValueChange={([v]) => setConfig(prev => ({ ...prev, maxTokens: v }))}
                    min={256}
                    max={8192}
                    step={256}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Temperature（创造性）</Label>
                    <span className="text-sm text-muted-foreground">{config.temperature.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[config.temperature]}
                    onValueChange={([v]) => setConfig(prev => ({ ...prev, temperature: v }))}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">值越高输出越有创造性，值越低输出越确定</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleTest} disabled={testing} variant="outline">
                {testing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    测试中...
                  </span>
                ) : (
                  '测试连接'
                )}
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {saved ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    已保存
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    保存配置
                  </span>
                )}
              </Button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={cn(
                'p-3 rounded-lg text-sm',
                testResult.success ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
              )}>
                <p className="font-medium">{testResult.success ? '✅ 连接成功' : '❌ 连接失败'}</p>
                <p className="text-xs mt-1 opacity-80">{testResult.message}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
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
