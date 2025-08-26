import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Printer, Receipt } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface InvoicePDFGeneratorProps {
  orderId: string;
  onClose: () => void;
}

interface OrderDetails {
  id: string;
  order_number: string;
  created_at: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  customer?: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  };
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      name: string;
      sku: string;
      barcode?: string;
    };
  }>;
}

export const InvoicePDFGenerator: React.FC<InvoicePDFGeneratorProps> = ({
  orderId,
  onClose,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: async (): Promise<OrderDetails> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          customers (
            first_name,
            last_name,
            phone,
            email
          ),
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            products (
              name,
              sku,
              barcode
            )
          )
        `
        )
        .eq("id", orderId)
        .single();

      if (error) throw error;

      return {
        ...data,
        customer: data.customers,
        order_items: data.order_items.map((item: any) => ({
          ...item,
          product: item.products,
        })),
      };
    },
  });

  const generatePDF = async () => {
    if (!orderDetails) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      // Store Info
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("GROCERY HUB PRO", margin, 30);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("123 Store Street, City, State 12345", margin, 40);
      pdf.text(
        "Phone: (555) 123-4567 | Email: info@groceryhubpro.com",
        margin,
        46
      );
      pdf.text("Tax ID: 123-456-7890", margin, 52);

      // Invoice Title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("SALES INVOICE", pageWidth - margin - 50, 30);

      // Invoice Details
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Invoice #: ${orderDetails.order_number}`,
        pageWidth - margin - 70,
        40
      );
      pdf.text(
        `Date: ${new Date(orderDetails.created_at).toLocaleDateString()}`,
        pageWidth - margin - 70,
        46
      );
      pdf.text(
        `Time: ${new Date(orderDetails.created_at).toLocaleTimeString()}`,
        pageWidth - margin - 70,
        52
      );

      // Customer Info
      let yPos = 70;
      pdf.setFont("helvetica", "bold");
      pdf.text("BILL TO:", margin, yPos);

      pdf.setFont("helvetica", "normal");
      if (orderDetails.customer) {
        pdf.text(
          `${orderDetails.customer.first_name} ${orderDetails.customer.last_name}`,
          margin,
          yPos + 8
        );
        if (orderDetails.customer.phone) {
          pdf.text(`Phone: ${orderDetails.customer.phone}`, margin, yPos + 16);
        }
        if (orderDetails.customer.email) {
          pdf.text(`Email: ${orderDetails.customer.email}`, margin, yPos + 24);
        }
        yPos += 35;
      } else {
        pdf.text("Walk-in Customer", margin, yPos + 8);
        yPos += 20;
      }

      // Items Table
      const tableData = orderDetails.order_items.map((item) => [
        item.product.name,
        item.product.sku,
        item.quantity.toString(),
        `$${item.unit_price.toFixed(2)}`,
        `$${item.total_price.toFixed(2)}`,
      ]);

      pdf.autoTable({
        startY: yPos,
        head: [["Item", "SKU", "Qty", "Unit Price", "Total"]],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: margin, right: margin },
      });

      // Totals
      const finalY = (pdf as any).lastAutoTable.finalY + 20;
      const totalsX = pageWidth - margin - 80;

      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Subtotal: $${orderDetails.subtotal.toFixed(2)}`,
        totalsX,
        finalY
      );
      pdf.text(
        `Tax: $${orderDetails.tax_amount.toFixed(2)}`,
        totalsX,
        finalY + 8
      );

      if (orderDetails.discount_amount > 0) {
        pdf.text(
          `Discount: -$${orderDetails.discount_amount.toFixed(2)}`,
          totalsX,
          finalY + 16
        );
      }

      // Grand Total
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      const grandTotalY =
        orderDetails.discount_amount > 0 ? finalY + 24 : finalY + 16;
      pdf.text(
        `TOTAL: $${orderDetails.total_amount.toFixed(2)}`,
        totalsX,
        grandTotalY
      );

      // Footer
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(
        "Thank you for your business!",
        margin,
        pdf.internal.pageSize.getHeight() - 30
      );
      pdf.text(
        "Returns accepted within 30 days with receipt.",
        margin,
        pdf.internal.pageSize.getHeight() - 24
      );

      // Save PDF
      pdf.save(`invoice-${orderDetails.order_number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading invoice...</div>;
  }

  if (!orderDetails) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 print:hidden">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={generatePDF} disabled={isGenerating}>
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      {/* Invoice Preview */}
      <Card ref={invoiceRef} className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                GROCERY HUB PRO
              </h1>
              <div className="text-sm text-muted-foreground mt-2">
                <p>123 Store Street, City, State 12345</p>
                <p>Phone: (555) 123-4567 | Email: info@groceryhubpro.com</p>
                <p>Tax ID: 123-456-7890</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-2">SALES INVOICE</h2>
              <div className="text-sm">
                <p>
                  <strong>Invoice #:</strong> {orderDetails.order_number}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(orderDetails.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h3 className="font-bold mb-2">BILL TO:</h3>
            {orderDetails.customer ? (
              <div className="text-sm">
                <p>
                  {orderDetails.customer.first_name}{" "}
                  {orderDetails.customer.last_name}
                </p>
                {orderDetails.customer.phone && (
                  <p>Phone: {orderDetails.customer.phone}</p>
                )}
                {orderDetails.customer.email && (
                  <p>Email: {orderDetails.customer.email}</p>
                )}
              </div>
            ) : (
              <p className="text-sm">Walk-in Customer</p>
            )}
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 p-2 text-left">Item</th>
                  <th className="border border-gray-300 p-2 text-left">SKU</th>
                  <th className="border border-gray-300 p-2 text-center">
                    Qty
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.order_items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="border border-gray-300 p-2">
                      {item.product.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product.sku}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      ${item.unit_price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      ${item.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${orderDetails.tax_amount.toFixed(2)}</span>
              </div>
              {orderDetails.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${orderDetails.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>${orderDetails.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p>Returns accepted within 30 days with receipt.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
