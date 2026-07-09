import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Ssd {
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
  capacity!: number;

  @Field()
  @Column()
  type!: string;

  @Field(() => Int)
  @Column()
  readSpeed!: number;

  @Field(() => Int)
  @Column()
  writeSpeed!: number;

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
