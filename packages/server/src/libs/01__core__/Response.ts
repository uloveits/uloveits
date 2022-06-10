/*
 * @Author: wangxian
 * @Date: 2022-06-09 15:07:43
 * @LastEditTime: 2022-06-09 15:19:28
 */

import { Middleware } from "../02__decorator__/middlewares";
import { Next, Response } from "../02__decorator__/param";
import { HttpStatus, ResponseStatus } from "../constants";
import { IContext, IMiddleware, TNext, TResponse } from "../type";
import { TigaError } from "./Error";

@Middleware()
export class TigaResponse implements IMiddleware {
  async use(
    @Response() response: TResponse,
    @Next() next: TNext,
    ctx: IContext
  ) {
    try {
      // 执行前面所有的中间件
      await next();
      let body = response.body || ctx.body;
      // 统一处理返回
      if (body) {
        return (response.body = {
          code: 0,
          message: ResponseStatus.SUCCESS,
          data: response.body,
        });
      }
      return (response.body = { code: 0, message: ResponseStatus.SUCCESS });
    } catch (err) {
      ctx.status = err.code;
      response.status = HttpStatus.OK;
      if (err instanceof TigaError) {
        response.body = {
          code: err.code,
          message: err.message || ResponseStatus.ERROR,
        };
      } else {
        response.body = {
          code: err.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message || ResponseStatus.ERROR,
        };
        // 未识别错误 抛至最外层error全局处理
        throw err;
      }
    }
  }
}
