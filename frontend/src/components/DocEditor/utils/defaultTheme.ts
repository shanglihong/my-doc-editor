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

export type ColorTier = 'light' | 'medium' | 'normal';
export type ColorCategory = 'textColor' | 'backgroundColor' | 'borderColor';

export interface ColorOption {
  label: string;
  value: string;
  tier: ColorTier;
}

export interface ColorGroup {
  hue: string;
  hueName: string;
  shades: {
    light: ColorOption;
    medium: ColorOption;
    normal: ColorOption;
  };
}

export interface UnifiedColorSystem {
  textColor: ColorGroup[];
  backgroundColor: ColorGroup[];
  borderColor: ColorGroup[];
}

export const UNIFIED_COLOR_SYSTEM: UnifiedColorSystem = {
  textColor: [
    {
      hue: 'slate',
      hueName: '灰色',
      shades: {
        light: { label: '浅灰文本', value: '#64748b', tier: 'light' },
        medium: { label: '中灰文本', value: '#334155', tier: 'medium' },
        normal: { label: '深灰文本', value: '#0f172a', tier: 'normal' },
      },
    },
    {
      hue: 'blue',
      hueName: '蓝色',
      shades: {
        light: { label: '浅蓝文本', value: '#60a5fa', tier: 'light' },
        medium: { label: '中蓝文本', value: '#2563eb', tier: 'medium' },
        normal: { label: '深蓝文本', value: '#1e3a8a', tier: 'normal' },
      },
    },
    {
      hue: 'emerald',
      hueName: '绿色',
      shades: {
        light: { label: '浅绿文本', value: '#4ade80', tier: 'light' },
        medium: { label: '中绿文本', value: '#16a34a', tier: 'medium' },
        normal: { label: '深绿文本', value: '#14532d', tier: 'normal' },
      },
    },
    {
      hue: 'amber',
      hueName: '黄色',
      shades: {
        light: { label: '浅黄文本', value: '#facc15', tier: 'light' },
        medium: { label: '中黄文本', value: '#ca8a04', tier: 'medium' },
        normal: { label: '深黄文本', value: '#713f12', tier: 'normal' },
      },
    },
    {
      hue: 'rose',
      hueName: '红色',
      shades: {
        light: { label: '浅红文本', value: '#f87171', tier: 'light' },
        medium: { label: '中红文本', value: '#dc2626', tier: 'medium' },
        normal: { label: '深红文本', value: '#7f1d1d', tier: 'normal' },
      },
    },
    {
      hue: 'purple',
      hueName: '紫色',
      shades: {
        light: { label: '浅紫文本', value: '#c084fc', tier: 'light' },
        medium: { label: '中紫文本', value: '#9333ea', tier: 'medium' },
        normal: { label: '深紫文本', value: '#581c87', tier: 'normal' },
      },
    },
    {
      hue: 'cyan',
      hueName: '青色',
      shades: {
        light: { label: '浅青文本', value: '#22d3ee', tier: 'light' },
        medium: { label: '中青文本', value: '#0891b2', tier: 'medium' },
        normal: { label: '深青文本', value: '#164e63', tier: 'normal' },
      },
    },
    {
      hue: 'orange',
      hueName: '橙色',
      shades: {
        light: { label: '浅橙文本', value: '#fb923c', tier: 'light' },
        medium: { label: '中橙文本', value: '#ea580c', tier: 'medium' },
        normal: { label: '深橙文本', value: '#7c2d12', tier: 'normal' },
      },
    },
  ],
  backgroundColor: [
    {
      hue: 'slate',
      hueName: '灰色',
      shades: {
        light: { label: '浅灰背景', value: '#f8fafc', tier: 'light' },
        medium: { label: '中灰背景', value: '#e2e8f0', tier: 'medium' },
        normal: { label: '深灰背景', value: '#cbd5e1', tier: 'normal' },
      },
    },
    {
      hue: 'blue',
      hueName: '蓝色',
      shades: {
        light: { label: '浅蓝背景', value: '#eff6ff', tier: 'light' },
        medium: { label: '中蓝背景', value: '#dbeafe', tier: 'medium' },
        normal: { label: '深蓝背景', value: '#93c5fd', tier: 'normal' },
      },
    },
    {
      hue: 'emerald',
      hueName: '绿色',
      shades: {
        light: { label: '浅绿背景', value: '#f0fdf4', tier: 'light' },
        medium: { label: '中绿背景', value: '#dcfce7', tier: 'medium' },
        normal: { label: '深绿背景', value: '#86efac', tier: 'normal' },
      },
    },
    {
      hue: 'amber',
      hueName: '黄色',
      shades: {
        light: { label: '浅黄背景', value: '#fefce8', tier: 'light' },
        medium: { label: '中黄背景', value: '#fef08a', tier: 'medium' },
        normal: { label: '深黄背景', value: '#fde047', tier: 'normal' },
      },
    },
    {
      hue: 'rose',
      hueName: '红色',
      shades: {
        light: { label: '浅红背景', value: '#fff1f2', tier: 'light' },
        medium: { label: '中红背景', value: '#fee2e2', tier: 'medium' },
        normal: { label: '深红背景', value: '#fca5a5', tier: 'normal' },
      },
    },
    {
      hue: 'purple',
      hueName: '紫色',
      shades: {
        light: { label: '浅紫背景', value: '#faf5ff', tier: 'light' },
        medium: { label: '中紫背景', value: '#f3e8ff', tier: 'medium' },
        normal: { label: '深紫背景', value: '#d8b4fe', tier: 'normal' },
      },
    },
    {
      hue: 'cyan',
      hueName: '青色',
      shades: {
        light: { label: '浅青背景', value: '#ecfeff', tier: 'light' },
        medium: { label: '中青背景', value: '#cffafe', tier: 'medium' },
        normal: { label: '深青背景', value: '#a5f3fc', tier: 'normal' },
      },
    },
    {
      hue: 'orange',
      hueName: '橙色',
      shades: {
        light: { label: '浅橙背景', value: '#fff7ed', tier: 'light' },
        medium: { label: '中橙背景', value: '#ffedd5', tier: 'medium' },
        normal: { label: '深橙背景', value: '#fed7aa', tier: 'normal' },
      },
    },
  ],
  borderColor: [
    {
      hue: 'slate',
      hueName: '灰色',
      shades: {
        light: { label: '浅灰边框', value: '#e2e8f0', tier: 'light' },
        medium: { label: '中灰边框', value: '#cbd5e1', tier: 'medium' },
        normal: { label: '深灰边框', value: '#94a3b8', tier: 'normal' },
      },
    },
    {
      hue: 'blue',
      hueName: '蓝色',
      shades: {
        light: { label: '浅蓝边框', value: '#bfdbfe', tier: 'light' },
        medium: { label: '中蓝边框', value: '#93c5fd', tier: 'medium' },
        normal: { label: '深蓝边框', value: '#3b82f6', tier: 'normal' },
      },
    },
    {
      hue: 'emerald',
      hueName: '绿色',
      shades: {
        light: { label: '浅绿边框', value: '#bbf7d0', tier: 'light' },
        medium: { label: '中绿边框', value: '#86efac', tier: 'medium' },
        normal: { label: '深绿边框', value: '#22c55e', tier: 'normal' },
      },
    },
    {
      hue: 'amber',
      hueName: '黄色',
      shades: {
        light: { label: '浅黄边框', value: '#fef08a', tier: 'light' },
        medium: { label: '中黄边框', value: '#fde047', tier: 'medium' },
        normal: { label: '深黄边框', value: '#eab308', tier: 'normal' },
      },
    },
    {
      hue: 'rose',
      hueName: '红色',
      shades: {
        light: { label: '浅红边框', value: '#fecaca', tier: 'light' },
        medium: { label: '中红边框', value: '#fca5a5', tier: 'medium' },
        normal: { label: '深红边框', value: '#ef4444', tier: 'normal' },
      },
    },
    {
      hue: 'purple',
      hueName: '紫色',
      shades: {
        light: { label: '浅紫边框', value: '#e9d5ff', tier: 'light' },
        medium: { label: '中紫边框', value: '#d8b4fe', tier: 'medium' },
        normal: { label: '深紫边框', value: '#a855f7', tier: 'normal' },
      },
    },
    {
      hue: 'cyan',
      hueName: '青色',
      shades: {
        light: { label: '浅青边框', value: '#a5f3fc', tier: 'light' },
        medium: { label: '中青边框', value: '#67e8f9', tier: 'medium' },
        normal: { label: '深青边框', value: '#06b6d4', tier: 'normal' },
      },
    },
    {
      hue: 'orange',
      hueName: '橙色',
      shades: {
        light: { label: '浅橙边框', value: '#fed7aa', tier: 'light' },
        medium: { label: '中橙边框', value: '#fdba74', tier: 'medium' },
        normal: { label: '深橙边框', value: '#f97316', tier: 'normal' },
      },
    },
  ],
};

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

