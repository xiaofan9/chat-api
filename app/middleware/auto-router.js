
import KoaRouter from "@koa/router";
import routes from "../router.js";

const router = new KoaRouter();

export default (app) => {
  app
    .use(router.routes())
    .use(router.allowedMethods());

  routes(router);
};
