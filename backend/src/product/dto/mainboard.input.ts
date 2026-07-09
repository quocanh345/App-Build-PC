import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateMainboardInput {
  @Field()
  name!: string;

  @Field()
  manufacturer!: string;

  @Field()
  socket!: string;

  @Field()
  chipset!: string;

  @Field()
  formFactor!: string;

  @Field(() => Int)
  memorySlots!: number;

  @Field()
  memoryType!: string;

  @Field(() => Int)
  maxMemory!: number;

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
export class UpdateMainboardInput extends PartialType(CreateMainboardInput) {}
