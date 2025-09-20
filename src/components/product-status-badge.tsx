import { Badge } from "@/components/ui/badge";
import { Product } from "@/hooks/use-products";

interface ProductStatusBadgeProps {
  product: Product;
}

export const ProductStatusBadge = ({ product }: ProductStatusBadgeProps) => {
  if (product.status === "inactive") {
    return <Badge variant="secondary">Inactive</Badge>;
  }

  if (product.status === "discontinued") {
    return <Badge variant="destructive">Discontinued</Badge>;
  }

  const stockLevel = product.min_stock_level || 0;

  if (stockLevel === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }

  if (stockLevel <= 10) {
    return (
      <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
    );
  }

  return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
};
