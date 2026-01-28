# Chrome Web Store 发布快速检查清单

## 🚀 5 分钟快速准备

### 第一步：构建和打包（2 分钟）

```bash
# 构建
pnpm build

# 打包
cd dist
zip -r ../smart-read-ai-v0.1.1.zip .
cd ..
```

### 第二步：准备物料（3 分钟）

#### 必需物料

- [x] ZIP 包：`smart-read-ai-v0.1.1.zip`
- [x] 商店图标：从 `dist/icons/icon-128.png` 复制
- [x] 截图：至少 1 张（1280x800 或 640x400）
- [x] 隐私政策 URL：需要创建并上传
- [x] 测试 API 密钥：OpenAI 测试密钥（$5 额度）

#### 可选物料

- [ ] 宣传图：440x280 PNG
- [ ] 演示视频：YouTube 链接
- [ ] 英文版描述

---

## 📝 复制粘贴文案

### 扩展名称

```
智阅 AI - 文本简化与解释助手
```

### 简短描述

```
让复杂文本变简单，用 AI 帮你理解专业术语和难懂内容
```

### 详细描述

> 见 `docs/WEBSTORE_SUBMISSION_GUIDE.md` 第 3 节

### 审核说明

> 见 `docs/WEBSTORE_SUBMISSION_GUIDE.md` 第 5 节

### 隐私政策

> 见 `docs/WEBSTORE_SUBMISSION_GUIDE.md` 第 4 节

---

## ✅ 提交前最后检查

### 代码

- [ ] 构建成功
- [ ] 本地测试通过
- [ ] 版本号正确（v0.1.1）

### 商店信息

- [ ] 名称、描述已填写
- [ ] 类别：生产力工具
- [ ] 语言：中文（简体）

### 图片

- [ ] 商店图标（128x128）
- [ ] 截图（至少 1 张）

### 隐私

- [ ] 隐私政策 URL 可访问
- [ ] 数据使用披露已勾选

### 审核

- [ ] 审核说明已填写
- [ ] 测试 API 密钥已提供
- [ ] 测试步骤清晰

---

## 🔑 测试 API 密钥模板

```markdown
### OpenAI 测试密钥

sk-proj-[您的测试密钥]

**额度限制**：$5
**有效期**：审核期间
**注意**：审核完成后将撤销
```

---

## 📞 紧急联系

**审核问题**：

- 查看开发者控制台通知
- 检查注册邮箱

**技术问题**：

- 查看 `docs/CHROME_WEBSTORE_API_POLICY.md`
- 查看 `docs/chrome-extension-best-practices.md`

**其他问题**：

- GitHub Issues: [项目地址]/issues
- Email: [联系邮箱]

---

## 📊 审核时间线

| 状态         | 预计时间  | 说明                   |
| ------------ | --------- | ---------------------- |
| 提交         | 立即      | 上传 ZIP 包，填写信息  |
| 待审核       | 0-24 小时 | 等待审核员分配         |
| 审核中       | 1-3 天    | 审核员测试和检查       |
| 需要更多信息 | -         | 审核员有疑问，需要回复 |
| 已发布       | 立即      | 审核通过，自动上架     |

---

## 🎯 常见拒绝原因和快速修复

| 拒绝原因         | 快速修复                    |
| ---------------- | --------------------------- |
| 隐私政策无法访问 | 检查 URL，确保可访问        |
| 功能说明不清晰   | 补充详细的审核说明          |
| 权限使用不合理   | 在审核说明中解释每个权限    |
| 代码可读性问题   | 确保使用 Terser，不过度混淆 |

---

## 📱 快速操作链接

- [开发者控制台](https://chrome.google.com/webstore/devconsole)
- [开发者政策](https://developer.chrome.com/docs/webstore/program_policies)
- [开发者支持](https://support.google.com/chrome_webstore/contact/developer_support)

---

**准备好了？点击"提交审核"！** 🚀
