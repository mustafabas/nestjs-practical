import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserDtoResponse } from './dto/createuser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserDtoResponse> {
    const user = await this.authService.create(createUserDto);
    console.log(user);
    return { userName: user.userName };
  }

  @Post('/signin')
  async signIn(@Body() signInRequest: CreateUserDto): Promise<any> {
    return await this.authService.signIn(signInRequest);
  }
}
