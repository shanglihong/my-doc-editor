# 数据模型与状态定义 (Data Model & State Definitions)

**Feature Branch**: `011-text-selection-hyperlink`  
**Date**: 2026-08-14  
**Spec**: [spec.md](spec.md) | **Research**: [research.md](research.md)

## 1. 实体模型 (Entity Models)

### HyperlinkMark (超链接 Mark 实体)
Tiptap/ProseMirror 中行内节点附加的超链接 Mark 属性结构：

```typescript
interface HyperlinkMarkAttrs {
  /** 目标跳转 URL */
  href: string;
  /** 打开方式，默认 '_blank' */
  target?: string;
  /** 链接关系属性，默认 'noopener noreferrer nofollow' */
  rel?: string;
}
```

---

### LinkPanelState (超链接面板状态)
气泡工具栏内部管理超链接面板显隐与编辑的状态模型：

```typescript
interface LinkPanelState {
  /** 面板是否开启 */
  isOpen: boolean;
  /** 当前编辑或输入的 URL 字符串 */
  url: string;
  /** 当前选区是否已附带超链接 */
  hasExistingLink: boolean;
  /** 面板定位样式（绝对定位 top/left 等） */
  style: React.CSSProperties;
}
```

---

## 2. 组件接口契约 (Component Interfaces)

### BubbleToolbarProps 变更说明
扩展 `BubbleToolbarProps` 或在 `BubbleToolbar` 内部引入 `LinkInputPanel` 组件：

```typescript
interface LinkInputPanelProps {
  /** 初始 URL */
  initialUrl?: string;
  /** 是否已有链接 */
  hasLink: boolean;
  /** 浮动样式 */
  style: React.CSSProperties;
  /** 提交保存回调 */
  onConfirm: (url: string) => void;
  /** 取消/清楚链接回调 */
  onUnlink?: () => void;
  /** 关闭面板回调 */
  onClose: () => void;
}
```

---

## 3. 校验与格式转换逻辑 (Validation & Transformation)

```typescript
/**
 * 规范化 URL 地址
 */
function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  
  // 匹配已有协议、相对路径或锚点
  if (/^(https?:\/\/|mailto:|tel:\/\/|ftp:\/\/|\/|#)/i.test(trimmed)) {
    return trimmed;
  }
  
  // 默认补全 https://
  return `https://${trimmed}`;
}
```
