import Koa from "koa";
import serve from "koa-static";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import path from "path";
import { getId } from "./http";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.post("/api/convert", async (ctx) => {
  const { url } = ctx.request.body as { url?: string };

  if (!url || typeof url !== "string") {
    ctx.status = 400;
    ctx.body = { code: 400, message: "请提供有效的分享链接", data: null };
    return;
  }

  if (!url.includes("y.qq.com")) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "请输入 QQ 音乐的分享链接", data: null };
    return;
  }

  try {
    const midId = await getId(url);
    const outUrl = `qqmusic://qq.com/media/playSonglist?p=%7B%22song%22%3A%5B%7B%22songmid%22%3A%22${midId}%22%7D%5D%2C%22action%22%3A%221%22%7D`;

    ctx.body = {
      code: 0,
      message: "ok",
      data: { songmid: midId, deepLink: outUrl },
    };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: err.message || "解析失败，请检查链接是否正确",
      data: null,
    };
  }
});

app.use(router.routes());
app.use(serve(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
