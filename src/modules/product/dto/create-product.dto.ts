import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDTO {
  @ApiProperty({
    example: 'iphone x',
    description: 'The name of the product',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 5,
    description: 'The quantity of the product in-stock',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    example: 5,
    description: 'The price of the product',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
