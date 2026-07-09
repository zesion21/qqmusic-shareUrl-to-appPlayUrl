import axios from "axios";
import { read } from "../reader";
export const getId = async (url: string) => {
  const iosClient = axios.create({
    timeout: 10000,
    headers: {
      // 1. 关键：User-Agent 模拟 iPhone 浏览器
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",

      // 2. 模拟 iOS 原生 App 常用标识（部分接口校验）
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });

  const res = await iosClient.get(url).then((r) => r.data);

  const str = read(res).replace(/\\/g, "");

  const { song } = JSON.parse(str);

  return song.mid;
};
