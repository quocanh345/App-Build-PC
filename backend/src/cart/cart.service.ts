import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { ProductLookupService } from '../product/product-lookup.service';
import { OrderService } from '../order/order.service';
import { AddCartItemInput } from './dto/add-cart-item.input';
import { CheckoutCartInput } from './dto/checkout-cart.input';
import { CartDetail, CartItemDetail } from './dto/cart.type';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productLookup: ProductLookupService,
    private readonly orderService: OrderService,
  ) {}

  async addToCart(
    userId: string,
    input: AddCartItemInput,
  ): Promise<CartDetail> {
    if (input.quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }
    const product = await this.productLookup.getInfo(
      input.productType,
      input.productId,
    );
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    if (product.stock < input.quantity) {
      throw new BadRequestException(`${product.name} không đủ hàng tồn kho`);
    }

    const cart = await this.cartRepository.getOrCreateCart(userId);
    await this.cartRepository.addItem(
      cart.id,
      input.productType,
      input.productId,
      input.quantity,
    );
    return this.viewCart(userId);
  }

  async updateQuantity(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartDetail> {
    const cart = await this.cartRepository.getOrCreateCart(userId);
    const item = await this.cartRepository.findItemById(itemId);
    if (!item || item.cartId !== cart.id) {
      throw new ForbiddenException('Sản phẩm không thuộc giỏ hàng của bạn');
    }

    if (quantity <= 0) {
      await this.cartRepository.removeItem(item.id);
    } else {
      const product = await this.productLookup.getInfo(
        item.productType,
        item.productId,
      );
      if (product && product.stock < quantity) {
        throw new BadRequestException(`${product.name} không đủ hàng tồn kho`);
      }
      await this.cartRepository.setQuantity(item.id, quantity);
    }
    return this.viewCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<CartDetail> {
    const cart = await this.cartRepository.getOrCreateCart(userId);
    await this.cartRepository.removeItemScoped(cart.id, itemId);
    return this.viewCart(userId);
  }

  async clearCart(userId: string): Promise<CartDetail> {
    const cart = await this.cartRepository.getOrCreateCart(userId);
    await this.cartRepository.clear(cart.id);
    return this.viewCart(userId);
  }

  async viewCart(userId: string): Promise<CartDetail> {
    const cart = await this.cartRepository.getOrCreateCart(userId);
    const items: CartItemDetail[] = [];

    for (const item of cart.items) {
      const product = await this.productLookup.getInfo(
        item.productType,
        item.productId,
      );
      if (!product) {
        // Sản phẩm đã bị xoá khỏi hệ thống sau khi thêm vào giỏ -> dọn dẹp luôn.
        await this.cartRepository.removeItem(item.id);
        continue;
      }
      items.push({
        id: item.id,
        productType: item.productType,
        productId: item.productId,
        quantity: item.quantity,
        productName: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.price,
        stock: product.stock,
        subtotal: product.price * item.quantity,
      });
    }

    return {
      id: cart.id,
      items,
      totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
      updatedAt: cart.updatedAt,
    };
  }

  async checkout(userId: string, input: CheckoutCartInput): Promise<Order> {
    const cart = await this.cartRepository.getOrCreateCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng đang trống');
    }

    const order = await this.orderService.create(userId, {
      shippingAddress: input.shippingAddress,
      phoneNumber: input.phoneNumber,
      note: input.note,
      items: cart.items.map((item) => ({
        productType: item.productType,
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    await this.cartRepository.clear(cart.id);
    return order;
  }
}
