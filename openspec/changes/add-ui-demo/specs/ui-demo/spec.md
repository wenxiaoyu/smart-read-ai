# UI Demo Specification

## ADDED Requirements

### Requirement: 划词工具栏交互

系统 SHALL 在用户选中文本时显示划词工具栏，提供快速操作入口。

#### Scenario: 选中文本触发工具栏

- **WHEN** 用户在网页中选中至少 5 个字符的文本
- **THEN** 在选中文本上方显示划词工具栏
- **AND** 工具栏包含"简化"、"解释"、"复制"按钮
- **AND** 工具栏使用淡入动画（0.2秒）

#### Scenario: 工具栏自动隐藏

- **WHEN** 工具栏显示后 3 秒内无用户操作
- **THEN** 工具栏自动淡出消失

#### Scenario: 点击空白区域关闭

- **WHEN** 用户点击网页其他区域
- **THEN** 工具栏立即消失

#### Scenario: 工具栏智能定位

- **WHEN** 选中文本靠近屏幕顶部
- **THEN** 工具栏显示在选中文本下方
- **WHEN** 选中文本在屏幕中部或底部
- **THEN** 工具栏显示在选中文本上方

### Requirement: AI 结果展示

系统 SHALL 在用户触发 AI 操作后，以卡片形式展示结果。

#### Scenario: 显示加载状态

- **WHEN** 用户点击"简化"或"解释"按钮
- **THEN** 在选中文本下方显示结果卡片
- **AND** 卡片显示加载动画（Spinner）
- **AND** 显示"AI 正在分析中..."提示

#### Scenario: 显示 Mock 结果

- **WHEN** Mock 延迟（1.5秒）结束
- **THEN** 卡片显示 AI 解析结果
- **AND** 包含"原文"和"结果"两个区域
- **AND** 提供"复制"、"收藏"、"来源"操作按钮

#### Scenario: 展开收起功能

- **WHEN** 用户点击卡片标题栏的"−"按钮
- **THEN** 卡片内容收起，只显示标题栏
- **WHEN** 用户点击"+"按钮
- **THEN** 卡片内容展开

#### Scenario: 关闭结果卡片

- **WHEN** 用户点击"×"按钮
- **THEN** 卡片使用淡出动画消失

### Requirement: Shadow DOM 样式隔离

系统 SHALL 使用 Shadow DOM 确保插件 UI 不受网页样式影响。

#### Scenario: 样式完全隔离

- **WHEN** 插件在任何网站上运行
- **THEN** 插件 UI 样式不受网页 CSS 影响
- **AND** 插件 UI 不影响网页原有样式

#### Scenario: 跨网站一致性

- **WHEN** 在不同网站（GitHub、知乎、CSDN）测试
- **THEN** 插件 UI 外观和行为完全一致

### Requirement: 暗黑模式支持

系统 SHALL 根据系统主题自动切换暗黑模式。

#### Scenario: 自动检测系统主题

- **WHEN** 系统使用暗黑模式
- **THEN** 插件 UI 自动切换为暗黑主题
- **AND** 背景色、文字色、按钮色适配暗黑模式

#### Scenario: 浅色模式

- **WHEN** 系统使用浅色模式
- **THEN** 插件 UI 使用浅色主题

### Requirement: Popup 弹窗功能

系统 SHALL 提供 Popup 弹窗，展示知识检索和统计信息。

#### Scenario: 打开 Popup

- **WHEN** 用户点击浏览器工具栏的插件图标
- **THEN** 显示 Popup 弹窗（360px 宽）
- **AND** 包含知识检索输入框
- **AND** 包含 Token 使用统计
- **AND** 包含快速设置入口

#### Scenario: Token 统计展示

- **WHEN** Popup 打开
- **THEN** 显示本月 Token 使用情况
- **AND** 显示进度条（已用/总额度）
- **AND** 显示百分比

#### Scenario: 知识检索（Mock）

- **WHEN** 用户在搜索框输入关键词
- **THEN** 显示 Mock 搜索结果
- **AND** 每个结果显示标题、摘要、来源

### Requirement: Options 设置页功能

系统 SHALL 提供完整的设置页面，支持配置和数据管理。

#### Scenario: 打开设置页

- **WHEN** 用户右键点击插件图标选择"选项"
- **THEN** 在新标签页打开设置页面

#### Scenario: AI 模型配置

- **WHEN** 用户在设置页
- **THEN** 显示模型选择下拉框（文心一言/通义千问/智谱GLM-4）
- **AND** 显示 API 密钥输入框（带遮罩显示）
- **AND** 提供"测试连接"按钮（Mock）

#### Scenario: 主题切换

- **WHEN** 用户选择主题（浅色/暗黑/自动）
- **THEN** 立即应用新主题
- **AND** 保存设置到 Mock 存储

#### Scenario: 数据管理

- **WHEN** 用户在数据管理区域
- **THEN** 显示"导出知识库"按钮
- **AND** 显示"清除所有数据"按钮
- **AND** 显示当前知识节点数量（Mock）

### Requirement: 性能要求

系统 SHALL 满足性能指标，确保流畅体验。

#### Scenario: 快速响应

- **WHEN** 用户选中文本
- **THEN** 工具栏在 100ms 内显示

#### Scenario: 流畅动画

- **WHEN** 任何动画播放
- **THEN** 保持 60 FPS 帧率
- **AND** 使用 GPU 加速（transform/opacity）

#### Scenario: 低内存占用

- **WHEN** 插件运行
- **THEN** 内存占用 < 30MB

### Requirement: Mock 数据真实性

系统 SHALL 使用真实场景的 Mock 数据，确保 Demo 可信度。

#### Scenario: AI 响应延迟

- **WHEN** 触发 AI 操作
- **THEN** 延迟 1.5 秒后返回结果
- **AND** 模拟真实 API 调用时间

#### Scenario: 术语解释数据库

- **WHEN** 用户查询常见技术术语
- **THEN** 返回预置的准确解释
- **AND** 术语库包含 100+ 条常用术语

#### Scenario: 知识节点展示

- **WHEN** 在 Popup 中查看知识库
- **THEN** 显示 Mock 知识节点列表
- **AND** 每个节点包含类型、内容、标签、时间

### Requirement: 跨网站兼容性

系统 SHALL 在主流网站上正常工作，无样式冲突。

#### Scenario: 技术文档网站

- **WHEN** 在 GitHub、Stack Overflow、MDN 上使用
- **THEN** 所有功能正常工作
- **AND** 无样式冲突

#### Scenario: 中文网站

- **WHEN** 在掘金、CSDN、知乎上使用
- **THEN** 所有功能正常工作
- **AND** 中文显示正常

#### Scenario: 复杂样式网站

- **WHEN** 在使用复杂 CSS 的网站上使用
- **THEN** Shadow DOM 完全隔离样式
- **AND** 插件 UI 不受影响
