# Implementation Plan: 统一工具栏菜单管理

**Branch**: `010-unified-toolbar-menu` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [spec.md](spec.md)

## Summary

统一编辑器中所有 Block 工具栏菜单的管理与交互模式。固定工具栏左侧为“插入空白 Block”与“删除 Block”通用按钮，右侧开放各 Block 组件的自定制操作项；将工具栏触发逻辑与组件点击解耦，完全由鼠标悬停（mouseenter）与离开（mouseleave）驱动；建立全局单例工具栏状态与深层嵌套优先级调度算法，确保任何时刻页面只存在唯一活动工具栏，且在嵌套场景下优先展示最具体的内嵌组件工具栏。

## Technical Context

**Language/Version**: TypeScript / React 18
**Primary Dependencies**: Tiptap Editor (React & Core), ProseMirror
**Storage**: Client-side state / Local Memory
**Testing**: Vitest / React Testing Library
**Target Platform**: Modern Web Browsers (Chrome, Edge, Safari, Firefox)
**Project Type**: Web Application Component (Rich Text Editor)
**Performance Goals**: 悬停响应时间 < 100ms，切换互斥过渡帧率 60fps，零多菜单并存异常
**Constraints**: 绝不依赖点击选区 (Selection) 触发 Block 工具栏；严格遵循统一外观与通用按钮架构
**Scale/Scope**: 覆盖 Table, Callout, ImageBlock, CodeBlock, DrawIO 等已有及未来扩展的全部 Block 组件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **原则一：代码质量至上**: 抽离 `<UnifiedBlockToolbar />` 容器组件与 `toolbarHoverManager` 全局管理器，消除各 Block 零散、重复的工具栏与事件绑定逻辑。
- [x] **原则二：严格测试标准**: 针对 `toolbarPriority` 调度算子与 `<UnifiedBlockToolbar />` 组件编写完整的单测与集成测试。
- [x] **原则三：用户体验一致性**: 统一左侧“插入/删除”交互排版与 Hover 显隐过渡效果，保证整洁一致的编辑体验。
- [x] **原则四：高性能与高响应性**: 基于事件监听与防抖处理（150ms 延迟判定），无频繁全量重绘或阻塞耗时计算。
- [x] **原则五：架构简洁性与演进**: 采用清晰的层次结构，保留自定制插槽扩展能力。
- [x] **原则六：规范与文档中文表达**: Plan 及关联设计文档均使用中文编写。

## Project Structure

### Documentation (this feature)

```text
specs/010-unified-toolbar-menu/
├── spec.md              # 需求规范
├── plan.md              # 实施计划方案 (本文件)
├── research.md          # 选型与技术研究 (Phase 0)
├── data-model.md        # 状态与数据模型 (Phase 1)
├── quickstart.md        # 快速验证指南 (Phase 1)
├── contracts/           # 组件与接口契约 (Phase 1)
│   └── toolbar-component-contract.md
└── checklists/
    └── requirements.md  # 规范质量检查表
```

### Source Code (repository root)

```text
frontend/src/components/DocEditor/
├── components/
│   ├── UnifiedBlockToolbar/              # [NEW] 统一工具栏封装容器
│   │   ├── UnifiedBlockToolbar.tsx
│   │   ├── UnifiedBlockToolbar.module.css
│   │   └── index.ts
│   ├── TableBubbleMenu/                  # [MODIFY] 整合统一工具栏，移除点击触发
│   ├── Callout/                          # [MODIFY] 整合统一工具栏，优化悬停互斥
│   ├── CodeBlock/                        # [MODIFY] 整合统一工具栏
│   ├── DrawIO/                           # [MODIFY] 整合统一工具栏
│   └── NonTextBlockToolbar/              # [MODIFY] 抽离插入空白/删除逻辑
├── extensions/
│   └── ImageBlock/                       # [MODIFY] 整合统一工具栏，移除点击依赖
├── utils/
│   └── toolbarPriority.ts                # [MODIFY] 全局悬停优先调度算法升级
└── __tests__/
    ├── toolbarPriority.test.ts           # [MODIFY] 增加嵌套互斥与 Hover 调度测试
    └── UnifiedBlockToolbar.test.tsx      # [NEW] 统一工具栏组件单元测试
```

**Structure Decision**: 采用前端单一组件库目录划分，新增 `components/UnifiedBlockToolbar` 核心容器，并对各 Block 的视图层组件实施规范重构。

## Complexity Tracking

*No violations detected.*
