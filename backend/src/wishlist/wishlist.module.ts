import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from './wishlist.service';
import { WishlistResolver } from './wishlist.resolver';
import { WishlistRepository } from './wishlist.repository';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, WishlistItem]),
    AuthModule,
    ProductModule,
  ],
  providers: [WishlistResolver, WishlistService, WishlistRepository],
})
export class WishlistModule {}
