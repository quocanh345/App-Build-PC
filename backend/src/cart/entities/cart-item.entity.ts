import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductType } from '../../product/product-type.enum';

@Entity()
@Unique(['cartId', 'productType', 'productId'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart!: Cart;

  @Column()
  cartId!: string;

  @Column()
  productType!: ProductType;

  @Column()
  productId!: string;

  @Column()
  quantity!: number;
}
