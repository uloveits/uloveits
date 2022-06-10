/*
 * @Author: wangxian
 * @Date: 2022-06-01 15:51:53
 * @LastEditTime: 2022-06-10 09:48:28
 */

import { ResponseBody } from "../libs/02__decorator__/param";
export default class HomeService {
  
  @ResponseBody()
  hello = () => {
    console.log("HomeService");

    return "hello world!!!!";
  };
}
