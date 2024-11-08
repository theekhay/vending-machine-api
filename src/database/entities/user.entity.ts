import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ColumnNumericTransformer } from '../../helpers/column-numeric-transformer';
import { Product } from './product.entity';
import { USER_ROLES } from '../../enums/roles.enum';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends AbstractEntity<User> {
  @Index()
  @Column()
  firstName: string;

  @Index()
  @Column()
  lastName: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Column({ unique: true })
  username: string;

  @Index()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
  })
  role: USER_ROLES;

  @Column({
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
    precision: 12,
    scale: 2,
    default: 0,
  })
  balance: number;

  @OneToMany(() => Product, (product) => product.seller, {
    cascade: true,
    // eager: true,
  })
  @JoinTable({ name: 'products' })
  products: Product[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async isValidPassword(password: string): Promise<boolean> {
    try {
      const storedPassword = this.password || '';
      return await bcrypt.compare(password, storedPassword);
    } catch (err) {
      console.error('isValidPassword', err);
      throw new Error(err);
    }
  }
}
