import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { EventDispatcherService } from './dispatch.service';

@Global()
@Module({
  imports: [],
  controllers: [QueueController],
  providers: [QueueService, EventDispatcherService],
  exports: [EventDispatcherService],
})
export class QueueModule {}
