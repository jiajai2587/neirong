import { useState, useEffect, useCallback } from 'react';
import {
  FileText, Search, TrendingUp, Brain, AlertTriangle, Megaphone,
  FileCheck, Sparkles, Rss, Settings, BookOpen, ChevronLeft, ChevronRight,
  Moon, Sun, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyTheme, getSelectedTheme } from '@/lib/themes';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'editor', label: '内容编辑', icon: <FileText className="w-4 h-4" /> },
  { id: 'ai-detect', label: 'AI 检测', icon: <Brain className="w-4 h-4" /> },
  { id: 'homogeneity', label: '同质化查询', icon: <Search className="w-4 h-4" /> },
  { id: 'traffic', label: '流量预测', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'logic', label: '逻辑性检测', icon: <FileCheck className="w-4 h-4" /> },
  { id: 'sensitive', label: '敏感违规检测', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'marketing', label: '营销文检测', icon: <Megaphone className="w-4 h-4" /> },
  { id: 'report', label: '综合检测报告', icon: <FileCheck className="w-4 h-4" /> },
  { id: 'polish', label: 'AI 润色排版', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'generate', label: 'AI 生成文章', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'hot-articles', label: '热门文章采集', icon: <Rss className="w-4 h-4" /> },
  { id: 'api-settings', label: 'API 接口设置', icon: <Settings className="w-4 h-4" /> },
  { id: 'manual', label: '使用说明', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'contact', label: '联系方式', icon: <MessageCircle className="w-4 h-4" /> },
];


export function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  const [isDark, setIsDark] = useState(false);

  // Sync with actual DOM state
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();

    // Apply saved theme on mount
    const savedTheme = getSelectedTheme();
    applyTheme(savedTheme);

    // Use MutationObserver to detect class changes
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    applyTheme(currentIsDark ? 'default' : 'dark');
    setIsDark(!currentIsDark);
  }, []);

  return (
    <div className={cn(
      'fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50 flex flex-col',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm truncate">自媒体工作台</h1>
            <p className="text-xs text-muted-foreground truncate">Multi-Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV_ITEMS.filter(item => item.id !== 'contact').map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
              activeTab === item.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Contact Info */}
      <div className="p-2 border-t border-border">
        <button
          onClick={() => onTabChange('contact')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
            activeTab === 'contact'
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title={collapsed ? '联系方式' : undefined}
        >
          <span className="flex-shrink-0"><MessageCircle className="w-4 h-4" /></span>
          {!collapsed && <span className="truncate">联系方式</span>}
        </button>
      </div>

      {/* Bottom controls */}
      <div className="p-2 border-t border-border space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          title={collapsed ? (isDark ? '切换亮色' : '切换暗色') : undefined}
        >
          {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && <span>{isDark ? '亮色模式' : '暗色模式'}</span>}
        </button>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : <ChevronLeft className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && <span>收起菜单</span>}
        </button>
      </div>
    </div>
  );
}
