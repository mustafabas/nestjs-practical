import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { BaseResponse } from '../models';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserDtoResponse } from './dto/createuser.dto';
import { SignInResponse } from './dto/siginresponse.dto';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseResponse<CreateUserDtoResponse>> {
    const user = await this.authService.create(createUserDto);
    const response: BaseResponse<CreateUserDtoResponse> = {
      result: { userName: user.userName },
      success: true,
    };
    return response;
  }

  @Post('/signin')
  async signIn(@Body() signInRequest: CreateUserDto): Promise<any> {
    const accessToken = await this.authService.signIn(signInRequest);
    const response: BaseResponse<SignInResponse> = {
      result: { token: accessToken },
      success: true,
    };
    return response;
  }
}
