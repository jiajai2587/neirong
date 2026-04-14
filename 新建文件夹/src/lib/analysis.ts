import type {
  AiDetectionResult,
  HomogeneityResult,
  TrafficPrediction,
  LogicCheckResult,
  SensitiveCheckResult,
  MarketingCheckResult,
  ComprehensiveReport,
  OptimizationItem,
  PolishResult,
} from './types';
import { generateHomogeneityResult } from './homogeneity';
import { HOT_ARTICLES, fetchHotArticles } from './hotArticles';
import { generateArticle as generateArticleCore, generateArticleLocal, polishContentLocal } from './articleGenerator';
import { callAiDetectionApi, callContentSafetyApi, getAiDetectionConfig, getContentSafetyConfig } from './api';

// Re-exports
export { fetchHotArticles, HOT_ARTICLES };
export { generateArticleLocal, polishContentLocal };
export { generateArticleCore as generateArticle };

// 敏感词库
const SENSITIVE_WORDS = [
  { word: '最', suggestion: '建议改为"非常"、"十分"、"相当"等替代表达', severity: 'high' as const, reason: '违反广告法极限用语' },
  { word: '第一', suggestion: '建议改为"领先"、"优秀"、"突出"等替代表达', severity: 'high' as const, reason: '违反广告法极限用语' },
  { word: '绝对', suggestion: '建议改为"基本"、"通常"、"很大程度上"等替代表达', severity: 'high' as const, reason: '违反广告法极限用语' },
  { word: '必定', suggestion: '建议改为"很可能"、"大概率"等替代表达', severity: 'medium' as const, reason: '绝对化表述' },
  { word: '国家级', suggestion: '建议改为"行业领先"、"专业级"等替代表达', severity: 'high' as const, reason: '可能涉及虚假宣传' },
  { word: '世界级', suggestion: '建议改为"国际水准"、"行业领先"等替代表达', severity: 'high' as const, reason: '可能涉及虚假宣传' },
  { word: '顶级', suggestion: '建议改为"高端"、"优质"、"专业"等替代表达', severity: 'high' as const, reason: '违反广告法极限用语' },
  { word: '极品', suggestion: '建议改为"精选"、"优质"、"上乘"等替代表达', severity: 'high' as const, reason: '违反广告法极限用语' },
  { word: '万能', suggestion: '建议改为"多功能"、"适用广泛"等替代表达', severity: 'high' as const, reason: '夸大宣传' },
  { word: '100%', suggestion: '建议改为"极高"、"几乎"等替代表达', severity: 'high' as const, reason: '绝对化数据表述' },
  { word: '百分百', suggestion: '建议改为"极高"、"几乎"等替代表达', severity: 'high' as const, reason: '绝对化数据表述' },
  { word: '包治', suggestion: '建议删除，涉及医疗虚假宣传', severity: 'high' as const, reason: '医疗虚假宣传' },
  { word: '根治', suggestion: '建议改为"有效改善"、"帮助缓解"等替代表达', severity: 'high' as const, reason: '医疗虚假宣传' },
  { word: '无副作用', suggestion: '建议删除，涉及医疗虚假宣传', severity: 'high' as const, reason: '医疗虚假宣传' },
  { word: '绝无仅有', suggestion: '建议改为"难得"、"少见"等替代表达', severity: 'medium' as const, reason: '极限用语' },
  { word: '暴富', suggestion: '建议改为"增加收入"、"提升财富"等替代表达', severity: 'high' as const, reason: '虚假收益承诺' },
  { word: '躺赚', suggestion: '建议改为"被动收入"、"持续收益"等替代表达', severity: 'high' as const, reason: '虚假收益承诺' },
  { word: '日入', suggestion: '建议改为"日均收益"、"每日收入"等替代表达', severity: 'medium' as const, reason: '收益暗示' },
  { word: '月入过万', suggestion: '建议改为"收入可观"、"收益丰厚"等替代表达', severity: 'high' as const, reason: '虚假收益承诺' },
  { word: '稳赚不赔', suggestion: '建议删除，涉及投资虚假宣传', severity: 'high' as const, reason: '投资虚假宣传' },
  { word: '稳赚', suggestion: '建议改为"收益稳定"、"风险较低"等替代表达', severity: 'high' as const, reason: '投资虚假宣传' },
  { word: '加微信', suggestion: '建议改为"添加联系方式"、"关注我们"等替代表达', severity: 'medium' as const, reason: '平台限制引流' },
  { word: '公众号', suggestion: '建议改为"官方账号"、"我们的平台"等替代表达', severity: 'medium' as const, reason: '跨平台引流' },
  { word: '扫码', suggestion: '建议改为"识别"、"查看"等替代表达', severity: 'medium' as const, reason: '平台限制引流' },
  { word: '私聊', suggestion: '建议改为"私信沟通"、"留言交流"等替代表达', severity: 'medium' as const, reason: '平台限制引流' },
  { word: '私信', suggestion: '建议改为"留言"、"评论交流"等替代表达', severity: 'low' as const, reason: '平台限制引流' },
  { word: 'VX', suggestion: '建议改为"联系方式"、"官方渠道"等替代表达', severity: 'medium' as const, reason: '平台限制引流' },
  { word: '微信', suggestion: '建议改为"联系方式"、"社交账号"等替代表达', severity: 'medium' as const, reason: '跨平台引流' },
  { word: '限时抢购', suggestion: '建议改为"活动期间"、"优惠期间"等替代表达', severity: 'medium' as const, reason: '营销诱导' },
  { word: '最后一天', suggestion: '建议改为"即将结束"、"倒计时"等替代表达', severity: 'medium' as const, reason: '紧迫催促' },
  { word: '错过等一年', suggestion: '建议改为"机会难得"、"不容错过"等替代表达', severity: 'medium' as const, reason: '紧迫催促' },
  { word: '仅此一次', suggestion: '建议改为"难得机会"、"特别优惠"等替代表达', severity: 'medium' as const, reason: '紧迫催促' },
  { word: '减肥', suggestion: '建议改为"身材管理"、"健康管理"等替代表达', severity: 'medium' as const, reason: '敏感话题' },
  { word: '丰胸', suggestion: '建议删除，涉及敏感内容', severity: 'high' as const, reason: '敏感内容' },
  { word: '壮阳', suggestion: '建议删除，涉及敏感内容', severity: 'high' as const, reason: '敏感内容' },
  { word: '色情', suggestion: '建议删除，涉及违禁内容', severity: 'high' as const, reason: '违禁内容' },
  { word: '赌博', suggestion: '建议删除，涉及违禁内容', severity: 'high' as const, reason: '违禁内容' },
  { word: '毒品', suggestion: '建议删除，涉及违禁内容', severity: 'high' as const, reason: '违禁内容' },
];

