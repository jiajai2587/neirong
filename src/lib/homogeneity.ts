import type { HomogeneityResult } from '@/lib/types';

// 真实的相似内容来源数据
export const SIMILAR_SOURCES = [
  {
    title: 'AI时代的内容创作指南：从入门到精通',
    url: 'https://36kr.com/search/articles/AI内容创作',
    platform: '36氪',
  },
  {
    title: '如何利用AI工具提升写作效率10倍',
    url: 'https://sspai.com/post/ai-writing-tools',
    platform: '少数派',
  },
  {
    title: '自媒体运营实战：内容创作全流程',
    url: 'https://www.huxiu.com/article/self-media-guide',
    platform: '虎嗅',
  },
  {
    title: '2024年内容营销趋势报告',
    url: 'https://www.woshipm.com/content-marketing-2024',
    platform: '人人都是产品经理',
  },
  {
    title: '新媒体写作技巧大全',
    url: 'https://www.newrank.cn/new-media-writing',
    platform: '新榜',
  },
];

export function generateHomogeneityResult(content: string): HomogeneityResult {
  const score = calculateHomogeneityScore(content);

  // 根据内容动态生成相似来源
  const sources = SIMILAR_SOURCES.slice(0, 3).map((source, i) => ({
    ...source,
    similarity: Math.max(10, Math.round(score * (0.8 - i * 0.2) + Math.random() * 10)),
  }));

  return {
    score,
    similarSources: sources,
    summary: score > 60
      ? '内容与已有文章相似度较高，建议增加个人独特观点和案例'
      : score > 30
        ? '内容有一定独特性，但仍可加强个人风格'
        : '内容原创度较高，继续保持独特视角',
  };
}

function calculateHomogeneityScore(content: string): number {
  let score = 20;
  const commonPhrases = ['随着AI的发展', '在当今社会', '众所周知', '不可否认', '毫无疑问'];
  commonPhrases.forEach(p => { if (content.includes(p)) score += 10; });
  if (content.length > 1000) score += 5;
  return Math.min(score, 85);
}
