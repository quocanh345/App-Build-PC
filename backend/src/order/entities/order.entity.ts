import { ObjectType, Field, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { OrderStatus } from '../order-status.enum';

@Entity()
@ObjectType()
export class Order {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  userId!: string;

  @Field(() => OrderStatus)
  @Column({ default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Field(() => Float)
  @Column()
  totalPrice!: number;

  @Field()
  @Column()
  shippingAddress!: string;

  @Field()
  @Column()
  phoneNumber!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @Field(() => [OrderStatusHistory])
  @OneToMany(() => OrderStatusHistory, (history) => history.order, {
    cascade: true,
  })
  statusHistory!: OrderStatusHistory[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
