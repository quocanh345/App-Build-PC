import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput {
  @Field()
  itemId!: string;

  @Field(() => Int)
  quantity!: number;
}