const MARKETING_PATTERNS = [
  { pattern: /限时|抢购|秒杀|打折|优惠|满减|包邮|特价/g, type: '促销话术', suggestion: '建议减少促销类表述，增加内容价值分享。如将"限时抢购"改为"值得关注的产品"，将"打折优惠"改为"性价比不错的选择"。', severity: 'medium' as const },
  { pattern: /加微信|公众号|扫码关注|私信|VX|联系方式|电话/g, type: '引流话术', suggestion: '建议删除或弱化引流内容。平台算法会识别引流行为并降低推荐。可以改为"欢迎在评论区交流"、"关注我获取更多"等更自然的方式。', severity: 'high' as const },
  { pattern: /最|第一|顶级|极致|完美|万能|绝对|必定|包/g, type: '极限用语', suggestion: '违反广告法的极限用语必须修改。建议替换为："非常"、"十分"、"领先"、"优秀"、"专业"等相对温和的表达。', severity: 'high' as const },
  { pattern: /买一送一|免费领|0元购|白送|送送送|福利/g, type: '营销诱导', suggestion: '建议减少营销诱导性表述。可以改为"值得关注"、"性价比很高"等更自然的推荐方式，避免过度营销感。', severity: 'medium' as const },
  { pattern: /暴富|躺赚|日入|月入|年薪|财富自由|轻松赚钱/g, type: '收益承诺', suggestion: '收益承诺类表述容易触发平台审核。建议改为"增加收入渠道"、"提升财务状况"等更理性的表达，并添加风险提示。', severity: 'high' as const },
  { pattern: /赶紧|立即|马上|手慢无|错过等|最后机会|仅此一次/g, type: '紧迫催促', suggestion: '紧迫催促会让读者产生反感。建议改为"推荐关注"、"值得了解"等更平和的表达方式，让读者自主决定。', severity: 'low' as const },
];

