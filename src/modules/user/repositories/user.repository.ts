import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AbstractRepository } from '../../../database/abstract.repository';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(protected dataSource: DataSource) {
    super(dataSource, User);
  }
}
