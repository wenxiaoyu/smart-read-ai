# 共享 UI 组件库

这是智阅 AI 的共享 UI 组件库，所有组件都采用毛玻璃效果设计，支持暗黑模式。

## 组件列表

### Button - 按钮组件

```tsx
import { Button } from '@/components'

// 基础用法
<Button onClick={() => console.log('clicked')}>点击我</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="danger">危险按钮</Button>
<Button variant="warning">警告按钮</Button>
<Button variant="ghost">幽灵按钮</Button>

// 不同尺寸
<Button size="small">小按钮</Button>
<Button size="medium">中按钮</Button>
<Button size="large">大按钮</Button>

// 带图标
<Button icon="🔍">搜索</Button>

// 加载状态
<Button loading>加载中...</Button>

// 禁用状态
<Button disabled>禁用按钮</Button>
```

### Input - 输入框组件

```tsx
import { Input } from '@/components'

// 基础用法
<Input placeholder="请输入内容" />

// 带标签
<Input label="用户名" placeholder="请输入用户名" />

// 带图标
<Input icon="🔍" placeholder="搜索..." />

// 带后缀
<Input suffix="@gmail.com" placeholder="邮箱前缀" />

// 带提示
<Input hint="密码长度至少 8 位" />

// 错误状态
<Input error="用户名不能为空" />

// 不同尺寸
<Input size="small" />
<Input size="medium" />
<Input size="large" />

// 不同变体
<Input variant="default" />
<Input variant="filled" />
```

### Select - 下拉选择组件

```tsx
import { Select } from '@/components'

const options = [
  { value: '1', label: '选项 1' },
  { value: '2', label: '选项 2' },
  { value: '3', label: '选项 3', disabled: true },
]

// 基础用法
<Select options={options} />

// 带标签
<Select label="选择模型" options={options} />

// 带提示
<Select hint="请选择一个选项" options={options} />

// 错误状态
<Select error="必须选择一个选项" options={options} />

// 不同尺寸
<Select size="small" options={options} />
<Select size="medium" options={options} />
<Select size="large" options={options} />
```

### Switch - 开关组件

```tsx
import { Switch } from '@/components'

// 基础用法
<Switch />

// 带标签
<Switch label="启用通知" />

// 带描述
<Switch 
  label="自动保存" 
  description="每 5 分钟自动保存一次"
/>

// 标签位置
<Switch label="左侧标签" labelPosition="left" />
<Switch label="右侧标签" labelPosition="right" />

// 不同尺寸
<Switch size="small" />
<Switch size="medium" />
<Switch size="large" />

// 受控组件
const [checked, setChecked] = useState(false)
<Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} />
```

### ProgressBar - 进度条组件

```tsx
import { ProgressBar } from '@/components'

// 基础用法
<ProgressBar value={50} />

// 带标签
<ProgressBar value={75} label="上传进度" showLabel />

// 不同变体
<ProgressBar value={30} variant="success" />
<ProgressBar value={70} variant="warning" />
<ProgressBar value={90} variant="danger" />

// 动画效果
<ProgressBar value={60} animated />

// 不同尺寸
<ProgressBar value={50} size="small" />
<ProgressBar value={50} size="medium" />
<ProgressBar value={50} size="large" />
```

### Spinner - 加载动画组件

```tsx
import { Spinner } from '@/components'

// 基础用法
<Spinner />

// 带标签
<Spinner label="加载中..." />

// 不同尺寸
<Spinner size="small" />
<Spinner size="medium" />
<Spinner size="large" />

// 不同变体
<Spinner variant="default" />
<Spinner variant="primary" />
<Spinner variant="white" />
```

### Toast - 通知提示组件

```tsx
import { Toast, useToast } from '@/components'

// 使用 Hook
function MyComponent() {
  const { showToast, ToastContainer } = useToast()

  const handleClick = () => {
    showToast({
      message: '操作成功！',
      type: 'success',
      duration: 3000,
    })
  }

  return (
    <>
      <button onClick={handleClick}>显示通知</button>
      <ToastContainer />
    </>
  )
}

// 不同类型
showToast({ message: '这是一条信息', type: 'info' })
showToast({ message: '操作成功', type: 'success' })
showToast({ message: '警告提示', type: 'warning' })
showToast({ message: '错误提示', type: 'error' })

// 不同位置
showToast({ message: '顶部左侧', position: 'top-left' })
showToast({ message: '顶部居中', position: 'top-center' })
showToast({ message: '顶部右侧', position: 'top-right' })
showToast({ message: '底部左侧', position: 'bottom-left' })
showToast({ message: '底部居中', position: 'bottom-center' })
showToast({ message: '底部右侧', position: 'bottom-right' })

// 不自动关闭
showToast({ message: '需要手动关闭', duration: 0 })

// 不可关闭
showToast({ message: '不可关闭', closable: false })
```

## 设计原则

1. **毛玻璃效果**：所有组件都使用 `backdrop-filter: blur()` 实现毛玻璃效果
2. **暗黑模式**：自动适配系统暗黑模式，使用 `@media (prefers-color-scheme: dark)`
3. **一致性**：所有组件使用统一的颜色、间距、圆角等设计规范
4. **可访问性**：支持键盘导航、屏幕阅读器等无障碍功能
5. **性能优化**：使用 GPU 加速的 CSS 属性（transform、opacity）

## 颜色规范

- **主色调**：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **成功色**：`#10b981`
- **警告色**：`#f59e0b`
- **危险色**：`#ef4444`
- **文本色（浅色）**：`rgba(0, 0, 0, 0.85)`
- **文本色（暗黑）**：`rgba(255, 255, 255, 0.9)`

## 使用建议

1. 优先使用共享组件，保持 UI 一致性
2. 如需自定义样式，使用 `className` 属性
3. 遵循组件的 Props 接口定义
4. 注意组件的受控/非受控状态
5. 合理使用组件的尺寸和变体选项
