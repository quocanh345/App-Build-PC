import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { ProductType } from '../../product/product-type.enum';

@Entity()
@Unique(['wishlistId', 'productType', 'productId'])
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wishlistId' })
  wishlist!: Wishlist;

  @Column()
  wishlistId!: string;

  @Column()
  productType!: ProductType;

  @Column()
  productId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
