/*
 * @Author: wangxian
 * @Date: 2022-06-01 15:51:53
 * @LastEditTime: 2022-06-02 10:15:26
 */
import { Get } from "../libs/02__decorator__/router";
import { Controller } from "../libs/02__decorator__/controller";
import HomeService from "../service/HomeService";

@Controller("/user")
export default class HomeController {
  private service: HomeService = new HomeService();

  @Get("/list")
  hello = async (ctx) => {
    ctx.body = await this.service.hello();
  };
}
