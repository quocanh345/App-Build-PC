import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreatePsuInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field(() => Int)
  wattage!: number;

  @Field()
  efficiency!: string;

  @Field()
  modular!: string;

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
export class UpdatePsuInput extends PartialType(CreatePsuInput) {}
