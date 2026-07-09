import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { CartRepository } from './cart.repository';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    AuthModule,
    ProductModule,
    OrderModule,
  ],
  providers: [CartResolver, CartService, CartRepository],
})
export class CartModule {}
