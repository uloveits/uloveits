/*
 * @Author: wangxian
 * @Date: 2022-05-31 11:09:48
 * @LastEditTime: 2022-06-02 10:17:47
 */
import StartUp from "./libs/01__core__/StartUp";
import HomeController from "./controller/HomeController";

class App extends StartUp {
  onMountingMiddlewares() {
    this.use(async (ctx, next) => {
      ctx.body = "hello world";
    });
  }
}

const service = { "/api": HomeController };

new App({ service })
  .start()
  .then()
  .catch((e) => {
    console.error("---", e);
  });
