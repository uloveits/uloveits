/*
 * @Author: wangxian
 * @Date: 2022-06-09 15:40:54
 * @LastEditTime: 2022-06-09 15:57:06
 */

import { Metadata } from "../01__core__/Metadata";
import { TIGA_APPLICATION } from "../constants";

export type TBean = { [path: string]: Function[] | Function };

export interface ITigaApplication {
  // 监听端口
  port?: string | number;
  // api
  bean?: TBean;
  // 拦截器
  interceptor?: Function;
  // 全局错误处理error middleware
  globalError?: Function;
  // 全局处理返回值 response middleware
  response?: Function;
  [key: string]: any;
}

/**
 * 服务启动配置项
 * @param application
 */
export const TigaApplication = (
  application: ITigaApplication
): ClassDecorator => {
  return (target: any) => {
    Metadata.set(TIGA_APPLICATION, application, target);
  };
};
