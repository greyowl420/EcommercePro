import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import CartDrawer from "./cart-drawer";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="text-xl font-bold">Shop</a>
            </Link>
            <Link href="/products">
              <a className="text-gray-600 hover:text-gray-900">Products</a>
            </Link>
            <Link href="/faq">
              <a className="text-gray-600 hover:text-gray-900">FAQ</a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.isAdmin && (
              <Link href="/admin">
                <a className="text-gray-600 hover:text-gray-900">Admin</a>
              </Link>
            )}
            
            {user ? (
              <Button 
                variant="ghost" 
                onClick={() => logoutMutation.mutate()}
              >
                Logout
              </Button>
            ) : (
              <Link href="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
            )}

            <Button 
              variant="outline" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
