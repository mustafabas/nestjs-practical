import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { REDDIT_POST_LIST_URL } from '../constant';
import { ConfigService } from '@nestjs/config';
import { PostsService } from './posts.service';
import { Post } from '../schemas/post.schema';
import { SubredditsService } from '../subreddits/subreddits.service';
import { Cron } from '@nestjs/schedule';
import { SubReddit } from '../schemas/subreddit.schema';

@Injectable()
export class PostsClientTaskService {
  private readonly logger = new Logger(PostsClientTaskService.name);

  constructor(
    private potsService: PostsService,
    private configService: ConfigService,
    private subRedditService: SubredditsService,
  ) {}

  @Cron('0 45 * * * *	')
  async synchronizePostsTask() {
    const dayBefore = new Date();
    dayBefore.setHours(
      dayBefore.getDay() -
        this.configService.get<number>('DAY_FOR_LAST_POST_INITIALIZATION'),
    );
    const subReddits = await this.subRedditService.findAllSubReddits();
    this.logger.log('Post synchronization started');
    for await (const subReddit of subReddits) {
      const lastPost = await this.potsService.findOneOrderByRedditCreated(
        -1,
        subReddit._id.toString(),
      );
      let lastPostTemp: any = {
        name: lastPost ? lastPost.name : '',
        created: lastPost ? lastPost.created : '',
      };
      while (1) {
        let url = `${REDDIT_POST_LIST_URL}/${subReddit.display_name}/new.json?count=100&limit=100`;
        if (!!lastPostTemp.name) url += `&after=${lastPostTemp.name}`;
        let postsResponse: any;

        try {
          postsResponse = await axios.get(url);
        } catch (ex) {
          break;
        }

        if (postsResponse) {
          const postsData: any = postsResponse.data.data.children;
          if (postsData.length > 0) {
            const postItems: Post[] = [];
            const fetchedFirstPost = postsData[0].data;

            if (lastPostTemp && lastPostTemp.name == fetchedFirstPost.name) {
              console.log('lasttime');
              break;
            }

            const fetchedLastPost = postsData[postsData.length - 1].data;
            lastPostTemp = {
              name: fetchedLastPost.name,
              created: fetchedLastPost.created,
            };
            await postsData.reduce(async (_promise, post) => {
              const element: Post = post.data as Post;
              element.internalSubReddit = subReddit._id;
              const postAny = await this.potsService.getPostByName(
                element.name,
              );
              if (!postAny) postItems.push(element);
            }, Promise.resolve());

            if (postItems.length > 0) {
              await this.potsService.insertMany(postItems);
              this.logger.log(`${postItems.length} posts saved`);
            }

            if (postsResponse.data.data.dist < 100) break;
          } else {
            break;
          }
        }
      }
    }
    this.logger.log('Post synchronization finished');
  }
}
