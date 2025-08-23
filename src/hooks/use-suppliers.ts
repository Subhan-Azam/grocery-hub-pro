import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // Get suppliers
      const { data: suppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (suppliersError) throw suppliersError;

      // Get product counts for each supplier
      const suppliersWithCount = await Promise.all(
        (suppliers || []).map(async (supplier) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('supplier_id', supplier.id)
            .eq('status', 'active');

          return {
            ...supplier,
            product_count: count || 0,
          };
        })
      );

      return suppliersWithCount as Supplier[];
    },
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (supplier: { name: string } & Partial<Supplier>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          ...supplier,
          is_active: supplier.is_active ?? true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Created",
        description: "Supplier has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create supplier.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...supplier }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Updated",
        description: "Supplier has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update supplier.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Deleted",
        description: "Supplier has been removed.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete supplier.",
        variant: "destructive",
      });
    },
  });
};