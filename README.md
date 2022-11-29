## 目录结构说明

|文件名称| 说明
|-------|--------
|app.controller.ts | 单个路由的基本控制器(Controller)
|app.controller.spec.ts | 针对控制器的单元测试
|app.module.ts|应用程序的根模块(Module)|
|app.service.ts|具有单一方法的基本服务(Service)
|main.ts|应用程序的入口文件，它使用核心函数NestFactory来创建Nest应用程序的实例

### 入口 main.ts

引入 AppModule(在 .module文件中 )。AppModule是应用程序的根模块，根模块提供了用来启动应用的引导机制，可以包含很多功能模块。

.module文件需要使用 @Module() 装饰器的类。装饰器可以理解为一个封装好的函数

@Module() 接受四个属性: providers、controllers、imports、exports

- providers: Nest.js注入器实例化的提供者，处理具体的业务逻辑，各个模块之间可以共享
- controllers: 处理http请求，包括路由控制，向客户端返回响应，将具体的业务逻辑委托给providers处理
- imports: 导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入
- exports: 导出服务的列表，供其他模块导入使用，如果希望当前模块下的服务可以被其他模块共享，需要在这里导出

### 路由装饰器

Nest.js中没有单独配置路由的地方，而是使用装饰器。

#### @Controller

可以传入一个路径参数，作为访问这个控制器的主路径:
`@Controller('app')`

#### HTTP方法处理装饰器

@Get、@Post、@Put 等众多用于HTTP方法处理装饰器。接受一个字符串或一个字符串数组作为参数，这里的字符串可以是固定的路径，也可以是通配符。

#### 全局路由前缀

比如给全部路由加上`/api`前缀。需要修改 `main.ts`。

```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(8888);
}
bootstrap();
```

### nest-cli常用的命令

`nest g [文件类型] [文件名] [文件目录]`

#### 1. 创建模块

> nest g mo posts 创建一个posts模块，文件目录不写，默认创建和文件名一样的posts目录。在posts目录下新建 `posts.module.ts`

执行完成命令后，在 `src/app.module.ts`里引入了 `PostModule`这个模块。

`import { PostsModule } from './posts/posts.module';`

也在 装饰器`@Module`的`imports`参数中引入了`PostsModule`。


#### 2. 创建控制器

`nest g co posts`
