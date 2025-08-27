import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  is_active: boolean;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

export const useWarehouses = () => {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Warehouse[];
    },
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      warehouse: Omit<Warehouse, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("warehouses")
        .insert([warehouse])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast({
        title: "Warehouse Created",
        description: "Warehouse has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create warehouse.",
        variant: "destructive",
      });
    },
  });
};
