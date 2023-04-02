import Koa from "koa";
import json from "koa-json";
import logger from "koa-logger";
import onerror from "koa-onerror";
import bodyParser from "koa-body";
import compress from "koa-compress";
import cors from "koa2-cors";
import errorPage from "./app/middleware/error-page.js";
import autoRouter from "./app/middleware/auto-router.js";
import nunjucks from "./app/middleware/nunjucks.js";
import sequelize from "./app/middleware/sequelize.js";
import fetch from "./app/middleware/fetch.js";
import config from "./config/index.js";

const app = new Koa();

if (config.cors) {
  app.use(cors(config.corsConfig));
}

// koa的错误处理
onerror(app);

// gzip 压缩
app.use(
  compress({
    level: 9,
  }),
);

// 输出日志
app.use(logger());

// 捕获404错误页面
app.use(errorPage);

app.use(nunjucks({
  extension: "html",
}));

// 格式化json输出
app.use(json());

// 解析 post body
app.use(
  bodyParser({
    multipart: true,
    enableTypes: ["json", "form", "text"],
  }),
);

fetch(app);

if (config.useDatabase) {
  sequelize(app);
}

// 自动加载路由
autoRouter(app);

export default app;
