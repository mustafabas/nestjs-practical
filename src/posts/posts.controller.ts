import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam } from '@nestjs/swagger';
import { BaseResponse } from '../models';
import { Post } from '../schemas/post.schema';
import { PostsService } from './posts.service';

@Controller('api')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get('posts')
  async getPosts(
    @Query() query: Record<string, any>,
  ): Promise<BaseResponse<Post[]>> {
    const posts = await this.postsService.searchPosts(query);
    const response: BaseResponse<Post[]> = {
      result: posts,
      success: true,
      message: 'Posts retrieved successfully',
    };
    return response;
  }
  @Get('posts/:subreddit')
  async getPostsBySubReddit(@Param('subreddit') subreddit: string) {
    const posts = await this.postsService.findBySubReddit(subreddit);
    const response: BaseResponse<Post[]> = {
      result: posts,
      success: true,
      message: 'Posts retrieved successfully',
    };
    return response;
  }

  @Get('post/:id')
  async getById(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    const response: BaseResponse<Post> = {
      result: post,
      success: true,
      message: 'Post retrieved successfully',
    };
    return response;
  }
  @Delete('post/:id')
  async deleteById(@Param('id') id: string) {
    const deleted = await this.postsService.deleteById(id);
    return deleted;
  }

}
