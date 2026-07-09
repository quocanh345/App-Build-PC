import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class RatingSummary {
  @Field(() => Float)
  average!: number;

  @Field(() => Int)
  count!: number;
}
