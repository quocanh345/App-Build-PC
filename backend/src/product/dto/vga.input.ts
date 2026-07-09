import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateVgaInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field()
  architecture!: string;

  @Field(() => Int)
  vMemory!: number;

  @Field(() => Int)
  frequency!: number;

  @Field(() => Int)
  cores!: number;

  @Field(() => Int)
  tgp!: number;

  @Field()
  port!: string;

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
export class UpdateVgaInput extends PartialType(CreateVgaInput) {}
