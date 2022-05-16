import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}
  async findOneOrderByRedditCreated(
    orderBy: number,
    subRedditId: string,
  ): Promise<Post> {
    const post = await this.postModel.findOne(
      { internalSubReddit: subRedditId },
      {},
      { sort: { created: orderBy } },
    );
    return post;
  }

  async getPostByName(name: string): Promise<Post> {
    return await this.postModel.findOne({ name: name });
  }

  async searchPosts(query: Record<string, any>): Promise<Post[]> {
    let limit = 100;
    let offset = 0;
    if (query) {
      if (query.limit) limit = query.limit;
      if (query.offset) offset = query.offset;
    }
    const whereCondition = this.prepareWhereCondiditon(query);
    if (whereCondition) {
      return await this.postModel
        .find({ ...whereCondition })
        .limit(limit)
        .skip(offset);
    }
    return await this.postModel.find().limit(limit).skip(offset);
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

  async insertMany(posts: Post[]) {
    await this.postModel.insertMany(posts);
  }

  async findBySubReddit(subReddit: string): Promise<Post[]> {
    return await this.postModel.find(
      { subreddit: subReddit },
      {},
      { sort: { created: -1 } },
    );
  }

  async findById(id: string) {
    const post = await this.postModel.findById(id);
    if (post == null) {
      throw new NotFoundException("post couldn't find with the given paramete");
    }
    return post;
  }
  async deleteById(id: string) {
    const post = await this.findById(id);
    await this.postModel.remove(post);
    return true;
  }
}
