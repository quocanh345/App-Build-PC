import { gqlRequest } from '@/lib/graphql-client';
import {
  fromGraphQLProductType,
  type ProductTypeKey,
} from '../products/product-types';

export interface OrderItem {
  id: string;
  productType: ProductTypeKey;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'completed'
  | 'cancelled';

export interface OrderStatusHistoryEntry {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  shippingAddress: string;
  phoneNumber: string;
  note?: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// Backend đăng ký OrderStatus/ProductType bằng registerEnumType() nên giá trị trả
// về trên wire là TÊN KEY TypeScript (PENDING, CPU...) chứ không phải giá trị chuỗi
// bên trong ('pending', 'cpu'...) mà frontend dùng nội bộ — phải dịch lại khi nhận.
function toGraphQLOrderStatus(status: OrderStatus): string {
  return status.toUpperCase();
}

function fromGraphQLOrderStatus(value: string): OrderStatus {
  return value.toLowerCase() as OrderStatus;
}

function normalizeOrder(raw: Order): Order {
  return {
    ...raw,
    status: fromGraphQLOrderStatus(raw.status),
    items: raw.items.map((item) => ({
      ...item,
      productType: fromGraphQLProductType(item.productType),
    })),
    statusHistory: raw.statusHistory.map((entry) => ({
      ...entry,
      status: fromGraphQLOrderStatus(entry.status),
    })),
  };
}

const ORDER_FIELDS = `
  id
  userId
  status
  totalPrice
  shippingAddress
  phoneNumber
  note
  createdAt
  items {
    id
    productType
    productId
    productName
    unitPrice
    quantity
    subtotal
  }
  statusHistory {
    id
    status
    note
    createdAt
  }
`;

export async function fetchMyOrders() {
  const query = `
    query MyOrders {
      myOrders {
        ${ORDER_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ myOrders: Order[] }>(query);
  return data.myOrders.map(normalizeOrder);
}

export async function fetchOrderById(id: string) {
  const query = `
    query OrderById($id: String!) {
      order(id: $id) {
        ${ORDER_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ order: Order }>(query, { id });
  return normalizeOrder(data.order);
}

export async function fetchAllOrders() {
  const query = `
    query AllOrders {
      orders {
        ${ORDER_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ orders: Order[] }>(query);
  return data.orders.map(normalizeOrder);
}

export async function updateOrderStatusRequest(
  id: string,
  status: OrderStatus,
  note?: string,
) {
  const query = `
    mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
      updateOrderStatus(input: $input) {
        ${ORDER_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ updateOrderStatus: Order }>(query, {
    input: { id, status: toGraphQLOrderStatus(status), note },
  });
  return normalizeOrder(data.updateOrderStatus);
}

export async function cancelOrderRequest(id: string) {
  const query = `
    mutation CancelOrder($id: String!) {
      cancelOrder(id: $id) {
        ${ORDER_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ cancelOrder: Order }>(query, { id });
  return normalizeOrder(data.cancelOrder);
}
