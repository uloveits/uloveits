/*
 * @Author: wangxian
 * @Date: 2022-06-09 14:55:38
 * @LastEditTime: 2022-06-10 14:16:24
 */

import { ERR_MIDDLEWARE_NAME, MIDDLEWARE_NAME } from "../constants";
import { getClassName } from "../utils";

export const Middleware = () => {
  return (target: any) => {
    // 给use方法添加一个middlewarName属性
    let middlewarName = `${getClassName(target)}_use`;
    target.prototype.use[MIDDLEWARE_NAME] = middlewarName;
  };
};

/**
 * error 注解，修饰全局处理error中间件
 */
export const ErrorMiddlewar = () => {
  return (target: object | any) => {
    let middlewarName = `${getClassName(target)}_use`;
    target.prototype.use[ERR_MIDDLEWARE_NAME] = middlewarName;
  };
};
