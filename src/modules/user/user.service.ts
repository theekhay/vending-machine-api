import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { Equal } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDTO: CreateUserDTO) {
    try {
      const userExists = await this.userRepository.findBy([
        {
          email: Equal(createUserDTO.email),
        },
        {
          username: Equal(createUserDTO.username),
        },
      ]);

      if (userExists.length) {
        throw new BadRequestException('User already exists');
      }

      return await this.userRepository.save(
        this.userRepository.create(createUserDTO),
      );
    } catch (error) {
      this.logger.error('createUser error %o', error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({
      email: Equal(email),
    });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOneBy({
      id: Equal(id),
    });
  }
}
