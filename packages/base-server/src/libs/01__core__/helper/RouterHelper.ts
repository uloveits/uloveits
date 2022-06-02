/*
 * @Author: wangxian
 * @Date: 2022-06-01 17:11:13
 * @LastEditTime: 2022-06-02 10:27:36
 */
import * as Router from "koa-router";
import * as Koa from "koa";
import * as path from "path";
import { isArray, toArray } from "lodash";
import { IRouterPathConfig, TApiMiddleware } from "../../type";
import { CONTROLLER_PATH, MIDDLEWARE_NAME } from "../../constants";
import {
  apiDescriptionMapKey,
  getClassName,
  toAsyncMiddleware,
} from "../../utils";
import ParamsHelper from "./ParamsHelper";
import { Metadata } from "../Metadata";

type TRouterMiddleware = Router.IMiddleware;

export default class RouterHelper {
  private router: Router;
  private paramsHelper: ParamsHelper;

  constructor() {}
  /**
   * 路由配置信息
   */
  static DecoratedRouters: Map<
    IRouterPathConfig,
    TApiMiddleware | Array<TApiMiddleware>
  > = new Map();

  /**
   * 接口描述映射表
   */
  static DescriptionMap: Map<string, string> = new Map();

  /**
   * 载入路由
   */
  loadRouter(app: Koa) {
    let controllerList = [];
    let descriptionsMap = RouterHelper.DescriptionMap;
    for (let [config, controllers] of RouterHelper.DecoratedRouters) {
      if (!isArray(controllers)) {
        controllers = toArray(<TApiMiddleware>controllers);
      }
      // 重置数组内中间件方法
      controllers = (controllers as TApiMiddleware[]).map((item) => {
        // 获取paramsMapKey参数
        // usebefore 特殊处理
        let controllerName =
          item.name != "use"
            ? item.name
            : `${config.name}_${item[MIDDLEWARE_NAME]}`;
        // 整理参数
        let paramsMapKey = ParamsHelper.fomartParamsMapKey(
          config.target,
          controllerName
        );
        // 转换方法
        return toAsyncMiddleware(
          config.target,
          item,
          paramsMapKey,
          this.paramsHelper.paramsToList
        );
      });

      let routerPath = path
        .join(
          Metadata.getOwn(
            `${CONTROLLER_PATH}_${getClassName(config.target)}`,
            config.target
          ),
          <string>config.path
        )
        .split(path.sep)
        .join("/");

      // 判断追加中间件
      let multerKey = `${getClassName(config.target)}_${config.name}_Multer`;
      if (config.target[multerKey]) {
        controllers.unshift(config.target[multerKey]);
      }

      this.router[config.method.toLocaleLowerCase()](
        routerPath,
        ...(<TRouterMiddleware[]>controllers)
      );
      // 接口列表 print
      controllerList.push({
        method: config.method,
        url: routerPath,
        name: `${getClassName(config.target)}.${config.name}`,
        description:
          descriptionsMap.get(
            apiDescriptionMapKey(config.target, config.name)
          ) || "",
      });
    }
    app.use(this.router.routes());
    app.use(this.router.allowedMethods());
    // 日志
    // let logstr = this.loggerService.drawTable(controllerList, {
    //   padding: 1,
    //   header: {
    //     method: "Method",
    //     url: "Endpoint",
    //     name: "Class method",
    //     description: "Description",
    //   },
    // });
    // this.loggerService.info("\n" + logstr.trim());
    // 节约内存
    RouterHelper.DescriptionMap.clear();
    RouterHelper.DecoratedRouters.clear();
  }

  /**
   * 拼接controller 路径
   * @param imports
   */
  joinControllerPath(imports) {
    Object.keys(imports).forEach((key) => {
      if (isArray(imports[key])) {
        (imports[key] as any[]).forEach((item) => {
          let metadataName = `${CONTROLLER_PATH}_${getClassName(item)}`;
          let controllerPath = path
            .join(this.startWithSep(key), Metadata.getOwn(metadataName, item))
            .split(path.sep)
            .join("/");
          Metadata.set(metadataName, controllerPath, item);
        });
        
      } else {
        let metadataName = `${CONTROLLER_PATH}_${getClassName(imports[key])}`;
        let importsPath = Metadata.getOwn(metadataName, imports[key]);
        // 对window兼容，就要做一些处理
        let controllerPath = path
          .join(this.startWithSep(key), importsPath)
          .split(path.sep)
          .join("/");
        Metadata.set(metadataName, controllerPath, imports[key]);
      }
    });

  }

  /**
   * 添加 /
   */
  startWithSep(key: string) {
    if (!key.startsWith("/")) {
      key = `/${key}`;
    }
    return key;
  }
}
