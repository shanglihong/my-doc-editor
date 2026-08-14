# Quickstart & Verification Guide: 重构验证指南

## 1. 静态构建与类型检查验证 (Static Analysis)

在完成代码移动与 CSS 拆分后，首先验证 TypeScript 路径解析与类型正确性。

```bash
cd frontend
npm run type-check # 或 npx tsc --noEmit
```

**预期结果**：
- 编译通过，无丢失导出、找不到路径或 CSS Module 无法解析等错误。

---

## 2. 自动化测试套件校验 (Automated Testing)

运行 DocEditor 的自动化单元测试与集成测试，验证重构后组件渲染与逻辑无退化。

```bash
cd frontend
npm run test -- src/components/DocEditor
```

**预期结果**：
- 所有单元测试用例（包括 `__tests__` 中的组件与插件测试）100% 通过。

---

## 3. 本地 UI 渲染与功能手动校验 (Manual UI Verification)

启动开发服务器进行实时交互验证：

```bash
make dev
```

在浏览器中打开前端应用，依次校验：
1. **图片块 (ImageBlock)**：
   - 插入图片，验证图片显示、对齐（左、中、右）及宽度手柄拖拽调整功能是否正常。
   - 检查图片对齐工具栏及样式是否有走样。
2. **呼出块 (Callout)**：
   - 插入呼出块，验证高亮边框、背景色及图标更改功能。
3. ** DrawIO & 代码块 (DrawIO & CodeBlock)**：
   - 校验图表全屏按钮与代码块工具栏显示无样式异常。
4. **工具栏与浮动菜单 (Toolbars & Menus)**：
   - 输入 `/` 弹出菜单，选中文本弹出 BubbleToolbar，移动光标显示 UnifiedBlockToolbar，检查样式样式对齐。
