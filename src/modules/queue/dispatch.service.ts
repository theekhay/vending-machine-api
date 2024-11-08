import { Injectable } from '@nestjs/common';
import { QUEUE_EVENT } from '../../enums/common.enum';

@Injectable()
export class EventDispatcherService {
  constructor() {}

  async dispatchProductSoldEvent(payload: {
    productId: string;
    quantity: number;
  }) {
    await this.dispatchEvent(QUEUE_EVENT.PRODUCT_SOLD, payload);
  }

  private async dispatchEvent(event: string, payload: any) {
    // await this.amqpConnection.publish('hoshistech-exchange', event, payload);
    console.log(`Event dispatched: ${event}`);
  }
}
