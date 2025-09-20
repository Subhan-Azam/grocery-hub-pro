import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Edit, Trash2, Phone, Mail, Loader2 } from "lucide-react";
import { useSuppliers, useCreateSupplier, useDeleteSupplier, Supplier } from "@/hooks/use-suppliers";
import { EditSupplierDialog } from "@/components/edit-supplier-dialog";
import { PageSkeleton } from "@/components/ui/page-loading";
import { useLoadingDelay } from "@/hooks/use-loading-delay";

const Suppliers = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    is_active: true,
  });

  const { data: suppliers = [], isLoading: suppliersLoading, error } = useSuppliers();
  const createSupplierMutation = useCreateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  // Use loading delay to prevent flash of loading states
  const isLoading = useLoadingDelay({ isActuallyLoading: suppliersLoading });

  const getStatusBadge = (status: boolean) => {
    return status 
      ? <Badge className="bg-success text-success-foreground">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name) {
      return;
    }

    await createSupplierMutation.mutateAsync({
      name: newSupplier.name,
      contact_person: newSupplier.contact_person || undefined,
      email: newSupplier.email || undefined,
      phone: newSupplier.phone || undefined,
      address: newSupplier.address || undefined,
      city: newSupplier.city || undefined,
      state: newSupplier.state || undefined,
      zip_code: newSupplier.zip_code || undefined,
      is_active: newSupplier.is_active,
    });

    setNewSupplier({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      is_active: true,
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteSupplier = async (id: string) => {
    await deleteSupplierMutation.mutateAsync(id);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <PageSkeleton type="suppliers" />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        Error loading suppliers: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Supplier Management</h2>
          <p className="text-muted-foreground">
            Manage your suppliers and their contact information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="supplier-name">Supplier Name *</Label>
                <Input 
                  id="supplier-name" 
                  placeholder="Enter supplier name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input 
                  id="contact-person" 
                  placeholder="Enter contact person name"
                  value={newSupplier.contact_person}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, contact_person: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email address"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter phone number"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="Enter address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    placeholder="City"
                    value={newSupplier.city}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    placeholder="State"
                    value={newSupplier.state}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input 
                    id="zip" 
                    placeholder="ZIP"
                    value={newSupplier.zip_code}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, zip_code: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={newSupplier.is_active}
                  onCheckedChange={(checked) => setNewSupplier(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
              <Button 
                onClick={handleAddSupplier} 
                className="w-full"
                disabled={createSupplierMutation.isPending || !newSupplier.name}
              >
                {createSupplierMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Supplier...
                  </>
                ) : (
                  "Add Supplier"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers ({suppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No suppliers available. Add your first supplier to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact_person || "-"}</TableCell>
                    <TableCell>
                      {supplier.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {supplier.email}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {supplier.phone}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{supplier.product_count || 0}</TableCell>
                    <TableCell>{getStatusBadge(supplier.is_active)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          disabled={deleteSupplierMutation.isPending}
                        >
                          {deleteSupplierMutation.isPending ? (
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
      
      <EditSupplierDialog
        supplier={editSupplier}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default Suppliers;