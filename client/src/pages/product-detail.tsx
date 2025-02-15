import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [_, setLocation] = useLocation();
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params.id}`],
  });

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const discountedPrice = product.discountPercentage
    ? Number(product.price) * (1 - product.discountPercentage / 100)
    : Number(product.price);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <button 
        onClick={() => setLocation('/products')}
        className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-medium">{product.name}</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl font-medium">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage && (
              <span className="text-lg line-through text-muted-foreground">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="bg-muted/50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-medium">Nutritional Information</h2>
            <div className="grid grid-cols-3 gap-4">
              {product.protein && (
                <div>
                  <div className="text-lg font-medium">{product.protein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
              )}
              {product.fat && (
                <div>
                  <div className="text-lg font-medium">{product.fat}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              )}
              {product.carbohydrates && (
                <div>
                  <div className="text-lg font-medium">{product.carbohydrates}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => addToCart(product)}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
