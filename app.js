const Koa = require("koa");
const json = require("koa-json");
const logger = require("koa-logger");
const onerror = require("koa-onerror");
const bodyParser = require("koa-body");
const compress = require("koa-compress");
const cors = require("koa2-cors");
const errorPage = require("./app/middleware/error-page");
const autoRouter = require("./app/middleware/auto-router");
const nunjucks = require("./app/middleware/nunjucks");
const sequelize = require("./app/middleware/sequelize");

const config = require("./config");
const fetch = require("./app/middleware/fetch");
const EventStream = require("./app/utils/eventStream");
const Socket = require("./app/utils/socket");

const app = new Koa();

if (config.cors) {
  app.use(cors(config.corsConfig));
}

// koa的错误处理
onerror(app);

// gzip 压缩
app.use(
  async (ctx, next) => {
    console.log(ctx.req.headers);
    const useEventStream = ctx.req.headers.accept === "text/event-stream";
    ctx.useEventStream = useEventStream;

    if (!useEventStream) {
      await compress({
        level: 9,
      })(ctx, next);
    } else {
      await next();
    }
  },
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

app.use(async(ctx, next) => {
  if(ctx.useEventStream) {
    const eventStream = new EventStream();
    const socket = new Socket(eventStream);

    // 握手成功后触发onConnection方法,TODO
    // 设置符合Event-Source要求的首部
    ctx.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    // 将Stream赋给body,Koa底层会判断Stream类型并调用pipe方法流入response
    ctx.body = eventStream;
    // 设置表示请求成功，否则前端onopen方法不会触发
    ctx.status = 200;
    // 触发connect方法，传递socket对象
    // socket.add("result", "");
    ctx.stream = eventStream;
    ctx.app.on("stream-content", function(type, str) {
      socket.add(type, str);
    });
    ctx.app.on("stream-end", function(type, str) {
      socket.end(null);
    });

    // 当流关闭时，清除间隔和监听器
    // stream.on("close", () => {
    //   stream.removeListener("data", listener);
    // });
  }

  await next();
});

fetch(app);

if (config.useDatabase) {
  sequelize(app);
}

// 自动加载路由
autoRouter(app);

module.exports = app;
