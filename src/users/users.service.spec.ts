import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RedditUser, RedditUserDocument } from '../schemas/reddituser.schema';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<RedditUserDocument>;
  let configService : ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(RedditUser.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
        ConfigService
      ],
    }).compile();
    mockUserModel = module.get<Model<RedditUserDocument>>(
      getModelToken(RedditUser.name),
    );

    service = module.get<UsersService>(UsersService);
  });

  it('it should response user successfully', async () => {
    const searchBuilder: any = {
      limit: () => searchBuilder,
      skip: () => {
        return [{ display_name: 'asda' }, { display_name: 'asdad' }];
      },
      groupBy: () => searchBuilder,
      where: () => searchBuilder,
    };

    jest.spyOn(mockUserModel, 'find').mockImplementation(() => searchBuilder);

    const result = await service.searchUsers({
      displayName: '12',
      limit: 2,
      offset: 0,
    });
    expect(result.length).toBe(2);
  });
});
