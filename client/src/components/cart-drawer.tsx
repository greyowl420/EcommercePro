import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-10rem)]">
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const discountedPrice = item.discountPercentage
                    ? Number(item.price) * (1 - item.discountPercentage / 100)
                    : Number(item.price);

                  return (
                    <div key={item.id} className="flex gap-4 py-2">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-medium">
                            ${discountedPrice.toFixed(2)}
                          </p>
                          {item.discountPercentage && (
                            <p className="text-sm line-through text-muted-foreground">
                              ${Number(item.price).toFixed(2)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full" disabled={items.length === 0} onClick={onClose}>
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
