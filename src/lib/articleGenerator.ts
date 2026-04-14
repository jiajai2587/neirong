// AI 文章生成器 - 本地高质量生成引擎
// 当没有配置 API Key 时使用此本地生成器

interface ArticleSection {
  type: 'title' | 'hook' | 'intro' | 'body' | 'example' | 'tips' | 'conclusion' | 'cta';
  content: string;
}

// 文章模板库 - 多种风格
const ARTICLE_TEMPLATES: Record<string, ArticleTemplate> = {
  '干货教程': {
    structure: ['title', 'hook', 'intro', 'body', 'body', 'example', 'tips', 'conclusion', 'cta'],
    tone: '专业但亲切，像一个有经验的朋友在分享',
    features: ['具体步骤', '实操案例', '避坑指南', '数据支撑'],
  },
  '观点评论': {
    structure: ['title', 'hook', 'intro', 'body', 'body', 'body', 'conclusion', 'cta'],
    tone: '有态度有观点，但不偏激，理性分析',
    features: ['独特视角', '深度分析', '对比论证', '个人见解'],
  },
  '新闻资讯': {
    structure: ['title', 'hook', 'intro', 'body', 'body', 'example', 'conclusion', 'cta'],
    tone: '客观中立，信息量大，及时性强',
    features: ['时效信息', '多方观点', '背景补充', '趋势预测'],
  },
  '个人分享': {
    structure: ['title', 'hook', 'intro', 'body', 'example', 'body', 'conclusion', 'cta'],
    tone: '真诚自然，像和朋友聊天，有个人情感',
    features: ['真实经历', '心路历程', '感悟总结', '经验教训'],
  },
  '专业严肃': {
    structure: ['title', 'intro', 'body', 'body', 'body', 'example', 'conclusion'],
    tone: '严谨专业，逻辑清晰，用词准确',
    features: ['理论支撑', '数据引用', '案例分析', '专业术语'],
  },
  '轻松幽默': {
    structure: ['title', 'hook', 'intro', 'body', 'example', 'body', 'tips', 'conclusion', 'cta'],
    tone: '幽默风趣，接地气，善用比喻和段子',
    features: ['幽默比喻', '网络热梗', '轻松案例', '互动调侃'],
  },
};

interface ArticleTemplate {
  structure: string[];
  tone: string;
  features: string[];
}

// 平台风格配置
const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  '微信公众号': {
    emoji: false,
    paragraphLength: 'medium',
    titleStyle: '悬念+价值',
    ending: '互动引导+关注引导',
    formatting: '小标题+加粗+引用',
  },
  '今日头条': {
    emoji: false,
    paragraphLength: 'short',
    titleStyle: '信息量+热点',
    ending: '观点总结+互动',
    formatting: '短段落+小标题',
  },
  '知乎': {
    emoji: false,
    paragraphLength: 'long',
    titleStyle: '问题式+专业',
    ending: '总结+开放讨论',
    formatting: '逻辑分层+数据引用',
  },
  '小红书': {
    emoji: true,
    paragraphLength: 'short',
    titleStyle: 'emoji+吸引力+关键词',
    ending: '互动+收藏引导',
    formatting: 'emoji+短段落+标签',
  },
  '抖音图文': {
    emoji: true,
    paragraphLength: 'very-short',
    titleStyle: '冲击力强+数字',
    ending: '互动引导',
    formatting: '要点式+emoji',
  },
  '百家号': {
    emoji: false,
    paragraphLength: 'medium',
    titleStyle: '权威+信息量',
    ending: '总结+展望',
    formatting: '正式+结构化',
  },
};

interface PlatformConfig {
  emoji: boolean;
  paragraphLength: 'very-short' | 'short' | 'medium' | 'long';
  titleStyle: string;
  ending: string;
  formatting: string;
}

