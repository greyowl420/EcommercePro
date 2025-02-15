import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, insertProductSchema, InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type ProductFormData = Omit<InsertProduct, "discountPercentage"> & {
  discountPercentage: string;
};

export default function AdminPage() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(
      insertProductSchema.extend({
        discountPercentage: z.string().optional(),
      })
    ),
    defaultValues: selectedProduct 
      ? {
          ...selectedProduct,
          discountPercentage: selectedProduct.discountPercentage?.toString() ?? "",
        }
      : {
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          discountPercentage: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const product: InsertProduct = {
        ...data,
        discountPercentage: data.discountPercentage 
          ? parseInt(data.discountPercentage) 
          : null,
      };
      const res = await apiRequest(
        "POST",
        "/api/products",
        product
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsEditDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData & { id: number }) => {
      const { id, ...product } = data;
      const updateData = {
        ...product,
        discountPercentage: product.discountPercentage 
          ? parseInt(product.discountPercentage) 
          : null,
      };
      const res = await apiRequest(
        "PATCH",
        `/api/products/${id}`,
        updateData
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      form.reset();
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (selectedProduct) {
      updateMutation.mutate({ ...data, id: selectedProduct.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      discountPercentage: product.discountPercentage?.toString() ?? "",
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedProduct(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} />
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" {...form.register("price")} />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" {...form.register("imageUrl")} />
              </div>
              
              <div>
                <Label htmlFor="discountPercentage">Discount Percentage</Label>
                <Input 
                  id="discountPercentage" 
                  type="number" 
                  {...form.register("discountPercentage")} 
                  placeholder="Optional"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {selectedProduct ? "Update" : "Create"} Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {products?.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 bg-card rounded-lg shadow"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-24 w-24 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium">${Number(product.price).toFixed(2)}</span>
                {product.discountPercentage && (
                  <span className="text-sm text-red-500">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(product)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this product? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(product.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
