/*
 * @Author: wangxian
 * @Date: 2022-06-02 08:33:45
 * @LastEditTime: 2022-06-02 09:07:02
 */

import { IContext, TApiMiddleware, TNext } from "./type";

/**
 *  获取类
 * @param target
 */
export const getClass = (target: any): any => {
  return target.prototype ? target : target.constructor;
};

/**
 * 获取类名
 */
export const getClassName = (target: any): string => {
  return typeof target === "function" ? target.name : target.constructor.name;
};

/**
 * 在每个方法的最外层封装一个原装的中间件，
 * 这样就能够在各自的方法体内获得属性修饰器，不受原来koa中间件的影响
 * @param target 关系this指向
 * @param middleware 新lenneth中间件
 * @param key 存储map key
 */
export const toAsyncMiddleware = (
  target: Object | any,
  middleware: TApiMiddleware,
  key?: string,
  cb?: (key: string, ctx: IContext, next: TNext) => any[]
) => {
  return async (ctx: IContext, next: TNext) => {
    if (key) {
      // 此处一定要用call来重新设置this指向
      return middleware.call(target, ...cb(key, ctx, next), ctx, next);
    }
    return middleware.call(target, ctx, next);
  };
};

/**
 * 接口描述映射表key
 * @param target
 * @param propertyKey
 */
export const apiDescriptionMapKey = (
  target: object | any,
  propertyKey: any
) => {
  return `${getClassName(target)}_${propertyKey}`;
};


/**
 * 获取该属性的描述对象
 * @param target 类
 * @param propertyKey 目标属性
 */
 export const descriptorOf = (
  target: any,
  propertyKey: string
): PropertyDescriptor | undefined => {
  return Reflect.getOwnPropertyDescriptor(
    (target && target.prototype) || target,
    propertyKey
  );
};