// 内容素材库
const CONTENT_BANK: Record<string, ContentBank> = {
  'AI写作技巧': {
    hooks: [
      '说实话，我一开始也觉得AI写作就是个噱头。直到上个月，我用AI辅助写了一周的文章，数据直接翻了三倍。今天就把我的真实经验掏心窝子分享给大家。',
      '你是不是也遇到过这种情况：坐在电脑前两个小时，憋不出500个字？别急，这篇文章就是为你准备的。我花了三个月时间摸索出来的AI写作方法论，今天一次性全告诉你。',
      '先说个数据：据我观察，现在头部自媒体账号里，至少有60%都在用AI辅助创作。不是因为他们懒，而是因为AI确实能大幅提升效率。关键是怎么用，这才是门道。',
    ],
    intros: [
      '其实AI写作这个事儿，很多人理解有偏差。它不是让你完全依赖AI去写，而是把AI当成一个"超级助手"。就像你不会让实习生直接发文章一样，AI写的东西也得经过你的把关和润色。但如果你用对了方法，它确实能帮你省下一大半的时间。',
      '我自己是从去年开始接触AI写作的。一开始也是各种踩坑，写出来的东西一看就很"AI味"。后来慢慢摸索，总结出了一套自己的方法论。今天这篇文章，就是我这段时间所有经验的浓缩。',
    ],
    bodies: [
      {
        title: '第一步：别一上来就让AI写全文',
        content: '这是新手最容易犯的错误。你给AI一个主题，让它直接写一篇文章，出来的东西十有八九不能用。为什么？因为AI不知道你想要的风格、语气、受众是谁。\n\n正确的做法是什么？分步骤来。\n\n先让AI帮你列大纲。你把主题告诉它，让它给你出3-5个不同角度的大纲。然后你选一个最合适的，再让AI根据大纲逐段展开。\n\n这样做的好处是，你能全程把控文章的方向和质量。AI负责"干活"，你负责"把关"。',
      },
      {
        title: '第二步：给AI足够具体的指令',
        content: '很多人用AI效果不好，问题出在指令太模糊。"帮我写一篇关于AI的文章"——这种指令，AI能写好吗？\n\n好的指令应该包含这些信息：\n\n• 目标读者是谁（新手？专业人士？）\n• 文章风格是什么（轻松？严肃？专业？）\n• 字数要求（800字？2000字？）\n• 需要包含哪些要点\n• 有没有需要避免的内容\n\n举个例子，好的指令是这样的："帮我写一篇面向自媒体新手的AI写作入门指南，风格轻松易懂，1500字左右，需要包含工具推荐、实操步骤和避坑建议。"',
      },
      {
        title: '第三步：人工润色是关键',
        content: 'AI写出来的初稿，说实话，"AI味"还是挺重的。主要表现为：\n\n• 连接词太模板化（"首先、其次、最后"）\n• 情感表达不够自然\n• 缺少个人化的细节\n• 句式太规整，缺乏变化\n\n所以润色这一步绝对不能省。我的润色流程是：\n\n1. 替换模板化连接词，改成更口语化的表达\n2. 加入个人经历和感受（"我当时就惊呆了"、"说实话"）\n3. 添加具体的数据和案例\n4. 调整句式，让长短句交替出现\n5. 检查逻辑是否通顺\n\n经过这样一轮润色，文章的质量会有质的飞跃。',
      },
      {
        title: '第四步：建立自己的"提示词库"',
        content: '用了一段时间AI之后，你会发现有些提示词特别好用。把这些提示词收集起来，建一个自己的提示词库，效率会大幅提升。\n\n我的提示词库里大概有50多个常用提示词，分成了几类：\n\n• 大纲生成类\n• 标题优化类\n• 内容扩写类\n• 润色修改类\n• 风格转换类\n\n每次写文章的时候，直接从库里调取合适的提示词，稍微修改一下就能用。这个方法帮我节省了至少30%的时间。',
      },
    ],
    examples: [
      '拿我自己的经历来说吧。上个月我试着用AI辅助写了15篇文章，其中8篇阅读量破万，最高的一篇达到了12万+。而之前纯手工写的时候，破万的文章一个月也就两三篇。\n\n当然，这不是说AI写的就一定好。那8篇破万的文章，每一篇我都花了至少1-2小时进行润色和修改。AI帮我完成了60%的工作量，但剩下的40%才是决定文章质量的关键。',
      '我有个做自媒体的朋友，之前每天写一篇文章要4-5个小时。用了AI辅助之后，现在2小时就能搞定，而且数据反而更好了。他的秘诀就是：AI出初稿 + 人工精修 + 个人化润色。这个公式，我觉得对大部分自媒体人都适用。',
    ],
    tips: [
      '💡 小技巧：让AI写完后，你可以追加一条指令："请用更口语化的方式重写这段话，加入一些语气词和个人感受"，效果会好很多。',
      '💡 避坑提醒：千万不要直接复制AI生成的内容发布！平台算法越来越聪明，纯AI内容很容易被识别并降权。一定要经过人工润色。',
    ],
    conclusions: [
      'AI写作不是万能药，但它确实是一个强大的工具。关键不在于用不用AI，而在于你怎么用。把AI当成助手而不是替代者，你的内容质量只会越来越高。',
      '说到底，AI再厉害也替代不了你的个人风格和独特观点。它能帮你提高效率，但不能帮你思考。真正让文章出彩的，永远是你自己的见解和经历。',
    ],
    ctas: [
      '你在用AI写作吗？有什么好的经验或者踩过的坑？欢迎在评论区分享一下，我们一起交流学习～\n\n如果觉得这篇文章对你有帮助，记得点赞收藏，方便以后随时翻看。',
      '关于AI写作，你还有什么想了解的？评论区告诉我，下期接着聊。\n\n别忘了关注我的账号，持续获取更多自媒体运营干货！',
    ],
  },
};