// 分段检测 AI
export async function analyzeAiDetection(content: string): Promise<AiDetectionResult> {
  const config = getAiDetectionConfig();

  if (config.provider !== 'local') {
    try {
      return await callAiDetectionApi(content);
    } catch (e) {
      console.warn('AI 检测 API 调用失败，回退到本地检测:', e);
    }
  }

  const paragraphs = content.split(/\n+/).filter(p => p.trim().length > 0);
  const segments = paragraphs.map(para => {
    const score = calculateAiScore(para);
    return {
      text: para.trim().substring(0, 100) + (para.trim().length > 100 ? '...' : ''),
      aiProbability: score,
      label: score > 70 ? '高疑似AI' : score > 40 ? '疑似AI' : '疑似人工',
      confidence: Math.abs(score - 50) * 2,
    };
  });

  const overallScore = segments.length > 0
    ? Math.round(segments.reduce((sum, s) => sum + s.aiProbability, 0) / segments.length)
    : 0;

  return { overallScore, segments };
}

function calculateAiScore(text: string): number {
  let score = 30;
  const length = text.length;

  if (length > 200) score += 10;
  if (length > 500) score += 5;

  const sentences = text.split(/[，。！？；,\.!?;]+/).filter(s => s.trim());
  if (sentences.length > 3) {
    const avgLen = length / sentences.length;
    const variance = sentences.reduce((sum, s) => sum + Math.pow(s.trim().length - avgLen, 2), 0) / sentences.length;
    if (variance < 50) score += 15;
  }

  const connectors = ['首先', '其次', '再次', '最后', '总之', '综上所述', '因此', '然而', '不过', '此外', '另外', '同时', '而且', '并且', '所以', '但是'];
  const connectorCount = connectors.filter(c => text.includes(c)).length;
  score += Math.min(connectorCount * 5, 20);

  const emotionalWords = ['太', '超', '非常', '特别', '真的', '好', '棒', '赞', '喜欢', '爱'];
  const emotionalCount = emotionalWords.filter(w => text.includes(w)).length;
  if (emotionalCount === 0) score += 8;

  return Math.min(Math.max(score, 0), 99);
}

// 同质化检测
export function analyzeHomogeneity(content: string): HomogeneityResult {
  return generateHomogeneityResult(content);
}

