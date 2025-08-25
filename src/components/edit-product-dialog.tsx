import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Product, useUpdateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useSuppliers } from "@/hooks/use-suppliers";

interface EditProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProductDialog = ({ product, open, onOpenChange }: EditProductDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    cost_price: "",
    selling_price: "",
    category_id: "",
    supplier_id: "",
    min_stock_level: "",
  });

  const { data: categories = [] } = useCategories();
  const { data: suppliers = [] } = useSuppliers();
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        sku: product.sku,
        cost_price: product.cost_price.toString(),
        selling_price: product.selling_price.toString(),
        category_id: product.category_id || "",
        supplier_id: product.supplier_id || "",
        min_stock_level: product.min_stock_level?.toString() || "",
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!product || !formData.name || !formData.sku) return;

    await updateProductMutation.mutateAsync({
      id: product.id,
      name: formData.name,
      description: formData.description || undefined,
      sku: formData.sku,
      cost_price: parseFloat(formData.cost_price) || 0,
      selling_price: parseFloat(formData.selling_price) || 0,
      category_id: formData.category_id || undefined,
      supplier_id: formData.supplier_id || undefined,
      min_stock_level: parseInt(formData.min_stock_level) || 0,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-product-name">Product Name *</Label>
              <Input 
                id="edit-product-name" 
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-sku">SKU *</Label>
              <Input 
                id="edit-sku" 
                placeholder="Enter SKU"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Input 
              id="edit-description" 
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-cost-price">Cost Price ($)</Label>
              <Input 
                id="edit-cost-price" 
                type="number" 
                placeholder="0.00"
                value={formData.cost_price}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-selling-price">Selling Price ($)</Label>
              <Input 
                id="edit-selling-price" 
                type="number" 
                placeholder="0.00"
                value={formData.selling_price}
                onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-supplier">Supplier</Label>
              <Select value={formData.supplier_id} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="edit-min-stock">Minimum Stock Level</Label>
            <Input 
              id="edit-min-stock" 
              type="number" 
              placeholder="0"
              value={formData.min_stock_level}
              onChange={(e) => setFormData(prev => ({ ...prev, min_stock_level: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={updateProductMutation.isPending || !formData.name || !formData.sku}
          >
            {updateProductMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Product...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};