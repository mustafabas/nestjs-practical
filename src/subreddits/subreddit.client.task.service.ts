import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { REDDIT_SUBREDDIT_LIST_URL } from '../constant';
import { SubReddit, SubRedditDocument } from '../schemas/subreddit.schema';
import { SubredditsService } from './subreddits.service';

@Injectable()
export class SubRedditClientTaskService {
  private readonly logger = new Logger(SubRedditClientTaskService.name);

  constructor(
    @InjectModel(SubReddit.name)
    private subRedditModel: Model<SubRedditDocument>,
    private subRedditsService: SubredditsService,
  ) {}

  @Cron('0 05 * * * *	')
  async synchronizeSubredditTask() {
    this.logger.log('Subredddit synchronization started');
    const lastSubReddit =
      await this.subRedditsService.findOneOrderByRedditCreated(-1);
    let lastSubRedditName = '';
    while (1) {
      let isLastSubRedditFound = false;
      let url = `${REDDIT_SUBREDDIT_LIST_URL}?count=100&limit=100`;
      if (lastSubRedditName) url += `&after=${lastSubRedditName}`;
      const subRedditResponse = await axios.get(url);
      const subRedditsData: any[] = subRedditResponse.data.data.children;
      lastSubRedditName = subRedditsData[subRedditsData.length - 1].data.name;
      const subReddits: SubReddit[] = [];
      for (const subRedditItem of subRedditsData) {
        const element: SubReddit = subRedditItem.data as SubReddit;
        if (element.name === lastSubReddit.name) {
          this.logger.debug(
            'Last saved subreddit found, synchronization will end',
          );
          isLastSubRedditFound = true;
          break;
        }
        if (!isLastSubRedditFound) {
          const subRedditCheck =
            await this.subRedditsService.getSubRedditByName(element.name);
          if (subRedditCheck === null) subReddits.push(element);
        }
      }
      if (subReddits.length) await this.subRedditModel.insertMany(subReddits);

      this.logger.log(`${subReddits.length} Subreddit Saved`);
      if (isLastSubRedditFound) break;
    }
    this.logger.log('SubReddits synchronization ended');
    return;
  }
}
