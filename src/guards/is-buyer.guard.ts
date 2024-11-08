import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../database/entities/user.entity';
import { USER_ROLES } from '../enums/roles.enum';

@Injectable()
export class IsBuyerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (user?.role != USER_ROLES.BUYER) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return true;
  }
}
