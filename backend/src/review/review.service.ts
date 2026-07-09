import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { Review } from './entities/review.entity';
import { RatingSummary } from './review.type';
import { ProductType } from '../product/product-type.enum';
import { UpsertReviewInput } from './dto/upsert-review.input';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async findByProduct(
    productType: ProductType,
    productId: string,
  ): Promise<Review[]> {
    return this.reviewRepository.findByProduct(productType, productId);
  }

  async getSummary(
    productType: ProductType,
    productId: string,
  ): Promise<RatingSummary> {
    return this.reviewRepository.getSummary(productType, productId);
  }

  async findMine(
    userId: string,
    productType: ProductType,
    productId: string,
  ): Promise<Review | null> {
    return this.reviewRepository.findByUserAndProduct(
      userId,
      productType,
      productId,
    );
  }

  async upsert(userId: string, input: UpsertReviewInput): Promise<Review> {
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestException('Đánh giá phải từ 1 đến 5 sao');
    }
    return this.reviewRepository.upsert(userId, input);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    await this.reviewRepository.remove(id, userId);
    return true;
  }
}
