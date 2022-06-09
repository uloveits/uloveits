/*
 * @Author: wangxian
 * @Date: 2022-06-01 15:51:53
 * @LastEditTime: 2022-06-09 13:53:04
 */
import { Get } from "../libs/02__decorator__/router";
import { Controller } from "../libs/02__decorator__/controller";
import HomeService from "../service/HomeService";
import { Autowired } from "../libs/02__decorator__/service";

@Controller("/user")
export default class HomeController {
  @Autowired()
  homeService: HomeService;

  @Get("/list")
  async hello(ctx) {
    console.log("=======HomeController.hello", ctx);
  
    ctx.body = this.homeService.hello();
  }
}
