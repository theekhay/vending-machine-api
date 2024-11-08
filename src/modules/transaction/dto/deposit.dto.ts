import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class DepositDTO {
  @ApiProperty({
    example: 5,
    description: 'Only 50,100, 200, 500 and 1,000 notes are allowed',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(50)
  @Max(1000)
  amount: number;
}
