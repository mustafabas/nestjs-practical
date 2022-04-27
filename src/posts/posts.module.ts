import { Module } from '@nestjs/common';
import { PostRedditService } from './post.reddit.service';
import { PostsController } from './posts.controller';

@Module({
  controllers: [PostsController],
  providers: [PostRedditService],
})
export class PostsModule {}
