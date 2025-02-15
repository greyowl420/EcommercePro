import { Link } from "wouter";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/context/cart-context";
import CartDrawer from "./cart-drawer";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="text-2xl font-bold tracking-wider text-[#5C3D2E]">SOUK</a>
            </Link>

            <div className="relative w-full max-w-xs ml-4">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-[#5C3D2E] text-white p-4 rounded-full shadow-lg hover:bg-[#4A2E1E] transition-colors z-50"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
      </button>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16" />
    </>
  );
}