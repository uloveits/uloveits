/*
 * @Author: wangxian
 * @Date: 2022-06-01 16:56:39
 * @LastEditTime: 2022-06-02 08:34:15
 */
/**
 * 路由基本方法
 * @Controller("/user")
 * class UserController{
 *    @Router({
 *        method: 'get',
 *        path: '/list'
 *    })
 *    async getUserList(){
 *    }
 * }
 */

import RouterHelper from "../01__core__/helper/RouterHelper";
import { IRouterParams } from "../type";

export const Router = (params: IRouterParams): Function => {
  return (target: any, name: string, descriptor: ParameterDecorator) => {
    RouterHelper.DecoratedRouters.set(
      {
        target,
        name,
        ...params,
      },
      target[name]
    );
  };
};

export const Get = (path: string): Function => {
  return Router({ method: "GET", path });
};

export const Post = (path: string): Function => {
  return Router({ method: "POST", path });
};

export const Put = (path: string): Function => {
  return Router({ method: "PUT", path });
};

export const Delete = (path: string): Function => {
  return Router({ method: "DELETE", path });
};
