import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderRepository } from './order.repository';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), AuthModule],
  providers: [OrderResolver, OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
