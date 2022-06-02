/*
 * @Author: wangxian
 * @Date: 2022-06-02 08:54:57
 * @LastEditTime: 2022-06-02 09:07:13
 */

import { Metadata } from "../01__core__/Metadata";
import { CONTROLLER_PATH } from "../constants";
import { getClassName } from "../utils";

export const Controller = (path: string = "/"): ClassDecorator => {
  return (target: any): void => {
    Metadata.set(`${CONTROLLER_PATH}_${getClassName(target)}`, path, target);
  };
};
