# Quickstart & Verification Guide: 高亮 Block 浮动菜单与统一调色板

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## 本地开发与手动验证流程

### 前置条件
确保开发服务器已启动：
```bash
make dev
# 或
npm --prefix frontend run dev
```
在浏览器访问: `http://localhost:5173/`

---

### 验证场景 1：高亮 Block 专属浮动菜单显示与防遮挡

1. 在编辑器中输入 `/callout` 或点击块选择菜单插入一个高亮 Block（Callout）。
2. 点击高亮 Block 内部的任意文本区域。
3. **预期结果**：
   - 高亮 Block 正上方（或空间不够时自动在正下方）浮现操作菜单。
   - 菜单风格与表格浮动菜单（TableBubbleMenu）保持一致（包含阴影、圆角、分割线）。
4. 滚动页面或在表格内插入高亮 Block，验证菜单浮动位置跟随与边界翻转能力。

---

### 验证场景 2：设置高亮 Block 的边框颜色与填充颜色

1. 点击高亮 Block 浮动菜单中的“边框颜色”选择图标。
2. 弹出 `UnifiedColorPicker`，切换到“边框颜色”分类。
3. 依次选择“浅蓝”、“中等蓝”、“深蓝”。
4. **预期结果**：高亮 Block 的边框颜色即时渲染为对应的蓝阶色值。
5. 点击浮动菜单中的“背景颜色”选择图标，在调色板中选择“浅绿”。
6. **预期结果**：高亮 Block 的背景底色即时变为柔和的浅绿背景。

---

### 3. 验证场景 3：统一调色板的三级明度分类

1. 分别打开：
   - 选中文本时的文本颜色/高亮背景面板 (BubbleToolbar)
   - 表格单元格的背景油漆桶面板 (TableBubbleMenu)
   - 高亮 Block 的颜色面板 (CalloutBubbleMenu)
2. **预期结果**：
   - 三者打开的颜色面板布局高度统一。
   - 颜色按“字体颜色”、“背景颜色”、“边框颜色”进行分类。
   - 每种色系均提供“浅”、“中”、“正常”三个梯度的直观配色展示。

---

### 4. 自动化测试验证

运行编辑器组件相关的单元测试：
```bash
npm --prefix frontend run test -- --filter=DocEditor
```
验证所有测试用例 pass 且无 regression 错误。
