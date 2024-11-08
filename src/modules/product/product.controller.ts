import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../passport/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { User } from '../../database/entities/user.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { ResponseModel } from '../../models/response-model';
import { IsProductOwnerGuard } from '../../guards/is-product-owner-guard';
import { IsSellerGuard } from '../../guards/is-seller.guard';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: 200,
    description: 'Create new product',
    type: '',
  })
  @UseGuards(JwtAuthGuard, IsSellerGuard)
  @Post()
  async createProduct(
    @AuthUser() user: User,
    @Body() createProductDTO: CreateProductDTO,
  ) {
    const response = await this.productService.createProduct(
      createProductDTO,
      user,
    );
    return ResponseModel.success('Product created successfully', response);
  }

  @ApiResponse({
    status: 200,
    description: 'fetch a single product',
    type: '',
  })
  @Get(':/productId')
  async fetchProduct(@Param('productId') productId: string) {
    const response = await this.productService.deleteProduct(productId);
    return ResponseModel.success('Product deleted successfully', response);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a product',
    type: '',
  })
  @UseGuards(JwtAuthGuard, IsSellerGuard, IsProductOwnerGuard)
  @Delete(':/productId')
  async updateProduct(
    @Body() updateProductDTO: UpdateProductDTO,
    @Param('productId') productId: string,
  ) {
    const response = await this.productService.updateProduct(
      productId,
      updateProductDTO,
    );
    return ResponseModel.success('Product updated successfully', response);
  }
  @ApiResponse({
    status: 200,
    description: 'Delete a product',
    type: '',
  })
  @UseGuards(JwtAuthGuard, IsProductOwnerGuard)
  @Delete(':/productId')
  async deleteProduct(@Param('productId') productId: string) {
    const response = await this.productService.deleteProduct(productId);
    return ResponseModel.success('Product deleted successfully', response);
  }
}
