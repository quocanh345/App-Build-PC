import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ComplaintStatus } from '../complaint-status.enum';

@Entity()
@ObjectType()
export class Complaint {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  orderId!: string;

  @Field()
  @Column()
  userId!: string;

  @Field()
  @Column()
  subject!: string;

  @Field()
  @Column({ type: 'text' })
  description!: string;

  @Field(() => ComplaintStatus)
  @Column({ default: ComplaintStatus.OPEN })
  status!: ComplaintStatus;

  // Phản hồi của admin khi xử lý khiếu nại — chưa có thì để trống.
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  adminResponse?: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
