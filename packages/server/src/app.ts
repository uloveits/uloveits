/*
 * @Author: wangxian
 * @Date: 2022-05-31 11:09:48
 * @LastEditTime: 2022-06-01 15:02:55
 */
import StartUp from "./libs/01__core__/StartUp";

class App extends StartUp {
  onMountingMiddlewares() {
    this.use(async (ctx, next) => {
      ctx.body = "hello world";
    });
  }
}

new App().start();
