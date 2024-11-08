import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../modules/auth/auth.service';
import { ILogin } from '../interfaces/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string) {
    try {
      return (await this.authService.validateUser({
        email: email?.toLowerCase(),
        password,
      })) as ILogin;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
