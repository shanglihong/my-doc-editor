# 实施计划：文本选中菜单栏超链接处理 (Text Selection Hyperlink)

**Branch**: `011-text-selection-hyperlink` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: 来自 [spec.md](spec.md) 的需求规范："在文本选中的菜单栏增超链接处理"

## 概要 (Summary)

在文本选中的浮动工具栏（`BubbleToolbar`）中引入 `@tiptap/extension-link` 扩展，并新增内联超链接交互面板 `LinkInputPanel`。支持在选中文本上快速添加超链接、已附带链接属性的回显与编辑、一键取消链接（Unlink）、URL 自动规范化补全（自动追加 `https://` 协议前缀）以及新标签页预览功能。同时提供视口防遮挡边界防护与 `Mod+K` 快捷键调起逻辑。

## 技术上下文 (Technical Context)

**Language/Version**: TypeScript 5.x, React 19.x  
**Primary Dependencies**: `@tiptap/react`, `@tiptap/extension-link`, `lucide-react`  
**Storage**: N/A (编辑器内存状态，随文档 Schema 持久化)  
**Testing**: Vitest, `@testing-library/react`  
**Target Platform**: 现代 Web 浏览器 (Chrome, Safari, Firefox, Edge)  
**Project Type**: React 富文本编辑器组件 (Web Application Frontend)  
**Performance Goals**: 菜单弹窗展开响应时间 < 16ms，选区计算不导致页面卡顿  
**Constraints**: 遵循宪章中 UX 一致性与微交互规范，弹窗具备防越界定位逻辑

## 宪章检查 (Constitution Check)

- **原则一 (代码质量至上)**: 保持组件内聚，独立抽取 `LinkInputPanel` 与 URL 规范化工具，避免在 `BubbleToolbar` 中混杂复杂逻辑。
- **原则二 (严格测试标准)**: 为 URL 格式化逻辑及链接添加/修改/移除命令编写自动化单元测试。
- **原则三 (用户体验一致性)**: 保持浮动面板、高亮按钮样式与现有 ColorPicker、FontSizePicker 风格高度一致。
- **原则六 (规范与文档中文表达)**: 方案设计、交互逻辑说明与架构设计文件全中文撰写。

## 项目结构 (Project Structure)

### 需求与设计文档

```text
specs/011-text-selection-hyperlink/
├── spec.md              # 需求规范
├── plan.md              # 本实施计划文件
├── research.md          # 技术调研与决策记录
├── data-model.md        # 数据模型与状态定义
├── quickstart.md        # 快速验证指南
└── contracts/
    └── link-toolbar-contract.md  # 组件与命令交互契约
```

### 源代码目录布局

```text
frontend/src/components/DocEditor/
├── index.tsx                         # 注册 @tiptap/extension-link
├── components/
│   ├── BubbleToolbar/
│   │   ├── index.tsx                 # 引入超链接按钮与面板状态控制
│   │   └── LinkInputPanel.tsx        # [NEW] 超链接输入/编辑/取消浮动面板
│   └── ...
├── utils/
│   └── urlUtils.ts                   # [NEW] URL 规范化与格式校验工具函数
└── __tests__/
    ├── urlUtils.test.ts              # [NEW] URL 校验逻辑单测
    └── BubbleToolbarLink.test.tsx    # [NEW] 超链接菜单集成测试
```

**结构决策**: 在 `BubbleToolbar` 组件目录内新增 `LinkInputPanel.tsx` 以维持 UI 组件模块内聚，同时在 `utils/` 中抽离无状态的 `urlUtils.ts` 以提升复用性与单测便利性。

## 复杂度跟踪 (Complexity Tracking)

*无违背宪章原则的特殊复杂度引入。*
