import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/products/cpu', label: 'Sản phẩm' },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/complaints', label: 'Khiếu nại' },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b pb-2 text-sm">
      {ADMIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-1',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
