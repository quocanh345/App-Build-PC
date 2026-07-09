import { InputType, Field } from '@nestjs/graphql';
import { OrderStatus } from '../order-status.enum';

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  id!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field({ nullable: true })
  note?: string;
}
