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
export class Psu {
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
  wattage!: number;

  @Field()
  @Column()
  efficiency!: string;

  @Field()
  @Column()
  modular!: string;

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
