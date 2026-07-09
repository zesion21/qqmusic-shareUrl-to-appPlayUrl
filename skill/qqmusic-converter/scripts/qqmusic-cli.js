#!/usr/bin/env node

const https = require('https');
const http = require('http');

/**
 * 从 HTML 中提取 __ssrFirstPageData__ 数据
 */
function extractSSRData(html) {
  const regex = /__ssrFirstPageData__="([\s\S]*?)"<\/script>/;
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * 模拟 iOS 客户端获取页面内容（支持重定向）
 */
function fetchPage(targetUrl) {
  return new Promise((resolve, reject) => {
    const mod = targetUrl.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    };

    mod.get(targetUrl, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * 从分享链接获取歌曲 mid
 */
async function getSongMid(url) {
  const html = await fetchPage(url);
  const str = extractSSRData(html);

  if (!str) {
    throw new Error('无法从页面中提取数据');
  }

  const json = JSON.parse(str.replace(/\\/g, ''));
  return json.song.mid;
}

/**
 * 生成 qqmusic:// deeplink
 */
function generateDeeplink(mid) {
  return `qqmusic://qq.com/media/playSonglist?p=%7B%22song%22%3A%5B%7B%22songmid%22%3A%22${mid}%22%7D%5D%2C%22action%22%3A%221%22%7D`;
}

/**
 * 主函数
 */
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('错误: 请提供 QQ 音乐分享链接');
    console.error('用法: node qqmusic-cli.js <url>');
    process.exit(1);
  }

  if (!url.includes('y.qq.com')) {
    console.error('错误: 请输入 QQ 音乐的分享链接');
    process.exit(1);
  }

  try {
    const mid = await getSongMid(url);
    const deeplink = generateDeeplink(mid);
    console.log(JSON.stringify({ mid, deeplink }));
  } catch (err) {
    console.error('错误:', err.message || '解析失败');
    process.exit(1);
  }
}

main();
