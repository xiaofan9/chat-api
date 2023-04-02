import conversationController from "./controller/conversation.js";

export default (router) => {
  router.post("/conversation", async (ctx, next) => {
    await conversationController(ctx).postMessage();

    next();
  });
};
