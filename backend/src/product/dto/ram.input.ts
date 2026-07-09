import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateRamInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field(() => Int)
  memory!: number;

  @Field(() => Int)
  bus!: number;

  @Field()
  standard!: string;

  @Field()
  latency!: string;

  @Field()
  description!: string;

  @Field()
  imageUrl!: string;

  @Field(() => Int)
  stock!: number;

  @Field(() => Int)
  price!: number;
}

@InputType()
export class UpdateRamInput extends PartialType(CreateRamInput) {}
