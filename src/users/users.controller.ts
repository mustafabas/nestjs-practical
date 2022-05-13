import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponse } from 'src/models';
import { RedditUser } from '../schemas/reddituser.schema';
import { SearchUserDto } from './dto/searchuser.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async searchUsers(
    @Query() query: Record<string, any>
  ): Promise<BaseResponse<RedditUser[]>> {
    const result = await this.usersService.searchUsers(query);
    const response: BaseResponse<RedditUser[]> = {
      result: result, 
      success: true,
      message: 'User retrieved successfully',
    };
    return response;
  }
}
