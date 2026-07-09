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
export class Vga {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  manufacturer!: string;

  @Field()
  @Column()
  architecture!: string;

  @Field(() => Int)
  @Column()
  vMemory!: number;

  @Field(() => Int)
  @Column()
  frequency!: number;

  @Field(() => Int)
  @Column()
  cores!: number;

  @Field(() => Int)
  @Column()
  tgp!: number;

  @Field()
  @Column()
  port!: string;

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
