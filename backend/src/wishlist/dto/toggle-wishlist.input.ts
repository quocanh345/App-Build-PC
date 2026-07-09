import { InputType, Field } from '@nestjs/graphql';
import { ProductType } from '../../product/product-type.enum';

@InputType()
export class ToggleWishlistInput {
  @Field(() => ProductType)
  productType!: ProductType;

  @Field()
  productId!: string;
}
