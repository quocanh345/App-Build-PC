import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDetail } from './dto/cart.type';
import { AddCartItemInput } from './dto/add-cart-item.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { CheckoutCartInput } from './dto/checkout-cart.input';
import { Order } from '../order/entities/order.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { tokenPayload } from '../auth/auth.type';

@UseGuards(AuthGuard)
@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartDetail)
  async myCart(@CurrentUser() user: tokenPayload) {
    return this.cartService.viewCart(user.id);
  }

  @Mutation(() => CartDetail)
  async addToCart(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: AddCartItemInput,
  ) {
    return this.cartService.addToCart(user.id, input);
  }

  @Mutation(() => CartDetail)
  async updateCartItemQuantity(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: UpdateCartItemInput,
  ) {
    return this.cartService.updateQuantity(
      user.id,
      input.itemId,
      input.quantity,
    );
  }

  @Mutation(() => CartDetail)
  async removeCartItem(
    @CurrentUser() user: tokenPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(user.id, itemId);
  }

  @Mutation(() => CartDetail)
  async clearCart(@CurrentUser() user: tokenPayload) {
    return this.cartService.clearCart(user.id);
  }

  @Mutation(() => Order)
  async checkoutCart(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: CheckoutCartInput,
  ) {
    return this.cartService.checkout(user.id, input);
  }
}
