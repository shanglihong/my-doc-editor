# UX 与组件交互需求规范质量检查清单 (UX Requirements Checklist)

**目的**: 校验个人知识库文档编辑器 UI/UX 交互需求规范的书写质量、完整性、清晰度与可测试性，作为 PR 代码审查与设计一致性的参考标准。
**创建时间**: 2026-08-12
**需求规范文件**: [spec.md](../spec.md)

---

## 需求完整性 (Requirement Completeness)

- [ ] CHK001 悬浮气泡工具栏（Bubble Menu）的唤起触发条件与隐藏退出的交互逻辑是否在规范中完整定义？ [Completeness, Spec §FR-003]
- [ ] CHK002 块左侧悬浮拖拽把手（Drag Handle）在嵌套容器（如 Callout 内部子块）下的显示与悬浮触发范围是否完整明确？ [Completeness, Spec §FR-012]
- [ ] CHK003 选中文本调色盘中字体前景色与背景高亮色的交互叠加规则是否完整列出？ [Completeness, Spec §FR-003]
- [ ] CHK004 斜杠菜单（`/`）在键盘方向键导航、Tab 键与 Enter 键选中的完整键盘交互规范是否已明确记载？ [Completeness, Spec §FR-002]

## 需求清晰度与无歧义性 (Requirement Clarity & Ambiguity)

- [ ] CHK005 拖拽块过程中的放置指示线是否定义了具体的线宽、视觉颜色规范及高亮延迟？ [Clarity, Spec §FR-012]
- [ ] CHK006 Callout 高亮块的“极简美观主题色板”是否提供了具体的背景色、边框色与图标色量化设计标准？ [Clarity, Spec §FR-007]
- [ ] CHK007 文本选区字号规范描述是否映射了明确的像素（px）或 rem 具体层级数值？ [Ambiguity, Spec §FR-003]
- [ ] CHK008 飞书云文档风格卡片式表格在窄屏及内容溢出情况下的横向滚动与交互规范是否清晰无歧义？ [Clarity, Spec §FR-005]

## 需求一致性 (Requirement Consistency)

- [ ] CHK009 行内代码（Inline Code）样式与独立代码块（Code Block）的视觉排版与字体规范是否保持一致？ [Consistency, Spec §FR-003, §FR-006]
- [ ] CHK010 Callout 容器内部子块的斜杠菜单唤起行为与顶层编辑器的斜杠菜单交互规范是否严格一致？ [Consistency, Spec §FR-002, §FR-007]
- [ ] CHK011 拖拽把手在不同块形态（如表格、画图块、Callout 容器）上的悬浮高度与边距计算逻辑是否一致？ [Consistency, Spec §FR-012]

## 场景与边界覆盖 (Scenario & Edge Case Coverage)

- [ ] CHK012 拖拽块过程中用户按下 Esc 键或拖出编辑器可视区域时的交互撤销与复原规范是否定义？ [Edge Case, Spec §Edge Cases]
- [ ] CHK013 多层 Callout 容器嵌套时（如达到上限 3 层）的 UI 提示与阻止插入规范是否包含？ [Edge Case, Spec §Edge Cases]
- [ ] CHK014 Excalidraw 画图块面板全屏/嵌入式编辑模式下的视口遮罩与退出交互规范是否涵盖？ [Coverage, Spec §FR-008]
- [ ] CHK015 外部富文本粘贴时的样式过滤与纯净块转换交互规范是否已予以明确？ [Coverage, Spec §Edge Cases]

## 可衡量性与可测试性 (Measurability & Testability)

- [ ] CHK016 块级拖拽重排时放置指示线动画的帧率要求（>55fps）与重排延迟（<20ms）是否可客观测量？ [Measurability, Spec §SC-005]
- [ ] CHK017 键盘输入与块切换响应延迟（<16ms）的测量方法与验收标准是否明确界定？ [Acceptance Criteria, Spec §SC-002]

---

## 检查指南与说明

- 勾选已通过质量核对的检查项：`[x]`
- 本检查清单专用于校验**需求规范本身的表达质量与完整度**，而非验证代码功能测试。
- 每一个检查项均对应 [spec.md](../spec.md) 中的具体章节或缺口标注 `[Gap]`。
