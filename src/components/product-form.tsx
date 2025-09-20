import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  cost_price: string;
  selling_price: string;
  category_id: string;
  supplier_id: string;
  min_stock_level: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  onFormChange: (data: ProductFormData) => void;
  categories: Array<{ id: string; name: string }>;
  suppliers: Array<{ id: string; name: string }>;
  onSubmit: () => void;
  isLoading?: boolean;
  submitText?: string;
}

export const ProductForm = ({
  formData,
  onFormChange,
  categories,
  suppliers,
  onSubmit,
  isLoading = false,
  submitText = "Save Product",
}: ProductFormProps) => {
  const updateField = (field: keyof ProductFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-name">Product Name *</Label>
          <Input
            id="product-name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            placeholder="Enter SKU"
            value={formData.sku}
            onChange={(e) => updateField("sku", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter product description"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost-price">Cost Price ($)</Label>
          <Input
            id="cost-price"
            type="number"
            placeholder="0.00"
            value={formData.cost_price}
            onChange={(e) => updateField("cost_price", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="selling-price">Selling Price ($)</Label>
          <Input
            id="selling-price"
            type="number"
            placeholder="0.00"
            value={formData.selling_price}
            onChange={(e) => updateField("selling_price", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => updateField("category_id", value)}
          >
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
          <Label htmlFor="supplier">Supplier</Label>
          <Select
            value={formData.supplier_id}
            onValueChange={(value) => updateField("supplier_id", value)}
          >
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
        <Label htmlFor="min-stock">Minimum Stock Level</Label>
        <Input
          id="min-stock"
          type="number"
          placeholder="0"
          value={formData.min_stock_level}
          onChange={(e) => updateField("min_stock_level", e.target.value)}
        />
      </div>

      <Button
        onClick={onSubmit}
        className="w-full"
        disabled={isLoading || !formData.name || !formData.sku}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {submitText}...
          </>
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
};
