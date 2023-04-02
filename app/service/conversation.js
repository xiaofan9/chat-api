const { getSingleExample } = require("../utils/index.js");
const chat = import("@waylaidwanderer/chatgpt-api");

class ConversationService {
  constructor (ctx) {
    this.ctx = ctx;
  }

  async postMessage() {
    const { BingAIClient } = await chat;
    const body = this.ctx.request.body || {};
    const clientOptions = body.clientOptions ?? {};
    const options = {
      // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
      host: clientOptions.host || "",
      // "_U" cookie from bing.com
      userToken: "",
      // If the above doesn't work, provide all your cookies as a string instead
      cookies: clientOptions.cookies || "",
      // A proxy string like "http://<ip>:<port>"
      proxy: "",
      // (Optional) Set to true to enable `console.debug()` logging
      debug: false,
    };

    const cacheOptions = {
      // Options for the Keyv cache, see https://www.npmjs.com/package/keyv
      // This is used for storing conversations, and supports additional drivers (conversations are stored in memory by default)
      // For example, to use a JSON file (`npm i keyv-file`) as a database:
      // store: new KeyvFile({ filename: 'cache.json' }),
    };

    const sydneyAIClient = new BingAIClient({
      ...options,
      cache: cacheOptions,
    });

    // 暂时不开越狱模式
    const res = await sydneyAIClient.sendMessage(
      body.message,
      {
        ...!body?.conversationSignature
          ? {}
          : {
            conversationId: body.conversationId,
            conversationSignature: body.conversationSignature,
            invocationId: body.invocationId,
            clientId: body.clientId,
          },
        onProgress: (token) => {
          process.stdout.write(token);
        },
      },
    );

    return res;
  }
}

module.exports = ctx => getSingleExample(ConversationService, ctx);
