import type {
  ApiConfig,
  LlmProvider,
  AiDetectionConfig,
  AiDetectionProvider,
  ContentSafetyConfig,
  ContentSafetyProvider,
  HotArticlesConfig,
  AppConfig,
  AiDetectionResult,
  SensitiveCheckResult,
  ImageGenerationConfig,
  ImageGenerationProvider,
  HotArticleSource,
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

export const DEFAULT_IMAGE_GENERATION_CONFIGS: Record<ImageGenerationProvider, ImageGenerationConfig> = {
  openai: {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  },
  dashscope: {
    provider: 'dashscope',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    apiKey: '',
    model: 'qwen-vl-plus',
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  },
  stability: {
    provider: 'stability',
    baseUrl: 'https://api.stability.ai/v1',
    apiKey: '',
    model: 'stable-diffusion-xl-1024-v1-0',
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  },
  midjourney: {
    provider: 'midjourney',
    baseUrl: 'https://api.midjourney.com/v1',
    apiKey: '',
    model: 'midjourney-v6',
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  },
  custom: {
    provider: 'custom',
    baseUrl: 'https://api.example.com/v1',
    apiKey: '',
    model: 'custom-model',
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  },
};

export const DEFAULT_HOT_ARTICLES_CONFIG: HotArticlesConfig = {
  useCustom: false,
  apiUrl: '',
  apiKey: '',
  platform: 'all',
};

export const DEFAULT_HOT_ARTICLE_SOURCES: HotArticleSource[] = [
  {
    id: 'wechat',
    name: '微信公众号',
    url: 'https://mp.weixin.qq.com',
    platform: 'wechat',
  },
  {
    id: 'toutiao',
    name: '今日头条',
    url: 'https://www.toutiao.com',
    platform: 'toutiao',
  },
  {
    id: 'tencent',
    name: '腾讯新闻',
    url: 'https://news.qq.com',
    platform: 'tencent',
  },
  {
    id: 'zhihu',
    name: '知乎热榜',
    url: 'https://www.zhihu.com/hot',
    platform: 'zhihu',
  },
  {
    id: 'weibo',
    name: '微博热搜',
    url: 'https://s.weibo.com/top/summary',
    platform: 'weibo',
  },
  {
    id: 'bilibili',
    name: 'B站热门',
    url: 'https://www.bilibili.com/v/popular',
    platform: 'bilibili',
  },
  {
    id: 'douyin',
    name: '抖音热点',
    url: 'https://www.douyin.com',
    platform: 'douyin',
  },
  {
    id: 'xiaohongshu',
    name: '小红书热门',
    url: 'https://www.xiaohongshu.com',
    platform: 'xiaohongshu',
  },
];

export const DEFAULT_APP_CONFIG: AppConfig = {
  llm: DEFAULT_LLM_CONFIGS.dashscope,
  aiDetection: DEFAULT_AI_DETECTION_CONFIGS.local,
  contentSafety: DEFAULT_CONTENT_SAFETY_CONFIGS.local,
  hotArticles: DEFAULT_HOT_ARTICLES_CONFIG,
  imageGeneration: DEFAULT_IMAGE_GENERATION_CONFIGS.openai,
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

export function getHotArticlesConfig(): HotArticlesConfig {
  return getAppConfig().hotArticles;
}

export function saveHotArticlesConfig(config: Partial<HotArticlesConfig>): void {
  const current = getAppConfig();
  saveAppConfig({ ...current, hotArticles: { ...current.hotArticles, ...config } });
}

export function getImageGenerationConfig(): ImageGenerationConfig {
  return getAppConfig().imageGeneration;
}

export function saveImageGenerationConfig(config: Partial<ImageGenerationConfig>): void {
  const current = getAppConfig();
  saveAppConfig({ ...current, imageGeneration: { ...current.imageGeneration, ...config } });
}

// 兼容旧版 API 配置
export function getApiConfig(): ApiConfig {
  return getLlmConfig();
}

export function saveApiConfig(config: Partial<ApiConfig>): void {
  saveLlmConfig(config);
}

// ==================== API 调用 ====================

// 调用 AI API
export async function callAiApi(prompt: string, config: ApiConfig): Promise<string> {
  // 实际实现需要根据不同的 provider 调用相应的 API
  // 这里返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI 响应：${prompt}`);
    }, 1000);
  });
}

// 调用 AI 检测 API
export async function callAiDetectionApi(content: string): Promise<AiDetectionResult> {
  // 实际实现需要调用 AI 检测服务
  // 这里返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        overallScore: 30,
        segments: [
          {
            text: content.substring(0, 100) + '...',
            aiProbability: 25,
            label: '疑似人工',
            confidence: 75,
          }
        ]
      });
    }, 1000);
  });
}

// 调用内容安全 API
export async function callContentSafetyApi(content: string): Promise<SensitiveCheckResult> {
  // 实际实现需要调用内容安全服务
  // 这里返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 95,
        violations: [],
        summary: '✅ 未检测到敏感词和违规内容，内容安全可发布'
      });
    }, 1000);
  });
}

// 调用图片生成 API
export async function callImageGenerationApi(prompt: string, options: { size: string }): Promise<string> {
  // 实际实现需要调用图片生成服务
  // 这里返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://example.com/image/${Date.now()}.jpg`);
    }, 1000);
  });
}
