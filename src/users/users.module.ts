import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedditUser, RedditUserSchema } from '../schemas/reddituser.schema';
import { RedditUserClientTaskService } from './reddituser.client.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RedditUsersInitService } from './reddituser.init.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RedditUser.name, schema: RedditUserSchema }
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    UsersService,
    RedditUserClientTaskService,
    RedditUsersInitService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
