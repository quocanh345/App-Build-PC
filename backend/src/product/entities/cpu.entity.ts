import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Cpu {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  manufacturer!: string;

  @Field(() => Int)
  @Column()
  cores!: number;

  @Field(() => Int)
  @Column()
  threads!: number;

  @Field(() => Float)
  @Column('float')
  frequency!: number;

  @Field(() => Int)
  @Column()
  cache!: number;

  @Field()
  @Column()
  socket!: string;

  @Field(() => Int)
  @Column()
  tdp!: number;

  @Field()
  @Column()
  iGPU!: string;

  @Field()
  @Column('text')
  description!: string;

  @Field()
  @Column()
  imageUrl!: string;

  @Field(() => Int)
  @Column()
  stock!: number;

  @Field()
  @Column({ default: true })
  isActive!: boolean;

  @Field(() => Int)
  @Column()
  price!: number;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
