import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/layout';
import { RequireAuth } from '@/components/layout/require-auth';
import { HomePage } from '@/pages/home-page';
import { ProductListPage } from '@/pages/product-list-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { BuildPage } from '@/pages/build-page';
import { ComparePage } from '@/pages/compare-page';
import { CartPage } from '@/pages/cart-page';
import { CheckoutPage } from '@/pages/checkout-page';
import { OrdersPage } from '@/pages/orders-page';
import { OrderDetailPage } from '@/pages/order-detail-page';
import { ProfilePage } from '@/pages/profile-page';
import { WishlistPage } from '@/pages/wishlist-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import { ForgotPasswordPage } from '@/pages/forgot-password-page';
import { ResetPasswordPage } from '@/pages/reset-password-page';
import { VerifyEmailPage } from '@/pages/verify-email-page';
import { AdminProductsPage } from '@/pages/admin-products-page';
import { AdminOrdersPage } from '@/pages/admin-orders-page';
import { AdminDashboardPage } from '@/pages/admin-dashboard-page';
import { AdminComplaintsPage } from '@/pages/admin-complaints-page';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:type" element={<ProductListPage />} />
        <Route path="products/:type/:id" element={<ProductDetailPage />} />
        <Route path="build" element={<BuildPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />

        <Route element={<RequireAuth />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        <Route element={<RequireAuth adminOnly />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/products/:type" element={<AdminProductsPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/complaints" element={<AdminComplaintsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
