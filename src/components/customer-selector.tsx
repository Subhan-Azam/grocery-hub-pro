import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useCustomers } from "@/hooks/use-customers";
import { useToast } from "@/hooks/use-toast";
import { User, Plus, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  selectedCustomer,
  onCustomerSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const { data: customers = [], createCustomer } = useCustomers();
  const { toast } = useToast();

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomer.first_name || !newCustomer.last_name) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createCustomer.mutateAsync(newCustomer);
      onCustomerSelect(result);
      setNewCustomer({ first_name: "", last_name: "", phone: "", email: "" });
      setShowAddDialog(false);

      toast({
        title: "Customer Added",
        description: `${result.first_name} ${result.last_name} has been added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      {selectedCustomer ? (
        <div className="flex items-center justify-between p-2 border rounded-md">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <div>
              <p className="font-medium text-sm">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </p>
              {selectedCustomer.phone && (
                <p className="text-xs text-muted-foreground">
                  {selectedCustomer.phone}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCustomerSelect(null)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex-1 justify-between text-sm"
              >
                Select customer...
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <Command>
                <CommandInput placeholder="Search customers..." />
                <CommandList>
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {customers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={`${customer.first_name} ${customer.last_name} ${
                          customer.phone || ""
                        }`}
                        onSelect={() => {
                          onCustomerSelect(customer);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCustomer?.id === customer.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div>
                          <p className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </p>
                          {customer.phone && (
                            <p className="text-xs text-muted-foreground">
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="px-3">
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Create a new customer profile for this sale.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={newCustomer.first_name}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          first_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={newCustomer.last_name}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          last_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Customer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {!selectedCustomer && (
        <Badge variant="secondary" className="text-xs">
          Walk-in Customer
        </Badge>
      )}
    </div>
  );
};
