import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
// AppModule是应用程序的根模块，根模块提供了用来启动应用程序的引导机制，可以包含很多功能模块
export class AppModule {}