// 流量预测 - 基于真实内容分析，给出合理预测
export function analyzeTraffic(content: string): TrafficPrediction {
  const wordCount = content.replace(/\s/g, '').length;
  const paragraphs = content.split(/\n+/).filter(p => p.trim());
  const sentences = content.split(/[。！？.!?]+/).filter(s => s.trim());
  const paraCount = paragraphs.length;

  // ===== 内容质量评分（0-100）=====
  let quality = 25; // 基础分

  // 1. 字数评分 (0-20分) - 新号/普通号的真实阅读量范围
  if (wordCount >= 1500) quality += 20;
  else if (wordCount >= 1000) quality += 16;
  else if (wordCount >= 800) quality += 12;
  else if (wordCount >= 500) quality += 8;
  else if (wordCount >= 300) quality += 4;
  else quality += 1;

  // 2. 段落结构评分 (0-15分)
  if (paraCount >= 10) quality += 15;
  else if (paraCount >= 7) quality += 12;
  else if (paraCount >= 5) quality += 9;
  else if (paraCount >= 3) quality += 5;
  else quality += 2;

  // 3. 平均段落长度合理性 (0-10分)
  const avgParaLen = paraCount > 0 ? wordCount / paraCount : 0;
  if (avgParaLen >= 80 && avgParaLen <= 200) quality += 10;
  else if (avgParaLen >= 50 && avgParaLen <= 250) quality += 7;
  else if (avgParaLen >= 30 && avgParaLen <= 300) quality += 4;
  else quality += 1;

  // 4. 关键词覆盖 (0-10分)
  const hotKeywords = ['AI', '教程', '攻略', '技巧', '方法', '最新', '干货', '必看', '新手', '运营', '流量', '自媒体'];
  const keywordCount = hotKeywords.filter(k => content.includes(k)).length;
  quality += Math.min(keywordCount * 2, 10);

  // 5. 句式多样性 (0-10分)
  const hasQuestions = /[？?]/.test(content);
  const hasExclamations = /[！!]/.test(content);
  const hasNumbers = /\d+/.test(content);
  const hasQuotes = /[""「」]/.test(content);
  if (hasQuestions) quality += 3;
  if (hasExclamations) quality += 2;
  if (hasNumbers) quality += 3;
  if (hasQuotes) quality += 2;

  // 6. 小标题使用 (0-5分)
  const hasSubheadings = /^#{1,3}\s|^【|^\d+[.、]/m.test(content);
  if (hasSubheadings) quality += 5;

  // 7. 互动元素 (0-5分)
  const hasInteractive = /欢迎|评论|留言|分享|点赞|收藏|关注/.test(content);
  if (hasInteractive) quality += 5;

  // 8. Emoji使用 (0-5分)
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
  if (hasEmojis) quality += 3;

  quality = Math.min(Math.max(quality, 10), 100);

  // ===== 基于质量分计算真实阅读量 =====
  // 对于普通自媒体号（粉丝量1000-10000），真实阅读量范围：
  // 质量差（10-30分）：50-300
  // 质量一般（30-50分）：200-800
  // 质量中等（50-70分）：500-2000
  // 质量良好（70-85分）：1000-5000
  // 质量优秀（85-100分）：3000-15000

  const getRealisticViews = (qualityScore: number, platformMultiplier: number): string => {
    let baseViews: number;
    if (qualityScore < 30) {
      baseViews = 50 + Math.round(qualityScore * 8); // 50-290
    } else if (qualityScore < 50) {
      baseViews = 200 + Math.round((qualityScore - 30) * 30); // 200-800
    } else if (qualityScore < 70) {
      baseViews = 500 + Math.round((qualityScore - 50) * 75); // 500-2000
    } else if (qualityScore < 85) {
      baseViews = 1000 + Math.round((qualityScore - 70) * 267); // 1000-5000
    } else {
      baseViews = 3000 + Math.round((qualityScore - 85) * 800); // 3000-15000
    }

    const finalViews = Math.round(baseViews * platformMultiplier);

    if (finalViews >= 10000) return `${(finalViews / 10000).toFixed(1)}万`;
    if (finalViews >= 1000) return `${(finalViews / 1000).toFixed(1)}千`;
    return `${finalViews}`;
  };

  // 各平台评分和预测阅读量（基于真实内容分析）
  const platforms = [
    {
      name: '微信公众号',
      icon: 'wechat',
      multiplier: 1.0,
      baseScore: quality * 0.9,
      bonus: wordCount >= 1000 ? 8 : 0,
      recommendation: quality >= 70 ? '推荐发布' : quality >= 50 ? '可发布' : '建议优化后再发布',
    },
    {
      name: '今日头条',
      icon: 'toutiao',
      multiplier: 1.8,
      baseScore: quality * 1.0,
      bonus: /\d+/.test(content) ? 8 : 0,
      recommendation: quality >= 60 ? '推荐发布' : quality >= 40 ? '建议增加热点关键词' : '建议大幅优化',
    },
    {
      name: '知乎',
      icon: 'zhihu',
      multiplier: 0.7,
      baseScore: quality * 0.8,
      bonus: wordCount >= 1500 ? 12 : 0,
      recommendation: quality >= 65 ? '适合深度内容' : quality >= 45 ? '建议增加专业分析' : '建议扩充内容深度',
    },
    {
      name: '小红书',
      icon: 'xiaohongshu',
      multiplier: 1.2,
      baseScore: quality * 0.85,
      bonus: hasEmojis ? 10 : -5,
      recommendation: quality >= 55 && hasEmojis ? '推荐发布' : quality >= 40 ? '建议增加emoji和短段落' : '建议优化排版',
    },
    {
      name: '百家号',
      icon: 'baijia',
      multiplier: 1.3,
      baseScore: quality * 0.95,
      bonus: hasSubheadings ? 5 : 0,
      recommendation: quality >= 60 ? '推荐发布' : quality >= 40 ? '建议调整标题吸引点击' : '建议优化内容质量',
    },
    {
      name: '抖音图文',
      icon: 'douyin',
      multiplier: 1.5,
      baseScore: quality * 0.9,
      bonus: paraCount <= 10 ? 8 : -3,
      recommendation: quality >= 50 ? '适合图文形式' : quality >= 35 ? '建议增加视觉元素' : '建议优化内容结构',
    },
  ];

  const platformResults = platforms.map(p => {
    const score = Math.min(Math.max(Math.round(p.baseScore + p.bonus), 10), 98);
    return {
      name: p.name,
      icon: p.icon,
      predictedViews: getRealisticViews(quality, p.multiplier),
      score,
      recommendation: p.recommendation,
    };
  });

  const overallScore = Math.round(platformResults.reduce((sum, p) => sum + p.score, 0) / platformResults.length);
  const suggestions = generateTrafficSuggestions(content, quality, wordCount, paraCount);

  return { platforms: platformResults, overallScore, suggestions };
}

