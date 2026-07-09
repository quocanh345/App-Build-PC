import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
class GeneralProductInput {
  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  maxPrice?: number;
}

@InputType()
export class CpuInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  socket?: string;

  @Field(() => Int, { nullable: true })
  minCore?: number;

  @Field(() => Int, { nullable: true })
  maxCore?: number;

  @Field(() => Float, { nullable: true })
  minFrequency?: number;

  @Field(() => Float, { nullable: true })
  maxFrequency?: number;

  @Field(() => Int, { nullable: true })
  minCache?: number;

  @Field(() => Int, { nullable: true })
  maxCache?: number;

  @Field({ nullable: true })
  iGPU?: boolean;
}

@InputType()
export class RamInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  standard?: string;

  @Field({ nullable: true })
  latency?: string;

  @Field(() => Int, { nullable: true })
  minBus?: number;

  @Field(() => Int, { nullable: true })
  maxBus?: number;

  @Field(() => Int, { nullable: true })
  minMemory?: number;

  @Field(() => Int, { nullable: true })
  maxMemory?: number;
}

@InputType()
export class VgaInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  architecture?: string;

  @Field(() => Int, { nullable: true })
  minVMemory?: number;

  @Field(() => Int, { nullable: true })
  maxVMemory?: number;

  @Field(() => Int, { nullable: true })
  minTgp?: number;

  @Field(() => Int, { nullable: true })
  maxTgp?: number;
}

@InputType()
export class MainboardInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  socket?: string;

  @Field({ nullable: true })
  chipset?: string;

  @Field({ nullable: true })
  formFactor?: string;

  @Field({ nullable: true })
  memoryType?: string;
}

@InputType()
export class PsuInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  efficiency?: string;

  @Field({ nullable: true })
  modular?: string;

  @Field(() => Int, { nullable: true })
  minWattage?: number;

  @Field(() => Int, { nullable: true })
  maxWattage?: number;
}

@InputType()
export class CoolerInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  socketSupport?: string;

  @Field(() => Int, { nullable: true })
  minSize?: number;

  @Field(() => Int, { nullable: true })
  maxSize?: number;
}

@InputType()
export class CaseInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  formFactor?: string;

  @Field(() => Int, { nullable: true })
  minMaxGpuLength?: number;

  @Field(() => Int, { nullable: true })
  minMaxCoolerHeight?: number;
}

@InputType()
export class SsdInput extends GeneralProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  minCapacity?: number;

  @Field(() => Int, { nullable: true })
  maxCapacity?: number;

  @Field(() => Int, { nullable: true })
  minReadSpeed?: number;

  @Field(() => Int, { nullable: true })
  minWriteSpeed?: number;
}
