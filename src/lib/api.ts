import type {
  ApiConfig,
  LlmProvider,
  AiDetectionConfig,
  AiDetectionProvider,
  ContentSafetyConfig,
  ContentSafetyProvider,
  AppConfig,
  AiDetectionResult,
  SensitiveCheckResult,
} from './types';

// ==================== 默认配置 ====================

export const DEFAULT_LLM_CONFIGS: Record<LlmProvider, ApiConfig> = {
  dashscope: {
    provider: 'dashscope',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    model: 'qwen-turbo',
    maxTokens: 8192,
    temperature: 0.85,
  },
  openai: {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o',
    maxTokens: 8192,
    temperature: 0.85,
  },
  anthropic: {
    provider: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 8192,
    temperature: 0.85,
  },
  deepseek: {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    model: 'deepseek-chat',
    maxTokens: 8192,
    temperature: 0.85,
  },
  'openai-compatible': {
    provider: 'openai-compatible',
    baseUrl: 'https://api.example.com/v1',
    apiKey: '',
    model: 'gpt-4',
    maxTokens: 8192,
    temperature: 0.85,
  },
  doubao: {
    provider: 'doubao',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: '',
    model: 'ep-20241203163449-j7x68',
    maxTokens: 8192,
    temperature: 0.85,
  },
  zhipu: {
    provider: 'zhipu',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '',
    model: 'glm-4-flash',
    maxTokens: 8192,
    temperature: 0.85,
  },
  wenxin: {
    provider: 'wenxin',
    baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
    apiKey: '',
    model: 'ernie-4.0-turbo-8k',
    maxTokens: 8192,
    temperature: 0.85,
  },
  moonshot: {
    provider: 'moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKey: '',
    model: 'moonshot-v1-8k',
    maxTokens: 8192,
    temperature: 0.85,
  },
  kimi: {
    provider: 'kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKey: '',
    model: 'moonshot-v1-8k',
    maxTokens: 8192,
    temperature: 0.85,
  },
};

export const DEFAULT_AI_DETECTION_CONFIGS: Record<AiDetectionProvider, AiDetectionConfig> = {
  local: {
    provider: 'local',
    apiKey: '',
  },
  originality: {
    provider: 'originality',
    apiKey: '',
    baseUrl: 'https://api.originality.ai/api/v1',
  },
  winston: {
    provider: 'winston',
    apiKey: '',
    baseUrl: 'https://api.gowinston.ai',
  },
  copyscape: {
    provider: 'copyscape',
    apiKey: '',
    baseUrl: 'https://www.copyscape.com/api',
  },
  gptzero: {
    provider: 'gptzero',
    apiKey: '',
    baseUrl: 'https://api.gptzero.me/v2',
  },
  contentatscale: {
    provider: 'contentatscale',
    apiKey: '',
    baseUrl: 'https://api.contentatscale.ai/v1',
  },
  scribbr: {
    provider: 'scribbr',
    apiKey: '',
    baseUrl: 'https://api.scribbr.com',
  },
  zerogpt: {
    provider: 'zerogpt',
    apiKey: '',
    baseUrl: 'https://api.zerogpt.com/api',
  },
};

export const DEFAULT_CONTENT_SAFETY_CONFIGS: Record<ContentSafetyProvider, ContentSafetyConfig> = {
  local: {
    provider: 'local',
  },
  aliyun: {
    provider: 'aliyun',
    accessKeyId: '',
    accessKeySecret: '',
    region: 'cn-shanghai',
  },
  tencent: {
    provider: 'tencent',
    secretId: '',
    secretKey: '',
    region: 'ap-guangzhou',
  },
  baidu: {
    provider: 'baidu',
    apiKey: '',
    secretKey: '',
  },
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  llm: DEFAULT_LLM_CONFIGS.dashscope,
  aiDetection: DEFAULT_AI_DETECTION_CONFIGS.local,
  contentSafety: DEFAULT_CONTENT_SAFETY_CONFIGS.local,
};

// ==================== 配置存储 ====================

const CONFIG_STORAGE_KEY = 'app_config_v2';

