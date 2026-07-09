import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { CompareBar } from '@/features/compare/compare-bar';
import { useOrderStatusNotifications } from '@/features/orders/use-order-status-notifications';

export function Layout() {
  useOrderStatusNotifications();

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <CompareBar />
      <Footer />
    </div>
  );
}
