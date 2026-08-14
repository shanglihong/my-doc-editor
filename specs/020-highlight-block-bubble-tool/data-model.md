# Data Model & State Specifications: Highlighting Block Bubble Tool Support

## State & Entities

### 1. ActiveToolbarInfo

统一调度算子返回的活动工具栏状态实体。

```typescript
export type ToolbarType = 'text' | 'table' | 'callout' | 'image' | 'codeBlock' | 'drawio' | 'default' | null;

export interface ActiveToolbarInfo {
  type: ToolbarType;
  depth: number;
  target?: HoverTarget | null;
}
```

#### Selection vs Hover Priority Rule Matrix

| Selection State | Hover Stack State | activeToolbar.type | Floating Menu Shown |
|---|---|---|---|
| TextSelection (non-empty) in Callout | Callout Hovered | `text` | BubbleToolbar (Text Formatting) |
| TextSelection (empty) in Callout | Callout Hovered | `callout` | CalloutBubbleMenu (Block Theme/Color) |
| NodeSelection (Image/DrawIO) | Callout Hovered | `image` / `drawio` | Image/DrawIO Bubble Menu |
| TextSelection (empty) outside | No Hover | `null` | None |

### 2. Highlighting Block (Callout) Node Structure

高亮块节点在 ProseMirror / TipTap 中的数据结构说明（只读说明，非代码变更）：

```json
{
  "type": "callout",
  "attrs": {
    "icon": "Lightbulb",
    "themeColor": "blue",
    "backgroundColor": "#eff6ff",
    "borderColor": "#bfdbfe"
  },
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "高亮块内部的文本内容"
        }
      ]
    }
  ]
}
```
