import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(RedditUser.name)
    private redditUserModel: Model<RedditUserDocument>,
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
}