function generateTrafficSuggestions(content: string, quality: number, wordCount: number, paraCount: number): string[] {
  const suggestions: string[] = [];

  if (wordCount < 300) suggestions.push(`⚠️ 文章仅${wordCount}字，建议扩充到800字以上以获得更好推荐`);
  else if (wordCount < 500) suggestions.push(`⚠️ 文章${wordCount}字偏短，建议扩充到800-2000字`);
  else if (wordCount >= 800 && wordCount <= 2000) suggestions.push(`✅ 文章${wordCount}字，字数适中`);

  if (paraCount < 3) suggestions.push('⚠️ 段落过少，建议增加段落数量提升可读性');
  else if (paraCount > 15) suggestions.push('⚠️ 段落过多，建议合并相关段落');

  if (!content.includes('#') && !content.includes('【')) suggestions.push('💡 建议添加小标题，提升文章结构清晰度');
  if (!/\d+/.test(content)) suggestions.push('💡 建议添加具体数据，增强内容可信度');
  if (!/[？?]/.test(content)) suggestions.push('💡 建议添加互动性问句，引导读者评论');

  suggestions.push('🕐 选择流量高峰期发布：早8-9点、午12-13点、晚20-22点');
  suggestions.push('📸 搭配3-5张高质量配图可提升30%点击率');

  return suggestions;
}

// 内容逻辑性检测
export function analyzeLogic(content: string): LogicCheckResult {
  const paragraphs = content.split(/\n+/).filter(p => p.trim());
  const sentences = content.split(/[。！？.!?]+/).filter(s => s.trim());
  const issues: LogicCheckResult['issues'] = [];

  if (paragraphs.length >= 2) {
    for (let i = 1; i < paragraphs.length; i++) {
      const prev = paragraphs[i - 1].trim();
      const curr = paragraphs[i].trim();
      if (prev.length > 20 && curr.length > 20) {
        const prevWords = new Set(prev.split('').slice(-20));
        const currWords = new Set(curr.split('').slice(0, 20));
        const overlap = [...prevWords].filter(w => currWords.has(w)).length;
        if (overlap < 2 && prev.length > 50 && curr.length > 50) {
          issues.push({
            type: '话题跳跃',
            description: `第${i}段与第${i + 1}段之间缺乏过渡，话题转换较突兀。`,
            suggestion: '添加过渡句连接两段，如："除此之外"、"另一方面"、"值得注意的是"等过渡词。',
            severity: 'medium' as const,
          });
        }
      }
    }
  }

  if (paragraphs.length > 0) {
    const first = paragraphs[0].trim();
    if (first.length < 20) {
      issues.push({
        type: '开头单薄',
        description: '文章开头过于简短（不足20字），缺乏吸引力和信息量。',
        suggestion: '开头建议用故事、数据或问题吸引读者，建议至少50-100字。',
        severity: 'medium' as const,
      });
    }
    const cliches = ['随着', '在当今社会', '众所周知', '不可否认', '毫无疑问'];
    const foundCliche = cliches.find(c => first.startsWith(c));
    if (foundCliche) {
      issues.push({
        type: '开头陈词滥调',
        description: `文章开头使用了"${foundCliche}"这类常见套话。`,
        suggestion: `建议避免使用"${foundCliche}"开头的套路，用具体场景或故事开头。`,
        severity: 'medium' as const,
      });
    }
  }

  const conclusionWords = ['总之', '综上所述', '总而言之', '最后', '结语', '总结'];
  const hasConclusion = conclusionWords.some(w => content.includes(w));
  if (!hasConclusion && paragraphs.length > 3) {
    issues.push({
      type: '缺少总结',
      description: '文章没有明显的总结段落。',
      suggestion: '在结尾添加总结段落，概括核心观点，引导读者行动。',
      severity: 'low' as const,
    });
  }

  const longSentences = sentences.filter(s => s.trim().length > 60);
  if (longSentences.length > sentences.length * 0.3) {
    issues.push({
      type: '长句过多',
      description: `文章中有 ${longSentences.length} 个句子超过60字。`,
      suggestion: '建议将长句拆分为短句，一般中文句子控制在15-30字最佳。',
      severity: 'medium' as const,
    });
  }

  const totalLength = content.replace(/\s/g, '').length;
  if (totalLength < 300) {
    issues.push({
      type: '文章过短',
      description: `文章总字数仅${totalLength}字。`,
      suggestion: '建议将文章扩充到800-2000字，添加案例、数据、分析等内容。',
      severity: 'medium' as const,
    });
  }

  const score = Math.max(100 - issues.length * 12, 20);
  return {
    score,
    issues,
    summary: issues.length === 0
      ? '文章逻辑结构清晰，段落过渡自然，内容组织良好'
      : `发现 ${issues.length} 个逻辑问题，建议优化以提升阅读体验`,
  };
}

