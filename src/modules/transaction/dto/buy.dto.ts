import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, IsPositive } from 'class-validator';

export class BuyDTO {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the product to purchase',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product to purchase',
    type: Number,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
