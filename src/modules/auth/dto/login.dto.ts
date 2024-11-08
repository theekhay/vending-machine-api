import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ILogin } from '../../../interfaces/auth';
import { Transform } from 'class-transformer';

export class LoginDTO implements ILogin {
  @ApiProperty({
    example: 'janedoe@test.com',
    description: 'Email of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Password of the user.',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
