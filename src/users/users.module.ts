import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedditUser, RedditUserSchema } from '../schemas/reddituser.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RedditUsersInitService } from './reddituser.init.service';
import { ConfigModule } from '@nestjs/config';
import { RedditUserClientTaskService } from './reddituser.client.task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RedditUser.name, schema: RedditUserSchema }
    ]),
    ScheduleModule.forRoot(),
    ConfigModule,
    ],
  providers: [
    UsersService,
    RedditUserClientTaskService,
    RedditUsersInitService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
