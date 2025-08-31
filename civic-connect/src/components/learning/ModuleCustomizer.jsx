import React, { useState } from 'react';
import { LearningModule } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Image, Save } from "lucide-react";
import { toast } from "sonner";

export default function ModuleCustomizer({ module, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(module.cover_image || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsUpdating(true);
    try {
      await LearningModule.update(module.id, {
        ...module,
        cover_image: newImageUrl.trim()
      });
      
      toast.success('Cover image updated successfully!');
      setIsOpen(false);
      onUpdate(); // Refresh the modules list
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update cover image');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImagePreview = () => {
    if (newImageUrl.trim()) {
      window.open(newImageUrl.trim(), '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200 shadow-sm"
        >
          <Edit className="w-3 h-3 mr-1" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-teal-600" />
            Customize Cover Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-image">Current Image</Label>
            {module.cover_image ? (
              <div className="mt-2 rounded-lg overflow-hidden border">
                <img 
                  src={module.cover_image} 
                  alt={module.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            ) : (
              <div className="mt-2 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No image set
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="image-url">New Image URL</Label>
            <Input
              id="image-url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1"
            />
          </div>

          {newImageUrl.trim() && newImageUrl !== module.cover_image && (
            <div>
              <Label>Preview</Label>
              <div className="mt-2 rounded-lg overflow-hidden border">
                <img 
                  src={newImageUrl} 
                  alt="Preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden h-32 bg-gray-100 rounded-lg items-center justify-center text-gray-500 text-sm">
                  Invalid image URL
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImagePreview}
                className="mt-2 text-xs"
              >
                Open in New Tab
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isUpdating || !newImageUrl.trim() || newImageUrl === module.cover_image}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Image
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-1">Tips for good images:</p>
          <ul className="text-xs space-y-1">
            <li>• Use Unsplash.com for free, high-quality images</li>
            <li>• Right-click → "Copy image address" to get the URL</li>
            <li>• Look for illustrations or graphic designs</li>
            <li>• Ensure the URL ends with .jpg, .png, or .webp</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}