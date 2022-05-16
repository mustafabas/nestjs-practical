import { Module } from '@nestjs/common';
import { SubredditsService } from './subreddits.service';
import { SubredditsController } from './subreddits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SubReddit, SubRedditSchema } from '../schemas/subreddit.schema';
import { SubRedditInitService } from './subreddit.init.service';
import { ConfigModule } from '@nestjs/config';
import { SubRedditClientTaskService } from './subreddit.client.task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubReddit.name, schema: SubRedditSchema },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule,
  ],
  providers: [
    SubredditsService,
    SubRedditInitService,
    SubRedditClientTaskService,
  ],
  controllers: [SubredditsController],
})
export class SubredditsModule {}
