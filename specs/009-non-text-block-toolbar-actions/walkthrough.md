# Walkthrough: Non-Text Block Toolbar Actions & Unified Floating Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Tasks**: [tasks.md](tasks.md)

## 工作完成总结

已全量完成非文本 Block（图片、代码块、DrawIO 架构图）悬浮工具栏功能增强，并严格落实**专注原则**（全编辑器同一时刻仅展示一个活动菜单/工具栏，且键盘输入时全量收起）：

1. **专注原则与全局互斥体系**:
   - **键盘输入全量避让**: 在 [DocEditor/index.tsx](../../frontend/src/components/DocEditor/index.tsx) 中增加 `handleDOMEvents.keydown` 与全局 `keydown` 监听器，一旦用户触发任何键盘输入动作，广播 `HIDE_ALL_FLOATING_MENUS` 事件，全量收起所有的悬浮工具栏、气泡菜单、调色板与下拉面板。
   - **全局工具栏互斥**: 在 [InsertBlockDropdown.tsx](../../frontend/src/components/DocEditor/components/NonTextBlockToolbar/InsertBlockDropdown.tsx)、[CodeBlockComponent.tsx](../../frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx)、[DrawIOView.tsx](../../frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx)、[ImageBlockView.tsx](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx) 与 [CalloutBubbleMenu.tsx](../../frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx) 中集成全局菜单隐退机制，确保整个编辑器界面内同一时间仅保持最多一个悬浮工具栏。
   - **内嵌工具栏互斥**: 工具栏内部展开一个下拉框（如“插入空白块”）时自动关闭该工具栏内的其他面板。

2. **符合 Callout 规范的悬浮工具栏设计**:
   - **水平居中**: 悬浮工具栏居中摆放于 Block 上方：`left: 50%; transform: translateX(-50%); top: -40px;`。
   - **纯图标按钮**: 纯 Icon 按钮（编辑 `Edit3`、插入 `Plus`、描述 `Tag`、转存 `Download`、删除 `Trash2`）。
   - **300ms 延迟消失**: 鼠标离开 Block 容器时增加 300ms 延迟判定，避免误移导致工具栏闪退。

---

## 验证与测试结果

- **单元测试**: `npm run test` 12 个测试文件、39 个测试用例全量通过。
- **构建校验**: `npm run build` Vite 与 TypeScript 编译通过，0 错误。
- **键盘避让实测**: 键盘输入字符或方向键时，浮动工具栏与下拉面板瞬时隐藏，专注输入体验顺畅。
