# Walkthrough: 内嵌 Block 交互优化与空白 Block 双击插入

**Feature Branch**: `008-nested-block-interaction`
**Date**: 2026-08-14
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Tasks**: [tasks.md](tasks.md)

## 变更摘要

针对内嵌 Block 交互重叠、双击空白快速追加 Block 以及高亮块悬浮菜单显示与防闪退的需求，已全面完成代码实现与自动化测试校验：

1. **块间与块下方双击插入空白 Block (`DoubleTapInsertPlugin`)**
   - 创建了 [DoubleTapInsertPlugin.ts](../../frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts) 扩展。
   - 精准区分标准文本选词双击与空白处双击。在 Block 下方、块间缝隙或容器底端双击时，通过 ProseMirror 事务向目标位置插入空白 `paragraph` 节点，并自动定位光标焦点。

2. **工具菜单栏优先与互斥展示 (`toolbarPriority.ts`)**
   - 创建了 [toolbarPriority.ts](../../frontend/src/components/DocEditor/utils/toolbarPriority.ts) 调度模块，提供 `getActiveToolbarInfo` 函数。
   - 遍历选区祖先节点树并按 `depth` 挑选唯一活菜单类型（`text` / `table` / `callout` / `image`）。
   - 在 [BubbleToolbar](../../frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)、[TableBubbleMenu](../../frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)、[CalloutBubbleMenu](../../frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx) 以及 [ImageBlockView](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx) 中接入调度函数，实现菜单栏的显隐互斥。

3. **高亮块 Callout 悬浮即现、防闪退与相邻平滑切换**
   - 在 [CalloutView.tsx](../../frontend/src/components/DocEditor/components/Callout/CalloutView.tsx) 中增加了 `onMouseEnter` / `onMouseLeave` 悬浮监听与 `CALLOUT_HOVER_CHANGE` 全局事件派发。
   - 在 [CalloutBubbleMenu.tsx](../../frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx) 中引入 300ms 悬浮防抖（Hide Delay Timer）机制与子弹窗保活判定：
     - 当鼠标从高亮块向悬浮菜单划过、或在两个相邻高亮块间快速移动时，300ms 缓冲区确保菜单不会因瞬时 `mouseleave` 而消失。
     - 当鼠标移入菜单本身或子弹窗（颜色选择器/预设主题）打开时，自动取消隐藏定时器，保证可顺畅点击菜单项。

---

## 验证与测试结果

### 自动化单元测试

运行命令：
```bash
npm run test
```

测试结果：
```text
 Test Files  11 passed (11)
      Tests  35 passed (35)
```

包含新增的单元测试文件：
- [toolbarPriority.test.ts](../../frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts) （7 项测试全部通过）
- [DoubleTapInsertPlugin.test.ts](../../frontend/src/components/DocEditor/__tests__/DoubleTapInsertPlugin.test.ts) （3 项测试全部通过）

---

## 依赖修改文件清单

- `[NEW]` [toolbarPriority.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/utils/toolbarPriority.ts)
- `[NEW]` [DoubleTapInsertPlugin.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts)
- `[NEW]` [toolbarPriority.test.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts)
- `[NEW]` [DoubleTapInsertPlugin.test.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/__tests__/DoubleTapInsertPlugin.test.ts)
- `[MODIFY]` [DocEditor/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/index.tsx)
- `[MODIFY]` [BubbleToolbar/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)
- `[MODIFY]` [TableBubbleMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)
- `[MODIFY]` [CalloutBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)
- `[MODIFY]` [CalloutView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/Callout/CalloutView.tsx)
- `[MODIFY]` [ImageBlockView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx)
- `[MODIFY]` [tasks.md](file:///Users/qiao.liu/Documents/my-docs/specs/008-nested-block-interaction/tasks.md)
