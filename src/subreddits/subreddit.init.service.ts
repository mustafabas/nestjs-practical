import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { REDDIT_SUBREDDIT_LIST_URL } from '../constant';
import { SubReddit, SubRedditDocument } from '../schemas/subreddit.schema';
import { SubredditsService } from './subreddits.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubRedditInitService implements OnModuleInit {
  private readonly logger = new Logger(SubRedditInitService.name);

  constructor(
    @InjectModel(SubReddit.name)
    private subRedditModel: Model<SubRedditDocument>,
    private subRedditService: SubredditsService,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    const firstSubReddit =
      await this.subRedditService.findOneOrderByRedditCreated(1);

    let firstSubRedditTemp: any = {
      name: firstSubReddit ? firstSubReddit.name : '',
      created: firstSubReddit ? firstSubReddit.created : '',
    };

    const oneDayBefore = new Date();
    oneDayBefore.setDate(
      oneDayBefore.getDate() -
        this.configService.get<number>('DAY_FOR_LAST_SUBREDDIT_INITIALIZATION'),
    );

    while (1) {
      if (!!firstSubRedditTemp.created) {
        const firstUserCreatedDate = new Date(
          firstSubRedditTemp.created * 1000,
        );
        if (firstUserCreatedDate < oneDayBefore) break;
      }
      let url = `${REDDIT_SUBREDDIT_LIST_URL}?count=100&limit=100`;
      if (!!firstSubRedditTemp.name) url += `&after=${firstSubRedditTemp.name}`;
      const subRedditResponse = await axios.get(url);
      const subRedditData: any = subRedditResponse.data.data.children;
      const subReddits: SubReddit[] = [];
      const fetchedLastUser = subRedditData[subRedditData.length - 1].data;
      firstSubRedditTemp = {
        name: fetchedLastUser.name,
        created: fetchedLastUser.created,
      };

      await subRedditData.reduce(async (promise, redditUserData) => {
        const element: SubReddit = redditUserData.data as SubReddit;
        const userCheck = await this.subRedditService.getSubRedditByName(
          element.name,
        );
        if (userCheck) console.log(userCheck.name, 'found');
        if (!userCheck) subReddits.push(element);
      }, Promise.resolve());
      await this.subRedditModel.insertMany(subReddits);
      this.logger.log(`${subReddits.length} subreddit saved`);
    }
    this.logger.log('subreddit initialization finished');
  }
}
