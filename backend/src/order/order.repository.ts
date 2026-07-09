import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { OrderStatus } from './order-status.enum';
import { assertStatusTransitionAllowed } from './order-status-transitions';
import { PRODUCT_ENTITIES } from '../product/product-entities';
import type { ProductType } from '../product/product-type.enum';

type Sellable = { id: string; name: string; price: number; stock: number };

const ORDER_RELATIONS = {
  items: true,
  statusHistory: true,
} as const;
const ORDER_ORDER = {
  createdAt: 'DESC' as const,
  statusHistory: { createdAt: 'ASC' as const },
};

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ORDER_RELATIONS,
      order: ORDER_ORDER,
    });
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ORDER_RELATIONS,
      order: ORDER_ORDER,
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ORDER_RELATIONS,
      order: { statusHistory: { createdAt: 'ASC' } },
    });
    if (!order) throw new NotFoundException(`Đơn hàng ${id} không tồn tại`);
    return order;
  }

  // Tạo đơn trong 1 transaction: khoá từng dòng sản phẩm, kiểm tra & trừ tồn kho, ghi snapshot giá.
  async createWithItems(
    userId: string,
    input: { shippingAddress: string; phoneNumber: string; note?: string },
    items: { productType: ProductType; productId: string; quantity: number }[],
  ): Promise<Order> {
    const created = await this.dataSource.transaction(async (manager) => {
      const orderItems: OrderItem[] = [];
      let totalPrice = 0;

      for (const item of items) {
        const entity = PRODUCT_ENTITIES[item.productType];
        const product = (await manager.findOne(entity, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' },
        })) as Sellable | null;
        if (!product) {
          throw new NotFoundException(
            `Sản phẩm ${item.productType}/${item.productId} không tồn tại`,
          );
        }
        if (product.stock < item.quantity) {
          throw new Error(`${product.name} không đủ hàng tồn kho`);
        }

        product.stock -= item.quantity;
        await manager.save(entity, product);

        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;

        const orderItem = manager.create(OrderItem, {
          productType: item.productType,
          productId: item.productId,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
          subtotal,
        });
        orderItems.push(orderItem);
      }

      const order = manager.create(Order, {
        userId,
        status: OrderStatus.PENDING,
        totalPrice,
        shippingAddress: input.shippingAddress,
        phoneNumber: input.phoneNumber,
        note: input.note,
        items: orderItems,
        statusHistory: [
          manager.create(OrderStatusHistory, { status: OrderStatus.PENDING }),
        ],
      });

      return manager.save(Order, order);
    });

    return this.findById(created.id);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    note?: string,
  ): Promise<Order> {
    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, { where: { id } });
      if (!order) throw new NotFoundException(`Đơn hàng ${id} không tồn tại`);
      assertStatusTransitionAllowed(order.status, status);
      // Trạng thái không đổi thì không ghi thêm — tránh tạo trùng lịch sử mỗi lần
      // admin bấm lại đúng trạng thái hiện tại.
      if (order.status === status) return;
      await this.appendStatus(manager, order, status, note);
    });
    return this.findById(id);
  }

  // Huỷ đơn còn ở trạng thái pending/confirmed và hoàn lại tồn kho đã trừ.
  async cancel(id: string, note?: string): Promise<Order> {
    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
        relations: { items: true },
      });
      if (!order) throw new NotFoundException(`Đơn hàng ${id} không tồn tại`);
      assertStatusTransitionAllowed(order.status, OrderStatus.CANCELLED);

      for (const item of order.items) {
        const entity = PRODUCT_ENTITIES[item.productType];
        const product = (await manager.findOne(entity, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' },
        })) as Sellable | null;
        if (product) {
          product.stock += item.quantity;
          await manager.save(entity, product);
        }
      }

      await this.appendStatus(manager, order, OrderStatus.CANCELLED, note);
    });
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findById(id);
    await this.orderRepository.remove(order);
  }

  private async appendStatus(
    manager: EntityManager,
    order: Order,
    status: OrderStatus,
    note?: string,
  ): Promise<void> {
    order.status = status;
    await manager.save(Order, order);
    await manager.save(
      OrderStatusHistory,
      manager.create(OrderStatusHistory, { orderId: order.id, status, note }),
    );
  }
}
