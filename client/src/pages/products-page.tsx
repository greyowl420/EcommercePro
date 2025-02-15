import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <>
        <Navbar onSearch={setSearchQuery} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#5C3D2E]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <div className="min-h-[calc(100vh-4rem)] p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts?.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No products found matching your search.
            </div>
          )}
        </div>
      </div>
    </>
  );
}