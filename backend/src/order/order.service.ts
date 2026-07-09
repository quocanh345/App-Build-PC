import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus } from './order-status.enum';
import { tokenPayload } from '../auth/auth.type';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(userId: string, input: CreateOrderInput): Promise<Order> {
    if (!input.items || input.items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
    }
    return this.orderRepository.createWithItems(
      userId,
      {
        shippingAddress: input.shippingAddress,
        phoneNumber: input.phoneNumber,
        note: input.note,
      },
      input.items,
    );
  }

  async findMine(userId: string): Promise<Order[]> {
    return this.orderRepository.findAllByUser(userId);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findOne(id: string, requester: tokenPayload): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    this.assertCanAccess(order, requester);
    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    note?: string,
  ): Promise<Order> {
    return this.orderRepository.updateStatus(id, status, note);
  }

  async cancel(id: string, requester: tokenPayload): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    this.assertCanAccess(order, requester);
    return this.orderRepository.cancel(id);
  }

  async remove(id: string): Promise<boolean> {
    await this.orderRepository.remove(id);
    return true;
  }

  private assertCanAccess(order: Order, requester: tokenPayload) {
    if (requester.role !== 'admin' && order.userId !== requester.id) {
      throw new ForbiddenException('Bạn không có quyền truy cập đơn hàng này');
    }
  }
}
