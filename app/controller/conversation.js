import conversationService from "../service/conversation.js";
import { getSingleExample } from "../utils/index.js";

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
      this.ctx.body = {
        code: 500,
        msg: "服务器出错了",
      };
    }
  }
}

export default ctx => getSingleExample(ConversationController, ctx);
