/*
 * @Author: wangxian
 * @Date: 2022-06-01 15:51:53
 * @LastEditTime: 2022-06-10 13:59:02
 */

import { Controller } from "../libs/02__decorator__/controller";
import HomeService from "../service/HomeService";
import { Autowired } from "../libs/02__decorator__/service";
import { PathVariable, Response } from "src/libs/02__decorator__/param";
import { TResponse } from "../libs/type";
import { GetMapping } from "src/libs/02__decorator__/router";

@Controller("/user")
export default class HomeController {
  @Autowired()
  homeService: HomeService;

  @GetMapping("/list/:userId")
  async hello(
    @PathVariable("userId") userId: string,
    @Response() response: TResponse
  ) {
    response.body = this.homeService.hello();
  }
}
