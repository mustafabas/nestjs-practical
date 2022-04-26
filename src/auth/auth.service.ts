import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createuser.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
  async findByUserName(username: string): Promise<User> {
    return await this.userModel.findOne({ userName: username }).exec();
  }
  async signIn(signInRequest: CreateUserDto): Promise<string> {
    const { userName, password } = signInRequest;
    const user = await this.findByUserName(userName);
    console.log(user, 'user');
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username: userName };
      const accessToken: string = await this.jwtService.sign(payload);
      return accessToken;
    }
    throw new UnauthorizedException('Please check your login credentials');
  }
}
