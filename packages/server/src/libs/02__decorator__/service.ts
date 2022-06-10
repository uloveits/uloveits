/*
 * @Author: wangxian
 * @Date: 2022-06-06 08:25:27
 * @LastEditTime: 2022-06-10 10:17:50
 */
import { Metadata } from "../01__core__/Metadata";
import { descriptorOf } from "../utils";

/**
 * 注入service，类属性修饰器
 * @param params 实例化参数
 */
export const Autowired = (params: any = ""): Function => {
  return (target: any, propertyKey: string) => {
    // 获取该属性的类型
    let typeClass = Metadata.getType(target, propertyKey);
    const descriptor = descriptorOf(target, propertyKey) || {
      writable: true,
      configurable: true,
    };
    // 实例化修饰类
    descriptor.value = params ? new typeClass(params) : new typeClass();
    console.log("==============Autowired==========", target, propertyKey);

    Reflect.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
  };
};

/**
 * 赋值
 * @param value
 */
export const Value = (value: string | any = "") => {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {
      writable: true,
      configurable: true,
    };
    descriptor.value = value;
    Reflect.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
  };
};
