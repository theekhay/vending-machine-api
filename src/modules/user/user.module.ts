import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../database/entities/user.entity';
import { DatabaseModule } from '../../database/database.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [DatabaseModule.forFeature([User])],
  exports: [UserService, UserRepository],
})
export class UserModule {}
