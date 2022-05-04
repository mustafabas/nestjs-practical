import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { SubReddit, SubRedditDocument } from '../schemas/subreddit.schema';
import { SubredditsService } from './subreddits.service';
import { ConfigService } from '@nestjs/config';

describe('SubredditsService', () => {
  let service: SubredditsService;
  let mockSubRedditModel: Model<SubRedditDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubredditsService,
        {
          provide: getModelToken(SubReddit.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
        ConfigService,
      ],
    }).compile();
    mockSubRedditModel = module.get<Model<SubRedditDocument>>(
      getModelToken(SubReddit.name),
    );

    service = module.get<SubredditsService>(SubredditsService);
  });

  it('it should response subreddits successfully', async () => {
    const searchBuilder: any = {
      limit: () => searchBuilder,
      skip: () => {
        return [{ display_name: 'asda' }, { display_name: 'asdad' }];
      },
      groupBy: () => searchBuilder,
      where: () => searchBuilder,
    };
    jest
      .spyOn(mockSubRedditModel, 'find')
      .mockImplementation(() => searchBuilder);
    const result = await service.searchSubReddit({
      displayName: '12',
      limit: 2,
      offset: 0,
    });
    expect(result.length).toBe(2);
  });
});
