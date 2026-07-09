import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType } from '../../product/product-type.enum';

@InputType()
export class UpsertReviewInput {
  @Field(() => ProductType)
  productType!: ProductType;

  @Field()
  productId!: string;

  @Field(() => Int)
  rating!: number;

  @Field({ nullable: true })
  comment?: string;
}
