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
    @Query() searchSubRedditDto: SearchSubRedditDto,
  ): Promise<BaseResponse<SubReddit[]>> {
    const result = await this.subRedditservice.searchSubReddit(
        searchSubRedditDto,
    );
    const response: BaseResponse<SubReddit[]> = {
      result: result,
      success: true,
      message: 'Subreddits retrieved successfully',
    };
    return response;
  }
}
