import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { RatingSummary } from './review.type';
import { ProductType } from '../product/product-type.enum';
import { UpsertReviewInput } from './dto/upsert-review.input';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findByProduct(
    productType: ProductType,
    productId: string,
  ): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { productType, productId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndProduct(
    userId: string,
    productType: ProductType,
    productId: string,
  ): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: { userId, productType, productId },
    });
  }

  async getSummary(
    productType: ProductType,
    productId: string,
  ): Promise<RatingSummary> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.productType = :productType', { productType })
      .andWhere('review.productId = :productId', { productId })
      .getRawOne<{ average: string | null; count: string }>();

    return {
      average: result?.average
        ? Math.round(Number(result.average) * 10) / 10
        : 0,
      count: result?.count ? Number(result.count) : 0,
    };
  }

  async upsert(userId: string, input: UpsertReviewInput): Promise<Review> {
    const existing = await this.findByUserAndProduct(
      userId,
      input.productType,
      input.productId,
    );
    if (existing) {
      existing.rating = input.rating;
      existing.comment = input.comment;
      return this.reviewRepository.save(existing);
    }
    const review = this.reviewRepository.create({ ...input, userId });
    return this.reviewRepository.save(review);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Đánh giá không tồn tại');
    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xoá đánh giá này');
    }
    await this.reviewRepository.remove(review);
  }
}
