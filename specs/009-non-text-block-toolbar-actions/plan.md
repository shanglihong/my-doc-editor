# Implementation Plan: Non-Text Block Floating Toolbar Actions & Styling

**Branch**: `009-non-text-block-toolbar-actions` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/009-non-text-block-toolbar-actions/spec.md`

## Summary

实现图片、代码块、DrawIO/图标等非文本 Block 悬浮工具栏的功能增强与样式保留：
1. 所有非文本 Block 统一采用 selected 选中时浮动在 Block 上方的悬浮工具栏 (Floating Bubble Toolbar)，不侵入或改变代码块等原生的内部 Header/容器样式。
2. 在悬浮工具栏增加聚合的“插入块”下拉按钮，支持点击展开“在上方插入”和“在下方插入”菜单项，在 Block 上方或下方无缝插入空白段落块。
3. 整合视口防遮挡定位 (`calculateSubMenuPosition`)，并建立工具栏下拉菜单间的互斥呈现控制。

## Technical Context

**Language/Version**: TypeScript 5.x, React 18  
**Primary Dependencies**: @tiptap/react, lucide-react, CSS Modules  
**Storage**: N/A  
**Testing**: Vitest, React Testing Library (`npm run test`)  
**Target Platform**: Web Modern Browsers (Chrome, Safari, Firefox, Edge)  
**Project Type**: Web Application Frontend (DocEditor Component)  
**Performance Goals**: 菜单响应延迟 < 16ms, 视口计算避让流畅无卡顿  
**Constraints**: 避免硬编码样式，所有设计符合项目 CSS 规范与全中文文档/代码注释要求，保留代码块原生样式  
**Scale/Scope**: 涉及 ImageBlock, CodeBlock, DrawIOView 三类非文本 Block 及相关悬浮组件  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **原则一：代码质量至上** - 通过抽取通用下拉菜单与块插入函数 `insertParagraphBlockAround` 避免重复代码，保持低耦合高可内聚。
- [x] **原则二：严格测试标准** - 为块插入逻辑与工具栏渲染编写单元测试。
- [x] **原则三：用户体验一致性** - 悬浮工具栏视觉效果100%统一，保持代码块内部原生外观不变，防遮挡与互斥体验流畅。
- [x] **原则四：高性能与高响应性** - 位置测算基于原生 `DOMRect` 极速运算，无阻塞卡顿。
- [x] **原则五：架构简洁性** - 不引入多余第三方重型 UI 库，使用原生 React 状态与已有悬浮避让算法。
- [x] **原则六：规范与文档中文表达** - 规格说明、方案、任务及注释全中文撰写。

## Project Structure

### Documentation (this feature)

```text
specs/009-non-text-block-toolbar-actions/
├── plan.md              # 本实施计划文件
├── research.md          # 技术调研与方案决策
├── data-model.md        # 数据模型与组件 Spec
├── quickstart.md        # 快速验证指南
├── contracts/           # 接口规范与契约
│   └── toolbar-api.md
└── checklists/
    └── requirements.md  # 规格说明质量检查清单
```

### Source Code Layout

```text
frontend/src/components/DocEditor/
├── components/
│   ├── NonTextBlockToolbar/            # 共享非文本悬浮工具栏组件与公共工具类
│   │   ├── InsertBlockDropdown.tsx     # 聚合“插入空白块”下拉菜单按钮
│   │   └── NonTextBlockToolbar.module.css # 统一悬浮工具栏视觉 Token
│   ├── CodeBlock/
│   │   └── CodeBlockComponent.tsx      # 保持原生 Header 样式，selected 时在上层渲染悬浮工具栏
│   ├── DrawIO/
│   │   └── DrawIOView.tsx              # 渲染顶部悬浮工具栏
│   └── Callout/                        # 防遮挡实现参考
├── extensions/
│   └── ImageBlock/
│       ├── ImageBubbleMenu.tsx         # 选中时浮动在图片上方
│       └── ImageBubbleMenu.module.css  # 规范悬浮样式类
└── utils/
    ├── blockInsertion.ts               # 统一 TipTap 块插入辅助工具函数
    └── floatingPosition.ts             # 视口防遮挡定位算子
```

**Structure Decision**: 保持在 `DocEditor/components/NonTextBlockToolbar` 下维护共享逻辑，在 Block 被选中时于层级顶端渲染悬浮工具栏，保留代码块自带容器样式。

## Complexity Tracking

> 本项目未违反宪章原则，无需复杂性补偿登记。
