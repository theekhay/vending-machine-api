import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLES } from '../../../enums/roles.enum';
export class CreateUserDTO {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {
    value?.toLowerCase();
    return value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase();
  })
  firstName: string;

  @ApiProperty({
    example: 'John',
    description: 'The last name of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {
    value?.toLowerCase();
    return value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase();
  })
  lastName: string;

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
    example: 'john.doe123',
    description: 'The username of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  username: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Password of the user.',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: USER_ROLES.BUYER,
    description: 'Role of the user.',
    type: String,
    required: true,
    enum: USER_ROLES,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(USER_ROLES)
  role: USER_ROLES;
}
