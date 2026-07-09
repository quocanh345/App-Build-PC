import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { ProductType } from '../../product/product-type.enum';

@ObjectType()
export class WishlistItemDetail {
  @Field()
  id!: string;

  @Field(() => ProductType)
  productType!: ProductType;

  @Field()
  productId!: string;

  // tra cứu real-time từ bảng sản phẩm tương ứng, giống CartItemDetail
  @Field()
  productName!: string;

  @Field()
  imageUrl!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => Int)
  stock!: number;
}
