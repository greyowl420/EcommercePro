import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Product } from "@shared/schema";
import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();
  
  const discountedPrice = product.discountPercentage
    ? Number(product.price) * (1 - product.discountPercentage / 100)
    : Number(product.price);

  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.discountPercentage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            {product.discountPercentage}% OFF
          </div>
        )}

        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 left-2"
          onClick={() => setLiked(!liked)}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium text-lg">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage && (
            <span className="text-sm line-through text-muted-foreground">
              ${Number(product.price).toFixed(2)}
            </span>
          )}
        </div>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="w-full mt-2"
        >
          <Button 
            className="w-full" 
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
