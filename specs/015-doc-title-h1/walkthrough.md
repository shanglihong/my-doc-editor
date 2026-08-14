# 实现复盘与验证报告: DocEditor 内置 H1 文档标题

## 变更概述

为了满足 DocEditor 组件内置固定文档标题的需求，本次改动改造了编辑器的 Schema 架构，并完成了相关的按键拦截与交互过滤防护。

### 新增与修改的文件

1. [`frontend/src/components/DocEditor/extensions/DocumentTitleExtension.ts`](../../frontend/src/components/DocEditor/extensions/DocumentTitleExtension.ts) [NEW]
   - 重定义 Root Schema (`doc: 'title block+'`)，强制文档第一个节点固定为 `title`。
2. [`frontend/src/components/DocEditor/extensions/TitleExtension.ts`](../../frontend/src/components/DocEditor/extensions/TitleExtension.ts) [NEW]
   - 定义 `title` 节点的 H1 节点渲染规则与键盘快捷键逻辑（`Enter` 换行跳跃、`Backspace` 首字符防删拦截）。
3. [`frontend/src/components/DocEditor/DocEditor.module.css`](../../frontend/src/components/DocEditor/DocEditor.module.css) [MODIFY]
   - 添加 `h1.doc-title-node` 专属标题 CSS 视觉样式及占位符提示样式。
4. [`frontend/src/components/DocEditor/types.ts`](../../frontend/src/components/DocEditor/types.ts) [MODIFY]
   - 扩展 `DocEditorProps` (`titlePlaceholder`, `onTitleChange`) 和 `DocEditorRef` (`getTitle`, `setTitle`)。
5. [`frontend/src/components/DocEditor/index.tsx`](../../frontend/src/components/DocEditor/index.tsx) [MODIFY]
   - 注册 Title 扩展节点，配置动态占位符，暴露 Ref 接口以及更新 `onUpdate` 触发标题变更通知。
6. [`frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts`](../../frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts) [MODIFY]
   - 识别 `title` 节点，自动屏蔽标题区的拖拽手柄显示。
7. [`frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx`](../../frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) [MODIFY]
   - 当目标节点为 `title` 时避免渲染块类型转换与删除菜单。
8. [`frontend/src/components/DocEditor/__tests__/DocEditorTitle.test.tsx`](../../frontend/src/components/DocEditor/__tests__/DocEditorTitle.test.tsx) [NEW]
   - 编写单元测试集合验证 Schema 定义、退格拦截、Enter 跳转与 Ref 接口。

---

## 验证结果

### 自动化测试执行

运行 Vitest 测试套件：

```bash
cd frontend && npm run test DocEditor
```

**测试输出**:
- Test Files: 11 passed (11)
- Tests: 33 passed (33)
- 包含 `DocEditorTitle.test.tsx` 在内的所有测试 100% 通过。
