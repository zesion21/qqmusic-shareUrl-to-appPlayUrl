# QQ 音乐链接转换器

将 QQ 音乐分享链接转换为可直接唤起 App 的 `qqmusic://` 深链接。

## 功能

- 粘贴 QQ 音乐分享链接，自动解析歌曲 ID
- 生成 `qqmusic://` scheme 深链接，可直接唤起 QQ 音乐播放
- 移动端适配，一键复制结果

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动生产服务
npm start
```

启动后访问 `http://localhost:3000`

## 项目结构

```
├── src/
│   ├── index.ts          # Koa 服务入口
│   ├── http/index.ts     # 请求 QQ 音乐接口
│   └── reader/index.ts   # 解析 SSR 数据
├── public/
│   └── index.html        # 前端页面
├── package.json
└── tsconfig.json
```

## 部署

推荐使用 PM2：

```bash
npm run build
pm2 start dist/index.js --name qqmusic
```

## 演示

<video src="94371c5ceecdb0dd3d11cb8dfe681c83.mp4" controls width="100%"></video>
