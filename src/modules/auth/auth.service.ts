import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../database/entities/user.entity';
import { UserService } from '../user/user.service';
import { ILogin } from '../../interfaces/auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly jwtExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpiresIn = configService.getOrThrow('JWT_EXPIRES_IN_SECONDS');
  }

  async login(user: User) {
    try {
      const token = await this.jwtService.signAsync(
        {
          id: user.id,
          role: user.role,
        },
        {
          expiresIn: this.jwtExpiresIn,
        },
      );

      return { token, user };
    } catch (error) {
      this.logger.error('AuthService :: loginAuth error %o ', error);

      throw error;
    }
  }

  async validateUser(payload: ILogin) {
    const { email, password } = payload;

    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user || user?.deletedAt) {
        throw new BadRequestException(
          `User with email: ${email} does not exist`,
        );
      }

      const isValid = await user.isValidPassword(password);

      if (!isValid)
        throw new BadRequestException('Incorrect email or password');

      return user;
    } catch (error) {
      this.logger.error('authservice :: validateUser error \n %o', error);
      throw error;
    }
  }
}
