import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Product } from "@shared/schema";
import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();
  const [_, setLocation] = useLocation();

  const discountedPrice = product.discountPercentage
    ? Number(product.price) * (1 - product.discountPercentage / 100)
    : Number(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div 
            onClick={() => setLocation(`/product/${product.id}`)}
            className="cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
              />
              {product.discountPercentage && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-medium tracking-tight">{product.name}</h3>

              <p className="text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage && (
                  <span className="text-sm line-through text-muted-foreground">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {(product.protein || product.fat || product.carbohydrates) && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {product.protein && (
                    <span>{product.protein}g protein</span>
                  )}
                  {product.fat && (
                    <span>{product.fat}g fat</span>
                  )}
                  {product.carbohydrates && (
                    <span>{product.carbohydrates}g carbs</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 pt-0 flex gap-4">
            <Button
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
            >
              <Heart className={`h-4 w-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}