import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

export class CreateUserDtoResponse {
  userName: string;
}