export function getAppConfig(): AppConfig {
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (stored) {
    try {
      return { ...DEFAULT_APP_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_APP_CONFIG;
    }
  }
  return DEFAULT_APP_CONFIG;
}

export function saveAppConfig(config: Partial<AppConfig>): void {
  const current = getAppConfig();
  const merged = { ...current, ...config };
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
}

export function getLlmConfig(): ApiConfig {
  return getAppConfig().llm;
}

export function saveLlmConfig(config: Partial<ApiConfig>): void {
  const current = getAppConfig();
  saveAppConfig({ ...current, llm: { ...current.llm, ...config } });
}

export function getAiDetectionConfig(): AiDetectionConfig {
  return getAppConfig().aiDetection;
}

export function saveAiDetectionConfig(config: Partial<AiDetectionConfig>): void {
  const current = getAppConfig();
  saveAppConfig({ ...current, aiDetection: { ...current.aiDetection, ...config } });
}

export function getContentSafetyConfig(): ContentSafetyConfig {
  return getAppConfig().contentSafety;
}

export function saveContentSafetyConfig(config: Partial<ContentSafetyConfig>): void {
  const current = getAppConfig();
  saveAppConfig({ ...current, contentSafety: { ...current.contentSafety, ...config } });
}

// 兼容旧版 API 配置
export function getApiConfig(): ApiConfig {
  return getLlmConfig();
}

export function saveApiConfig(config: Partial<ApiConfig>): void {
  saveLlmConfig(config);
}

// ==================== 大模型 API 调用 ====================

export async function callAiApi(
  prompt: string,
  systemPrompt?: string,
  config?: Partial<ApiConfig>
): Promise<string> {
  const apiConfig = { ...getLlmConfig(), ...config };

  if (!apiConfig.apiKey) {
    throw new Error('请先在 API 设置中配置你的 API Key');
  }

  switch (apiConfig.provider) {
    case 'anthropic':
      return callAnthropicApi(prompt, systemPrompt, apiConfig);
    default:
      return callOpenAiCompatibleApi(prompt, systemPrompt, apiConfig);
  }
}

export async function callAiApiStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  systemPrompt?: string,
  config?: Partial<ApiConfig>
): Promise<void> {
  const apiConfig = { ...getLlmConfig(), ...config };

  if (!apiConfig.apiKey) {
    throw new Error('请先在 API 设置中配置你的 API Key');
  }

  switch (apiConfig.provider) {
    case 'anthropic':
      return callAnthropicApiStream(prompt, onChunk, systemPrompt, apiConfig);
    default:
      return callOpenAiCompatibleApiStream(prompt, onChunk, systemPrompt, apiConfig);
  }
}

async function callOpenAiCompatibleApi(
  prompt: string,
  systemPrompt: string | undefined,
  config: ApiConfig
): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callOpenAiCompatibleApiStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  systemPrompt: string | undefined,
  config: ApiConfig
): Promise<void> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
        } catch {
        }
      }
    }
  }
}

async function callAnthropicApi(
  prompt: string,
  systemPrompt: string | undefined,
  config: ApiConfig
): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [
    { role: 'user', content: prompt }
  ];

  const body: any = {
    model: config.model,
    messages,
    max_tokens: config.maxTokens,
    temperature: config.temperature,
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function callAnthropicApiStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  systemPrompt: string | undefined,
  config: ApiConfig
): Promise<void> {
  const messages: Array<{ role: string; content: string }> = [
    { role: 'user', content: prompt }
  ];

  const body: any = {
    model: config.model,
    messages,
    max_tokens: config.maxTokens,
    temperature: config.temperature,
    stream: true,
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta') {
            const content = parsed.delta?.text;
            if (content) onChunk(content);
          }
        } catch {
        }
      }
    }
  }
}

// ==================== AI 检测 API ====================

export async function callAiDetectionApi(content: string): Promise<AiDetectionResult> {
  const config = getAiDetectionConfig();

  if (config.provider === 'local') {
    throw new Error('local provider should use local implementation');
  }

  switch (config.provider) {
    case 'originality':
      return callOriginalityAi(content, config);
    case 'winston':
      return callWinstonAi(content, config);
    case 'copyscape':
      return callCopyscape(content, config);
    case 'gptzero':
      return callGptZero(content, config);
    case 'contentatscale':
      return callContentAtScale(content, config);
    case 'scribbr':
      return callScribbr(content, config);
    case 'zerogpt':
      return callZeroGpt(content, config);
    default:
      throw new Error(`Unsupported AI detection provider: ${config.provider}`);
  }
}

