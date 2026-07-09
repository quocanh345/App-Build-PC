import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { OrderStatus } from '../order/order-status.enum';
import { ProductType } from '../product/product-type.enum';

@ObjectType()
export class OrderStatusCount {
  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class TopProduct {
  @Field()
  productName!: string;

  @Field(() => ProductType)
  productType!: ProductType;

  @Field(() => Int)
  totalQuantity!: number;

  @Field(() => Float)
  totalRevenue!: number;
}

@ObjectType()
export class DashboardStats {
  @Field(() => Float)
  totalRevenue!: number;

  @Field(() => Int)
  totalOrders!: number;

  @Field(() => Int)
  totalUsers!: number;

  @Field(() => Int)
  totalProducts!: number;

  @Field(() => [OrderStatusCount])
  ordersByStatus!: OrderStatusCount[];

  @Field(() => [TopProduct])
  topProducts!: TopProduct[];
}
