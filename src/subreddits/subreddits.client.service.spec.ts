import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import axios from 'axios';
import { SubReddit, SubRedditDocument } from '../schemas/subreddit.schema';
import { SubredditsService } from './subreddits.service';
import { SubRedditClientTaskService } from './subreddit.client.task.service';

describe('SubRedditClientTaskService', () => {
  let service: SubRedditClientTaskService;
  let mockUserModel: Model<SubRedditDocument>;
  let subRedditsService: SubredditsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubredditsService,
        SubRedditClientTaskService,
        {
          provide: getModelToken(SubReddit.name),
          useValue: Model,
        },
      ],
    }).compile();

    mockUserModel = module.get<Model<SubRedditDocument>>(
      getModelToken(SubReddit.name),
    );

    subRedditsService = module.get<SubredditsService>(SubredditsService);

    service = module.get<SubRedditClientTaskService>(
      SubRedditClientTaskService,
    );
  });

  it('it should sync subreddits successfully and insert', async () => {
    const mockResult: SubReddit = {
      display_name: 'test',
      created: 2332231321,
      created_at: new Date(),
      name: 'test',
      title: 'test',
      subscribers: 10,
      id: 't_521',
    };
    const lastSubReddit = { ...mockResult, name: 'test6' };

    jest
      .spyOn(subRedditsService, 'findOneOrderByRedditCreated')
      .mockResolvedValue(lastSubReddit);

    const children = [
      { data: mockResult },
      { data: { ...mockResult, name: 'test6' } },
    ];

    const axiosResultMock = { data: { data: { children: children } } };

    jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResultMock);

    const searchBuilder: any = {
      insertMany: () => true,
      findOne: () => lastSubReddit,
    };
    jest
      .spyOn(mockUserModel, 'findOne')
      .mockImplementation(() => searchBuilder.findOne);
    jest
      .spyOn(mockUserModel, 'insertMany')
      .mockImplementation(() => searchBuilder.insertMany);

    jest
      .spyOn(subRedditsService, 'getSubRedditByName')
      .mockResolvedValueOnce(null);
    await service.synchronizeSubredditTask();
    expect(mockUserModel.insertMany).toBeCalledTimes(1);
  });
});
