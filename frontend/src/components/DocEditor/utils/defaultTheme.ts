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
    bgColor: '#f0f6ff',
    borderColor: '#93c5fd',
    textColor: '#1e3a5f',
    iconColor: '#3b82f6',
    defaultIcon: 'Info',
  },
  {
    id: 'emerald',
    name: '成功绿',
    bgColor: '#f0fdf6',
    borderColor: '#86efac',
    textColor: '#14532d',
    iconColor: '#22c55e',
    defaultIcon: 'CheckCircle2',
  },
  {
    id: 'amber',
    name: '警告黄',
    bgColor: '#fefce8',
    borderColor: '#fde047',
    textColor: '#713f12',
    iconColor: '#eab308',
    defaultIcon: 'AlertTriangle',
  },
  {
    id: 'rose',
    name: '危险红',
    bgColor: '#fff1f2',
    borderColor: '#fca5a5',
    textColor: '#7f1d1d',
    iconColor: '#f87171',
    defaultIcon: 'OctagonAlert',
  },
  {
    id: 'purple',
    name: '灵感紫',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    textColor: '#4c1d95',
    iconColor: '#a855f7',
    defaultIcon: 'Lightbulb',
  },
  {
    id: 'cyan',
    name: '提示青',
    bgColor: '#ecfeff',
    borderColor: '#67e8f9',
    textColor: '#164e63',
    iconColor: '#06b6d4',
    defaultIcon: 'FileText',
  },
  {
    id: 'slate',
    name: '中性灰',
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
    textColor: '#334155',
    iconColor: '#94a3b8',
    defaultIcon: 'Bookmark',
  },
  {
    id: 'orange',
    name: '重点橙',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
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

export const TABLE_CELL_BG_PALETTE = [
  { label: '无背景', value: 'transparent' },
  { label: '宝石蓝', value: '#dbeafe' },
  { label: '天空蓝', value: '#93c5fd' },
  { label: '薄荷绿', value: '#dcfce7' },
  { label: '翡翠绿', value: '#86efac' },
  { label: '柠檬黄', value: '#fef08a' },
  { label: '琥珀黄', value: '#fde047' },
  { label: '珊瑚粉', value: '#fee2e2' },
  { label: '火焰红', value: '#fca5a5' },
  { label: '梦幻紫', value: '#f3e8ff' },
  { label: '紫罗兰', value: '#d8b4fe' },
  { label: '活力橙', value: '#ffedd5' },
  { label: '冰爽青', value: '#cffafe' },
  { label: '中性灰', value: '#e2e8f0' },
  { label: '深灰', value: '#cbd5e1' },
];


