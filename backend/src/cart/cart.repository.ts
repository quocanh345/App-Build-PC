import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductType } from '../product/product-type.enum';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    const existing = await this.cartRepository.findOne({
      where: { id: userId },
      relations: { items: true },
    });
    if (existing) return existing;

    const cart = this.cartRepository.create({ id: userId, items: [] });
    return this.cartRepository.save(cart);
  }

  async findItemById(itemId: string): Promise<CartItem | null> {
    return this.cartItemRepository.findOne({ where: { id: itemId } });
  }

  // Thêm dòng mới; nếu sản phẩm đã có trong giỏ (vi phạm unique constraint) thì cộng dồn số lượng.
  async addItem(
    cartId: string,
    productType: ProductType,
    productId: string,
    quantity: number,
  ): Promise<void> {
    try {
      await this.cartItemRepository.insert({
        cartId,
        productType,
        productId,
        quantity,
      });
    } catch (error) {
      if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
        await this.cartItemRepository.increment(
          { cartId, productType, productId },
          'quantity',
          quantity,
        );
        return;
      }
      throw error;
    }
  }

  async setQuantity(itemId: string, quantity: number): Promise<void> {
    await this.cartItemRepository.update(itemId, { quantity });
  }

  async removeItem(itemId: string): Promise<void> {
    await this.cartItemRepository.delete(itemId);
  }

  async removeItemScoped(cartId: string, itemId: string): Promise<void> {
    await this.cartItemRepository.delete({ id: itemId, cartId });
  }

  async clear(cartId: string): Promise<void> {
    await this.cartItemRepository.delete({ cartId });
  }
}
