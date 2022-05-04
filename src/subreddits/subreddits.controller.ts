import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from '../models';
import { SubReddit } from '../schemas/subreddit.schema';
import { SearchSubRedditDto } from './dto/searchsubreddit.dto';
import { SubredditsService } from './subreddits.service';

@Controller('api/reddits')
export class SubredditsController {
  constructor(private subRedditservice: SubredditsService) {}

  @Get()
  async searchSubReddits(
    @Query() query,
  ): Promise<BaseResponse<SubReddit[]>> {
      
    const result = await this.subRedditservice.searchSubReddit(
        query,
    );
    const response: BaseResponse<SubReddit[]> = {
      result: result,
      success: true,
      message: 'User retrieved successfully',
    };
    return response;
  }
}
