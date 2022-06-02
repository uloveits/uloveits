/*
 * @Author: wangxian
 * @Date: 2022-05-31 15:49:35
 * @LastEditTime: 2022-06-02 10:37:38
 */
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
//@ts-ignore
import chalk from "chalk";
import RouterHelper from "./helper/RouterHelper";
import { TService } from "../type";

interface ISystemConfig {
  service: TService;
}

export default class StartUp {
  private app: Koa;
  private sysConfig: ISystemConfig;

  // 路由服务
  private routerHelper: RouterHelper;
  constructor(config: ISystemConfig) {
    this.app = new Koa();
    this.sysConfig = config;
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
   * bodyParser
   * @returns
   */
  private async loadBodyParser(): Promise<void> {
    console.log(chalk.blue("[koa2] loadBodyParser..."));
    return new Promise<void>((res, err) => {
      this.app.use(bodyParser());
      res();
    });
  }

  /**
   * 设置controller路由
   */
  private async loadRouters(): Promise<void> {
    console.log(chalk.blue("[koa2] loadRouters..."));
    return new Promise((res, err) => {
      // 设置controller 路径
    //   this.routerHelper.joinControllerPath(this.sysConfig.service);

      // 载入路由
    //   this.routerHelper.loadRouter(this.app);
      res();
    });
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
      // 载入bodyParser
      await this.loadBodyParser();
      // 载入路由
      await this.loadRouters();
      // 启动服务
      await this.startServer();
      // 启动服务完成(生命周期)
      await this.useHook("onReady");
    } catch (error) {}
  }
}
