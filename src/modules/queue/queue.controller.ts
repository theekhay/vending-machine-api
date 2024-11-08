import { Controller, Logger } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { GenericQueueModel } from '../../interfaces/common';
import { QUEUE_EVENT } from '../../enums/common.enum';

@Controller('queue')
export class QueueController {
  private readonly logger = new Logger(QueueController.name);

  constructor(private readonly queueService: QueueService) {}

  @MessagePattern()
  async processQueueMessages(@Ctx() context: RmqContext) {
    try {
      const data = context.getMessage();
      const message: GenericQueueModel = JSON.parse(data?.content?.toString());

      this.logger.log('queue payload %o', message);

      switch (message?.event) {
        case QUEUE_EVENT.PRODUCT_SOLD:
          //TODO - send email
          break;
      }
    } catch (error) {
      this.logger.error('processQueueMessages error %o', error);
    } finally {
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);
    }
  }
}
