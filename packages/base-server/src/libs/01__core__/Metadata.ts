/*
 * @Author: wangxian
 * @Date: 2022-06-02 09:05:09
 * @LastEditTime: 2022-06-02 09:05:15
 */

import  "reflect-metadata";
import { DESIGN_TYPE } from "../constants";
import { getClass } from "../utils";

export class Metadata {
  static get(key: string, target: any, propertyKey: string | symbol): any {
    return Reflect.getMetadata(key, getClass(target), propertyKey);
  }

  static set(
    key: string,
    value: any,
    target: any,
    propertyKey?: string | symbol
  ): any {
    return propertyKey
      ? Reflect.defineMetadata(key, value, getClass(target), propertyKey)
      : Reflect.defineMetadata(key, value, getClass(target));
  }

  static getOwn(key: string, target: any, propertyKey?: string | symbol): any {
    return propertyKey
      ? Reflect.getOwnMetadata(key, getClass(target), propertyKey)
      : Reflect.getOwnMetadata(key, getClass(target));
  }

  static getType(target, propertyKey?: string | symbol) {
    return Reflect.getMetadata(DESIGN_TYPE, target, propertyKey);
  }
}
