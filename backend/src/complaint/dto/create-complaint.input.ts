import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateComplaintInput {
  @Field()
  orderId!: string;

  @Field()
  subject!: string;

  @Field()
  description!: string;
}
