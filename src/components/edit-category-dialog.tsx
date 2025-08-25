import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Category, useUpdateCategory } from "@/hooks/use-categories";

interface EditCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditCategoryDialog = ({ category, open, onOpenChange }: EditCategoryDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        is_active: category.is_active,
      });
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!category || !formData.name) return;

    await updateCategoryMutation.mutateAsync({
      id: category.id,
      name: formData.name,
      description: formData.description || undefined,
      is_active: formData.is_active,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-category-name">Category Name *</Label>
            <Input 
              id="edit-category-name" 
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="edit-category-description">Description</Label>
            <Input 
              id="edit-category-description" 
              placeholder="Enter category description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-is-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="edit-is-active">Active</Label>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={updateCategoryMutation.isPending || !formData.name}
          >
            {updateCategoryMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Category...
              </>
            ) : (
              "Update Category"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};