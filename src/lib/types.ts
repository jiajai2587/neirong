// 自媒体多工作平台类型定义

// 大模型提供商类型
export type LlmProvider = 'dashscope' | 'openai' | 'anthropic' | 'deepseek' | 'openai-compatible' | 'doubao' | 'zhipu' | 'wenxin' | 'moonshot' | 'kimi';

// AI 检测服务提供商类型
export type AiDetectionProvider = 'originality' | 'winston' | 'copyscape' | 'local' | 'gptzero' | 'contentatscale' | 'scribbr' | 'zerogpt' | 'dashscope' | 'zhipu' | 'wenxin';

// 内容安全服务提供商类型
export type ContentSafetyProvider = 'aliyun' | 'tencent' | 'baidu' | 'local' | 'dashscope' | 'zhipu' | 'huawei';

// 图片生成服务提供商类型
export type ImageGenerationProvider = 'openai' | 'dashscope' | 'stability' | 'midjourney' | 'custom' | 'doubao' | 'zhipu' | 'wenxin';

// AI润色服务提供商类型
export type PolishProvider = 'openai' | 'dashscope' | 'deepseek' | 'doubao' | 'zhipu' | 'wenxin' | 'anthropic' | 'custom';

// AI润色配置
export interface PolishConfig {
  provider: PolishProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// 热门文章来源配置
export interface HotArticleSource {
  id: string;
  name: string;
  url: string;
  platform: string;
}

// 图片生成配置
export interface ImageGenerationConfig {
  provider: ImageGenerationProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

export interface ApiConfig {
  provider: LlmProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// AI 检测配置
export interface AiDetectionConfig {
  provider: AiDetectionProvider;
  apiKey: string;
  baseUrl?: string;
}

// 内容安全配置
export interface ContentSafetyConfig {
  provider: ContentSafetyProvider;
  accessKeyId?: string;
  accessKeySecret?: string;
  secretId?: string;
  secretKey?: string;
  apiKey?: string;
  region?: string;
}

// 热门文章配置
export interface HotArticlesConfig {
  useCustom: boolean;
  apiUrl: string;
  apiKey?: string;
}

// 完整应用配置
export interface AppConfig {
  llm: ApiConfig;
  aiDetection: AiDetectionConfig;
  contentSafety: ContentSafetyConfig;
  hotArticles: HotArticlesConfig;
  imageGeneration: ImageGenerationConfig;
  polish: PolishConfig;
}

export interface AiDetectionResult {
  overallScore: number;
  segments: AiSegmentResult[];
}

export interface AiSegmentResult {
  text: string;
  aiProbability: number;
  label: string;
  confidence: number;
}

export interface HomogeneityResult {
  score: number;
  similarSources: SimilarSource[];
  summary: string;
}

export interface SimilarSource {
  title: string;
  url: string;
  similarity: number;
  platform: string;
}

export interface TrafficPrediction {
  platforms: TrafficPlatform[];
  overallScore: number;
  suggestions: string[];
}

export interface TrafficPlatform {
  name: string;
  icon: string;
  predictedViews: string;
  score: number;
  recommendation: string;
}

export interface LogicCheckResult {
  score: number;
  issues: LogicIssue[];
  summary: string;
}

export interface LogicIssue {
  type: string;
  description: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SensitiveCheckResult {
  score: number;
  violations: SensitiveViolation[];
  summary: string;
}

export interface SensitiveViolation {
  type: 'sensitive' | 'violation';
  text: string;
  triggerText: string;
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface MarketingCheckResult {
  score: number;
  adDensity: number;
  issues: MarketingIssue[];
  summary: string;
}

export interface MarketingIssue {
  type: string;
  text: string;
  triggerText: string;
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface ComprehensiveReport {
  aiDetection: AiDetectionResult;
  homogeneity: HomogeneityResult;
  traffic: TrafficPrediction;
  logic: LogicCheckResult;
  sensitive: SensitiveCheckResult;
  marketing: MarketingCheckResult;
  overallScore: number;
  optimizationList: OptimizationItem[];
}

export interface OptimizationItem {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  action: string;
}

export interface PolishResult {
  original: string;
  polished: string;
  changes: string[];
}

export interface HotArticle {
  title: string;
  source: string;
  platform: string;
  views: string;
  url: string;
  tags: string[];
  publishDate: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  icon: string;
  colors: {
    primary: string;
    bg: string;
    accent: string;
  };
}
