import homeController from './controller/HomeController';

export default [
  {
    path: '/',
    method: 'get',
    action: homeController.hello
  }
];
