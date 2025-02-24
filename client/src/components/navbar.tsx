import { Link } from "wouter";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/context/cart-context";
import CartDrawer from "./cart-drawer";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="text-3xl font-bold tracking-wider text-[#5C3D2E] relative group">
                <span className="bg-gradient-to-r from-[#5C3D2E] to-[#8B5E3C] bg-clip-text text-transparent">
                  SOUK
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C17817] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </Link>

            <div className="flex items-center">
              <div className={`transition-all duration-300 ${isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
                <Input
                  type="text"
                  placeholder="Search products..."
                  className={`pl-10 ${isSearchOpen ? 'visible' : 'invisible'}`}
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="ml-2"
              >
                <Search className="h-5 w-5 text-[#5C3D2E]" />
              </Button>
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
    </>
  );
}