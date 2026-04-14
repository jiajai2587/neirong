// 自媒体多工作平台类型定义

export interface ApiConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
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
