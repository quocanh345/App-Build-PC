import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ProductType } from '../../product/product-type.enum';

@ObjectType()
export class CartItemDetail {
  @Field()
  id!: string;

  @Field(() => ProductType)
  productType!: ProductType;

  @Field()
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  // các trường dưới đây tra cứu real-time từ bảng sản phẩm tương ứng, không lưu trong CartItem
  @Field()
  productName!: string;

  @Field()
  imageUrl!: string;

  @Field(() => Float)
  unitPrice!: number;

  @Field(() => Int)
  stock!: number;

  @Field(() => Float)
  subtotal!: number;
}

@ObjectType()
export class CartDetail {
  @Field()
  id!: string;

  @Field(() => [CartItemDetail])
  items!: CartItemDetail[];

  @Field(() => Float)
  totalPrice!: number;

  @Field()
  updatedAt!: Date;
}
