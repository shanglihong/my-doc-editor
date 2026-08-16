/**
 * 个人知识库文档编辑器 TypeScript 数据模型与接口规范
 */

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'table'
  | 'callout'
  | 'drawio'
  | 'horizontalRule';

export interface MarkState {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'fontSize' | 'color' | 'highlight';
  attrs?: {
    size?: 'small' | 'normal' | 'large' | 'huge' | string;
    color?: string;
    highlightColor?: string;
  };
}

export interface InlineContentNode {
  type: 'text';
  text: string;
  marks?: MarkState[];
}

export interface CalloutAttributes {
  icon?: string;
  iconType?: 'lucide' | 'emoji';
  themeColor?: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray' | 'pink' | 'black' | 'custom' | string;
  customBg?: string;
  customBorder?: string;
}

export interface DrawIOBlockAttrs {
  xml: string;
  svg: string;
  alignment?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
}

export interface DrawIOModalState {
  isOpen: boolean;
  initialXml: string;
  nodePos: number | null;
}

export interface BlockNode {
  id: string;
  type: BlockType;
  attrs?: Record<string, any>;
  content?: InlineContentNode[] | BlockNode[];
  children?: BlockNode[];
}

export interface DocumentNode {
  type: 'doc';
  version?: '1.0';
  content: BlockNode[];
}

export interface DragState {
  isDragging: boolean;
  draggedBlockId: string | null;
  targetBlockId: string | null;
  dropPosition: 'before' | 'after' | 'inside';
}

export interface SelectionState {
  isTextSelected: boolean;
  from: number;
  to: number;
  activeMarks: Record<string, boolean>;
  activeFontSize: string;
  activeColor: string;
}

export type EditorTheme = 'light' | 'dark' | 'auto';

export interface DocEditorProps {
  /** 初始内容，支持传递 JSON Block AST 对象或 Markdown 文本 */
  value?: DocumentNode | string;

  /** 内容发生变更时的回调 */
  onChange?: (doc: DocumentNode, markdown: string) => void;

  /** 标题单独发生变更时的回调 */
  onTitleChange?: (title: string) => void;

  /** 是否只读模式 */
  readOnly?: boolean;

  /** 标题占位符文本 */
  titlePlaceholder?: string;

  /** 自定义正文占位符文本 */
  placeholder?: string;

  /** 编辑器主题样式，支持 'light' | 'dark' | 'auto' */
  theme?: EditorTheme;

  /** 样式类名扩展 */
  className?: string;

  /** 是否启用 draw.io 画图块扩展 */
  enableDrawIO?: boolean;

  /** 自定义 draw.io 嵌入页面的 URL 路径，若未提供则默认离线资源或 Fallback 链接 */
  drawioUrl?: string;

  /** 获得焦点时的回调 */
  onFocus?: (event: FocusEvent) => void;

  /** 失去焦点时的回调 */
  onBlur?: (event: FocusEvent) => void;

  /** 选择区域或光标变更时的回调 */
  onSelectionChange?: (selection: { empty: boolean; from: number; to: number }) => void;

  /** 自定义异步图片上传处理 Hook */
  onUploadImage?: (file: File) => Promise<string>;
}

export interface DocEditorRef {
  /** 获取当前文档标题文本 */
  getTitle: () => string;

  /** 设置当前文档标题文本 */
  setTitle: (title: string) => void;

  /** 获取当前文档的结构化 JSON AST 对象 */
  getJSON: () => DocumentNode;

  /** 获取当前文档转换后的标准 Markdown 文本 */
  getMarkdown: () => string;

  /** 设置文档内容 (传入 JSON AST 或 Markdown) */
  setContent: (content: DocumentNode | string) => void;

  /** 清空当前编辑器正文 (保留标题) */
  clear: () => void;

  /** 清空当前编辑器正文 (保留标题的快捷别名) */
  clearContent: () => void;

  /** 使编辑器获得焦点 */
  focus: () => void;

  /** 使编辑器失去焦点 */
  blur: () => void;

  /** 覆盖设置文档 Markdown 内容 */
  setMarkdown: (content: string) => void;

  /** 检查当前编辑器正文是否为空 */
  isEmpty: () => boolean;
}
