import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { RedditUserClientTaskService } from './reddituser.client.service';
import { RedditUsersInitService } from './reddituser.init.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Model } from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        RedditUserClientTaskService,
        RedditUsersInitService,
        {
          provide: getModelToken(RedditUser.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should searchUsers return response successfully', async () => {
    const mockResult: RedditUser[] = [
      {
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
      },
    ];

    jest.spyOn(usersService, 'searchUsers').mockResolvedValue(mockResult);
    const controllerResult = await controller.searchUsers({
      displayName: 'test',
      limit: 1,
      offset: 0,
    });
    expect(controllerResult.success).toBe(true);
    expect(controllerResult.result.length).toBe(1);
  });
});
