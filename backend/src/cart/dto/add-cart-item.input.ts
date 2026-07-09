import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType } from '../../product/product-type.enum';

@InputType()
export class AddCartItemInput {
  @Field(() => ProductType)
  productType!: ProductType;

  @Field()
  productId!: string;

  @Field(() => Int, { defaultValue: 1 })
  quantity!: number;
}
