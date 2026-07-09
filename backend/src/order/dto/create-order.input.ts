import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType } from '../../product/product-type.enum';

@InputType()
export class CreateOrderItemInput {
  @Field(() => ProductType)
  productType!: ProductType;

  @Field()
  productId!: string;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  shippingAddress!: string;

  @Field()
  phoneNumber!: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => [CreateOrderItemInput])
  items!: CreateOrderItemInput[];
}
