# Implementation Plan: 高亮 Block 浮动菜单与统一调色板

**Branch**: `005-highlight-block-menu-colors` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-highlight-block-menu-colors/spec.md`

## Summary

本计划旨在实现：
1. **高亮 Block 专属浮动菜单 (`CalloutBubbleMenu`)**：基于 `TableBubbleMenu` 的浮动菜单定位机制，为 Callout / 高亮块提供在选中/聚焦时弹出的悬浮菜单，支持即时设置边框颜色和背景填充颜色。
2. **重构并统一调色板体系 (`UnifiedColorPicker` & `defaultTheme.ts`)**：打通文本、表格单元格与高亮 Block 的颜色选择机制，按功能（字体颜色、背景颜色、边框颜色）及明度/饱和度色阶（浅、中、正常）统一组织调色板面板。

全流程技术决策与数据模型详见 [research.md](research.md)、[data-model.md](data-model.md)、[contracts/color-palette-contract.md](contracts/color-palette-contract.md) 与 [contracts/highlight-block-menu-contract.md](contracts/highlight-block-menu-contract.md)。

---

## Technical Context

**Language/Version**: TypeScript 5.x / React 18  
**Primary Dependencies**: @tiptap/react, @tiptap/pm/state, lucide-react  
**Storage**: Web 本地状态 / TipTap Prosemirror Node attributes  
**Testing**: Vitest / React Testing Library  
**Target Platform**: Modern Web Browsers (Chrome, Edge, Safari, Firefox)  
**Project Type**: Web Application (React Frontend Component Library)  
**Performance Goals**: 浮动菜单响应延迟 < 100ms，调色板色块切换无明显渲染帧率下降 (60 fps)  
**Constraints**: 避免产生被视口裁剪的浮层，遵从暗/亮模式下的 WCAG 2.1 AA 对比度要求  
**Scale/Scope**: 覆盖编辑器内文本颜色、高亮背景、表格单元格背景、高亮 Block 4 大场景的颜色管理  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 宪章原则 | 评估状态 | 说明 |
|---|---|---|
| **原则一：代码质量至上** | 通过 | 提取复用通用 `UnifiedColorPicker` 组件与定位逻辑，避免重复编写样式和定位计算，保持 KISS/DRY 原则。 |
| **原则二：严格测试标准** | 通过 | 针对 `CalloutBubbleMenu` 与 `UnifiedColorPicker` 编写完备的自动化单元测试与交互测试。 |
| **原则三：用户体验一致性** | 通过 | `CalloutBubbleMenu` 与既有 `TableBubbleMenu` 保持 100% 视觉风格、阴影、防遮挡与交互一致；调色板跨组件统一。 |
| **原则四：高性能与高响应性** | 通过 | 浮动定位使用原生 DOM Rect 计算，不额外增加复杂动画重绘开销。 |
| **原则五：架构简洁性与演进** | 通过 | 色彩体系通过 JSON/TypeScript 类型规范收拢在 `defaultTheme.ts` 中，无新增过度架构。 |
| **原则六：中文文档规范** | 通过 | 需求 Spec、方案 Plan、研发研究 Research、数据模型与契约等文档全流程统一使用中文撰写。 |

---

## Project Structure

### Documentation (this feature)

```text
specs/005-highlight-block-menu-colors/
├── spec.md              # 需求规格说明书
├── plan.md              # 实施计划 (本文件)
├── research.md          # 技术调研与决策总结
├── data-model.md        # 数据结构与组件模型规范
├── quickstart.md        # 本地验证与测试指南
├── contracts/           # UI 组件接口契约
│   ├── color-palette-contract.md
│   └── highlight-block-menu-contract.md
└── checklists/
    └── requirements.md  # 需求质量检查清单
```

### Source Code (repository root)

```text
frontend/src/components/DocEditor/
├── components/
│   ├── BubbleToolbar/           # 选中文本浮动工具栏 (升级颜色选择)
│   ├── Callout/                 # 高亮 Block 组件
│   │   ├── CalloutBubbleMenu.tsx # [NEW] 高亮块专属浮动操作菜单
│   │   ├── CalloutIconPicker.tsx
│   │   └── CalloutView.tsx      # 渲染高亮块内容
│   ├── ColorPicker/             # [NEW] 统一调色板组件库
│   │   ├── UnifiedColorPicker.tsx
│   │   └── UnifiedColorPicker.module.css
│   └── TableBubbleMenu/         # 表格浮动菜单 (升级背景油漆桶)
│       └── index.tsx
├── utils/
│   ├── defaultTheme.ts          # [MODIFY] 统一三级色调体系配置
│   └── floatingPosition.ts      # 浮动菜单智能定位工具
└── index.tsx                    # [MODIFY] 编辑器主组件挂载 CalloutBubbleMenu
```

**Structure Decision**: 采用 Web 应用前端模块化结构（`frontend/src/components/DocEditor/`），在 `components/` 下新建 `ColorPicker/` 保存通用的统一调色板组件，在 `components/Callout/` 下新建 `CalloutBubbleMenu.tsx` 处理高亮块的悬浮菜单。

---

## Complexity Tracking

> **宪章合规评估：无违规项，无需复杂性追踪。**
