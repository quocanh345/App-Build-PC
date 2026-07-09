import { Injectable } from '@nestjs/common';
import { WishlistRepository } from './wishlist.repository';
import { ProductLookupService } from '../product/product-lookup.service';
import { ProductType } from '../product/product-type.enum';
import { WishlistItemDetail } from './dto/wishlist.type';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productLookup: ProductLookupService,
  ) {}

  // Bật/tắt: chưa có thì thêm, đã có thì bỏ — khớp với hành vi nút trái tim ở UI.
  async toggle(
    userId: string,
    productType: ProductType,
    productId: string,
  ): Promise<boolean> {
    const wishlist = await this.wishlistRepository.getOrCreate(userId);
    const existing = await this.wishlistRepository.findItem(
      wishlist.id,
      productType,
      productId,
    );

    if (existing) {
      await this.wishlistRepository.removeItem(existing.id);
      return false;
    }

    try {
      await this.wishlistRepository.addItem(
        wishlist.id,
        productType,
        productId,
      );
    } catch (error) {
      if ((error as { code?: string }).code !== UNIQUE_VIOLATION) throw error;
    }
    return true;
  }

  async list(userId: string): Promise<WishlistItemDetail[]> {
    const wishlist = await this.wishlistRepository.getOrCreate(userId);
    const details: WishlistItemDetail[] = [];

    for (const item of wishlist.items) {
      const product = await this.productLookup.getInfo(
        item.productType,
        item.productId,
      );
      if (!product) {
        // Sản phẩm đã bị xoá khỏi hệ thống -> dọn dẹp luôn.
        await this.wishlistRepository.removeItem(item.id);
        continue;
      }
      details.push({
        id: item.id,
        productType: item.productType,
        productId: item.productId,
        productName: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        stock: product.stock,
      });
    }

    return details;
  }
}
