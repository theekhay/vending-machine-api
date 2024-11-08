import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { IsBuyerGuard } from '../../guards/is-buyer.guard';
import { ResponseModel } from '../../models/response-model';
import { JwtAuthGuard } from '../../passport/jwt-auth.guard';
import { DepositDTO } from './dto/deposit.dto';
import { BuyDTO } from './dto/buy.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, IsBuyerGuard)
  @Post('deposit')
  @ApiResponse({
    status: 200,
    description: 'Deposit into vending machine balance',
  })
  async deposit(@Body() depositDTO: DepositDTO, @AuthUser() user: User) {
    const response = await this.transactionService.deposit(user.id, depositDTO);
    return ResponseModel.success('Deposit successfully', response);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, IsBuyerGuard)
  @Post('buy')
  @ApiResponse({ status: 200, description: 'Buy a product' })
  async buy(@Body() buyDTO: BuyDTO, @AuthUser() user: User) {
    const response = await this.transactionService.buy(user.id, buyDTO);
    return ResponseModel.success('Deposit successfully', response);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, IsBuyerGuard)
  @Post('reset')
  @ApiResponse({ status: 200, description: 'Reset balance to zero' })
  async resetBalance(@AuthUser() user: User) {
    const response = await this.transactionService.resetBalance(user.id);
    return ResponseModel.success('Reset successfully', response);
  }
}
