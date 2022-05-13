import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  password: string;
}

export class CreateUserDtoResponse {
  userName: string;
}
