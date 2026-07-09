import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // Biến class này thành kiểu trả về trong GraphQL schema
@Entity() // Biến class này thành bảng trong database (TypeORM)
export class Auth {
  @Field() // Expose field này ra GraphQL schema
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  email!: string;

  @Column()
  role!: 'user' | 'admin';

  // hashPassword KHÔNG có @Field() → không bao giờ xuất hiện trong GraphQL response
  @Column()
  hashPassword!: string;

  @Field()
  @Column()
  phoneNumber!: string;

  @Field()
  @Column({ default: false })
  isVerified!: boolean;

  @Field()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Field()
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
