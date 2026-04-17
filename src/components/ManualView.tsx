import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, FileText, Brain, Search, TrendingUp, FileCheck,
  AlertTriangle, Megaphone, Sparkles, Rss, Settings, ChevronRight,
  Lightbulb, CheckCircle2, ArrowRight, Mail, MessageCircle
} from 'lucide-react';

export function ManualView() {
  const sections = [
    {
      id: 'overview',
      title: '平台概览',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              <strong>自媒体多工作平台</strong> 是一个集内容创作、质量检测、AI 分析于一体的综合性工具。
              它帮助自媒体创作者在发布前对内容进行全面检测和优化，确保内容质量，提升流量表现。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: <FileText className="w-4 h-4" />, label: '内容编辑' },
                { icon: <Brain className="w-4 h-4" />, label: 'AI 检测' },
                { icon: <Search className="w-4 h-4" />, label: '同质化查询' },
                { icon: <TrendingUp className="w-4 h-4" />, label: '流量预测' },
                { icon: <FileCheck className="w-4 h-4" />, label: '逻辑性检测' },
                { icon: <AlertTriangle className="w-4 h-4" />, label: '敏感词检测' },
                { icon: <Megaphone className="w-4 h-4" />, label: '营销文检测' },
                { icon: <Sparkles className="w-4 h-4" />, label: 'AI 润色' },
                { icon: <Rss className="w-4 h-4" />, label: '热门文章' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Lightbulb className="w-4 h-4" />
                <strong>提示</strong>：点击左侧菜单栏底部的 🌙/☀️ 图标可以切换暗色/明亮主题
              </p>
            </div>
          </div>
      ),
    },
    {
      id: 'step1',
      title: '第一步：内容编辑',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：在编辑器中撰写或粘贴你的自媒体文章内容。
          </p>
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              输入文章标题
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              在"文章标题"输入框中输入你的文章标题。标题是吸引读者的第一要素，建议包含关键词和吸引力元素。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              选择目标平台
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              在右上角的下拉菜单中选择你要发布的平台（微信公众号、今日头条、知乎等）。
              不同平台有不同的内容偏好，选择后检测会更有针对性。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              撰写或粘贴内容
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              在文本区域中输入或粘贴你的文章内容。你也可以：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li>使用工具栏进行格式编辑（加粗、斜体、标题、列表等）</li>
              <li>点击"导入"按钮从本地文件导入 .txt 或 .md 文件</li>
              <li>点击"导出"按钮将内容导出为 Markdown 文件</li>
              <li>实时查看字数、段落数、句子数统计</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">4</Badge>
              保存内容
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              内容会自动保存在浏览器中，下次打开时会自动恢复。你也可以使用导出功能备份。
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-4 h-4" />
              <strong>提示</strong>：建议内容至少 200 字以上，检测结果会更准确。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      title: '第二步：AI 检测（分段检测）',
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检测内容是否由 AI 生成，识别 AI 写作痕迹。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              点击"开始 AI 检测"
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              系统会逐段分析你的内容，评估每段的 AI 生成概率。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              查看检测结果
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              结果包括：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>总体 AI 疑似度</strong>：所有段落的平均 AI 概率</li>
              <li><strong>分段检测详情</strong>：每段的 AI 概率、判定结果和置信度</li>
              <li>点击每段可以展开查看详细信息</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              理解分数含义
            </h4>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span><strong>0-40%</strong>：疑似人工创作，安全</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span><strong>40-70%</strong>：疑似 AI 生成，建议修改</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span><strong>70%+</strong>：高疑似 AI，需要大幅优化</span>
              </div>
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">4</Badge>
              什么是分段检测？
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              分段检测将文章按段落拆分，逐段分析 AI 特征。这样你可以精确定位哪些段落 AI 痕迹较重，
              针对性地进行修改，而不需要重写整篇文章。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      title: '第三步：同质化查询',
      icon: <Search className="w-5 h-5 text-amber-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检测你的内容与互联网上已有文章的相似度。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              什么叫做同质化？
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              同质化是指你的文章与网络上已有文章在内容、结构、表达上的相似程度。
              同质化过高意味着你的内容缺乏独特性，平台算法会降低推荐权重。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              分数代表什么？
            </h4>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span><strong>0-30%</strong>：原创度高，内容独特</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span><strong>30-60%</strong>：中度相似，建议增加独特观点</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span><strong>60%+</strong>：高度同质，需要大幅修改</span>
              </div>
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              相似内容来源
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              系统会列出与你的内容相似的文章，包括标题、平台、相似度等信息，
              帮助你了解哪些内容与你重复，从而有针对性地修改。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step4',
      title: '第四步：流量预测',
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：预测文章在不同平台的流量表现。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              流量预测是什么意思？
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              基于内容质量、标题吸引力、关键词匹配、文章长度等因素，
              预估文章发布后可能获得的阅读量和平台推荐指数。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              各平台评分代表什么？
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              每个平台会给出一个评分（0-100分），代表：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>80分以上</strong>：强烈推荐发布，预计获得良好流量</li>
              <li><strong>60-80分</strong>：可以发布，有流量潜力</li>
              <li><strong>60分以下</strong>：建议优化后再发布</li>
            </ul>
            <p className="text-sm text-muted-foreground ml-6 mt-2">
              同时会给出预测阅读量（如"5万+"）和针对性的优化建议。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              支持的平台
            </h4>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {['微信公众号', '今日头条', '知乎', '小红书', '百家号', '抖音图文'].map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step5',
      title: '第五步：内容逻辑与连贯性检测',
      icon: <FileCheck className="w-5 h-5 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检查文章的逻辑结构是否清晰，段落过渡是否自然。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              什么是内容逻辑与连贯性？
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              内容逻辑性指文章的观点是否有清晰的论证过程，段落之间是否有合理的过渡。
              连贯性指读者阅读时是否能顺畅地理解文章脉络，不会感到突兀或跳跃。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              检测什么内容？
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>段落连贯性</strong>：相邻段落之间是否有合理的过渡，话题是否跳跃</li>
              <li><strong>开头吸引力</strong>：开头是否足够引人入胜</li>
              <li><strong>结构完整性</strong>：是否有清晰的开头、主体、结尾</li>
              <li><strong>总结段落</strong>：是否有概括性的总结</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              问题严重程度
            </h4>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span><strong>严重</strong>：明显影响阅读体验，必须修改</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span><strong>中等</strong>：建议优化以提升阅读体验</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span><strong>轻微</strong>：锦上添花的改进建议</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step6',
      title: '第六步：敏感与违规词检测',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检测内容中的敏感词和违规词，避免触发平台审核。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              检测哪些内容？
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>极限用语</strong>："最"、"第一"、"绝对"等违反广告法的词</li>
              <li><strong>敏感话题</strong>：涉及政治、色情、赌博、毒品等</li>
              <li><strong>引流话术</strong>："加微信"、"扫码关注"等平台限制的内容</li>
              <li><strong>虚假承诺</strong>："暴富"、"躺赚"、"稳赚不赔"等</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              触发段落显示
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              每个检测到的敏感/违规词都会显示<strong>触发它的具体段落</strong>，
              你可以直接看到是哪句话出了问题，方便快速定位和修改。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              严重等级
            </h4>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span><strong>违规</strong>：可能触发审核、限流甚至封号，必须删除</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span><strong>敏感</strong>：可能影响推荐，建议替换</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step7',
      title: '第七步：营销文与广告浓度检测',
      icon: <Megaphone className="w-5 h-5 text-pink-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检测内容的营销特征和广告浓度。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              检测哪些营销特征？
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>促销话术</strong>："限时"、"抢购"、"秒杀"、"打折"等</li>
              <li><strong>引流话术</strong>："加微信"、"公众号"、"扫码关注"等</li>
              <li><strong>极限用语</strong>："最"、"第一"、"顶级"等</li>
              <li><strong>营销诱导</strong>："买一送一"、"免费领"、"0元购"等</li>
              <li><strong>收益承诺</strong>："暴富"、"躺赚"、"日入"等</li>
              <li><strong>紧迫催促</strong>："赶紧"、"立即"、"手慢无"等</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              广告浓度是什么意思？
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              广告浓度 = 营销特征数量 / 总段落数 × 100%。
              浓度越高，文章越像广告，平台越可能限流。
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span><strong>0-15%</strong>：正常，阅读体验良好</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span><strong>15-30%</strong>：偏高，建议减少营销内容</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span><strong>30%+</strong>：过高，严重影响推荐</span>
              </div>
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              触发段落显示
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              每种营销特征都会显示<strong>触发它的具体段落</strong>，方便你快速定位和修改。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step8',
      title: '第八步：综合检测报告',
      icon: <FileCheck className="w-5 h-5 text-violet-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：一键生成所有检测模块的综合报告和优化清单。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              综合评分
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              系统整合 AI 检测、同质化、流量预测、逻辑性、敏感词、营销文六个维度的结果，
              给出一个综合评分（0-100分）。同时展示每个维度的独立评分。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              一键优化清单
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              根据检测结果自动生成优化清单，按优先级排序：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>高优先级</strong>：必须处理的问题，如违规词、高AI疑似度</li>
              <li><strong>中优先级</strong>：建议处理的问题，如逻辑问题、营销浓度</li>
              <li><strong>低优先级</strong>：锦上添花的改进建议</li>
            </ul>
            <p className="text-sm text-muted-foreground ml-6 mt-2">
              每个优化项都包含：问题描述、影响说明、具体修改建议。
              你可以导出报告为 Markdown 文件保存。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step9',
      title: '第九步：AI 润色与排版',
      icon: <Sparkles className="w-5 h-5 text-cyan-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：使用 AI 对内容进行智能润色和优化。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              选择润色模式
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>普通润色</strong>：优化语言表达，使文章更流畅自然</li>
              <li><strong>降低AI痕迹</strong>：重写文章使其更像人工创作</li>
              <li><strong>内容增强</strong>：提升吸引力和传播性</li>
              <li><strong>智能排版</strong>：优化文章结构和格式</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              查看和对比
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              润色完成后，可以在"润色结果"、"原文对比"、"修改说明"三个标签页之间切换，
              查看润色前后的差异。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              应用修改
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              满意后点击"应用到编辑器"，润色后的内容会替换编辑器中的原文。
              你也可以点击"复制"按钮复制润色后的内容。
            </p>
          </div>

          <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <p className="text-sm flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Lightbulb className="w-4 h-4" />
              <strong>注意</strong>：AI 润色需要先在"API 接口设置"中配置你的 API Key。
            </p>
          </div>
        </div>
      ),
    },
    {
    id: 'step10',
    title: '第十步：热门文章采集',
    icon: <Rss className="w-5 h-5 text-orange-500" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          <strong>目的</strong>：采集各平台热门文章，获取创作灵感。
        </p>

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="text-xs">1</Badge>
            筛选和搜索
          </h4>
          <p className="text-sm text-muted-foreground ml-6">
            你可以按平台筛选（今日头条、微信公众号、知乎等），
            也可以搜索特定关键词或标签。
          </p>

          <h4 className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="text-xs">2</Badge>
            排序方式
          </h4>
          <p className="text-sm text-muted-foreground ml-6">
            支持按阅读量或发布时间排序，帮助你找到最热门或最新的内容。
          </p>

          <h4 className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="text-xs">3</Badge>
            自定义 API 接口
          </h4>
          <p className="text-sm text-muted-foreground ml-6">
            点击"配置接口"按钮，可以配置自定义数据源：
          </p>
          <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
            <li>启用自定义接口开关</li>
            <li>填写 API 地址和可选的 API Key</li>
            <li>API 应返回文章数组或包含 articles/data 字段</li>
            <li>文章字段：title, source, platform, views, url, tags, publishDate</li>
          </ul>

          <h4 className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="text-xs">4</Badge>
            利用热门文章
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
            <li>学习爆款文章的标题写法</li>
            <li>了解当前热门话题和趋势</li>
            <li>分析高流量内容的共同特征</li>
            <li>获取选题灵感和创作方向</li>
          </ul>
        </div>
      </div>
    ),
  },
    {
      id: 'step11',
      title: '第十一步：API 接口设置',
      icon: <Settings className="w-5 h-5 text-slate-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：配置 AI 模型 API，启用 AI 润色等高级功能。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              选择服务商
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              平台预设了多种主流 AI 服务商，点击即可自动填充配置：
            </p>
            <div className="ml-6 grid grid-cols-2 gap-2 mb-3">
              {['OpenAI (GPT-4)', 'Claude', '智谱 AI', '通义千问', '文心一言', 'Moonshot (Kimi)', 'DeepSeek', '豆包'].map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 ml-6">
              💡 提示：按住 <strong>Ctrl/Command</strong> 键点击服务商按钮可直接跳转到对应官网获取 API Key
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              填写配置信息
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>API Base URL</strong>：API 请求地址（选择预设后自动填充）</li>
              <li><strong>API Key</strong>：你的 API 密钥（从服务商官网获取）</li>
              <li><strong>模型名称</strong>：要使用的模型（如 gpt-4o）</li>
              <li><strong>最大 Token</strong>：单次请求的最大输出长度</li>
              <li><strong>Temperature</strong>：控制输出的创造性（0=确定，2=随机）</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              测试连接
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              点击"测试连接"验证配置是否正确。如果连接成功，你就可以使用 AI 润色等功能了。
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">4</Badge>
              保存配置
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              点击"保存配置"将设置保存到本地浏览器。API Key 仅保存在你的设备上，不会上传到任何服务器。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: '联系我们',
      icon: <MessageCircle className="w-5 h-5 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            如有问题或建议，欢迎通过以下方式联系我们：
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">微信</p>
                <p className="text-sm text-muted-foreground">xiaoqi19860607</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">邮箱</p>
                <p className="text-sm text-muted-foreground">2742938881@qq.com</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-4 h-4" />
              <strong>提示</strong>：工作日内我们会在 24 小时内回复你的问题
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">使用说明</CardTitle>
              <CardDescription>详细的使用指南，从入门到精通</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">快速开始</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {['内容编辑', 'AI检测', '同质化', '流量预测', '逻辑检测', '敏感词', '营销检测', '综合报告', 'AI润色', 'API设置'].map((step, i) => (
              <span key={i} className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                <span className="text-muted-foreground">{step}</span>
                {i < 9 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      {sections.map((section, i) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {section.icon}
              </div>
              <div>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {section.content}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
