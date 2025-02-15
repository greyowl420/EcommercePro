import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

type PaymentMethod = "card" | "paypal" | "cod";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [_, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 5.99;
  const finalTotal = total + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    setLocation("/");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => setLocation("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <Card>
            <CardContent className="p-4">
              {items.map((item) => {
                const discountedPrice = item.discountPercentage
                  ? Number(item.price) * (1 - item.discountPercentage / 100)
                  : Number(item.price);

                return (
                  <div key={item.id} className="flex gap-4 py-2 border-b last:border-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          ${(discountedPrice * item.quantity).toFixed(2)}
                        </p>
                        {item.discountPercentage && (
                          <p className="text-sm line-through text-muted-foreground">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="p-4 space-y-6">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit Card</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