interface ContentBank {
  hooks: string[];
  intros: string[];
  bodies: Array<{ title: string; content: string }>;
  examples: string[];
  tips: string[];
  conclusions: string[];
  ctas: string[];
}

// 通用内容素材（当没有特定主题素材时使用）
const GENERIC_CONTENT: ContentBank = {
  hooks: [
    '说真的，这个话题我关注很久了。最近终于有时间好好整理一下我的想法，今天就一次性跟大家聊透。',
    '你是不是也经常刷到关于这个话题的讨论？但说实话，网上大部分内容都太表面了。今天我想从一个不一样的角度，跟你聊聊这件事。',
    '先说个扎心的事实：很多人对这个话题的理解，其实都是错的。别急着反驳，看完这篇文章你再下结论。',
    '这篇文章可能有点长，但我保证，看完之后你会有收获。因为这里面的每一个点，都是我踩过坑之后总结出来的。',
  ],
  intros: [
    '其实这个话题，我之前一直不太想写。因为网上相关内容太多了，感觉自己也没什么新东西可说。但最近发生的一些事情，让我改变了想法。\n\n我发现，虽然写的人多，但真正说到点子上的没几个。大部分文章要么太浅，要么太学术，普通人看了根本用不上。\n\n所以今天，我想用大白话，把这个事情给你讲清楚。',
    '先自我介绍一下，我在这个领域摸爬滚打也有好几年了。期间踩过不少坑，也总结了一些经验。今天这篇文章，就是把我这些年的心得浓缩一下，分享给大家。\n\n不整那些虚的，直接上干货。',
  ],
  bodies: [
    {
      title: '先说说最常见的误区',
      content: '很多人一上来就犯了一个错误：把这件事想得太简单了。\n\n我见过太多人，看了几篇文章就觉得自己懂了，然后一头扎进去，结果碰了一鼻子灰。\n\n为什么会这样？因为你看到的只是冰山一角。那些成功的案例，背后往往有你看不到的积累和付出。\n\n所以我的建议是：先别急着行动，花点时间把基础知识打牢。磨刀不误砍柴工，这句话放在哪里都适用。',
    },
    {
      title: '核心方法论',
      content: '经过这段时间的实践，我总结出了一个比较靠谱的方法论，分三个步骤：\n\n第一步，明确目标。你到底想要什么？这个问题看起来简单，但很多人其实没想清楚。目标不明确，后面的所有努力都可能是无用功。\n\n第二步，制定计划。有了目标之后，不要一上来就干。先花点时间做一个详细的计划，把每个阶段要做什么、怎么做、做到什么程度都列清楚。\n\n第三步，执行和调整。计划再好，不执行也是白搭。但在执行的过程中，一定要根据实际情况不断调整。不要死板地按照计划走，灵活应变才是王道。',
    },
    {
      title: '实操建议',
      content: '光说不练假把式。下面我分享几个我自己一直在用的实操技巧：\n\n第一个技巧，建立自己的知识库。平时看到好的内容、好的案例，都收集起来。可以用笔记软件，也可以用文件夹，关键是要养成收集的习惯。时间长了，这就是你的素材宝库。\n\n第二个技巧，定期复盘。每周花一个小时，回顾一下这周做了什么、做得怎么样、有什么可以改进的。复盘是成长最快的方式，没有之一。\n\n第三个技巧，保持学习。这个行业变化太快了，不学习就会被淘汰。每天至少花30分钟学习新知识，看文章、听课、和别人交流都可以。',
    },
    {
      title: '避坑指南',
      content: '这条路我走了不短，踩过的坑也不少。下面这几个坑，希望你不要再踩：\n\n第一个坑，盲目跟风。看到别人做什么赚钱就跟着做，完全不考虑自己适不适合。这种心态很容易让你成为"韭菜"。\n\n第二个坑，急于求成。总想着一个月就能见效，三个月就能成功。但现实是，大部分事情都需要至少半年的积累才能看到明显效果。\n\n第三个坑，闭门造车。自己闷头干，不跟同行交流，不向有经验的人请教。这样很容易走弯路，而且效率很低。',
    },
  ],
  examples: [
    '拿我自己的经历来说吧。去年这个时候，我也跟很多人一样，对这个领域一知半解。但我做了一件事：每天花两个小时系统学习，坚持了半年。\n\n半年之后，效果是显而易见的。不仅专业能力提升了，收入也有了明显的增长。更重要的是，我对这个领域的理解，从"知道"变成了"理解"。\n\n这个过程不难，难的是坚持。但只要你坚持下来了，回报一定会让你觉得值得。',
    '我认识一个朋友，他用了跟我类似的方法，但效果比我还要好。他的秘诀是什么？执行力。\n\n我说每天学习两个小时，他就真的每天雷打不动地学两个小时。我说要定期复盘，他就每周写一篇复盘笔记。这种执行力，真的让我很佩服。\n\n所以有时候，成功的关键不在于你知道多少，而在于你做到了多少。',
  ],
  tips: [
    '💡 小建议：不要试图一下子掌握所有东西。先抓住核心要点，其他的慢慢补充。贪多嚼不烂，这个道理大家都懂，但真正做到的人不多。',
    '💡 提醒一下：网上的信息良莠不齐，要学会甄别。不要看到什么就信什么，多思考、多验证，形成自己的判断力。',
  ],
  conclusions: [
    '说了这么多，其实核心就一句话：这件事值得你花时间和精力去做。但前提是，你要用对方法，并且坚持下去。\n\n希望这篇文章能给你一些启发。如果你有什么想法或者问题，欢迎在评论区交流。',
    '最后总结一下：明确目标 → 制定计划 → 坚持执行 → 定期复盘 → 持续学习。这套方法论，放在很多事情上都适用。\n\n加油，期待看到你的成果。',
  ],
  ctas: [
    '你觉得这篇文章对你有帮助吗？欢迎在评论区告诉我你的想法。\n\n如果身边有朋友也需要这方面的信息，不妨转发给ta，一起进步～',
    '关于这个话题，你还有什么想了解的？评论区告诉我，我看到就会回复。\n\n记得点赞收藏，方便以后随时翻看。关注我，持续获取更多实用干货！',
  ],
};

