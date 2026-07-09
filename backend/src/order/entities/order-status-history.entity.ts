import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from '../order-status.enum';

// Mỗi lần trạng thái đơn hàng thay đổi (kể cả lúc tạo đơn) sẽ ghi thêm 1 dòng ở đây,
// để hiển thị được timeline "đã xác nhận lúc nào, bắt đầu giao lúc nào...".
@Entity()
@ObjectType()
export class OrderStatusHistory {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Field()
  @Column()
  orderId!: string;

  @Field(() => OrderStatus)
  @Column()
  status!: OrderStatus;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
