import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCoolerInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field()
  type!: string;

  @Field(() => Int)
  size!: number;

  @Field(() => Int)
  fanSpeed!: number;

  @Field(() => Float)
  noise!: number;

  @Field()
  socketSupport!: string;

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
export class UpdateCoolerInput extends PartialType(CreateCoolerInput) {}
