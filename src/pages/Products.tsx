import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Loader2, X } from "lucide-react";
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
  Product,
} from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useSuppliers } from "@/hooks/use-suppliers";
import { EditProductDialog } from "@/components/edit-product-dialog";
import { PageSkeleton } from "@/components/ui/page-loading";
import { useLoadingDelay } from "@/hooks/use-loading-delay";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    sku: "",
    cost_price: "",
    selling_price: "",
    category_id: "",
    supplier_id: "",
    min_stock_level: "",
  });

  // Get category filter from URL
  const categoryFilter = searchParams.get("category");

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(categoryFilter || undefined);
  const { data: categories = [] } = useCategories();
  const { data: suppliers = [] } = useSuppliers();
  const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Use loading delay to prevent flash of loading states
  const isLoading = useLoadingDelay({ isActuallyLoading: productsLoading });

  // Find the current category name for display
  const currentCategory = categories.find((cat) => cat.id === categoryFilter);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categories?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const getStatusBadge = (product: Product) => {
    if (product.status === "inactive") {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (product.status === "discontinued") {
      return <Badge variant="destructive">Discontinued</Badge>;
    }
    // Check stock levels based on min_stock_level
    const stockLevel = product.min_stock_level || 0;
    if (stockLevel === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stockLevel <= 10) {
      return (
        <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
      );
    }
    return (
      <Badge className="bg-success text-success-foreground">In Stock</Badge>
    );
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sku) {
      return;
    }

    await createProductMutation.mutateAsync({
      name: newProduct.name,
      description: newProduct.description || undefined,
      sku: newProduct.sku,
      cost_price: parseFloat(newProduct.cost_price) || 0,
      selling_price: parseFloat(newProduct.selling_price) || 0,
      category_id: newProduct.category_id || undefined,
      supplier_id: newProduct.supplier_id || undefined,
      min_stock_level: parseInt(newProduct.min_stock_level) || 0,
      status: "active" as const,
      is_taxable: true,
    });

    setNewProduct({
      name: "",
      description: "",
      sku: "",
      cost_price: "",
      selling_price: "",
      category_id: "",
      supplier_id: "",
      min_stock_level: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProductMutation.mutateAsync(id);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleClearCategoryFilter = () => {
    setSearchParams({});
  };

  if (isLoading) {
    return <PageSkeleton type="products" />;
  }

  if (productsError) {
    return (
      <div className="text-center text-destructive p-8">
        Error loading products: {productsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Product Management
            {currentCategory && (
              <span className="text-xl text-muted-foreground ml-2">
                - {currentCategory.name}
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {currentCategory
              ? `Showing products in "${currentCategory.name}" category`
              : "Manage your product inventory and stock levels"}
          </p>
          {categoryFilter && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                Category: {currentCategory?.name || "Unknown"}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={handleClearCategoryFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-name">Product Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        sku: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost-price">Cost Price ($)</Label>
                  <Input
                    id="cost-price"
                    type="number"
                    placeholder="0.00"
                    value={newProduct.cost_price}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        cost_price: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="selling-price">Selling Price ($)</Label>
                  <Input
                    id="selling-price"
                    type="number"
                    placeholder="0.00"
                    value={newProduct.selling_price}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        selling_price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category_id}
                    onValueChange={(value) =>
                      setNewProduct((prev) => ({ ...prev, category_id: value }))
                    }
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
                    value={newProduct.supplier_id}
                    onValueChange={(value) =>
                      setNewProduct((prev) => ({ ...prev, supplier_id: value }))
                    }
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
                  value={newProduct.min_stock_level}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      min_stock_level: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                onClick={handleAddProduct}
                className="w-full"
                disabled={
                  createProductMutation.isPending ||
                  !newProduct.name ||
                  !newProduct.sku
                }
              >
                {createProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name, category, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Products ({filteredProducts.length})
            {categoryFilter && currentCategory && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                in "{currentCategory.name}"
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {categoryFilter
                ? `No products found in "${
                    currentCategory?.name || "this category"
                  }".`
                : searchTerm
                ? "No products found matching your search."
                : "No products available. Add your first product to get started."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.categories?.name || "-"}</TableCell>
                    <TableCell>${product.cost_price.toFixed(2)}</TableCell>
                    <TableCell>${product.selling_price.toFixed(2)}</TableCell>
                    <TableCell>{product.suppliers?.name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          {deleteProductMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EditProductDialog
        product={editProduct}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default Products;
