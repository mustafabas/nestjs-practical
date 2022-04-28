import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import axios from 'axios';

@Injectable()
export class RedditUsersInitService implements OnModuleInit {
  constructor(
    @InjectModel(RedditUser.name)
    private redditUserModel: Model<RedditUserDocument>,
    private usersService: UsersService,
  ) {}
  async onModuleInit() {
    const fiveDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));
    while (1) {
      const lastRedditUser = await this.usersService.getLastUser();
      if (lastRedditUser) {
        console.log(lastRedditUser);
        const lastAddedDate = new Date(lastRedditUser.created * 1000);
        console.log(lastAddedDate, 'lastAddedDate');
        if (lastAddedDate < fiveDaysAgo) {
          break;
        }
      }
      const users = await axios.get('https://www.reddit.com/users/new.json', {
        params: {
          count: 100,
          limit: 100,
          after: lastRedditUser ? lastRedditUser.name : '',
        },
      });
      const usersData: any = users.data.data.children;
      const userDocumentItems: RedditUser[] = [];

      usersData.forEach((redditUserData: any) => {
        const element: RedditUser = redditUserData.data as RedditUser;
        userDocumentItems.push(element);
      });
      const created = await this.redditUserModel.insertMany(userDocumentItems);
      console.log('Users Saved');
    }
    console.log('user initialization finished');
  }
}
