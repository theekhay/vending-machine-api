import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';
import { AbstractRepository } from '../../../database/abstract.repository';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductRepository.name);

  constructor(protected dataSource: DataSource) {
    super(dataSource, Product);
  }
}
