import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCpuInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field(() => Int)
  cores!: number;

  @Field(() => Int)
  threads!: number;

  @Field(() => Float)
  frequency!: number;

  @Field(() => Int)
  cache!: number;

  @Field()
  socket!: string;

  @Field(() => Int)
  tdp!: number;

  @Field()
  iGPU!: string;

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
export class UpdateCpuInput extends PartialType(CreateCpuInput) {}
