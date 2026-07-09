import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { ProductType } from '../product/product-type.enum';

@Injectable()
export class WishlistRepository {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private readonly wishlistItemRepository: Repository<WishlistItem>,
  ) {}

  async getOrCreate(userId: string): Promise<Wishlist> {
    const existing = await this.wishlistRepository.findOne({
      where: { id: userId },
      relations: { items: true },
    });
    if (existing) return existing;

    const wishlist = this.wishlistRepository.create({ id: userId, items: [] });
    return this.wishlistRepository.save(wishlist);
  }

  async findItem(
    wishlistId: string,
    productType: ProductType,
    productId: string,
  ): Promise<WishlistItem | null> {
    return this.wishlistItemRepository.findOne({
      where: { wishlistId, productType, productId },
    });
  }

  async addItem(
    wishlistId: string,
    productType: ProductType,
    productId: string,
  ): Promise<void> {
    await this.wishlistItemRepository.insert({
      wishlistId,
      productType,
      productId,
    });
  }

  async removeItem(itemId: string): Promise<void> {
    await this.wishlistItemRepository.delete(itemId);
  }
}
