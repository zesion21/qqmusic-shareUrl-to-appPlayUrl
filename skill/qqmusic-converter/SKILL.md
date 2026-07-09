---
name: qqmusic-converter
description: 将 QQ 音乐分享链接转换为 qqmusic:// deeplink，用于 iOS/macOS 直接打开播放
license: MIT
---

# QQ 音乐链接转换器

将 QQ 音乐的网页分享链接转换为 `qqmusic://` 格式的 deeplink，可直接在 iOS/macOS 上打开播放。

## 使用场景

当用户提供 QQ 音乐分享链接（如 `https://c6.y.qq.com/base/fcgi-bin/u?__=AW9Aff`）并希望：

- 获取可在 iOS/macOS 上直接打开的 qqmusic:// 链接
- 获得歌曲的 mid 标识

## 输入格式

用户输入应为 QQ 音乐分享链接，格式如：

- `https://c6.y.qq.com/base/fcgi-bin/u?__=AW9Aff`

## 输出格式

返回 JSON 格式的结果：

```json
{
  "mid": "歌曲的 mid 标识",
  "deeplink": "qqmusic://qq.com/media/playSonglist?p={...}"
}
```

## 实现步骤

### 1. 验证输入链接

首先检查链接是否为有效的 QQ 音乐链接：

- 链接必须包含 `y.qq.com`
- 链接格式应符合 QQ 音乐分享链接规范

### 2. 执行转换命令

使用项目中的 CLI 工具进行转换：

```bash
npx ts-node ./scripts/qqmusic-cli.ts "<用户提供的链接>"
```

### 3. 解析输出

CLI 工具会返回 JSON 格式的结果：

- `mid`: 歌曲的唯一标识符
- `deeplink`: 可直接打开的 qqmusic:// 链接

### 4. 返回结果给用户

将结果格式化后返回给用户，包含：

- 歌曲 mid
- qqmusic:// deeplink（用户可直接复制使用）

## 示例

**用户输入：**

```
帮我转换这个 QQ 音乐链接：https://c6.y.qq.com/base/fcgi-bin/u?__=AW9Aff
```

**AI 执行：**

```bash
npx ts-node ./scripts/qqmusic-cli.ts "https://c6.y.qq.com/base/fcgi-bin/u?__=AW9Aff"
```

**返回给用户：**

```
转换结果：
- 歌曲 Mid: 003OUlho2HcRHC
- Deeplink: qqmusic://qq.com/media/playSonglist?p=%7B%22song%22%3A%5B%7B%22songmid%22%3A%22003OUlho2HcRHC%22%7D%5D%2C%22action%22%3A%221%22%7D

你可以直接在 iOS/macOS 上打开这个链接播放歌曲。
```

## 错误处理

如果转换失败，应向用户说明：

- 链接格式错误
- 无法访问 QQ 音乐页面
- 页面数据解析失败

## 技术细节

该功能通过以下方式实现：

1. 使用 axios 模拟 iOS Safari 浏览器访问 QQ 音乐页面
2. 从 HTML 中提取 `__ssrFirstPageData__` SSR 数据
3. 解析 JSON 获取歌曲 mid
4. 生成 qqmusic:// 格式的 deeplink

相关源码：

- `./scripts/qqmusic-cli.ts` - CLI 工具入口
