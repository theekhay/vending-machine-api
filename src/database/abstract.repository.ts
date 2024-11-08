import { Logger } from '@nestjs/common';
import {
  DataSource,
  EntityTarget,
  Equal,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export abstract class AbstractRepository<T> extends Repository<T> {
  protected readonly logger = new Logger(AbstractRepository.name);
  private repository: Repository<T>;

  constructor(
    protected readonly dataSource: DataSource,
    private readonly entity: EntityTarget<T>,
  ) {
    super(entity, dataSource.createEntityManager());
    this.repository = dataSource.getRepository(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    try {
      return await this.repository.findOneOrFail({ where, relations });
    } catch (error) {
      this.logger.error('AbstractRepository :: findOne error');
      return null;
    }
  }

  async findById(id: string, relations?: FindOptionsRelations<T>): Promise<T> {
    try {
      const where = { id: Equal(id) } as unknown as FindOptionsWhere<T>;
      return await this.repository.findOneOrFail({ where, relations });
    } catch (error) {
      this.logger.error('AbstractRepository :: findById error  %o', error);
      return null;
    }
  }
}
