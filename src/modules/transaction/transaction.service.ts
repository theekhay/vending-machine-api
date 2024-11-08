import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { ProductRepository } from '../product/repositories/product.repository';
import { BuyDTO } from './dto/buy.dto';
import { User } from '../../database/entities/user.entity';
import { Product } from '../../database/entities/product.entity';
import { Equal } from 'typeorm';
import { DepositDTO } from './dto/deposit.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async deposit(userId: string, depositDTO: DepositDTO) {
    const { amount } = depositDTO;

    if (![50, 100, 200, 500, 1000].includes(amount)) {
      throw new BadRequestException(
        'Only 50, 100, 200, 500, and 1,000 notes are allowed',
      );
    }

    try {
      await this.userRepository.manager.transaction(async (manager) => {
        const user = await manager.findOne(User, {
          where: { id: userId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!user) {
          throw new BadRequestException('User not found');
        }

        user.balance += amount;

        await manager.save(user);
      });

      return await this.userRepository.findById(userId);
    } catch (error) {
      // this.logger.error('UserService :: Deposit error %o', error);
      console.log('error', error);
      throw error;
    }
  }

  async buy(userId: string, buyDTO: BuyDTO) {
    const { productId, quantity } = buyDTO;

    let response;
    try {
      await this.userRepository.manager.transaction(async (manager) => {
        // Lock user row
        const user = await manager.findOne(User, {
          where: { id: Equal(userId) },
          lock: { mode: 'pessimistic_write' },
        });

        if (!user) {
          throw new BadRequestException('User not found');
        }

        // Lock product row
        const product = await manager.findOne(Product, {
          where: { id: Equal(productId) },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new BadRequestException('Product not found');
        }

        if (product.quantity < quantity) {
          throw new BadRequestException('Not enough stock for the product');
        }

        // Calculate total cost
        const totalCost = product.price * quantity;

        // Check if user has enough balance
        if (user.balance < totalCost) {
          throw new BadRequestException('Insufficient balance');
        }

        // Deduct balance and update product stock
        user.balance -= totalCost;
        product.quantity -= quantity;

        // Save updated user and product within the transaction
        await manager.save(user);
        await manager.save(product);

        // Calculate remaining change in denominations
        const change = this.calculateChange(user.balance);

        // Update and return response with transaction details
        response = {
          totalSpent: totalCost,
          productPurchased: {
            id: product.id,
            name: product.name,
            quantity,
            pricePerUnit: product.price,
          },
          change,
        };
      });

      return response;
    } catch (error) {
      this.logger.error('UserService :: Buy error', error);
      throw error;
    }
  }

  async resetBalance(userId: string) {
    try {
      await this.userRepository.manager.transaction(async (manager) => {
        // Lock the user row
        const user = await manager.findOne(User, {
          where: { id: userId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!user) {
          throw new BadRequestException('User not found');
        }

        // Reset user balance to zero
        user.balance = 0;
        await manager.save(user);
      });

      return await this.userRepository.findById(userId);
    } catch (error) {
      this.logger.error('UserService :: Reset balance error', error);
      throw error;
    }
  }

  private calculateChange(amount: number): { [key: number]: number } {
    const denominations = [1000, 500, 200, 100, 50];
    const change = {};

    for (const note of denominations) {
      change[note] = Math.floor(amount / note);
      amount %= note;
    }

    return change;
  }
}
