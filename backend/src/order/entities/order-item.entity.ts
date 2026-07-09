import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductType } from '../../product/product-type.enum';

@Entity()
@ObjectType()
export class OrderItem {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Field()
  @Column()
  orderId!: string;

  @Field(() => ProductType)
  @Column()
  productType!: ProductType;

  @Field()
  @Column()
  productId!: string;

  // snapshot tại thời điểm đặt hàng, không đổi theo giá sản phẩm về sau
  @Field()
  @Column()
  productName!: string;

  @Field(() => Float)
  @Column()
  unitPrice!: number;

  @Field(() => Int)
  @Column()
  quantity!: number;

  @Field(() => Float)
  @Column()
  subtotal!: number;
}
