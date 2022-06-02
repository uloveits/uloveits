/*
 * @Author: wangxian
 * @Date: 2022-05-31 15:49:35
 * @LastEditTime: 2022-06-01 15:04:09
 */
import * as Koa from "koa";
//@ts-ignore
import chalk from "chalk";

export default class StartUp {
  private app: Koa;
  constructor() {
    this.app = new Koa();
  }

  /**
   * 统一调用hook方法
   * @param key
   * @param elseFn
   * @param args
   */
  private useHook(key: string, elseFn = new Function(), ...args: any[]) {
    const self = this;
    if (key in self) {
      return self[key](...args);
    }
    return elseFn();
  }

  /**
   * 启动服务
   */
  private async startServer(): Promise<any> {
    return new Promise<void>((res, err) => {
      this.app.listen(8090);
      console.log(chalk.blue("[koa2] start-quick is starting at port 8090"));
      res();
    });
  }

  /**
   *
   * @param middleware koa中间件
   */
  public use(middleware: Koa.Middleware): this {
    this.app.use(middleware);
    return this;
  }

  public async start(): Promise<any> {
    const startTime = new Date();
    console.log(chalk.blue(`[${startTime}] `));
    try {
      // 初始化(生命周期)
      await this.useHook("onInit");
      // 载入中间件
      await this.useHook("onMountingMiddlewares", undefined, this.app);
      // 启动服务
      await this.startServer();
      // 启动服务完成(生命周期)
      await this.useHook("onReady");
    } catch (error) {}
  }
}
