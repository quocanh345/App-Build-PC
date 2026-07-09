import { useEffect, useRef } from 'react';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { useMyOrders } from './hooks';
import { STATUS_LABEL } from './status';
import type { OrderStatus } from './api';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function notifyStatusChange(orderId: string, status: OrderStatus) {
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      granted = (await requestPermission()) === 'granted';
    }
    if (!granted) return;

    sendNotification({
      title: 'Cập nhật đơn hàng',
      body: `Đơn #${orderId.slice(0, 8)} đã chuyển sang trạng thái "${STATUS_LABEL[status]}"`,
    });
  } catch {
    // Không chạy trong app desktop Tauri (vd đang mở bằng trình duyệt) -> bỏ qua.
  }
}

// Theo dõi thay đổi trạng thái đơn hàng (nhờ polling ở useMyOrders) và bắn thông báo
// native trên desktop khi phát hiện đổi trạng thái. Gắn 1 lần ở Layout khi đã đăng nhập.
export function useOrderStatusNotifications() {
  const { data: orders } = useMyOrders();
  const previousStatuses = useRef<Map<string, OrderStatus> | null>(null);

  useEffect(() => {
    if (!isTauri || !orders) return;

    const current = new Map(orders.map((order) => [order.id, order.status]));

    if (previousStatuses.current) {
      for (const [id, status] of current) {
        const prevStatus = previousStatuses.current.get(id);
        if (prevStatus && prevStatus !== status) {
          void notifyStatusChange(id, status);
        }
      }
    }
    previousStatuses.current = current;
  }, [orders]);
}
