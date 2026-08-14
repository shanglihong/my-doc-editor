# Interface Contracts: Non-Text Block Toolbar Actions & Unified Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`  
**Spec**: [spec.md](../spec.md) | **Data Model**: [data-model.md](../data-model.md)

## Interface Specifications

### 1. Block Insertion Action Contract (`insertBlockAt`)

定义非文本 Block 工具栏触发插入空白段落块的标准操作函数接口。

```typescript
export interface InsertBlockParams {
  editor: Editor;
  pos: number;
  direction: 'above' | 'below';
  nodeSize: number;
}

/**
  在指定节点的上方或下方插入一个新的空白段落块并自动获取焦点
 */
export function insertParagraphBlockAround({
  editor,
  pos,
  direction,
  nodeSize,
}: InsertBlockParams): boolean {
  if (!editor) return false;

  const insertPos = direction === 'above' ? pos : pos + nodeSize;

  return editor
    .chain()
    .focus()
    .insertContentAt(insertPos, { type: 'paragraph' })
    .run();
}
```

---

### 2. InsertBlockMenu Component Interface (`InsertBlockMenu`)

可复用的“插入空白块”下拉按钮组件接口规范。

```typescript
export interface InsertBlockMenuProps {
  editor: Editor;
  getPos: () => number;
  nodeSize: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}
```

---

### 3. Non-Text Block Toolbar Common Utility CSS Classes (`NonTextToolbar.module.css`)

统一公共样式类规格契约：

```css
.toolbarContainer {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.iconBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.iconBtn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.iconBtnActive {
  background-color: #e5e7eb;
  color: #111827;
}

.dropdownMenu {
  position: absolute;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 140px;
}

.dropdownItem {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  text-align: left;
}

.dropdownItem:hover {
  background-color: #f3f4f6;
  color: #111827;
}
```
