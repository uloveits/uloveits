/*
 * @Author: wangxian
 * @Date: 2022-06-02 08:37:29
 * @LastEditTime: 2022-06-10 14:11:17
 */
import { HttpStatus } from "../../../libs/constants";
import { IContext, IParamsMapValue, ParamsType, TNext } from "../../type";
import { getClassName } from "../../utils";

export default class ParamsHelper {
  // params 参数集合
  static paramsMap: Map<string, IParamsMapValue[]> = new Map();

  /**
   * 拼接 paramsMap key值
   * @param target
   * @param propertyKey
   */
  static fomartParamsMapKey(target: object | any, propertyKey: string) {
    return `${getClassName(target)}_${propertyKey}`;
  }

  /**
   * 返回参数序列
   * @param paramsMapKey
   * @param ctx
   */
  paramsToList(paramsMapKey: string, ctx: IContext, next: TNext) {
    // 不存在key值时直接返回一个空数组
    if (!ParamsHelper.paramsMap.has(paramsMapKey)) return [];
    return ParamsHelper.paramsMap.get(paramsMapKey).map((item) => {
      switch (item.paramsType) {
        case ParamsType.PATH_PARAMS:
          // path
          return ctx.params[item.paramsKey];
        case ParamsType.QUERY_PARAMS:
          // query
          return ctx.request.query[item.paramsKey];
        case ParamsType.BODY_PARAMS:
          // body
          return item.paramsKey
            ? ctx.request.body[item.paramsKey]
            : ctx.request.body;
        case ParamsType.REQUEST:
          // request
          return ctx.req;
        case ParamsType.RESPONSE:
          // response
          return ctx.response;
        case ParamsType.NEXT:
          // next
          return next;
        case ParamsType.HEADER_PARAMS:
          // header
          return item.paramsKey
            ? ctx.request.headers[item.paramsKey]
            : ctx.request.headers;
        default:
          break;
      }
    });
  }

  /**
   * 错误中间件参数处理
   * @param paramsMapKey
   * @param err
   * @param ctx
   */
  paramsToErrorList(paramsMapKey: string, err: Error, ctx: IContext): any[] {
    if (!ParamsHelper.paramsMap.has(paramsMapKey)) return [];
    return ParamsHelper.paramsMap.get(paramsMapKey).map((item) => {
      switch (item.paramsType) {
        case ParamsType.ERROR:
          // 异常字符处理
          return {
            message: err.message,
            status: err["status"] || HttpStatus.INTERNAL_SERVER_ERROR,
            data: err["errorData"],
          };
        default:
          break;
      }
    });
  }
}
