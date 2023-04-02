const conversation = require("./controller/conversation");

module.exports = (router) => {
  router.post("/conversation", (ctx) => conversation(ctx).postMessage());

  router.get("/test", async (ctx) => {
    ctx.body = "test message";
  });
};
