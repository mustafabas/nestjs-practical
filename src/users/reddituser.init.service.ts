import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import axios from 'axios';
import { REDDIT_USER_LIST_URL } from '../constant';

@Injectable()
export class RedditUsersInitService implements OnModuleInit {
  private readonly logger = new Logger(RedditUsersInitService.name);

  constructor(
    @InjectModel(RedditUser.name)
    private redditUserModel: Model<RedditUserDocument>,
    private usersService: UsersService
  ) {}
  async onModuleInit() {
    const firstRedditUser = await this.usersService.findOneOrderByRedditCreated(
      1,
    );
    let firstRedditUserTemp: any = {
      name: firstRedditUser ? firstRedditUser.name : '',
      created: firstRedditUser ? firstRedditUser.created : '',
    };

    const oneHourBefore = new Date();
    while (1) {
      if (!!firstRedditUserTemp.created) {
        const firstUserCreatedDate = new Date(
          firstRedditUserTemp.created * 1000,
        );
        if (firstUserCreatedDate < oneHourBefore) break;
      }
      let url = `${REDDIT_USER_LIST_URL}?count=100&limit=100`;
      if (!!firstRedditUserTemp.name)
        url += `&after=${firstRedditUserTemp.name}`;
      const usersResponse = await axios.get(url);
      const usersData: any = usersResponse.data.data.children;
      const userDocumentItems: RedditUser[] = [];
      const fetchedLastUser = usersData[usersData.length - 1].data;
      firstRedditUserTemp = {
        name: fetchedLastUser.name,
        created: fetchedLastUser.created,
      };

      await usersData.reduce(async (promise, redditUserData) => {
        const element: RedditUser = redditUserData.data as RedditUser;
        const userCheck = await this.usersService.getUserByName(element.name);
        if (userCheck) console.log(userCheck.name, 'found');
        if (!userCheck) userDocumentItems.push(element);
      }, Promise.resolve());
      await this.redditUserModel.insertMany(userDocumentItems);
      this.logger.log(`${userDocumentItems.length} users saved`);
    }
    this.logger.log('user initialization finished');
  }
}
