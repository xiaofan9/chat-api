const conversation = require("./controller/conversation");

module.exports = (router) => {
  router.get("/conversation", ctx => conversation(ctx).postMessage());
};
