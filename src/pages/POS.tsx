import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";
import { useOrders, useCompleteOrderSale } from "@/hooks/use-orders";
import { useWarehouses } from "@/hooks/use-warehouses";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Scan,
  Users,
  Receipt,
  Calculator,
} from "lucide-react";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { InvoicePDFGenerator } from "@/components/invoice-pdf-generator";
import { CustomerSelector } from "@/components/customer-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
  sku: string;
  tax_rate?: number;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [discount, setDiscount] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const { toast } = useToast();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: warehouses = [], isLoading: warehousesLoading } =
    useWarehouses();
  const createOrder = useCompleteOrderSale();

  // Filter products based on search term (name, barcode, or SKU)
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add product to cart
  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.selling_price,
          quantity: 1,
          barcode: product.barcode,
          sku: product.sku,
          tax_rate: product.tax_rate,
        },
      ]);
    }
  };

  // Update cart item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const taxRate = item.tax_rate || 0;
    return sum + (itemTotal * taxRate) / 100;
  }, 0);
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal + taxAmount - discountAmount;

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      addToCart(product);
      setSearchTerm("");
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive",
      });
    }
    setShowScanner(false);
  };

  // Handle checkout button click - opens confirmation modal
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    // Check if there are any warehouses available
    if (warehouses.length === 0) {
      toast({
        title: "No Warehouse Available",
        description:
          "Please configure at least one warehouse before making sales.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  // Handle actual order processing
  const handleConfirmOrder = async () => {
    setIsProcessingOrder(true);

    try {
      // Generate order number
      const orderNumber = `POS-${Date.now()}`;

      // Use the first available warehouse
      const warehouseId = warehouses[0].id;

      // Create order data
      const orderData = {
        order_number: orderNumber,
        customer_id: selectedCustomer?.id || null,
        subtotal: subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: grandTotal,
        payment_status: "paid" as const,
        status: "delivered" as const,
        warehouse_id: warehouseId,
        shipping_amount: 0,
        notes: "POS Sale",
      };

      // Create order items
      const orderItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const result = await createOrder.mutateAsync({
        order: orderData,
        items: orderItems,
      });

      setLastOrderId(result.id);
      setShowInvoice(true);
      setShowConfirmModal(false);

      // Clear cart after successful order
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);

      toast({
        title: "Sale Completed",
        description: `Order ${orderNumber} has been processed successfully`,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "Failed to process the sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredProducts.length > 0) {
      addToCart(filteredProducts[0]);
      setSearchTerm("");
    }
  };

  return (
    <div className="p-6 h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Panel - Product Search & Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Product Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by name, barcode, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-2"
                >
                  <Scan className="h-4 w-4" />
                  Scan
                </Button>
              </div>

              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm truncate">
                            {product.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            ${product.selling_price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          SKU: {product.sku}
                        </p>
                        {product.barcode && (
                          <p className="text-xs text-muted-foreground">
                            Barcode: {product.barcode}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="space-y-4">
          {/* Customer Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerSelector
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
              />
            </CardContent>
          </Card>

          {/* Cart */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShoppingCart className="h-4 w-4" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 mb-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Cart is empty
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Separator className="my-4" />

              {/* Discount */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Discount %:</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 h-8"
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full mt-4"
                disabled={
                  cart.length === 0 || warehousesLoading || isProcessingOrder
                }
              >
                <Calculator className="h-4 w-4 mr-2" />
                {isProcessingOrder ? "Processing..." : "Checkout"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Barcode Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogDescription>
              Position the barcode within the camera view
            </DialogDescription>
          </DialogHeader>
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onClose={() => setShowScanner(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogDescription>
              Please review your order details before confirming the sale.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>
                    {cart.length} item{cart.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {selectedCustomer && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Customer</h4>
                <p className="text-sm">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </p>
                {selectedCustomer.phone && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.phone}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
                disabled={isProcessingOrder}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmOrder}
                className="flex-1"
                disabled={isProcessingOrder}
              >
                {isProcessingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Receipt className="h-4 w-4 mr-2" />
                    Confirm Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Generated</DialogTitle>
            <DialogDescription>
              Sale completed successfully. You can print or download the
              invoice.
            </DialogDescription>
          </DialogHeader>
          {lastOrderId && (
            <InvoicePDFGenerator
              orderId={lastOrderId}
              onClose={() => setShowInvoice(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