// 标题生成器
function generateTitle(topic: string, platform: string, style: string): string {
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG['微信公众号'];

  const titleTemplates: Record<string, string[]> = {
    '悬念+价值': [
      `${topic}：90%的人都不知道的${Math.floor(Math.random() * 5) + 3}个关键点`,
      `关于${topic}，我想说点不一样的`,
      `${topic}最全指南：看完这篇就够了`,
      `为什么我建议你现在就开始关注${topic}？`,
      `${topic}的${Math.floor(Math.random() * 5) + 3}个真相，知道的人不多`,
    ],
    '信息量+热点': [
      `${topic}最新解读：这些变化将影响每一个人`,
      `${topic}深度分析：背后的逻辑你可能没想到`,
      `一文读懂${topic}：从入门到精通`,
      `${topic}的${Math.floor(Math.random() * 5) + 3}个核心要点，建议收藏`,
    ],
    '问题式+专业': [
      `如何系统地掌握${topic}？这篇文章给你答案`,
      `${topic}到底该怎么学？我的经验都在这了`,
      `关于${topic}，你可能一直理解错了`,
    ],
    'emoji+吸引力+关键词': [
      `🔥${topic}｜${Math.floor(Math.random() * 5) + 3}个超实用技巧，学会直接起飞`,
      `✨${topic}干货｜新手必看，少走${Math.floor(Math.random() * 10) + 5}年弯路`,
      `💡${topic}攻略｜亲测有效，建议收藏慢慢看`,
    ],
    '冲击力强+数字': [
      `${Math.floor(Math.random() * 5) + 3}个${topic}的核心技巧`,
      `${topic}：${Math.floor(Math.random() * 5) + 3}个你必须知道的要点`,
    ],
    '权威+信息量': [
      `${topic}深度解读：行业趋势与未来展望`,
      `${topic}全景分析：从理论到实践`,
    ],
  };

  const templates = titleTemplates[config.titleStyle] || titleTemplates['悬念+价值'];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 随机选择
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成文章
export function generateArticleLocal(topic: string, platform: string, style: string, wordCount: number): string {
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG['微信公众号'];
  const template = ARTICLE_TEMPLATES[style] || ARTICLE_TEMPLATES['干货教程'];

  // 获取内容素材
  const bank = CONTENT_BANK[topic] || GENERIC_CONTENT;

  // 生成标题
  const title = generateTitle(topic, platform, style);

  // 构建文章
  const sections: string[] = [];

  // 标题
  if (config.emoji && !title.match(/^[\u{1F300}-\u{1F9FF}]/u)) {
    const emojis = ['🔥', '💡', '✨', '📌', '🎯', '⭐', '🚀'];
    sections.push(`${pickRandom(emojis)} ${title}`);
  } else {
    sections.push(title);
  }

  // Hook（钩子）
  sections.push(pickRandom(bank.hooks));

  // Intro（引言）
  sections.push(pickRandom(bank.intros));

  // Body sections
  const usedBodies = new Set<number>();
  const bodyCount = Math.min(template.structure.filter(s => s === 'body').length, bank.bodies.length);

  for (let i = 0; i < bodyCount; i++) {
    let bodyIndex: number;
    do {
      bodyIndex = Math.floor(Math.random() * bank.bodies.length);
    } while (usedBodies.has(bodyIndex) && usedBodies.size < bank.bodies.length);

    usedBodies.add(bodyIndex);
    const body = bank.bodies[bodyIndex];

    // 添加小标题
    if (config.formatting.includes('小标题')) {
      sections.push(`\n### ${body.title}\n`);
    } else {
      sections.push(`\n**${body.title}**\n`);
    }

    sections.push(body.content);

    // 在body之间插入example或tips
    if (i < bodyCount - 1 && bank.examples.length > 0 && Math.random() > 0.5) {
      sections.push(pickRandom(bank.examples));
    }
  }

  // 添加额外的tips
  if (bank.tips.length > 0) {
    sections.push('\n---\n');
    sections.push('**💡 实用小贴士**\n');
    bank.tips.forEach(tip => sections.push(tip));
  }

  // 根据字数要求添加更多内容
  if (wordCount > 1000) {
    sections.push('\n### 进阶建议\n');
    sections.push('上面说的都是基础，下面再分享几个进阶的技巧：\n');
    sections.push('第一，建立自己的体系。不要只学碎片化的知识，要形成自己的知识框架。这样遇到问题的时候，你才能快速找到解决方案。\n');
    sections.push('第二，多实践少空想。知道和做到之间隔着巨大的鸿沟。只有真正去做了，你才能发现问题、解决问题、获得成长。\n');
    sections.push('第三，保持耐心和定力。任何值得做的事情都需要时间。不要因为短期内看不到效果就放弃，坚持下去，时间会给你答案。');
  }

  // 如果字数要求更高，添加更多内容
  if (wordCount > 1500) {
    sections.push('\n### 常见问题解答\n');
    sections.push('Q：新手入门难不难？\nA：说难也难，说不难也不难。难在起步阶段需要克服惰性，不难在方法其实并不复杂。关键是迈出第一步，然后坚持下去。\n');
    sections.push('Q：需要投入多少时间？\nA：建议每天至少投入1-2小时。不需要太多，但一定要保证质量。专注的1小时比走神的3小时有效得多。\n');
    sections.push('Q：多久能看到效果？\nA：一般来说，坚持3个月会有明显进步，6个月会有质的飞跃。当然，这也取决于你的学习方法和执行力。');
  }

  // 结论
  sections.push('\n---\n');
  sections.push(pickRandom(bank.conclusions));

  // CTA（行动引导）
  if (config.ending.includes('互动')) {
    sections.push(pickRandom(bank.ctas));
  }

  // 拼接文章
  let article = sections.join('\n\n');

  // 根据平台调整格式
  article = adjustForPlatform(article, config);

  return article;
}

// 根据平台调整格式
function adjustForPlatform(article: string, config: PlatformConfig): string {
  let result = article;

  // 小红书：添加更多emoji和标签
  if (config.emoji) {
    const paragraphs = result.split('\n\n');
    const emojis = ['✨', '💡', '🔥', '📌', '💪', '🎯', '⭐', '👇', '👉', '✅', '💰', '📈', '🚀', '🎉', '🌟', '💫'];

    result = paragraphs.map((p, i) => {
      if (i === 0) return p;
      if (p.startsWith('#') || p.startsWith('**') || p.startsWith('---')) return p;
      if (Math.random() > 0.6) {
        return `${pickRandom(emojis)} ${p}`;
      }
      return p;
    }).join('\n\n');

    // 添加标签
    result += '\n\n#干货分享 #实用技巧 #建议收藏 #新手必看';
  }

  // 抖音图文：缩短段落
  if (config.paragraphLength === 'very-short') {
    result = result.split('\n\n').map(p => {
      if (p.length > 100) {
        const sentences = p.split(/[。！？；]+/).filter(s => s.trim());
        return sentences.map(s => s.trim() + '。').join('\n\n');
      }
      return p;
    }).join('\n\n');
  }

  return result;
}

// AI 生成文章（优先使用 API，无 API 时使用本地生成）
export async function generateArticle(
  topic: string,
  platform: string,
  style: string,
  wordCount: number,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const { getApiConfig } = await import('./api');
  const apiConfig = getApiConfig();

  // 如果有 API Key，尝试使用 API
  if (apiConfig.apiKey) {
    const systemPrompt = buildSystemPrompt(topic, platform, style, wordCount);
    const userPrompt = `请围绕"${topic}"这个主题，创作一篇适合发布在${platform}的文章。风格要求：${style}。字数要求：${wordCount}字左右。\n\n请直接输出完整的文章内容，包含标题和正文，不要添加任何解释或说明。`;

    if (onChunk) {
      let result = '';
      try {
        const { callAiApiStream } = await import('./api');
        await callAiApiStream(userPrompt, (chunk) => {
          result += chunk;
          onChunk(chunk);
        }, systemPrompt);
        if (result.trim()) return result.trim();
      } catch (e) {
        console.warn('API 调用失败，使用本地生成:', e);
      }
    } else {
      try {
        const { callAiApi } = await import('./api');
        const result = await callAiApi(userPrompt, systemPrompt);
        if (result.trim()) return result.trim();
      } catch (e) {
        console.warn('API 调用失败，使用本地生成:', e);
      }
    }
  }

  // 无 API Key 或 API 调用失败时，使用本地生成
  if (onChunk) {
    // 模拟流式输出
    const result = generateArticleLocal(topic, platform, style, wordCount);
    const chunkSize = 10;
    for (let i = 0; i < result.length; i += chunkSize) {
      const chunk = result.slice(i, i + chunkSize);
      onChunk(chunk);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    return result;
  }

  return generateArticleLocal(topic, platform, style, wordCount);
}

// 构建系统提示词
function buildSystemPrompt(topic: string, platform: string, style: string, wordCount: number): string {
  const platformGuides: Record<string, string> = {
    '微信公众号': '微信公众号文章风格：专业但亲切，像一个有经验的行业前辈在分享。段落适中，使用小标题组织内容，适当加粗重点。结尾要有互动引导和关注引导。',
    '今日头条': '今日头条文章风格：通俗易懂，信息量大，段落要短（3-5行），标题要有信息量和吸引力。适合大众阅读，避免过于专业的术语。',
    '知乎': '知乎回答风格：专业深度，逻辑清晰，论证充分。可以长一些，但要有条理。善用数据、案例和对比论证。结尾开放讨论。',
    '小红书': '小红书笔记风格：轻松活泼，个人化，多用emoji。段落要短，每段2-3行。标题要有emoji和关键词。结尾引导收藏和互动。',
    '抖音图文': '抖音图文风格：简短有力，视觉化。每段1-2行，用emoji分隔。要点式表达，冲击力强。',
    '百家号': '百家号文章风格：权威专业，结构严谨。用词准确，逻辑清晰。适合深度分析和行业解读。',
  };

  const styleGuides: Record<string, string> = {
    '干货教程': '干货教程风格：以实用为主，提供具体的步骤、方法和技巧。多用"第一步、第二步"这样的结构，配合实操案例和避坑指南。',
    '观点评论': '观点评论风格：有态度有观点，但不偏激。理性分析，多角度思考。善用对比论证和案例支撑。',
    '新闻资讯': '新闻资讯风格：客观中立，信息量大，时效性强。包含多方观点和背景信息。',
    '个人分享': '个人分享风格：真诚自然，像和朋友聊天。多用"我"的视角，分享真实经历和感悟。',
    '专业严肃': '专业严肃风格：严谨专业，逻辑清晰，用词准确。适合行业分析和深度解读。',
    '轻松幽默': '轻松幽默风格：幽默风趣，接地气。善用比喻、段子和网络热梗，让读者在轻松的氛围中获取信息。',
  };

  return `你是一位资深的自媒体内容创作者，拥有10年以上的写作经验。你擅长根据不同平台和风格创作高质量、高流量的文章。

你的写作特点：
1. 语言自然流畅，像真人在说话，没有AI味
2. 善用个人经历和真实案例增加可信度
3. 段落短小精悍，适合手机阅读
4. 开头有吸引力，能快速抓住读者
5. 内容有深度但不晦涩，普通人也能看懂
6. 结尾有互动引导，促进读者评论和分享

请严格按照以下要求创作：
- 平台风格：${platformGuides[platform] || ''}
- 文章风格：${styleGuides[style] || ''}
- 主题：${topic}
- 字数：约${wordCount}字

重要要求：
1. 标题要有吸引力，能引起点击欲望
2. 开头用一个故事、数据或问题快速吸引读者
3. 内容要有实际价值，不要空话套话
4. 使用口语化、自然的表达方式
5. 避免"首先、其次、最后"等模板化连接词
6. 加入具体的案例、数据或个人经历
7. 段落控制在3-5行以内
8. 结尾引导读者互动

请直接输出完整的文章，不要添加任何解释。`;
}

// AI 润色 - 本地实现（不依赖 API）
export function polishContentLocal(content: string, mode: string): string {
  const paragraphs = content.split(/\n+/).filter(p => p.trim());

  switch (mode) {
    case 'normal':
      return polishNormal(paragraphs);
    case 'reduce_ai':
      return polishReduceAi(paragraphs);
    case 'enhance':
      return polishEnhance(paragraphs, content);
    case 'format':
      return polishFormat(paragraphs, content);
    default:
      return polishNormal(paragraphs);
  }
}

function polishNormal(paragraphs: string[]): string {
  return paragraphs.map(p => {
    let text = p.trim();
    // 优化连接词
    text = text.replace(/首先，/g, '一开始，');
    text = text.replace(/其次，/g, '接着，');
    text = text.replace(/再次，/g, '再来，');
    text = text.replace(/最后，/g, '最后说一下，');
    text = text.replace(/总之，/g, '总的来说，');
    text = text.replace(/综上所述，/g, '所以我觉得，');
    text = text.replace(/因此，/g, '所以说，');
    text = text.replace(/然而，/g, '不过呢，');
    text = text.replace(/此外，/g, '另外，');
    text = text.replace(/而且，/g, '再说了，');
    text = text.replace(/并且，/g, '同时，');
    text = text.replace(/但是，/g, '不过，');
    text = text.replace(/所以，/g, '所以说，');
    // 优化常用词
    text = text.replace(/非常重要/g, '特别关键');
    text = text.replace(/非常有用/g, '特别实用');
    text = text.replace(/很多/g, '不少');
    text = text.replace(/很大/g, '挺大的');
    text = text.replace(/很好/g, '挺不错的');
    text = text.replace(/可以/g, '不妨');
    text = text.replace(/应该/g, '建议');
    return text;
  }).join('\n\n');
}

function polishReduceAi(paragraphs: string[]): string {
  return paragraphs.map(p => {
    let text = p.trim();
    // 替换AI常用连接词
    text = text.replace(/首先/g, '说实话');
    text = text.replace(/其次/g, '还有就是');
    text = text.replace(/再次/g, '再说说');
    text = text.replace(/最后/g, '最后再说一句');
    text = text.replace(/总之/g, '总的来说吧');
    text = text.replace(/综上所述/g, '所以我觉得');
    text = text.replace(/因此/g, '所以说');
    text = text.replace(/然而/g, '不过呢');
    text = text.replace(/此外/g, '另外啊');
    text = text.replace(/而且/g, '再说了');
    text = text.replace(/并且/g, '同时呢');
    text = text.replace(/但是/g, '不过');
    text = text.replace(/所以/g, '所以说嘛');
    // 添加口语化表达
    text = text.replace(/这是一个/g, '这其实是');
    text = text.replace(/我们可以看到/g, '大家可能也注意到了');
    text = text.replace(/值得注意的是/g, '有个事儿得提一下');
    text = text.replace(/不可否认/g, '说实话');
    text = text.replace(/毫无疑问/g, '这点没啥好说的');
    text = text.replace(/在当今社会/g, '现在这个时代');
    text = text.replace(/随着.*的发展/g, '这几年');
    return text;
  }).join('\n\n');
}

function polishEnhance(paragraphs: string[], original: string): string {
  if (paragraphs.length === 0) return original;

  // 优化标题
  let title = paragraphs[0].trim();
  if (!title.includes('？') && !title.includes('！') && title.length < 30) {
    title = `${title}？看完这篇你就懂了`;
  }

  // 优化开头
  let firstPara = paragraphs[1] || '';
  if (firstPara.length > 10 && !firstPara.includes('你') && !firstPara.includes('我')) {
    firstPara = `你有没有遇到过这样的情况？${firstPara}`;
  }

  // 优化中间段落
  const middleParas = paragraphs.slice(2).map((p, i) => {
    let text = p.trim();
    // 添加互动性表达
    if (i === 0 && text.length > 50) {
      text = `先说个重点：${text}`;
    }
    if (i === Math.floor(paragraphs.length / 2) && text.length > 50) {
      text = `${text}\n\n说到这里，你是不是也有同感？`;
    }
    return text;
  });

  // 添加结尾
  const ending = `\n\n---\n\n💬 你觉得呢？欢迎在评论区分享你的想法和经历！\n\n如果觉得这篇文章有用，记得点赞收藏，分享给更多需要的朋友～`;

  return [title, firstPara, ...middleParas, ending].filter(Boolean).join('\n\n');
}

function polishFormat(paragraphs: string[], original: string): string {
  if (paragraphs.length === 0) return original;

  return paragraphs.map((p, i) => {
    const text = p.trim();
    if (i === 0) {
      // 第一段作为标题
      if (text.length < 50 && !text.startsWith('#')) {
        return `# ${text}`;
      }
      return text;
    }
    if (text.length < 30 && !text.startsWith('#') && !text.startsWith('-') && !text.startsWith('*')) {
      return `## ${text}`;
    }
    // 如果段落较长，尝试拆分
    if (text.length > 200) {
      const sentences = text.split(/[。！？；]+/).filter(s => s.trim());
      if (sentences.length > 4) {
        const firstHalf = sentences.slice(0, Math.ceil(sentences.length / 2)).join('。') + '。';
        const secondHalf = sentences.slice(Math.ceil(sentences.length / 2)).join('。') + '。';
        return `${firstHalf.trim()}\n\n${secondHalf.trim()}`;
      }
    }
    return text;
  }).join('\n\n');
}
