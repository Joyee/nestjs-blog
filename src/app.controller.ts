import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app') // @Controller装饰器，用来定义控制器。
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get() // 请求方法的装饰器，对getHello()方法进行修饰，表示这个方法会被GET请求调用
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get('list')
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('list')
  create(): string {
    return 'create a post'
  }

  @Get('user_*')
  getUser(){ return 'getUser' }

  @Put('list/user') // 写在 @Put('list/:id') 前面
  updateUser() {
    return { userId: 1 }
  }

  @Put('list/:id')
  update() {
    return 'update'
  }
}
