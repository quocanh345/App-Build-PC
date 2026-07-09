import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '../../product/product-type.enum';

// Mỗi user chỉ được đánh giá 1 lần cho 1 sản phẩm (đánh giá lại thì upsert cập nhật).
@Entity()
@Unique(['productType', 'productId', 'userId'])
@ObjectType()
export class Review {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ProductType)
  @Column()
  productType!: ProductType;

  @Field()
  @Column()
  productId!: string;

  @Field()
  @Column()
  userId!: string;

  @Field(() => Int)
  @Column()
  rating!: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
