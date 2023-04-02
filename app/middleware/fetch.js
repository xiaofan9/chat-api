import { cAxios } from "v-axios";

export default async (app) => {
  app.context.fetch = cAxios();
};
