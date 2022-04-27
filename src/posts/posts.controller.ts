import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Snoowrap from 'snoowrap';
import { PostRedditService } from './post.reddit.service';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private postRedditService: PostRedditService) {}
  @Get()
  async getPosts() {
    return this.postRedditService.getPosts();
  }
}
