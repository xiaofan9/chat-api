const conversationService = require("../service/conversation");

class ConversationController {
  constructor (ctx) {
    this.ctx = ctx;
  }

  postMessage() {
    conversationService.postMessage(this.ctx);
  }
}

module.exports = ctx => new ConversationController(ctx);
