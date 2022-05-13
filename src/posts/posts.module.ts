import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SubredditsModule } from '../subreddits/subreddits.module';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsClientTaskService } from './posts.client.task.service';
import { SubredditsService } from 'src/subreddits/subreddits.service';
import { PostsService } from './posts.service';
import { SubReddit, SubRedditSchema } from 'src/schemas/subreddit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: SubReddit.name, schema: SubRedditSchema },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule,
    SubredditsModule,
  ],
  controllers: [PostsController],
  providers: [PostsClientTaskService, PostsService, SubredditsService],
})
export class PostsModule {}
