import { Link, NavLink } from 'react-router-dom';
import {
  Cpu,
  Heart,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User,
  UserRound,
  Wrench,
} from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';
import { useCart } from '@/features/cart/hooks';
import { useWishlist } from '@/features/wishlist/hooks';
import { PRODUCT_TYPES } from '@/features/products/product-types';
import { PRODUCT_TYPE_ICONS } from '@/features/products/product-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cart } = useCart();
  const itemCount = cart?.items.length ?? 0;
  const { data: wishlist } = useWishlist();
  const wishlistCount = wishlist?.length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Cpu className="size-5" />
          </span>
          AppPC
        </Link>

        <nav className="hidden flex-1 flex-wrap items-center gap-1 text-sm lg:flex">
          {PRODUCT_TYPES.map((type) => {
            const Icon = PRODUCT_TYPE_ICONS[type.key];
            return (
              <NavLink
                key={type.key}
                to={`/products/${type.key}`}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors ${
                    isActive
                      ? 'bg-accent font-medium text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  }`
                }
              >
                <Icon className="size-4" />
                {type.label}
              </NavLink>
            );
          })}
          <NavLink
            to="/build"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-primary hover:bg-primary/10'
              }`
            }
          >
            <Wrench className="size-4" />
            Build PC
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <User className="size-5" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link to="/orders">Đơn hàng của tôi</Link>} />
                <DropdownMenuItem
                  render={
                    <Link to="/profile">
                      <UserRound className="size-4" />
                      Hồ sơ cá nhân
                    </Link>
                  }
                />
                {user?.role === 'admin' && (
                  <DropdownMenuItem
                    render={
                      <Link to="/admin">
                        <LayoutDashboard className="size-4" />
                        Trang quản trị
                      </Link>
                    }
                  />
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                  <LogOut className="size-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-1 border-t px-4 py-2 text-sm lg:hidden">
        {PRODUCT_TYPES.map((type) => (
          <NavLink
            key={type.key}
            to={`/products/${type.key}`}
            className="rounded-md px-2 py-1 text-muted-foreground"
          >
            {type.label}
          </NavLink>
        ))}
        <NavLink to="/build" className="rounded-md px-2 py-1 font-medium text-primary">
          Build PC
        </NavLink>
      </nav>
    </header>
  );
}
