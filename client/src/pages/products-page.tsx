import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory">
      {products?.map((product) => (
        <div 
          key={product.id} 
          className="h-[calc(100vh-4rem)] snap-start flex items-center justify-center p-8"
        >
          <div className="w-full max-w-2xl mx-auto">
            <ProductCard product={product} />
          </div>
        </div>
      ))}
    </div>
  );
}