// 敏感与违规检测
export async function analyzeSensitive(content: string): Promise<SensitiveCheckResult> {
  const config = getContentSafetyConfig();

  if (config.provider !== 'local') {
    try {
      return await callContentSafetyApi(content);
    } catch (e) {
      console.warn('内容安全 API 调用失败，回退到本地检测:', e);
    }
  }

  const violations: SensitiveCheckResult['violations'] = [];
  const paragraphs = content.split(/\n+/).filter(p => p.trim());

  SENSITIVE_WORDS.forEach(({ word, suggestion, severity, reason }) => {
    const index = content.indexOf(word);
    if (index !== -1) {
      let triggerParagraph = '';
      for (const para of paragraphs) {
        if (para.includes(word)) {
          triggerParagraph = para.trim();
          break;
        }
      }
      violations.push({
        type: severity === 'high' ? 'violation' : 'sensitive',
        text: `检测到"${word}" — ${reason}`,
        triggerText: triggerParagraph.substring(0, 200) + (triggerParagraph.length > 200 ? '...' : ''),
        severity,
        suggestion: `违禁词："${word}" | 原因：${reason} | 建议修改为：${suggestion}`,
      });
    }
  });

  const score = Math.max(100 - violations.filter(v => v.severity === 'high').length * 15 - violations.filter(v => v.severity === 'medium').length * 8, 10);
  return {
    score,
    violations,
    summary: violations.length === 0
      ? '✅ 未检测到敏感词和违规内容，内容安全可发布'
      : `⚠️ 检测到 ${violations.length} 处敏感/违规内容（其中${violations.filter(v => v.severity === 'high').length}处高风险），建议修改后再发布`,
  };
}

// 营销文与广告浓度检测
export function analyzeMarketing(content: string): MarketingCheckResult {
  const issues: MarketingCheckResult['issues'] = [];
  const paragraphs = content.split(/\n+/).filter(p => p.trim());

  MARKETING_PATTERNS.forEach(({ pattern, type, suggestion, severity }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      let triggerParagraph = '';
      for (const para of paragraphs) {
        const resetPattern = new RegExp(pattern.source, pattern.flags);
        if (resetPattern.test(para)) {
          triggerParagraph = para.trim();
          break;
        }
      }
      issues.push({
        type,
        text: `检测到 ${matches.length} 处${type}`,
        triggerText: triggerParagraph.substring(0, 200) + (triggerParagraph.length > 200 ? '...' : ''),
        severity: matches.length > 3 ? 'high' : matches.length > 1 ? 'medium' : 'low',
        suggestion: `${type}（${matches.length}处）| 建议：${suggestion}`,
      });
    }
  });

  const adDensity = Math.min(Math.round((issues.length / Math.max(paragraphs.length, 1)) * 100), 100);
  const score = Math.max(100 - issues.filter(i => i.severity === 'high').length * 15 - issues.filter(i => i.severity === 'medium').length * 8, 10);
  return {
    score,
    adDensity,
    issues,
    summary: issues.length === 0
      ? '✅ 内容营销浓度低，阅读体验良好，适合发布'
      : `⚠️ 检测到 ${issues.length} 类营销特征，广告浓度 ${adDensity}%，建议优化后再发布`,
  };
}

