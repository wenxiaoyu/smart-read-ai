# Change: 智阅AI UI Demo 原型

## Why

在开发完整功能之前，需要先构建一个高保真的 UI Demo 来：
1. **验证交互体验** - 确保划词工具栏、注入式 UI 等核心交互符合预期
2. **快速迭代设计** - UI 层面的调整成本远低于功能实现后的调整
3. **获取早期反馈** - 让团队和潜在用户提前体验产品形态
4. **降低开发风险** - 确认技术方案可行性（Shadow DOM、样式隔离等）

Demo 采用"UI 完整、逻辑留白"的策略：
- ✅ UI 体验与真实产品无差异
- ✅ 所有交互动画、过渡效果完整
- ✅ 响应式设计、暗黑模式支持
- ⏸️ AI 解析逻辑使用 Mock 数据
- ⏸️ 数据存储使用内存模拟
- ⏸️ API 调用使用假数据

## What Changes

创建一个完整的 UI Demo，包含：

### 核心 UI 组件
1. **划词工具栏** - 选中文本后弹出的浮动工具栏
   - 简化、解释、复制按钮
   - 平滑动画、智能定位
   - 响应式尺寸

2. **注入式结果展示** - AI 解析结果的展示卡片
   - Shadow DOM 样式隔离
   - 展开/收起动画
   - 复制、收藏操作
   - 加载状态、错误状态

3. **Popup 弹窗** - 插件图标点击后的弹窗
   - 知识检索入口
   - Token 使用统计
   - 快速设置

4. **Options 设置页** - 完整的设置页面
   - API 密钥配置
   - 模型选择
   - 主题切换
   - 数据管理

### Mock 数据层
- 模拟 AI 解析结果（延迟 1-2 秒）
- 模拟知识节点数据
- 模拟 Token 统计数据

### 技术验证
- Shadow DOM 样式隔离
- Content Script 注入
- 跨网站兼容性测试
- 性能基准测试

## Impact

- **Affected specs**: 创建新的 UI Demo spec
  - `ui-demo` - UI Demo 规范
  
- **Affected code**: 
  - `src/content/` - 划词工具栏、注入式 UI
  - `src/popup/` - Popup 弹窗
  - `src/options/` - 设置页面
  - `src/components/` - 共享 UI 组件
  - `src/mock/` - Mock 数据

- **Documentation**: 
  - 新增 `docs/UI_DEMO_GUIDE.md` - Demo 使用指南
  - 更新 `README.md` - 添加 Demo 说明

## Risks

1. **样式冲突风险** - 不同网站的样式可能影响注入式 UI
   - 缓解: 使用 Shadow DOM + CSS Reset

2. **性能问题** - 复杂动画可能影响页面性能
   - 缓解: 使用 CSS 动画 + GPU 加速

3. **Mock 数据不真实** - 可能无法发现真实场景的问题
   - 缓解: 使用真实场景的文本作为测试数据
