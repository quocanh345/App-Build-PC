import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCaseInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field()
  formFactor!: string;

  @Field(() => Int)
  maxGpuLength!: number;

  @Field(() => Int)
  maxCoolerHeight!: number;

  @Field(() => Int)
  includedFans!: number;

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
export class UpdateCaseInput extends PartialType(CreateCaseInput) {}
