#!/usr/bin/env node

import axios from "axios";

/**
 * 从 HTML 中提取 __ssrFirstPageData__ 数据
 */
function extractSSRData(html: string): string | null {
  const regex = /__ssrFirstPageData__=\"\s*([\s\S]*?)(\"<\/script>)/;
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * 模拟 iOS 客户端获取歌曲 mid
 */
async function getSongMid(url: string): Promise<string> {
  const iosClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });

  const res = await iosClient.get(url).then((r) => r.data);
  const str = extractSSRData(res);

  if (!str) {
    throw new Error("无法从页面中提取数据");
  }

  const { song } = JSON.parse(str.replace(/\\/g, ""));
  return song.mid;
}

/**
 * 生成 qqmusic:// deeplink
 */
function generateDeeplink(mid: string): string {
  return `qqmusic://qq.com/media/playSonglist?p=%7B%22song%22%3A%5B%7B%22songmid%22%3A%22${mid}%22%7D%5D%2C%22action%22%3A%221%22%7D`;
}

/**
 * 主函数
 */
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error("错误: 请提供 QQ 音乐分享链接");
    console.error("用法: npx ts-node scripts/qqmusic-cli.ts <url>");
    process.exit(1);
  }

  if (!url.includes("y.qq.com")) {
    console.error("错误: 请输入 QQ 音乐的分享链接");
    process.exit(1);
  }

  try {
    const mid = await getSongMid(url);
    const deeplink = generateDeeplink(mid);

    console.log(JSON.stringify({ mid, deeplink }));
  } catch (err: any) {
    console.error("错误:", err.message || "解析失败");
    process.exit(1);
  }
}

main();
