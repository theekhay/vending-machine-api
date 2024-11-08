import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseModel } from '../../models/response-model';
import { LocalAuthGuard } from '../../passport/local-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Create a new user',
    type: '',
  })
  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    const response = await this.userService.createUser(createUserDTO);
    return ResponseModel.success('User created successfully', response);
  }

  @ApiResponse({
    status: 200,
    description: 'Login',
    type: '',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUser() currentUser: any, @Body() loginDTO: LoginDTO) {
    try {
      const response = await this.authService.login(currentUser);
      return ResponseModel.success('success', response);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
