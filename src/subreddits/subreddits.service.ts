import { Injectable, Logger } from '@nestjs/common';
import { SubReddit, SubRedditDocument } from '../schemas/subreddit.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SearchSubRedditDto } from './dto/searchsubreddit.dto';

@Injectable()
export class SubredditsService {
  private readonly logger = new Logger(SubredditsService.name);

  constructor(
    @InjectModel(SubReddit.name)
    private subRedditModel: Model<SubRedditDocument>,
  ) {}

  async findOneOrderByRedditCreated(orderBy: number): Promise<SubReddit> {
    const firstSubReddit = await this.subRedditModel.findOne(
      {},
      {},
      { sort: { created: orderBy } },
    );
    return firstSubReddit;
  }

  async getSubRedditByName(name: string): Promise<SubReddit> {
    return await this.subRedditModel.findOne({ name: name });
  }

  async getSubRedditWithPostByTitle(name: string): Promise<SubReddit> {
    return await this.subRedditModel.findOne({ title: name }).populate('posts');
  }

  async searchSubReddit(
    searchSubRedditDto: SearchSubRedditDto,
  ): Promise<SubReddit[]> {
    let { limit, offset } = searchSubRedditDto;
    if (limit === 0) limit = 100;
    if (!offset) offset = 0;

    if (searchSubRedditDto.displayName) {
      return await this.subRedditModel
        .find({
          display_name: {
            $regex: '.*' + searchSubRedditDto.displayName + '.*',
          },
        })
        .limit(limit)
        .skip(offset);
    }
    return await this.subRedditModel.find().limit(limit).skip(offset);
  }

  async findAllSubReddits(): Promise<SubReddit[]> {
    return await this.subRedditModel.find();
  }

  async updateSubReddit(subReddit: SubReddit){
    return await this.subRedditModel.updateOne(subReddit);
  }
}
