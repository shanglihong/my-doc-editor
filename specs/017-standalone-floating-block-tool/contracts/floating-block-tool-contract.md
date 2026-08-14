# FloatingBlockTool 组件契约接口规范

**Feature**: Standalone Floating Block Tool (017-standalone-floating-block-tool)
**Component Path**: [frontend/src/components/DocEditor/components/FloatingBlockTool](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool)

## 1. 契约组件导出 (Component API)

```tsx
import React from 'react';
import type { Editor } from '@tiptap/react';

export interface FloatingBlockToolProps {
  /** TipTap 编辑器对象实例 */
  editor: Editor | null;
  /** 目标非文本块节点类型 */
  blockType: string;
  /** 外部传入的拖拽激活状态 */
  isDragging?: boolean;
  /** 外部传入的块切换菜单激活状态 */
  isTypeMenuOpen?: boolean;
  /** 自定义块删除回调，默认删除当前 Block 节点 */
  onDeleteBlock?: () => void;
  /** 是否隐藏内置的块类型切换下拉菜单 */
  hideTypeDropdown?: boolean;
  /** 定制按钮内容，注入到 Block Tool 右侧扩展区域 */
  children?: React.ReactNode;
}

export const FloatingBlockTool: React.FC<FloatingBlockToolProps>;
```

## 2. 定制插槽使用示例 (Usage Examples)

### 高亮块 (Callout Block) 对接示例

```tsx
<FloatingBlockTool
  editor={editor}
  blockType="callout"
  isDragging={isDragging}
  isTypeMenuOpen={isTypeMenuOpen}
  onDeleteBlock={handleDeleteCallout}
>
  <ThemePickerButton onSelectTheme={handleSelectTheme} />
  <ColorPickerButton category="borderColor" currentColor={currentBorder} onSelectColor={handleSetBorderColor} />
  <ColorPickerButton category="backgroundColor" currentColor={currentBg} onSelectColor={handleSetBgColor} />
</FloatingBlockTool>
```

### 代码块 (Code Block) 对接示例

```tsx
<FloatingBlockTool
  editor={editor}
  blockType="codeBlock"
  isDragging={isDragging}
  isTypeMenuOpen={isTypeMenuOpen}
>
  <LanguageSelect value={currentLanguage} onChange={handleLanguageChange} />
  <CopyCodeButton codeText={codeText} />
</FloatingBlockTool>
```

### 图片块 (Image Block) 对接示例

```tsx
<FloatingBlockTool
  editor={editor}
  blockType="image"
  isDragging={isDragging}
  isTypeMenuOpen={isTypeMenuOpen}
>
  <AlignButtons currentAlign={align} onAlignChange={handleAlignChange} />
  <ReplaceImageButton onReplace={handleReplaceImage} />
</FloatingBlockTool>
```
