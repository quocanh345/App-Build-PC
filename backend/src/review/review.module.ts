import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { ReviewRepository } from './review.repository';
import { Review } from './entities/review.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), AuthModule],
  providers: [ReviewResolver, ReviewService, ReviewRepository],
})
export class ReviewModule {}
