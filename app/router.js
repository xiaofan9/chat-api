const conversation = require("./controller/conversation");

module.exports = (router) => {
  router.post("/conversation", async (ctx) => await conversation(ctx).postMessage());

  router.get("/test", (ctx) => {
    ctx.body = "test message";
  });
};
