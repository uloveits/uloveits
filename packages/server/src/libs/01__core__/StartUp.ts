/*
 * @Author: wangxian
 * @Date: 2022-05-31 15:49:35
 * @LastEditTime: 2022-06-10 14:21:51
 */
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
//@ts-ignore
import chalk from "chalk";
import RouterHelper from "./helper/RouterHelper";
import { Autowired } from "../02__decorator__/service";
import { Configuration } from "./Configuration";
import { toAsyncMiddleware, toErrorAsyncMiddleware } from "../utils";
import { ERR_MIDDLEWARE_NAME, MIDDLEWARE_NAME } from "../constants";
import ParamsHelper from "./helper/ParamsHelper";

export default class StartUp {
  @Autowired()
  private app: Koa;

  // 配置类实例
  @Autowired() private configuration: Configuration;

  // 路由服务
  @Autowired()
  private routerHelper: RouterHelper;

  @Autowired()
  private paramsHelper: ParamsHelper;

  constructor() {
    // 获取设置的service参数
    const _configuration = this.configuration.getMetadata(this);
    if (_configuration) {
      this.setConfiguration(_configuration);
    }
  }

  /**
   * 设置参数
   * @param settings
   */
  private setConfiguration(configuration: Configuration) {
    this.configuration.setMap(configuration);
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
   * 加载拦截器
   */
  private async loadInterceptor() {
    // 读取拦截器类
    let Interceptor = Configuration.serverSettingMap.get("interceptor");
    if (Interceptor) {
      this.loadMiddleware(Interceptor);
    }
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
   * 返回值处理
   */
  private async loadResponse(): Promise<any> {
    let response = Configuration.serverSettingMap.get("response");
    if (response) {
      this.loadMiddleware(response);
    }
  }

  /**
   * 引入中间件
   * @param middlewareClass
   */
  private loadMiddleware(middlewareClass) {
    if (middlewareClass) {
      let middlewareFun = new middlewareClass().use;
      let asyncMiddle = toAsyncMiddleware(
        // 这里this指向的是类的原型
        middlewareClass.prototype,
        middlewareFun,
        middlewareFun[MIDDLEWARE_NAME],
        this.paramsHelper.paramsToList
      );
      this.app.use(asyncMiddle);
    }
  }

  /**
   * 设置controller路由
   */
  private async loadRouters(): Promise<void> {
    console.log(chalk.blue("[koa2] loadRouters..."));
    let bean = Configuration.serverSettingMap.get("bean");
    return new Promise((res, err) => {
      // 设置controller 路径
      this.routerHelper.joinControllerPath(bean);
      // 载入路由
      this.routerHelper.loadRouter(this.app);
      res();
    });
  }

  /**
   * 错误处理中间件
   */
  private async errorMiddleware(): Promise<any> {
    let errorMiddleware = Configuration.serverSettingMap.get("globalError");

    if (errorMiddleware) {
      let errorMiddlewarFun = new errorMiddleware().use;
      let asyncMiddle = toErrorAsyncMiddleware(
        // 这里this指向的是类的原型
        errorMiddleware.prototype,
        errorMiddlewarFun,
        errorMiddlewarFun[ERR_MIDDLEWARE_NAME],
        this.paramsHelper.paramsToErrorList
      );
      this.app.on("error", asyncMiddle);
    }
  }

  /**
   * 启动服务
   */
  private async startServer(): Promise<any> {
    let port = Configuration.serverSettingMap.get("port");
    return new Promise<void>((res, err) => {
      this.app.listen(port);
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
      // 拦截器
      await this.loadInterceptor();
      // 载入中间件
      await this.useHook("onMountingMiddlewares", undefined, this.app);
      // 载入bodyParser
      await this.loadBodyParser();
      // 处理返回值
      await this.loadResponse();
      // 载入路由
      await this.loadRouters();
      // error处理中间件
      await this.errorMiddleware();
      // 启动服务
      await this.startServer();
      // 启动服务完成(生命周期)
      await this.useHook("onReady");
    } catch (error) {
      this.useHook("onServerInitError", undefined, error);
      Promise.reject(error);
      throw error;
    }
  }
}
