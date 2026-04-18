import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, FileText, Brain, Search, TrendingUp, FileCheck,
  AlertTriangle, Megaphone, Sparkles, Rss, Settings, ChevronRight,
  Lightbulb, CheckCircle2, ArrowRight, Mail, MessageCircle, Check,
  Image, Palette, Zap, ExternalLink, Code
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
                { icon: <Sparkles className="w-4 h-4" />, label: 'AI 生成文章' },
                { icon: <Brain className="w-4 h-4" />, label: 'AI 检测' },
                { icon: <Search className="w-4 h-4" />, label: '同质化查询' },
                { icon: <TrendingUp className="w-4 h-4" />, label: '流量预测' },
                { icon: <FileCheck className="w-4 h-4" />, label: '逻辑性检测' },
                { icon: <AlertTriangle className="w-4 h-4" />, label: '敏感词检测' },
                { icon: <Megaphone className="w-4 h-4" />, label: '营销文检测' },
                { icon: <Sparkles className="w-4 h-4" />, label: 'AI 润色' },
                { icon: <Image className="w-4 h-4" />, label: '图片生成' },
                { icon: <Rss className="w-4 h-4" />, label: '热门文章' },
                { icon: <Settings className="w-4 h-4" />, label: 'API 接口设置' },
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
      title: '第一步：内容编辑（Markdown 编辑器）',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：在编辑器中撰写或粘贴你的自媒体文章内容，支持 Markdown 格式。
          </p>
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              Markdown 编辑器
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              全新升级的编辑器，支持：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li>完整的 Markdown 工具栏（标题、加粗、斜体、列表、引用、代码、链接、图片等）</li>
              <li>编辑/预览双视图模式</li>
              <li>实时预览 Markdown 渲染效果</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              工具栏按钮说明
            </h4>
            <div className="ml-6 grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { icon: 'H1', desc: '一级标题' },
                { icon: 'H2', desc: '二级标题' },
                { icon: 'H3', desc: '三级标题' },
                { icon: 'B', desc: '加粗' },
                { icon: 'I', desc: '斜体' },
                { icon: '"', desc: '引用' },
                { icon: '•', desc: '无序列表' },
                { icon: '1.', desc: '有序列表' },
                { icon: '`', desc: '代码' },
                { icon: '[]', desc: '链接' },
                { icon: '![]', desc: '图片' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                  <span className="w-6 h-6 rounded bg-muted flex items-center justify-center font-bold">{item.icon}</span>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              其他功能
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>实时预览</strong>：切换到"预览"标签页查看 Markdown 渲染效果</li>
              <li><strong>导入/导出</strong>：支持导入 .txt/.md 文件，导出为 Markdown 文件</li>
              <li><strong>实时统计</strong>：字数、段落数、句子数实时统计</li>
              <li><strong>自动保存</strong>：内容自动保存在浏览器中</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'generate',
      title: '第二步：AI 生成文章',
      icon: <Sparkles className="w-5 h-5 text-violet-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：输入主题，AI 自动为你创作高质量自媒体文章，还可以生成配图。
          </p>
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              配置文章参数
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>文章主题</strong>：输入你想写的主题（必填）</li>
              <li><strong>目标平台</strong>：选择发布平台（微信公众号、今日头条、知乎等）</li>
              <li><strong>文章风格</strong>：选择文章风格（干货教程、观点评论、新闻资讯等）</li>
              <li><strong>目标字数</strong>：用滑块调整文章字数（500-3000字）</li>
              <li><strong>快捷主题</strong>：点击快捷主题按钮快速填入热门话题</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              生成文章配图
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              文章生成后，会自动生成图片提示词，你可以：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li>使用自动生成的提示词，或手动修改</li>
              <li>选择图片尺寸（512x512、1024x1024、1024x1792、1792x1024）</li>
              <li>点击"生成图片"生成配图</li>
              <li>生成后可以下载图片</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              图片生成服务商
            </h4>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {[
                { name: '通义千问（万相）', free: true },
                { name: '豆包', free: true },
                { name: '智谱', free: true },
                { name: '文心', free: true },
                { name: 'OpenAI DALL-E 3', free: false },
                { name: 'Stability AI', free: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>{item.name}</span>
                  {item.free && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      title: '第三步：AI 检测（分段检测）',
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检测内容是否由 AI 生成，识别 AI 写作痕迹。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              AI 检测服务商
            </h4>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {[
                { name: '通义千问', free: true },
                { name: '智谱', free: true },
                { name: '文心', free: true },
                { name: 'Originality.ai', free: false },
                { name: 'Winston AI', free: false },
                { name: 'GPTZero', free: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>{item.name}</span>
                  {item.free && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
                </div>
              ))}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 ml-6">
              💡 推荐使用国内服务商（通义千问、智谱、文心），有免费额度
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
          </div>
        </div>
      ),
    },
    {
      id: 'polish',
      title: '第四步：AI 润色与排版',
      icon: <Sparkles className="w-5 h-5 text-cyan-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：使用 AI 对内容进行智能润色、降低AI痕迹、优化排版。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              AI 润色服务商
            </h4>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {[
                { name: '通义千问', free: true },
                { name: '豆包', free: true },
                { name: '智谱', free: true },
                { name: '文心', free: true },
                { name: 'DeepSeek', free: true },
                { name: 'OpenAI', free: false },
                { name: 'Claude', free: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>{item.name}</span>
                  {item.free && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
                </div>
              ))}
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              选择润色模式
            </h4>
            <div className="ml-6 space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm">✨ 普通润色</p>
                <p className="text-sm text-muted-foreground">优化语言表达，使文章更流畅自然</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm">🤖 降低AI痕迹</p>
                <p className="text-sm text-muted-foreground">重写文章使其更像人工创作，降低AI检测分数。功能包括：</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-muted-foreground mt-1">
                  <li>替换AI常用的模板化连接词</li>
                  <li>增加口语化和个人化表达</li>
                  <li>优化句式多样性</li>
                  <li>增加语气词和自然过渡</li>
                  <li>加入更多个人观点和真实案例暗示</li>
                </ul>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm">🚀 内容增强</p>
                <p className="text-sm text-muted-foreground">提升文章吸引力和传播性，增加互动元素</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm">📐 智能排版</p>
                <p className="text-sm text-muted-foreground">优化文章结构和格式，添加Markdown样式，包括：</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-muted-foreground mt-1">
                  <li>添加合适的标题层级（#、##、###）</li>
                  <li>将长段落拆分为易读短段落</li>
                  <li>添加列表格式（有序和无序列表）</li>
                  <li>整体排版更清晰易读</li>
                </ul>
              </div>
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              查看和对比
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              润色完成后，可以在多个标签页之间切换查看：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>对比视图</strong>：原文和润色后并排对比，差异行高亮显示</li>
              <li><strong>润色结果</strong>：只显示润色后的内容</li>
              <li><strong>Markdown 预览</strong>：预览Markdown渲染效果</li>
              <li><strong>原文</strong>：只显示原文内容</li>
              <li><strong>修改说明</strong>：列出所有修改点和字数变化</li>
            </ul>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">4</Badge>
              使用 AI API
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              勾选"使用 AI API"可以使用真实的 AI 模型进行润色（需要先配置 API Key），
              否则使用本地润色模式。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      title: '第五步：同质化查询',
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
      title: '第六步：流量预测',
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
      title: '第七步：内容逻辑与连贯性检测',
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
      title: '第八步：敏感与违规词检测',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：检测内容中的敏感词和违规词，避免触发平台审核。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              内容安全服务商
            </h4>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {[
                { name: '通义千问', free: true },
                { name: '智谱', free: true },
                { name: '华为内容安全', free: false },
                { name: '阿里云内容安全', free: false },
                { name: '腾讯云内容安全', free: false },
                { name: '百度内容安全', free: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>{item.name}</span>
                  {item.free && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">免费额度</Badge>}
                </div>
              ))}
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              检测哪些内容？
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
              <li><strong>极限用语</strong>："最"、"第一"、"绝对"等违反广告法的词</li>
              <li><strong>敏感话题</strong>：涉及政治、色情、赌博、毒品等</li>
              <li><strong>引流话术</strong>："加微信"、"扫码关注"等平台限制的内容</li>
              <li><strong>虚假承诺</strong>："暴富"、"躺赚"、"稳赚不赔"等</li>
            </ul>

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
      title: '第九步：营销文与广告浓度检测',
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
      title: '第十步：综合检测报告',
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
    id: 'hot-articles',
    title: '第十一步：热门文章采集',
    icon: <Rss className="w-5 h-5 text-orange-500" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          <strong>目的</strong>：查看各平台热门文章来源，获取创作灵感。
        </p>

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="text-xs">1</Badge>
            热门文章来源
          </h4>
          <p className="text-sm text-muted-foreground ml-6">
            平台预设了多个热门文章来源，点击名称可直接跳转到对应平台：
          </p>
          <div className="ml-6 grid grid-cols-2 gap-2">
            {[
              '微信公众号', '今日头条', '腾讯新闻', '知乎热榜',
              '微博热搜', 'B站热门', '抖音热点', '小红书热门'
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>{p}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="text-xs">2</Badge>
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
      id: 'api-settings',
      title: '第十二步：API 接口设置',
      icon: <Settings className="w-5 h-5 text-slate-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong>目的</strong>：配置各种 AI 服务 API，启用高级功能。
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              配置模块说明
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              API 接口设置分为 6 个模块：
            </p>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {[
                { icon: <Brain className="w-3 h-3" />, label: '大模型' },
                { icon: <ScanFace className="w-3 h-3" />, label: 'AI 检测' },
                { icon: <Shield className="w-3 h-3" />, label: '内容安全' },
                { icon: <Image className="w-3 h-3" />, label: '图片生成' },
                { icon: <Sparkles className="w-3 h-3" />, label: 'AI 润色' },
                { icon: <TrendingUp className="w-3 h-3" />, label: '热门文章' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              免费额度推荐
            </h4>
            <div className="ml-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                💡 推荐使用以下国内服务商（均有免费额度）：
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
                <li><strong>通义千问</strong>：大模型、AI检测、内容安全、图片生成、AI润色</li>
                <li><strong>智谱</strong>：大模型、AI检测、内容安全、图片生成、AI润色</li>
                <li><strong>豆包</strong>：大模型、图片生成、AI润色</li>
                <li><strong>文心</strong>：大模型、AI检测、图片生成、AI润色</li>
                <li><strong>DeepSeek</strong>：大模型、AI润色</li>
              </ul>
            </div>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              快速选择服务商
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              点击服务商按钮即可自动填充配置：
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 ml-6">
              💡 提示：按住 <strong>Ctrl/Command</strong> 键点击服务商按钮可直接跳转到对应官网获取 API Key
            </p>

            <h4 className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-xs">4</Badge>
              保存配置
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              点击"保存所有配置"将设置保存到本地浏览器。API Key 仅保存在你的设备上，不会上传到任何服务器。
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
              <div className="flex-1">
                <p className="text-sm font-medium">微信</p>
                <p className="text-sm text-muted-foreground">xiaoqi19860607</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText('xiaoqi19860607')}
              >
                <Check className="w-3 h-3 mr-1" />
                复制
              </Button>
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
              <CardDescription>详细的使用指南，从入门到精通（已更新最新功能）</CardDescription>
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
            {[
              '内容编辑', 'AI生成文章', 'AI检测', 'AI润色', 'API设置'
            ].map((step, i) => (
              <span key={i} className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                <span className="text-muted-foreground">{step}</span>
                {i < 4 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
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
