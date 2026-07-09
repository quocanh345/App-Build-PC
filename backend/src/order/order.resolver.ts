import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order.input';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { tokenPayload } from '../auth/auth.type';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  async createOrder(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: CreateOrderInput,
  ) {
    return this.orderService.create(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Order])
  async myOrders(@CurrentUser() user: tokenPayload) {
    return this.orderService.findMine(user.id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => [Order])
  async orders() {
    return this.orderService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => Order)
  async order(@CurrentUser() user: tokenPayload, @Args('id') id: string) {
    return this.orderService.findOne(id, user);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Order)
  async updateOrderStatus(@Args('input') input: UpdateOrderStatusInput) {
    return this.orderService.updateStatus(input.id, input.status, input.note);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  async cancelOrder(@CurrentUser() user: tokenPayload, @Args('id') id: string) {
    return this.orderService.cancel(id, user);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async removeOrder(@Args('id') id: string) {
    return this.orderService.remove(id);
  }
}
