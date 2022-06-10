/*
 * @Author: wangxian
 * @Date: 2022-06-09 15:17:15
 * @LastEditTime: 2022-06-10 14:19:10
 */

import { ErrorMiddlewar } from "../02__decorator__/middlewares";
import { Err } from "../02__decorator__/param";
import { IErrorResponse, IMiddleware } from "../type";

/**
 * 全局默认error 事件捕获 处理
 */
@ErrorMiddlewar()
export class TigaGlobalError implements IMiddleware {
  async use(@Err() error: any) {
    // this.logger.error(error);
    console.log("error", error);
  }
}

/**
 * 自定义异常
 */
export class TigaError extends Error {
  code: string | number;
  constructor(err_opt: IErrorResponse) {
    super();
    this.name = err_opt.name;
    this.code = err_opt.code;
    this.message = err_opt.message;
  }
}
