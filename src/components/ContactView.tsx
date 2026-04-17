import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Lightbulb } from 'lucide-react';

export function ContactView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">联系方式</CardTitle>
              <CardDescription>如有问题或建议，欢迎联系我们</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                  复制
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">邮箱</p>
                  <p className="text-sm text-muted-foreground">2742938881@qq.com</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('2742938881@qq.com')}
                >
                  复制
                </Button>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Lightbulb className="w-4 h-4" />
                <strong>提示</strong>：工作日内我们会在 24 小时内回复你的问题
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
