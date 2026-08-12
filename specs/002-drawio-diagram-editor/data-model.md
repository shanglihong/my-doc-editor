# Data Model: draw.io 图表组件

## 实体与数据结构

### 1. DrawIO Block Node Attributes (DrawIO 节点属性模型)

表示在 TipTap 富文本文档模型中 `drawioBlock` 节点存储的持久化数据结构。

```typescript
interface DrawIOBlockAttrs {
  /**
   * draw.io 标准图表 XML 数据（压缩或未压缩的字符串）
   */
  xml: string;

  /**
   * 导出的矢量预览 SVG 字符串，用于在文档中快速静态渲染
   */
  svg: string;

  /**
   * 图表在文档布局中的对齐方式
   * @default 'center'
   */
  alignment: 'left' | 'center' | 'right';

  /**
   * 图表在预览区的自定义显示宽度（例如 '100%' 或 '600px'）
   */
  width?: string;

  /**
   * 图表在预览区的自定义显示高度
   */
  height?: string;
}
```

---

### 2. TipTap Schema 节点定义 (Node Specification)

```typescript
const DrawIONodeSpec = {
  name: 'drawioBlock',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true, // 视为不可分割的原子块节点

  addAttributes() {
    return {
      xml: {
        default: '',
      },
      svg: {
        default: '',
      },
      alignment: {
        default: 'center',
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      },
    };
  },
};
```

---

### 3. 编辑器与 iframe 交互状态模型 (Modal State Model)

控制 draw.io 全屏弹窗组件在编辑期间的运行时状态。

```typescript
interface DrawIOModalState {
  /**
   * 弹窗是否显示
   */
  isOpen: boolean;

  /**
   * 当前正在编辑的 TipTap Node 在文档中的位置 (getPos)
   */
  nodePos: number | null;

  /**
   * 传入 draw.io 编辑器的初始 XML 数据
   */
  initialXml: string;

  /**
   * 编辑器 iframe 是否准备就绪 (接收到 init 事件)
   */
  isReady: boolean;
}
```

---

## 校验规则 (Validation Rules)

1. **XML 校验**：保存时传入的 `xml` 属性必须为有效非空字符串。若用户清空图表后退出，保存空图表或保持上次保存的状态。
2. **SVG 安全清洗与校验**：生成的 `svg` 预览字符串需保证标签完整，仅包含矢量绘制代码，且防止脚本注入。
3. **节点拖拽与选中**：`atom: true` 保证该节点在 TipTap 中按整体单元选中、复制、剪切或删除。