export interface DarkColorPreset {
  hue: string;
  name: string;
  textValue: string;
  bgValue: string;
  bgValueSecondary?: string;
}

export interface DarkColorPreset {
  hue: string;
  name: string;
  textValue: string;
  bgValue: string;
  bgValueSecondary?: string;
}

export const DARK_THEME_COLOR_PRESETS: DarkColorPreset[] = [
  { hue: 'default', name: '默认', textValue: '#f8fafc', bgValue: 'transparent', bgValueSecondary: '#27272a' },
  { hue: 'slate', name: '灰色', textValue: '#94a3b8', bgValue: '#2d2d30', bgValueSecondary: '#3f3f46' },
  { hue: 'rose', name: '红色', textValue: '#f87171', bgValue: '#552222', bgValueSecondary: '#7f1d1d' },
  { hue: 'amber', name: '棕黄', textValue: '#fbbf24', bgValue: '#5d3a1a', bgValueSecondary: '#713f12' },
  { hue: 'yellow', name: '橄榄黄', textValue: '#facc15', bgValue: '#4c4b1a', bgValueSecondary: '#65641a' },
  { hue: 'emerald', name: '绿色', textValue: '#4ade80', bgValue: '#1f4522', bgValueSecondary: '#14532d' },
  { hue: 'blue', name: '蓝色', textValue: '#60a5fa', bgValue: '#223965', bgValueSecondary: '#1e3a8a' },
  { hue: 'purple', name: '紫色', textValue: '#c084fc', bgValue: '#422560', bgValueSecondary: '#581c87' },
];

