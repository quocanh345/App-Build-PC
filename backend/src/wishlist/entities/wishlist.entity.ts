import { CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';

// id trùng với Auth.id/User.id (quan hệ 1-1 theo khóa chính dùng chung, giống Cart).
@Entity()
export class Wishlist {
  @PrimaryColumn('uuid')
  id!: string;

  @OneToMany(() => WishlistItem, (item) => item.wishlist, { cascade: true })
  items!: WishlistItem[];

  @CreateDateColumn()
  createdAt!: Date;
}
