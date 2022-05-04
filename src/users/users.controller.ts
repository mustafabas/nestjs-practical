import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from 'src/models';
import { RedditUser } from '../schemas/reddituser.schema';
import { SearchUserDto } from './dto/searchuser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async searchUsers(
    @Query() searchUserDto: SearchUserDto,
  ): Promise<BaseResponse<RedditUser[]>> {
    const result = await this.usersService.searchUsers(searchUserDto);
    const response: BaseResponse<RedditUser[]> = {
      result: result,
      success: true,
      message: 'User retrieved successfully',
    };
    return response;
  }
}