export interface LightColorPreset {
  hue: string;
  name: string;
  textValue: string;
  bgValue: string;
  bgValueSecondary?: string;
}

export const LIGHT_THEME_COLOR_PRESETS: LightColorPreset[] = [
  { hue: 'default', name: '默认', textValue: '#0f172a', bgValue: 'transparent', bgValueSecondary: '#e2e8f0' },
  { hue: 'slate', name: '灰色', textValue: '#64748b', bgValue: '#f1f5f9', bgValueSecondary: '#cbd5e1' },
  { hue: 'rose', name: '红色', textValue: '#dc2626', bgValue: '#fee2e2', bgValueSecondary: '#fca5a5' },
  { hue: 'amber', name: '橙色', textValue: '#ea580c', bgValue: '#ffedd5', bgValueSecondary: '#fdba74' },
  { hue: 'yellow', name: '黄色', textValue: '#ca8a04', bgValue: '#fef08a', bgValueSecondary: '#fde047' },
  { hue: 'emerald', name: '绿色', textValue: '#16a34a', bgValue: '#dcfce7', bgValueSecondary: '#86efac' },
  { hue: 'blue', name: '蓝色', textValue: '#2563eb', bgValue: '#dbeafe', bgValueSecondary: '#93c5fd' },
  { hue: 'purple', name: '紫色', textValue: '#9333ea', bgValue: '#f3e8ff', bgValueSecondary: '#d8b4fe' },
];



