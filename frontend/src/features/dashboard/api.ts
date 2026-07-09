import { gqlRequest } from '@/lib/graphql-client';
import { fromGraphQLProductType, type ProductTypeKey } from '../products/product-types';
import type { OrderStatus } from '../orders/api';

export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface TopProduct {
  productName: string;
  productType: ProductTypeKey;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  ordersByStatus: OrderStatusCount[];
  topProducts: TopProduct[];
}

export async function fetchDashboardStats() {
  const query = `
    query AdminDashboardStats {
      adminDashboardStats {
        totalRevenue
        totalOrders
        totalUsers
        totalProducts
        ordersByStatus {
          status
          count
        }
        topProducts {
          productName
          productType
          totalQuantity
          totalRevenue
        }
      }
    }
  `;
  const data = await gqlRequest<{ adminDashboardStats: DashboardStats }>(query);
  const raw = data.adminDashboardStats;
  return {
    ...raw,
    ordersByStatus: raw.ordersByStatus.map((row) => ({
      ...row,
      status: row.status.toLowerCase() as OrderStatus,
    })),
    topProducts: raw.topProducts.map((row) => ({
      ...row,
      productType: fromGraphQLProductType(row.productType),
    })),
  };
}
