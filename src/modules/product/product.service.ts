import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { Equal } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { User } from '../../database/entities/user.entity';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createProductDTO: CreateProductDTO, user: User) {
    try {
      return await this.productRepository.save(
        this.productRepository.create({ ...createProductDTO, seller: user }),
      );
    } catch (error) {
      this.logger.error('ProductService :: createProduct error %o', error);
      throw error;
    }
  }

  async fetchProduct(productId: string) {
    try {
      await this.productRepository.findOneBy({
        id: Equal(productId),
      });
    } catch (error) {
      this.logger.error('ProductService :: fetchProduct error %o', error);
      throw error;
    }
  }

  async updateProduct(productId: string, updateProductDTO: UpdateProductDTO) {
    try {
      await this.productRepository.update(
        { id: Equal(productId) },
        updateProductDTO,
      );

      return this.productRepository.findById(productId);
    } catch (error) {
      this.logger.error('ProductService :: updateProduct error %o', error);
      throw error;
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.productRepository.softDelete({
        id: Equal(productId),
      });
    } catch (error) {
      this.logger.error('ProductService :: deleteProduct error %o', error);
      throw error;
    }
  }
}
