import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../database/entities/user.entity';

@Injectable()
export class IsProductOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const productId = request.Param.productId;

    const user: User = request.user;

    if (!user) {
      throw new Error('Invalid user');
    }

    const product = user?.products.find((product) => product.id == productId);

    if (!product) {
      throw new Error('Unauthorized access.');
    }

    return true;
  }
}
