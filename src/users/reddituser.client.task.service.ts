import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { REDDIT_USER_LIST_URL } from '../constant';

@Injectable()
export class RedditUserClientTaskService {
  private readonly logger = new Logger(RedditUserClientTaskService.name);

  constructor(
    @InjectModel(RedditUser.name)
    private redditUserModel: Model<RedditUserDocument>,
    private usersService: UsersService,
  ) {}

  @Cron('0 30 * * * *	')
  async synchronizeUsersTask() {
    this.logger.log('Users synchronization started');
    const lastRedditUser = await this.usersService.findOneOrderByRedditCreated(
      -1,
    );
    let lastResponseUserName = '';
    while (1) {
      let isLastUserFound = false;
      let url = `${REDDIT_USER_LIST_URL}?count=100&limit=100`;
      if (lastResponseUserName) url += `&after=${lastResponseUserName}`;
      const users = await axios.get(url);
      const usersData: any[] = users.data.data.children;
      lastResponseUserName = usersData[usersData.length - 1].data.name;
      const userDocumentItems: RedditUser[] = [];
      for (const redditUserData of usersData) {
        const element: RedditUser = redditUserData.data as RedditUser;
        if (element.name === lastRedditUser.name) {
          this.logger.debug('Last saved user found, synchronization will end');
          isLastUserFound = true;
          break;
        }
        if (!isLastUserFound) {
          const userCheck = await this.usersService.getUserByName(element.name);
          if (userCheck === null) userDocumentItems.push(element);
        }
      }
      if (userDocumentItems.length)
        await this.redditUserModel.insertMany(userDocumentItems);
      this.logger.log(`${userDocumentItems.length} Users Saved`);
      if (isLastUserFound) break;
    }
    this.logger.log('Users synchronization ended');
    return;
  }
}
