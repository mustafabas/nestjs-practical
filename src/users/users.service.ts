import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';
import { SearchUserDto } from './dto/searchuser.dto';
import { ConfigService } from '@nestjs/config';

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

  async searchUsers(searchUserDto: SearchUserDto): Promise<RedditUser[]> {
    let { limit, offset } = searchUserDto;
    if (limit === 0) limit = 100;
    if (!offset) offset = 0;

    if (searchUserDto.displayName) {
      return await this.redditUserModel
        .find({
          display_name: { $regex: '.*' + searchUserDto.displayName + '.*' },
        })
        .limit(limit)
        .skip(offset);
    }
    return await this.redditUserModel.find().limit(limit).skip(offset);
  }
}
