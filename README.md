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

`nest g mo` `nest go co` `nest go service` 可以简化成一个命令

#### 1. 创建模块

> nest g mo posts 创建一个posts模块，文件目录不写，默认创建和文件名一样的posts目录。在posts目录下新建 `posts.module.ts`

执行完成命令后，在 `src/app.module.ts`里引入了 `PostModule`这个模块。

`import { PostsModule } from './posts/posts.module';`

也在 装饰器`@Module`的`imports`参数中引入了`PostsModule`。


#### 2. 创建控制器

`nest g co posts`

#### 3. 创建服务类

`nest g service posts`

#### 创建顺序：Module -> Controller、Service。

### 连接数据库

MacOs安装mysql有两种方法

1. Mysql官网安装社区版
2. `brew install mysql`

#### 使用 TypeORM (ORM: Object-Relational Mapping)

1. 安装 `pnpm install @nestjs/typeorm typeorm mysql2 -S`

2. 连接数据库

   方法1)

   在项目根目录下新建 `.env`和 `.env.prod` 分别存 开发环境和 线上环境。

   ```
   // 数据库地址
   DB_HOST=localhost
   // 端口号
   DB_PORT=3306
   // 数据库登录名
   DB_USER=root
   // 数据库登录密码
   DB_PASSWORD=xxxx
   // 数据库名称
   DB_DATABASE=blog
   ``` 
   
   配置环境：在根目录下新建文件夹`config`，再新建`env.ts`(用于根据不同环境读取相应的配置文件)
   
   在 `app.module.ts`中连接数据库:

      1. 使用环境变量, 安装 @nestjs/config `pnpm install @nestjs/config -S`
      2. 配置(开箱即用)
  
  方法2)

    根目录下新增 `orm.config.ts`

    ```
    {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "12345678",
      "database": "blog",
      "entities": ["dist/**/*.entity{.ts,.js}"],
      "synchronize": true
    }
    ```

    在 `app.module.ts` 中调用 `TypeormModule.forRoot()` 即:

    ```
    import ormconfig from '../orm.config';

    @Module({
      imports: [
        TypeOrmModule.forRoot(ormconfig),
        PostsModule,
      ],
      controllers: [AppController, PostsController],
      providers: [AppService, PostsService],
    })
    ```

#### CRUD(create、read、update、delete)

##### 建表

`posts/posts.entity.ts`

##### 操作`CRUD`的业务逻辑

`posts/posts.service.ts`

### 接口格式统一

请求成功

```
{
  "code": 0,
  "message": "OK",
  "data": {}
}
```

请求失败

```
{
  "code": -1,
  "message": "error reason",
  "data": {}
}
```

#### 拦截错误请求

使用命令创建一个过滤器:

`nest g filter core/filter/http-exception`

编辑 `core/filter/http-exception/http-exception.filter.ts`

在`main.ts`中全局注册

`app.useGlobalFilters(new HttpExceptionFilter());`

#### 拦截成功的返回数据

使用命令创建一个拦截器

`nest g interceptor core/interceptor/transform`

编辑 `core/interceptor/transform/transform.interceptor.ts`

在`main.ts`中全局注册

`app.useGlobalInterceptors(new TransformInterceptor());`

### 配置接口文档Swagger

安装

`npm install @nestjs/swagger swagger-ui-express -S`

在`main.ts`配置Swagger文档信息

```
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...

  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8888);
}
bootstrap();
```

访问: `http://localhost:8888/docs`

#### 接口标签

可以根据`Controller`来分类，只要添加`@ApiTags`就可以

#### 接口传参

DTO(Data Transfer Object)

在 `post` 目录下创建一个`dto`文件夹，再创建一个`create-post.dto.ts`文件:

```
export class CreatePostDto {
  readonly title: string;
  readonly author: string;
  readonly content: string;
  readonly cover_url: string;
  readonly type: number;
}
```

在`Controller`中对创建文章是传入的参数进行类型说明：


### 数据验证

Nest.js中的`管道`就是专门用来做数据转换的。

Nest提供的: ValidationPipe、ParseIntPipe和ParseUUIDPipe, 其中ValidationPipe 配合class-validator

需要安装 `npm install class-validator class-transformer -S`