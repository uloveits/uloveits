/*
 * @Author: wangxian
 * @Date: 2022-06-01 17:07:37
 * @LastEditTime: 2022-06-02 10:12:20
 */
import * as Koa from "koa";

export type TService = { [path: string]: Function[] | Function };
export type PathOrParamsType = string | RegExp | (string | RegExp)[];
export interface IRouterParams {
  method: string;
  path: PathOrParamsType;
}
export type TApiMiddleware = (...args: any[]) => Promise<any>;
export interface IRouterPathConfig {
  // 目标类
  target: any;
  // 请求方式
  method: string;
  // 路由path路径
  path: PathOrParamsType;
  // 类方法
  name: string;
}
export interface IContext extends Koa.Context {}
export type TMiddleware = Koa.Middleware;
export type TResponse = Koa.Response;
export type TRequest = Koa.Request;
export type TNext = () => Promise<any>;
export type TPromise = () => Promise<any>;

/**
 * 参数类型枚举
 */
export enum ParamsType {
  QUERY_PARAMS = "query",
  BODY_PARAMS = "body",
  PATH_PARAMS = "path",
  REQUEST = "request",
  RESPONSE = "response",
  NEXT = "next",
  HEADERPARAMS = "header",
  ERROR = "error",
}

export interface IParamsMapKey {
  // 目标类
  target: object | any;
  // 方法名
  propertyKey: string | symbol;
}

export interface IParamsMapValue {
  // 参数序号
  parameterIndex: number;
  // 请求方式
  paramsType: ParamsType;
  // 参数名(切记，不是修饰的参数名，而是挂载在request上的属性)
  paramsKey: string;
}
