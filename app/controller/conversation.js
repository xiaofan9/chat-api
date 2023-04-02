const { getSingleExample } = require("../utils/index.js");
const conversationService = require("../service/conversation");
class ConversationController {
  constructor (ctx) {
    this.ctx = ctx;
  }

  async postMessage() {
    try {
      const res = await conversationService(this.ctx).postMessage();

      this.ctx.body = res;
    } catch (err) {
      console.error(err);
      this.ctx.status = 500;
      this.ctx.body = {
        code: 500,
        msg: err.message ?? "服务器出错了",
      };
    }
  }
}

module.exports = ctx => getSingleExample(ConversationController, ctx);
