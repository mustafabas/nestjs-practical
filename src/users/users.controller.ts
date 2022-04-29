import { Controller, Get } from '@nestjs/common';
import { RedditUserClientTaskService } from './reddituser.client.service';

@Controller('users')
export class UsersController {
  constructor(private redditUserClient: RedditUserClientTaskService) {}

  @Get()
  async getUsers() {
    //await this.redditUserClient.fillUsersTask();
    return "";
    }
}
