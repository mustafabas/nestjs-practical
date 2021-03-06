import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(RedditUser.name)
    private redditUserModel: Model<RedditUserDocument>
  ) {}
  async findOneOrderByRedditCreated(orderBy: number): Promise<RedditUser> {
    const firstRedditUser = await this.redditUserModel.findOne(
      {},
      {},
      { sort: { created: orderBy } },
    );
    return firstRedditUser;
  }

  async getUserByName(name: string): Promise<RedditUser> {
    return await this.redditUserModel.findOne({ name: name });
  }

  async searchUsers(query: Record<string, any>): Promise<RedditUser[]> {
    let limit = 100;
    let offset = 0;
    if (query) {
      if (query.limit) limit = query.limit;
      if (query.offset) offset = query.offset;
    }
    const whereCondition = this.prepareWhereCondiditon(query);
    if (whereCondition) {
      return await this.redditUserModel
        .find({ ...whereCondition })
        .limit(limit)
        .skip(offset);
    }
    return await this.redditUserModel.find().limit(limit).skip(offset);
  }

  prepareWhereCondiditon(query: Record<string, any>): Record<string, any> {
    delete query.limit;
    delete query.offset;
    for (const prop in query) {
      if (query[prop] === 'true') {
        const str = '{"' + prop + '":' + true + '}';
        const newfield = JSON.parse(str);
        query = { ...query, ...newfield };
      } else if (query[prop] === 'false') {
        const str = '{"' + prop + '":' + false + '}';
        const newfield = JSON.parse(str);
        query = { ...query, ...newfield };
      }
    }
    return query;
  }
}
