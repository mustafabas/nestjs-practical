import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { Model } from 'mongoose';
import { RedditUserClientTaskService } from './reddituser.client.task.service';
import { UsersService } from './users.service';
import axios from 'axios';

describe('RedditUserClientTaskService', () => {
  let service: RedditUserClientTaskService;
  let mockUserModel: Model<RedditUserDocument>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        RedditUserClientTaskService,
        {
          provide: getModelToken(RedditUser.name),
          useValue: Model,
        },
      ],
    }).compile();

    mockUserModel = module.get<Model<RedditUserDocument>>(
      getModelToken(RedditUser.name),
    );

    usersService = module.get<UsersService>(UsersService);

    service = module.get<RedditUserClientTaskService>(
      RedditUserClientTaskService,
    );
  });

  it('it should sync user successfully and insert', async () => {
    const mockResult: RedditUser = {
      display_name: 'test',
      created: 2332231321,
      banner_img: 'test',
      created_at: new Date(),
      emojis_enabled: true,
      hide_ads: 'false',
      icon_image: 'icon-img',
      name: 'test',
      prediction_leader_board_entry_type: 'TES',
      public_description: 'test',
      quarantine: 'test',
      title: 'test',
    };
    const lastRedditUser = { ...mockResult, name: '444' };

    jest
      .spyOn(usersService, 'findOneOrderByRedditCreated')
      .mockResolvedValue(lastRedditUser);

    const children = [
      { data: mockResult },
      { data: { ...mockResult, name: '444' } },
    ];

    const axiosResultMock = { data: { data: { children: children } } };

    jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResultMock);

    const searchBuilder: any = {
      insertMany: () => true,
      findOne: () => lastRedditUser,
    };
    jest
      .spyOn(mockUserModel, 'findOne')
      .mockImplementation(() => searchBuilder.findOne);
    jest
      .spyOn(mockUserModel, 'insertMany')
      .mockImplementation(() => searchBuilder.insertMany);

    jest.spyOn(usersService, 'getUserByName').mockResolvedValueOnce(null);
    await service.synchronizeUsersTask();
    expect(mockUserModel.insertMany).toBeCalledTimes(1);
  });


//   it('it should not sync when does not exist new data', async () => {
//     const mockResult: RedditUser = {
//       display_name: 'test',
//       created: 2332231321,
//       banner_img: 'test',
//       created_at: new Date(),
//       emojis_enabled: true,
//       hide_ads: 'false',
//       icon_image: 'icon-img',
//       name: 'test',
//       prediction_leader_board_entry_type: 'TES',
//       public_description: 'test',
//       quarantine: 'test',
//       title: 'test',
//     };

//     jest
//       .spyOn(usersService, 'findOneOrderByRedditCreated')
//       .mockResolvedValue(mockResult);

//     const children = [{ data: mockResult }];

//     const axiosResultMock = { data: { data: { children: children } } };

//     jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResultMock);

//     const searchBuilder: any = {
//       insertMany: () => true,
//       findOne: () => mockResult,
//     };
//     jest
//       .spyOn(mockUserModel, 'findOne')
//       .mockImplementation(() => searchBuilder.findOne);
//     jest
//       .spyOn(mockUserModel, 'insertMany')
//       .mockImplementation(() => searchBuilder.insertMany);

//     jest.spyOn(usersService, 'getUserByName').mockResolvedValueOnce(null);
//     await service.synchronizeUsersTask();
//     expect(mockUserModel.insertMany).toBeCalledTimes(0);
//   });
});
