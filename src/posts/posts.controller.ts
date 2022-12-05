import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dot';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '创建文章' })
  @Post()
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  @Get()
  async findAll(@Query() query) {
    return await this.postsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.postsService.deleteById(id);
  }
}
