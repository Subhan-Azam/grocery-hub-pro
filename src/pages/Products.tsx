import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
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
import { ProductForm } from "@/components/product-form";
import { SearchInput } from "@/components/search-input";
import { ProductStatusBadge } from "@/components/product-status-badge";
import { PageHeader } from "@/components/page-header";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const getPageSubtitle = () => {
    return currentCategory
      ? `Showing products in "${currentCategory.name}" category`
      : "Manage your product inventory and stock levels";
  };

  const getPageTitle = () => {
    return currentCategory
      ? `Product Management - ${currentCategory.name}`
      : "Product Management";
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
      <PageHeader
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        categoryFilter={
          categoryFilter
            ? {
                name: currentCategory?.name || "Unknown",
                onClear: handleClearCategoryFilter,
              }
            : undefined
        }
      >
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
            <ProductForm
              formData={newProduct}
              onFormChange={setNewProduct}
              categories={categories}
              suppliers={suppliers}
              onSubmit={handleAddProduct}
              isLoading={createProductMutation.isPending}
              submitText="Add Product"
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      Search
      {/* <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name, category, or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div> */}
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search products by name, category, or SKU..."
      />
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
                    <TableCell>
                      <ProductStatusBadge product={product} />
                    </TableCell>
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
