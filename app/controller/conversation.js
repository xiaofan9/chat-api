const { getSingleExample } = require("../utils/index.js");
const conversationService = require("../service/conversation");
class ConversationController {
  constructor (ctx) {
    this.ctx = ctx;
  }

  async postMessage() {
    const handleRes = async(cb) => {
      let data = {};

      try {
        const res = await conversationService(this.ctx).postMessage();

        data = res;
      } catch (err) {
        console.error(err);
        data = {
          error: err.message ?? "服务器出错了",
        };
      }

      if (!this.ctx.useEventStream) {
        return data;
      } else {
        const msgType = data?.error ? "error" : "result";

        this.ctx.app.emit("stream-content", msgType, data);
        this.ctx.app.emit("stream-end");
      }
    };

    if(!this.ctx.useEventStream) {
      const res = await handleRes();

      this.ctx.body = res;
      this.ctx.status = res?.error ? 500 : 200;
    } else {
      this.ctx.app.emit("stream-content", "message", "");
      handleRes();
    }
  }
}

module.exports = ctx => getSingleExample(ConversationController, ctx);
