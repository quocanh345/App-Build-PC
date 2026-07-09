import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateSsdInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field(() => Int)
  capacity!: number;

  @Field()
  type!: string;

  @Field(() => Int)
  readSpeed!: number;

  @Field(() => Int)
  writeSpeed!: number;

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
export class UpdateSsdInput extends PartialType(CreateSsdInput) {}
