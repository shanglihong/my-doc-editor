export interface CalloutTheme {
  id: string;
  name: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  defaultIcon: string;
}

export const CALLOUT_THEMES: CalloutTheme[] = [
  {
    id: 'blue',
    name: '信息蓝',
    bgColor: '#f0f7ff',
    borderColor: '#0066ff',
    textColor: '#1e293b',
    iconColor: '#0066ff',
    defaultIcon: 'Info',
  },
  {
    id: 'emerald',
    name: '成功绿',
    bgColor: '#f0fdf4',
    borderColor: '#10b981',
    textColor: '#14532d',
    iconColor: '#10b981',
    defaultIcon: 'CheckCircle2',
  },
  {
    id: 'amber',
    name: '警告黄',
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
    textColor: '#78350f',
    iconColor: '#f59e0b',
    defaultIcon: 'AlertTriangle',
  },
  {
    id: 'rose',
    name: '危险红',
    bgColor: '#fff1f2',
    borderColor: '#f43f5e',
    textColor: '#881337',
    iconColor: '#f43f5e',
    defaultIcon: 'OctagonAlert',
  },
  {
    id: 'purple',
    name: '灵感紫',
    bgColor: '#faf5ff',
    borderColor: '#a855f7',
    textColor: '#581c87',
    iconColor: '#a855f7',
    defaultIcon: 'Lightbulb',
  },
  {
    id: 'cyan',
    name: '提示青',
    bgColor: '#ecfeff',
    borderColor: '#06b6d4',
    textColor: '#164e63',
    iconColor: '#06b6d4',
    defaultIcon: 'FileText',
  },
  {
    id: 'slate',
    name: '中性灰',
    bgColor: '#f8fafc',
    borderColor: '#64748b',
    textColor: '#334155',
    iconColor: '#64748b',
    defaultIcon: 'Bookmark',
  },
  {
    id: 'orange',
    name: '重点橙',
    bgColor: '#fff7ed',
    borderColor: '#f97316',
    textColor: '#7c2d12',
    iconColor: '#f97316',
    defaultIcon: 'Zap',
  },
];

export const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
];

export const COLOR_PALETTE = [
  { label: '默认文本', value: 'inherit' },
  { label: '石墨黑', value: '#1e293b' },
  { label: '深灰', value: '#475569' },
  { label: '静谧蓝', value: '#2563eb' },
  { label: '翡翠绿', value: '#059669' },
  { label: '琥珀黄', value: '#d97706' },
  { label: '玫瑰红', value: '#e11d48' },
  { label: '紫罗兰', value: '#7c3aed' },
];

export const HIGHLIGHT_PALETTE = [
  { label: '无高亮', value: 'transparent' },
  { label: '柔光黄', value: '#fef08a' },
  { label: '薄荷绿', value: '#bbf7d0' },
  { label: '天空蓝', value: '#bae6fd' },
  { label: '薰衣草紫', value: '#e9d5ff' },
  { label: '粉桃红', value: '#fbcfe8' },
  { label: '暖灰', value: '#e2e8f0' },
];
