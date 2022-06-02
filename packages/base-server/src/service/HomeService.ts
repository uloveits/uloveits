/*
 * @Author: wangxian
 * @Date: 2022-06-01 15:51:53
 * @LastEditTime: 2022-06-02 09:17:17
 */
export default class HomeService {
  hello = () => {
    return new Promise((resolve) => resolve("hello world!!!!"));
  };
}
