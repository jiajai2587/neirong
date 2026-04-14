import type { ThemeOption } from '@/lib/types';

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    name: '默认明亮',
    icon: '☀️',
    colors: { primary: '#2563eb', bg: '#ffffff', accent: '#3b82f6' },
  },
  {
    id: 'dark',
    name: '暗黑模式',
    icon: '🌙',
    colors: { primary: '#60a5fa', bg: '#0f172a', accent: '#818cf8' },
  },
  {
    id: 'ocean',
    name: '深海蓝',
    icon: '🌊',
    colors: { primary: '#0ea5e9', bg: '#0c1929', accent: '#06b6d4' },
  },
  {
    id: 'forest',
    name: '森林绿',
    icon: '🌿',
    colors: { primary: '#22c55e', bg: '#052e16', accent: '#10b981' },
  },
  {
    id: 'sunset',
    name: '日落橙',
    icon: '🌅',
    colors: { primary: '#f97316', bg: '#1c1917', accent: '#ef4444' },
  },
  {
    id: 'purple',
    name: '霓虹紫',
    icon: '💜',
    colors: { primary: '#a855f7', bg: '#1e1b4b', accent: '#d946ef' },
  },
  {
    id: 'rose',
    name: '玫瑰红',
    icon: '🌹',
    colors: { primary: '#f43f5e', bg: '#1a0a0e', accent: '#fb7185' },
  },
  {
    id: 'minimal',
    name: '极简白',
    icon: '⬜',
    colors: { primary: '#18181b', bg: '#fafafa', accent: '#52525b' },
  },
];

export function applyTheme(themeId: string) {
  const theme = THEME_OPTIONS.find(t => t.id === themeId);
  if (!theme) return;

  localStorage.setItem('selected_theme', themeId);
  document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
  document.documentElement.style.setProperty('--theme-bg', theme.colors.bg);
  document.documentElement.style.setProperty('--theme-accent', theme.colors.accent);

  if (themeId === 'dark' || themeId === 'ocean' || themeId === 'forest' ||
      themeId === 'sunset' || themeId === 'purple' || themeId === 'rose') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function getSelectedTheme(): string {
  return localStorage.getItem('selected_theme') || 'default';
}
