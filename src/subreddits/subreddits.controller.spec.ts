import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { SubredditsController } from './subreddits.controller';
import { SubReddit } from '../schemas/subreddit.schema';
import { SubRedditClientTaskService } from './subreddit.client.task.service';
import { SubRedditInitService } from './subreddit.init.service';
import { SubredditsService } from './subreddits.service';

describe('SubRedditsController', () => {
  let controller: SubredditsController;
  let subRedditsService: SubredditsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SubredditsService,
        SubRedditClientTaskService,
        SubRedditInitService,
        {
          provide: getModelToken(SubReddit.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
      ],
      controllers: [SubredditsController],
    }).compile();

    controller = module.get<SubredditsController>(SubredditsController);
    subRedditsService = module.get<SubredditsService>(SubredditsService);
  });

  it('should searchUsers return response successfully', async () => {
    const mockResult: SubReddit[] = [
      {
        display_name: 'r/test',
        created: 2332231321,
        name: 'test',
        title: 'test',
        id: 'te213',
        subscribers: 5,
        created_at: new Date(),
      },
    ];

    jest
      .spyOn(subRedditsService, 'searchSubReddit')
      .mockResolvedValue(mockResult);
    const controllerResult = await controller.searchSubReddits({
      displayName: 'test',
      limit: 1,
      offset: 0,
    });
    expect(controllerResult.success).toBe(true);
    expect(controllerResult.result.length).toBe(1);
    expect(controllerResult.message).toBe('Subreddits retrieved successfully');
  });
});
