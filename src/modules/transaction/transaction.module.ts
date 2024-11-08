import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [UserModule, ProductModule, QueueModule],
})
export class TransactionModule {}
