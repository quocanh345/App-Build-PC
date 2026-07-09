import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CheckoutCartInput {
  @Field()
  shippingAddress!: string;

  @Field()
  phoneNumber!: string;

  @Field({ nullable: true })
  note?: string;
}
