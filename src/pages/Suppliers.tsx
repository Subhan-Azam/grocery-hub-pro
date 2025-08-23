import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  productsSupplied: number;
  status: "Active" | "Inactive";
}

const initialSuppliers: Supplier[] = [
  { id: 1, name: "Fresh Farms", contact: "John Smith", email: "john@freshfarms.com", phone: "+1-555-0101", productsSupplied: 45, status: "Active" },
  { id: 2, name: "Dairy Co", contact: "Sarah Johnson", email: "sarah@dairyco.com", phone: "+1-555-0102", productsSupplied: 23, status: "Active" },
  { id: 3, name: "Local Bakery", contact: "Mike Wilson", email: "mike@localbakery.com", phone: "+1-555-0103", productsSupplied: 18, status: "Active" },
  { id: 4, name: "Garden Supply", contact: "Emma Davis", email: "emma@gardensupply.com", phone: "+1-555-0104", productsSupplied: 32, status: "Active" },
  { id: 5, name: "Premium Meats", contact: "Robert Brown", email: "robert@premiummeats.com", phone: "+1-555-0105", productsSupplied: 15, status: "Inactive" },
];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: Supplier["status"]) => {
    return status === "Active" 
      ? <Badge className="bg-success text-success-foreground">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  const handleAddSupplier = () => {
    toast({
      title: "Supplier Added",
      description: "New supplier has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast({
      title: "Supplier Deleted",
      description: "Supplier has been removed.",
      variant: "destructive",
    });
  };

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier-name">Supplier Name</Label>
                <Input id="supplier-name" placeholder="Enter supplier name" />
              </div>
              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="Enter contact person name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <Button onClick={handleAddSupplier} className="w-full">
                Add Supplier
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
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {supplier.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {supplier.phone}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.productsSupplied}</TableCell>
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;