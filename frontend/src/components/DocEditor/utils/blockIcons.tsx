import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  TextQuote,
  Code2,
  Megaphone,
  Table,
  Workflow,
  Plus,
  Type,
  Minus,
} from 'lucide-react';

export interface BlockIconConfig {
  type: string;
  level?: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  color: string;
  bgColor: string;
}

export const BLOCK_ICON_CONFIGS: Record<string, BlockIconConfig> = {
  paragraph: {
    type: 'paragraph',
    label: '正文文本',
    description: '标准普通文本段落',
    icon: Text,
    color: '#475569',
    bgColor: '#f1f5f9',
  },
  'heading-1': {
    type: 'heading',
    level: 1,
    label: '一级标题',
    description: '最高层级大标题',
    icon: Heading1,
    color: '#4f46e5',
    bgColor: '#eef2ff',
  },
  'heading-2': {
    type: 'heading',
    level: 2,
    label: '二级标题',
    description: '章节中级标题',
    icon: Heading2,
    color: '#0284c7',
    bgColor: '#e0f2fe',
  },
  'heading-3': {
    type: 'heading',
    level: 3,
    label: '三级标题',
    description: '小节标题',
    icon: Heading3,
    color: '#0d9488',
    bgColor: '#ccfbf1',
  },
  bulletList: {
    type: 'bulletList',
    label: '无序列表',
    description: '项目符号点状列表',
    icon: List,
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  orderedList: {
    type: 'orderedList',
    label: '有序列表',
    description: '数字编号顺序列表',
    icon: ListOrdered,
    color: '#ea580c',
    bgColor: '#ffedd5',
  },
  taskList: {
    type: 'taskList',
    label: '待办事项',
    description: '支持勾选复选框任务',
    icon: CheckSquare,
    color: '#6366f1',
    bgColor: '#e0e7ff',
  },
  blockquote: {
    type: 'blockquote',
    label: '引用块',
    description: '引用文段或重点强调',
    icon: TextQuote,
    color: '#64748b',
    bgColor: '#f1f5f9',
  },
  codeBlock: {
    type: 'codeBlock',
    label: '代码块',
    description: '高亮代码片段区域',
    icon: Code2,
    color: '#e11d48',
    bgColor: '#ffe4e6',
  },
  callout: {
    type: 'callout',
    label: '高亮块',
    description: '彩色带背景提示区域',
    icon: Megaphone,
    color: '#9333ea',
    bgColor: '#f3e8ff',
  },
  horizontalRule: {
    type: 'horizontalRule',
    label: '分割线',
    description: '水平分割线切分章节',
    icon: Minus,
    color: '#94a3b8',
    bgColor: '#f1f5f9',
  },
  table: {
    type: 'table',
    label: '数据表格',
    description: '结构化表格数据块',
    icon: Table,
    color: '#0891b2',
    bgColor: '#cffafe',
  },
  drawioBlock: {
    type: 'drawioBlock',
    label: 'DrawIO 图表',
    description: '流程图与架构设计图',
    icon: Workflow,
    color: '#059669',
    bgColor: '#d1fae5',
  },
  empty: {
    type: 'empty',
    label: '空白 Block',
    description: '点击添加或转换 Block 类型',
    icon: Plus,
    color: '#64748b',
    bgColor: '#f8fafc',
  },
};

/**
 * 根据 nodeType 和 level 获取 BlockIcon 配置
 */
export function getBlockIconConfig(type: string, level?: number, isEmpty?: boolean): BlockIconConfig {
  if (isEmpty) {
    return BLOCK_ICON_CONFIGS.empty;
  }

  if (type === 'heading') {
    const headingKey = `heading-${level || 1}`;
    if (BLOCK_ICON_CONFIGS[headingKey]) {
      return BLOCK_ICON_CONFIGS[headingKey];
    }
  }

  if (BLOCK_ICON_CONFIGS[type]) {
    return BLOCK_ICON_CONFIGS[type];
  }

  // 兜底为段落或 Empty
  return BLOCK_ICON_CONFIGS.paragraph;
}

export interface BlockIconProps {
  type: string;
  level?: number;
  isEmpty?: boolean;
  size?: number;
  showBg?: boolean;
  className?: string;
}

export const BlockIcon: React.FC<BlockIconProps> = ({
  type,
  level,
  isEmpty = false,
  size = 16,
  className = '',
}) => {
  const config = getBlockIconConfig(type, level, isEmpty);
  const IconComponent = config.icon || Type;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: config.color,
        flexShrink: 0,
      }}
      title={config.label}
    >
      <IconComponent size={size} color={config.color} />
    </div>
  );
};
