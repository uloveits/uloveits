/*
 * @Author: wangxian
 * @Date: 2022-06-09 15:50:08
 * @LastEditTime: 2022-06-10 14:19:49
 */
import { TBean } from "./../02__decorator__/application";
/**
 * 基础设置类
 */

import { ITigaApplication } from "../02__decorator__/application";
import { Value } from "../02__decorator__/service";
import { Env, TIGA_APPLICATION } from "../constants";
import { TigaResponse } from "./Response";
import { Metadata } from "./Metadata";
import { TigaGlobalError } from "./Error";

// 根目录
const rootDir = process.cwd();
// 环境变量
const env = (process.env.NODE_ENV as Env) || Env.DEV;

export class Configuration implements ITigaApplication {
  /**
   * 端口号
   */
  @Value(8090)
  port: string | number;
  /**
   * 环境变量
   */
  @Value(env) env: string;
  /**
   * API
   */
  @Value()
  bean: TBean;
  /**
   * 错误处理
   */
  @Value(TigaGlobalError) globalError: Function;

  /**
   * 返回值处理
   */
  @Value(TigaResponse) response: Function;
  /**
   * 拦截器
   */
  interceptor: Function;

  static serverSettingMap = new Map<string, any>();

  /**
   * 子类实例对象,这个是关键的方法，用来获取设置参数的
   * @param target
   */
  getMetadata(target: any) {
    return Metadata.getOwn(TIGA_APPLICATION, target);
  }

  /**
   * 设置字段
   * @param propertyKey
   * @param value
   */
  setMap(propertyKey: string | ITigaApplication, value?: any): void {
    if (typeof propertyKey == "string") {
      Configuration.serverSettingMap.set(propertyKey, value);
    } else {
      let setting = {
        port: this.port,
        env: this.env,
        globalError: this.globalError,
        response: this.response,
        ...propertyKey,
      };
      // imports 特殊处理
      let _bean = this.bean;
      let bean = setting["bean"];
      setting["bean"] = { ...bean, ..._bean };

      Object.keys(setting).forEach((key) => {
        this.setMap(key, setting[key]);
      });
    }
  }

  /**
   * 构建端口
   * listion(port, '0.0.0.0', callback)
   */
  getHttpPort(): { hostname: string; port: string | number } {
    let hostname = "localhost";
    return { hostname, port: Configuration.serverSettingMap.get("port") };
  }
}
