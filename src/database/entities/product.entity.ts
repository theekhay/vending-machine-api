import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ColumnNumericTransformer } from '../../helpers/column-numeric-transformer';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Product extends AbstractEntity<Product> {
  @ManyToOne(() => User, (user) => user.products, {
    cascade: ['insert', 'update'],
    nullable: false,
  })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column({ type: 'text', default: null })
  description: string;

  @Column({
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
    precision: 12,
    scale: 2,
    comment:
      'The selling price is the amount of money a customer pays to purchase a product or service. It is the price at which the product is sold to the end consumer.',
  })
  price: number;

  @Column({ name: 'currency_code', default: 'NGN' })
  currencyCode: string;

  @Column({ default: null, name: 'available_quantity' })
  quantity: number;

  @Column({ type: 'numeric', default: null, name: 'weight_in_kg' })
  weightInKg: number;

  @BeforeInsert()
  @BeforeUpdate()
  isMultipleOf50(num: number): void {
    if (num % 50 !== 0) {
      throw new BadRequestException('price expected to be a multiple of 50');
    }
  }
}
