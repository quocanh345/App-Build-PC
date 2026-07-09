import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { RatingSummary } from './review.type';
import { UpsertReviewInput } from './dto/upsert-review.input';
import { ProductType } from '../product/product-type.enum';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { tokenPayload } from '../auth/auth.type';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review])
  async productReviews(
    @Args('productType', { type: () => ProductType }) productType: ProductType,
    @Args('productId') productId: string,
  ) {
    return this.reviewService.findByProduct(productType, productId);
  }

  @Query(() => RatingSummary)
  async productRatingSummary(
    @Args('productType', { type: () => ProductType }) productType: ProductType,
    @Args('productId') productId: string,
  ) {
    return this.reviewService.getSummary(productType, productId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Review, { nullable: true })
  async myReview(
    @CurrentUser() user: tokenPayload,
    @Args('productType', { type: () => ProductType }) productType: ProductType,
    @Args('productId') productId: string,
  ) {
    return this.reviewService.findMine(user.id, productType, productId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Review)
  async upsertReview(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: UpsertReviewInput,
  ) {
    return this.reviewService.upsert(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteReview(
    @CurrentUser() user: tokenPayload,
    @Args('id') id: string,
  ) {
    return this.reviewService.remove(id, user.id);
  }
}
