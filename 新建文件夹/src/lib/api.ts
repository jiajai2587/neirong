import type { ApiConfig } from './types';

// 默认 API 配置 - 默认使用通义千问（qwen-turbo 有免费额度）
export const DEFAULT_API_CONFIG: ApiConfig = {
  provider: 'dashscope',
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: '',
  model: 'qwen-turbo',
  maxTokens: 8192,
  temperature: 0.85,
};

// 获取本地存储的 API 配置
export function getApiConfig(): ApiConfig {
  const stored = localStorage.getItem('api_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_API_CONFIG;
    }
  }
  return DEFAULT_API_CONFIG;
}

// 保存 API 配置
export function saveApiConfig(config: ApiConfig): void {
  localStorage.setItem('api_config', JSON.stringify(config));
}

// 调用 AI API
export async function callAiApi(
  prompt: string,
  systemPrompt?: string,
  config?: Partial<ApiConfig>
): Promise<string> {
  const apiConfig = { ...getApiConfig(), ...config };

  if (!apiConfig.apiKey) {
    throw new Error('请先在 API 设置中配置你的 API Key。推荐使用通义千问（qwen-turbo 有免费额度）');
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages,
      max_tokens: apiConfig.maxTokens,
      temperature: apiConfig.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// 流式调用 AI API
export async function callAiApiStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  systemPrompt?: string,
  config?: Partial<ApiConfig>
): Promise<void> {
  const apiConfig = { ...getApiConfig(), ...config };

  if (!apiConfig.apiKey) {
    throw new Error('请先在 API 设置中配置你的 API Key。推荐使用通义千问（qwen-turbo 有免费额度）');
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages,
      max_tokens: apiConfig.maxTokens,
      temperature: apiConfig.temperature,
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
          // 忽略解析错误
        }
      }
    }
  }
}

// 模拟 API 调用（用于演示）
export function simulateApiCall(delay: number = 2000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}
