import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 使用环境变量
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { PostsService } from './posts/posts.service';
import envConfig from '../config/env';
import ormconfig from '../orm.config';
import { PostsEntity } from './posts/posts.entity';

@Module({
  imports: [
    // 使用方法一这样处理
    // ConfigModule.forRoot({
    //   envFilePath: [envConfig.path],
    //   isGlobal: true,
    // }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     type: 'mysql', // 数据库类型
    //     entities: [PostsEntity], // 数据库实体
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: configService.get<number>('DB_PORT', 3306),
    //     username: configService.get('DB_USER', 'root'),
    //     password: configService.get('DB_PASSWORD', '12345678'),
    //     database: configService.get('DB_DATABASE', 'blog'),
    //     timezone: '+08:00', // 服务器上配置的时区
    //     synchronize: true, // 根据实体自动创建数据库表，生产环境建议关闭
    //   })
    // }),
    // 方法二不需要任何配置，都放在了 orm.config.ts
    TypeOrmModule.forRoot({
      ...ormconfig,
      autoLoadEntities: true,
    }),
    PostsModule,
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService],
})
// AppModule是应用程序的根模块，根模块提供了用来启动应用程序的引导机制，可以包含很多功能模块
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