async function callOriginalityAi(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  if (!config.apiKey) {
    throw new Error('请配置 Originality.ai API Key');
  }

  const response = await fetch(`${config.baseUrl}/scan/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OAI-API-KEY': config.apiKey,
    },
    body: JSON.stringify({
      content,
      title: 'Content Analysis',
    }),
  });

  if (!response.ok) {
    throw new Error(`Originality.ai API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const aiScore = Math.round((data.score?.ai || 0) * 100);

  return {
    overallScore: aiScore,
    segments: [{
      text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      aiProbability: aiScore,
      label: aiScore > 70 ? '高疑似AI' : aiScore > 40 ? '疑似AI' : '疑似人工',
      confidence: Math.abs(aiScore - 50) * 2,
    }],
  };
}

async function callWinstonAi(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  if (!config.apiKey) {
    throw new Error('请配置 Winston AI API Key');
  }

  const response = await fetch(`${config.baseUrl}/v3/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      text: content,
      language: 'zh',
    }),
  });

  if (!response.ok) {
    throw new Error(`Winston AI API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const aiScore = Math.round(data.score * 100);

  return {
    overallScore: aiScore,
    segments: [{
      text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      aiProbability: aiScore,
      label: aiScore > 70 ? '高疑似AI' : aiScore > 40 ? '疑似AI' : '疑似人工',
      confidence: Math.abs(aiScore - 50) * 2,
    }],
  };
}

async function callCopyscape(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  throw new Error('Copyscape integration coming soon');
}

async function callGptZero(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  if (!config.apiKey) {
    throw new Error('请配置 GPTZero API Key');
  }

  const response = await fetch(`${config.baseUrl}/predict/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': config.apiKey,
    },
    body: JSON.stringify({
      document: content,
    }),
  });

  if (!response.ok) {
    throw new Error(`GPTZero API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const aiScore = Math.round((data.documents?.[0]?.completely_generated_prob || 0) * 100);

  return {
    overallScore: aiScore,
    segments: [{
      text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      aiProbability: aiScore,
      label: aiScore > 70 ? '高疑似AI' : aiScore > 40 ? '疑似AI' : '疑似人工',
      confidence: Math.abs(aiScore - 50) * 2,
    }],
  };
}

async function callContentAtScale(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  if (!config.apiKey) {
    throw new Error('请配置 Content at Scale API Key');
  }

  const response = await fetch(`${config.baseUrl}/detect-ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    throw new Error(`Content at Scale API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const aiScore = Math.round((data.ai_score || 0) * 100);

  return {
    overallScore: aiScore,
    segments: [{
      text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      aiProbability: aiScore,
      label: aiScore > 70 ? '高疑似AI' : aiScore > 40 ? '疑似AI' : '疑似人工',
      confidence: Math.abs(aiScore - 50) * 2,
    }],
  };
}

async function callScribbr(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  throw new Error('Scribbr integration coming soon');
}

async function callZeroGpt(content: string, config: AiDetectionConfig): Promise<AiDetectionResult> {
  if (!config.apiKey) {
    throw new Error('请配置 ZeroGPT API Key');
  }

  const response = await fetch(`${config.baseUrl}/detectText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: content,
      api_key: config.apiKey,
    }),
  });

  if (!response.ok) {
    throw new Error(`ZeroGPT API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const aiScore = Math.round(data.fakePercentage || 0);

  return {
    overallScore: aiScore,
    segments: [{
      text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      aiProbability: aiScore,
      label: aiScore > 70 ? '高疑似AI' : aiScore > 40 ? '疑似AI' : '疑似人工',
      confidence: Math.abs(aiScore - 50) * 2,
    }],
  };
}

// ==================== 内容安全 API ====================

export async function callContentSafetyApi(content: string): Promise<SensitiveCheckResult> {
  const config = getContentSafetyConfig();

  if (config.provider === 'local') {
    throw new Error('local provider should use local implementation');
  }

  switch (config.provider) {
    case 'aliyun':
      return callAliyunContentSafety(content, config);
    case 'tencent':
      return callTencentContentSafety(content, config);
    case 'baidu':
      return callBaiduContentSafety(content, config);
    default:
      throw new Error(`Unsupported content safety provider: ${config.provider}`);
  }
}

async function callAliyunContentSafety(content: string, config: ContentSafetyConfig): Promise<SensitiveCheckResult> {
  if (!config.accessKeyId || !config.accessKeySecret) {
    throw new Error('请配置阿里云 AccessKey ID 和 Secret');
  }

  const response = await fetch('https://green-cip.cn-shanghai.aliyuncs.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Service: 'text_antispam',
      ServiceParameters: JSON.stringify({ content }),
    }),
  });

  if (!response.ok) {
    throw new Error(`阿里云内容安全 API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const violations: any[] = [];

  if (data.Data?.Results) {
    for (const result of data.Data.Results) {
      if (result.Label !== 'normal') {
        violations.push({
          type: 'violation',
          text: `检测到 ${result.Label} 内容`,
          triggerText: content.substring(0, 200),
          severity: 'high' as const,
          suggestion: `请删除或修改违规内容`,
        });
      }
    }
  }

  const score = Math.max(100 - violations.length * 20, 10);

  return {
    score,
    violations,
    summary: violations.length === 0
      ? '✅ 内容安全可发布'
      : `⚠️ 检测到 ${violations.length} 处违规内容`,
  };
}

async function callTencentContentSafety(content: string, config: ContentSafetyConfig): Promise<SensitiveCheckResult> {
  throw new Error('腾讯云内容安全集成 coming soon');
}

async function callBaiduContentSafety(content: string, config: ContentSafetyConfig): Promise<SensitiveCheckResult> {
  throw new Error('百度内容安全集成 coming soon');
}

// 模拟 API 调用
export function simulateApiCall(delay: number = 2000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}
