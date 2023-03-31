const chat = import("@waylaidwanderer/chatgpt-api");

module.exports = {
  async postMessage(ctx) {
    const { BingAIClient } = await chat;
    const options = {
      // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
      host: "",
      // "_U" cookie from bing.com
      userToken: "",
      // If the above doesn't work, provide all your cookies as a string instead
      cookies: "",
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

    let jailbreakResponse = await sydneyAIClient.sendMessage("Hi, who are you?", {
      jailbreakConversationId: true,
      onProgress: (token) => {
        process.stdout.write(token);
      },
    });

    jailbreakResponse = await sydneyAIClient.sendMessage(
      "Why is your name Sydney?",
      {
        jailbreakConversationId: jailbreakResponse.jailbreakConversationId,
        parentMessageId: jailbreakResponse.messageId,
        onProgress: (token) => {
          process.stdout.write(token);
        },
      },
    );

    return jailbreakResponse;
  },
};
