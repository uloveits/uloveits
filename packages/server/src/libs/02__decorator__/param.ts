/**
 * Create a parameters decorators
 */

import ParamsHelper from "../01__core__/helper/ParamsHelper";
import { Metadata } from "../01__core__/Metadata";
import { ParamsType } from "../type";
import { descriptorOf, toArray } from "../utils";

const decorate = (
  target: Object,
  propertyKey: string,
  parameterIndex: number,
  paramsKey: string,
  type: ParamsType
) => {
  let paramsMap = ParamsHelper.paramsMap;
  // 拼接map字符key 类名_方法名
  let paramsMapKey = ParamsHelper.fomartParamsMapKey(target, propertyKey);
  let paramsValueList = toArray(paramsMap.get(paramsMapKey));
  // 按照序列填充数组
  paramsValueList[parameterIndex] = {
    parameterIndex,
    paramsType: type,
    paramsKey,
  };
  console.log("decorate", paramsMapKey, paramsValueList);
  ParamsHelper.paramsMap.set(paramsMapKey, paramsValueList);
};

export const RequestParam = (paramsKey: string | any): ParameterDecorator => {
  return (target: Object, propertyKey: string, parameterIndex: number): any => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.QUERY_PARAMS
    );
  };
};

export const RequestBody = (paramsKey?: string | any) => {
  return (target: Object, propertyKey: string, parameterIndex: number): any => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.BODY_PARAMS
    );
  };
};

export const PathVariable = (paramsKey: string | any) => {
  return (target: Object, propertyKey: string, parameterIndex: number): any => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.PATH_PARAMS
    );
  };
};

export const Response = () => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.RESPONSE);
  };
};

export const ResponseBody = (): Function => {
  return (target: Object, propertyKey: string) => {
    console.log("ResponseBody");
    // 获取该属性的类型
    let typeClass = Metadata.getType(target, propertyKey);
    const descriptor = descriptorOf(target, propertyKey) || {
      writable: true,
      configurable: true,
    };
    console.log(typeClass(), typeClass["propertyKey"]);
    descriptor.value = 123;
  };
};

export const Request = () => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.REQUEST);
  };
};

export const HeaderParams = (paramsKey: string | any = "") => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.HEADER_PARAMS
    );
  };
};

export const Next = () => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.NEXT);
  };
};

export const Err = () => {
  return (
    target: object | any,
    propertyKey: string,
    parameterIndex: number
  ) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.ERROR);
  };
};
