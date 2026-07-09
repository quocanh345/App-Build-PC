import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistItemDetail } from './dto/wishlist.type';
import { ToggleWishlistInput } from './dto/toggle-wishlist.input';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { tokenPayload } from '../auth/auth.type';

@UseGuards(AuthGuard)
@Resolver()
export class WishlistResolver {
  constructor(private readonly wishlistService: WishlistService) {}

  @Query(() => [WishlistItemDetail])
  async myWishlist(@CurrentUser() user: tokenPayload) {
    return this.wishlistService.list(user.id);
  }

  @Mutation(() => Boolean)
  async toggleWishlist(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: ToggleWishlistInput,
  ) {
    return this.wishlistService.toggle(
      user.id,
      input.productType,
      input.productId,
    );
  }
}
