import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { OrderStatus } from '../order/order-status.enum';
import { Auth } from '../auth/entities/auth.entity';
import { ProductType } from '../product/product-type.enum';
import { PRODUCT_ENTITIES } from '../product/product-entities';
import { DashboardStats } from './dashboard.type';

@Injectable()
export class DashboardService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const orderRepo = this.dataSource.getRepository(Order);
    const orderItemRepo = this.dataSource.getRepository(OrderItem);
    const authRepo = this.dataSource.getRepository(Auth);

    const [totalOrders, totalUsers] = await Promise.all([
      orderRepo.count(),
      authRepo.count(),
    ]);

    const revenueResult = await orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'sum')
      .where('order.status = :status', { status: OrderStatus.COMPLETED })
      .getRawOne<{ sum: string | null }>();
    const totalRevenue = revenueResult?.sum ? Number(revenueResult.sum) : 0;

    const statusRows = await orderRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany<{ status: OrderStatus; count: string }>();
    const ordersByStatus = statusRows.map((row) => ({
      status: row.status,
      count: Number(row.count),
    }));

    const topRows = await orderItemRepo
      .createQueryBuilder('item')
      .select('item.productName', 'productName')
      .addSelect('item.productType', 'productType')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('SUM(item.subtotal)', 'totalRevenue')
      .groupBy('item.productName')
      .addGroupBy('item.productType')
      .orderBy('SUM(item.quantity)', 'DESC')
      .limit(5)
      .getRawMany<{
        productName: string;
        productType: ProductType;
        totalQuantity: string;
        totalRevenue: string;
      }>();
    const topProducts = topRows.map((row) => ({
      productName: row.productName,
      productType: row.productType,
      totalQuantity: Number(row.totalQuantity),
      totalRevenue: Number(row.totalRevenue),
    }));

    const productCounts = await Promise.all(
      Object.values(PRODUCT_ENTITIES).map((entity) =>
        this.dataSource.getRepository(entity).count(),
      ),
    );
    const totalProducts = productCounts.reduce((sum, count) => sum + count, 0);

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      ordersByStatus,
      topProducts,
    };
  }
}