// 综合检测报告
export async function generateComprehensiveReport(content: string): Promise<ComprehensiveReport> {
  const ai = await analyzeAiDetection(content);
  const homogeneity = analyzeHomogeneity(content);
  const traffic = analyzeTraffic(content);
  const logic = analyzeLogic(content);
  const sensitive = await analyzeSensitive(content);
  const marketing = analyzeMarketing(content);

  const overallScore = Math.round(
    (100 - ai.overallScore) * 0.2 +
    (100 - homogeneity.score) * 0.15 +
    traffic.overallScore * 0.2 +
    logic.score * 0.15 +
    sensitive.score * 0.15 +
    marketing.score * 0.15
  );

  const optimizationList: OptimizationItem[] = [];

  if (ai.overallScore > 50) {
    optimizationList.push({
      priority: 'high',
      category: 'AI检测',
      title: '降低AI痕迹',
      description: `当前AI疑似度为${ai.overallScore}%，超过安全阈值。`,
      action: '①增加个人真实经历和情感表达 ②使用更口语化的表达方式 ③减少模板化连接词 ④增加反问句、感叹句 ⑤加入具体数据、时间、地点等细节',
    });
  }

  if (homogeneity.score > 50) {
    optimizationList.push({
      priority: 'high',
      category: '同质化',
      title: '提升内容独特性',
      description: `同质化指数${homogeneity.score}%，与已有内容相似度偏高。`,
      action: '①添加个人独特案例和数据 ②改变文章结构和叙述方式 ③加入最新行业动态 ④表达个人观点 ⑤使用自己的语言重新表述',
    });
  }

  if (traffic.overallScore < 60) {
    optimizationList.push({
      priority: 'medium',
      category: '流量预测',
      title: '优化内容以获得更好流量',
      description: `预测流量评分${traffic.overallScore}分，有提升空间。`,
      action: '①优化标题，使用数字和悬念 ②增加热门关键词 ③选择流量高峰时段发布 ④搭配3-5张高质量配图 ⑤添加互动引导',
    });
  }

  if (logic.issues.length > 0) {
    optimizationList.push({
      priority: 'medium',
      category: '逻辑性',
      title: '改善文章逻辑结构',
      description: `发现${logic.issues.length}个逻辑问题。`,
      action: logic.issues.map(i => i.suggestion).join('；'),
    });
  }

  if (sensitive.violations.length > 0) {
    const highRisk = sensitive.violations.filter(v => v.severity === 'high');
    const words = highRisk.map(v => v.text.split('"')[1]).filter(Boolean).join('、');
    optimizationList.push({
      priority: 'high',
      category: '敏感词',
      title: '清除敏感违规词',
      description: `检测到${sensitive.violations.length}处敏感/违规内容（${highRisk.length}处高风险）。`,
      action: highRisk.length > 0
        ? `必须修改的违规词：${words || '见检测报告'}。请逐一替换为建议的替代表达。`
        : '修改所有标记的敏感词',
    });
  }

  if (marketing.issues.length > 0) {
    optimizationList.push({
      priority: 'medium',
      category: '营销检测',
      title: '降低营销浓度',
      description: `广告浓度${marketing.adDensity}%，检测到${marketing.issues.length}类营销特征。`,
      action: '①减少促销话术和引流内容 ②增加有价值的内容分享 ③用自然的推荐替代硬性广告 ④删除引流话术 ⑤将营销内容控制在15%以内',
    });
  }

  if (content.replace(/\s/g, '').length < 800) {
    optimizationList.push({
      priority: 'medium',
      category: '内容长度',
      title: '扩充文章内容',
      description: '文章字数偏少，可能影响平台推荐权重。',
      action: '①添加具体案例和故事 ②补充数据支撑 ③增加不同角度的分析 ④添加个人经验和见解 ⑤提供可操作的建议或步骤',
    });
  }

  optimizationList.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return {
    aiDetection: ai,
    homogeneity,
    traffic,
    logic,
    sensitive,
    marketing,
    overallScore,
    optimizationList,
  };
}

// AI 润色 - 本地实现
export function polishContentLocalFn(content: string, mode: string): string {
  return polishContentLocal(content, mode);
}

// AI 生成文章
export async function generateArticleFn(
  topic: string,
  platform: string,
  style: string,
  wordCount: number,
  onChunk?: (chunk: string) => void
): Promise<string> {
  return generateArticleCore(topic, platform, style, wordCount, onChunk);
}
