import { TigaApplication } from "./libs/02__decorator__/application";
/*
 * @Author: wangxian
 * @Date: 2022-05-31 11:09:48
 * @LastEditTime: 2022-06-09 16:14:30
 */
import StartUp from "./libs/01__core__/StartUp";
import HomeController from "./controller/HomeController";

const serviceBean = { "/api": HomeController };

@TigaApplication({ bean: serviceBean })
class App extends StartUp {}

new App()
  .start()
  .then()
  .catch((e) => {});
