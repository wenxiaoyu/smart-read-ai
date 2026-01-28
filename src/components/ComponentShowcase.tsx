import React, { useState } from 'react'
import {
  Button,
  Input,
  Select,
  Switch,
  ProgressBar,
  Spinner,
  useToast,
} from './index'

/**
 * 组件展示页面 - 用于测试和演示所有共享组件
 * 这个文件不会被打包到最终产品中，仅用于开发测试
 */
export const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('1')
  const [switchChecked, setSwitchChecked] = useState(false)
  const [progress, setProgress] = useState(50)
  const { showToast, ToastContainer } = useToast()

  const selectOptions = [
    { value: '1', label: 'ERNIE-Bot-turbo' },
    { value: '2', label: 'GPT-4' },
    { value: '3', label: 'Claude-3' },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>共享 UI 组件展示</h1>

      {/* Button 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Button - 按钮组件</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">主要按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="danger">危险按钮</Button>
          <Button variant="warning">警告按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button size="small">小按钮</Button>
          <Button size="medium">中按钮</Button>
          <Button size="large">大按钮</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button icon="🔍">带图标</Button>
          <Button loading>加载中</Button>
          <Button disabled>禁用状态</Button>
        </div>
      </section>

      {/* Input 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Input - 输入框组件</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="用户名"
            placeholder="请输入用户名"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="搜索"
            icon="🔍"
            placeholder="搜索内容..."
          />
          <Input
            label="邮箱"
            suffix="@gmail.com"
            placeholder="邮箱前缀"
          />
          <Input
            label="密码"
            type="password"
            hint="密码长度至少 8 位"
          />
          <Input
            label="错误示例"
            error="此字段不能为空"
          />
        </div>
      </section>

      {/* Select 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Select - 下拉选择组件</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="选择 AI 模型"
            options={selectOptions}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
          <Select
            label="带提示"
            options={selectOptions}
            hint="请选择一个 AI 模型"
          />
        </div>
      </section>

      {/* Switch 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Switch - 开关组件</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Switch
            label="启用通知"
            checked={switchChecked}
            onChange={(e) => setSwitchChecked(e.target.checked)}
          />
          <Switch
            label="自动保存"
            description="每 5 分钟自动保存一次"
          />
          <div style={{ display: 'flex', gap: '16px' }}>
            <Switch size="small" label="小" />
            <Switch size="medium" label="中" />
            <Switch size="large" label="大" />
          </div>
        </div>
      </section>

      {/* ProgressBar 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>ProgressBar - 进度条组件</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProgressBar value={progress} label="上传进度" showLabel />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button size="small" onClick={() => setProgress(Math.max(0, progress - 10))}>
              -10
            </Button>
            <Button size="small" onClick={() => setProgress(Math.min(100, progress + 10))}>
              +10
            </Button>
          </div>
          <ProgressBar value={30} variant="success" label="成功" />
          <ProgressBar value={70} variant="warning" label="警告" />
          <ProgressBar value={90} variant="danger" label="危险" />
          <ProgressBar value={60} animated label="动画效果" />
        </div>
      </section>

      {/* Spinner 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Spinner - 加载动画组件</h2>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
          <Spinner label="加载中..." />
          <Spinner variant="primary" label="主色调" />
        </div>
      </section>

      {/* Toast 组件 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Toast - 通知提示组件</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            onClick={() =>
              showToast({ message: '这是一条信息提示', type: 'info' })
            }
          >
            信息提示
          </Button>
          <Button
            onClick={() =>
              showToast({ message: '操作成功！', type: 'success' })
            }
          >
            成功提示
          </Button>
          <Button
            onClick={() =>
              showToast({ message: '警告：请注意', type: 'warning' })
            }
          >
            警告提示
          </Button>
          <Button
            onClick={() =>
              showToast({ message: '错误：操作失败', type: 'error' })
            }
          >
            错误提示
          </Button>
          <Button
            onClick={() =>
              showToast({
                message: '这条消息不会自动关闭',
                type: 'info',
                duration: 0,
              })
            }
          >
            持久提示
          </Button>
        </div>
      </section>

      <ToastContainer />
    </div>
  )
}
