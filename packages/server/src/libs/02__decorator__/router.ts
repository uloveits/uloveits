/*
 * @Author: wangxian
 * @Date: 2022-06-01 16:56:39
 * @LastEditTime: 2022-06-10 11:29:19
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

export const RequestMapping = (params: IRouterParams): Function => {
  return (target: any, name: string, descriptor: any) => {
    console.log("RequestMapping", target, name, descriptor);
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

export const GetMapping = (path: string): Function => {
  return RequestMapping({ method: "GET", path });
};

export const PostMapping = (path: string): Function => {
  return RequestMapping({ method: "POST", path });
};

export const PutMapping = (path: string): Function => {
  return RequestMapping({ method: "PUT", path });
};

export const DeleteMapping = (path: string): Function => {
  return RequestMapping({ method: "DELETE", path });
};
