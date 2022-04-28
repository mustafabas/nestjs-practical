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
  async getLastUser() {
    const lastRedditUser = await this.redditUserModel.findOne(
      {},
      {},
      { sort: { created_at: -1 } },
    );
    return lastRedditUser;
  }
}
