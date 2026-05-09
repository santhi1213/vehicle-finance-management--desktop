// import { useState, useEffect } from 'react';
// import { useData } from '@/lib/data-context';
// import { PageHeader } from '@/components/PageHeader';
// import { StatusBadge } from '@/components/StatusBadge';
// import { formatINR } from '@/lib/mock-data';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Card, CardContent } from '@/components/ui/card';
// import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Upload, Image as ImageIcon } from 'lucide-react';
// import { Vehicle } from '@/lib/types';
// import { toast } from 'sonner';
// import axios from 'axios';

// const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// const emptyVehicle: Omit<Vehicle, 'id' | 'images'> = { 
//   type: 'Car', 
//   name: '', 
//   model: '', 
//   price: 0, 
//   status: 'Available',
//   // description: ''
// };

// interface VehicleWithImages extends Vehicle {
//   images: string[];
//   description?: string;
// }

// export default function VehicleManagement() {
//   const { vehicles, setVehicles } = useData();
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<VehicleWithImages | null>(null);
//   const [form, setForm] = useState<Omit<VehicleWithImages, 'id' | 'images'>>(emptyVehicle);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // Gallery view states
//   const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithImages | null>(null);
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Fetch vehicles on component mount  
//   useEffect(() => {
//     fetchVehicles();
//   }, []);

//   const fetchVehicles = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/vehicles`);
//       console.log(response)
//       setVehicles(response.data.data);
//     } catch (error) {
//       console.error('Error fetching vehicles:', error);
//       toast.error('Failed to fetch vehicles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setSelectedImages(prev => [...prev, ...files]);
    
//     // Create preview URLs
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(prev => [...prev, ...newPreviews]);
//   };

//   const removeImage = (index: number) => {
//     setSelectedImages(prev => prev.filter((_, i) => i !== index));
//     URL.revokeObjectURL(imagePreviews[index]);
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const openNew = () => { 
//     setEditing(null); 
//     setForm(emptyVehicle); 
//     setSelectedImages([]);
//     setImagePreviews([]);
//     setOpen(true); 
//   };

//   const openEdit = (v: VehicleWithImages) => { 
//     setEditing(v); 
//     setForm({ 
//       type: v.type, 
//       name: v.name, 
//       model: v.model, 
//       price: v.price, 
//       status: v.status,
//       description: v.description || ''
//     }); 
//     setSelectedImages([]);
//     setImagePreviews(v.images || []);
//     setOpen(true); 
//   };

//   const openGallery = (vehicle: VehicleWithImages) => {
//     setSelectedVehicle(vehicle);
//     setCurrentImageIndex(0);
//     setGalleryOpen(true);
//   };

//   const save = async () => {
//     if (!form.name || !form.model || form.price <= 0) { 
//       toast.error('Please fill all required fields'); 
//       return; 
//     }

//     try {
//       setLoading(true);
      
//       if (editing) {
//         // Update vehicle details
//         await axios.put(`${API_BASE_URL}/vehicles/${editing.id}`, {
//           vehicleType: form.type.toLowerCase(),
//           name: form.name,
//           model: form.model,
//           price: form.price.toString(),
//           status: form.status.toLowerCase().replace(' ', ''),
//           description: form.description
//         });

//         // Upload new images if any
//         if (selectedImages.length > 0) {
//           const formData = new FormData();
//           selectedImages.forEach(image => {
//             formData.append('images', image);
//           });
          
//           await axios.post(`${API_BASE_URL}/vehicles/${editing.id}/images`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
//         }

//         toast.success('Vehicle updated successfully');
//       } else {
//         // Create new vehicle
//         const formData = new FormData();
//         formData.append('vehicleType', form.type.toLowerCase());
//         formData.append('name', form.name);
//         formData.append('model', form.model);
//         formData.append('price', form.price.toString());
//         formData.append('status', form.status.toLowerCase().replace(' ', ''));
//         if (form.description) {
//           formData.append('description', form.description);
//         }
        
//         selectedImages.forEach(image => {
//           formData.append('images', image);
//         });

//         await axios.post(`${API_BASE_URL}/vehicles`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });

//         toast.success('Vehicle added successfully');
//       }

//       // Refresh vehicles list
//       await fetchVehicles();
//       setOpen(false);
//     } catch (error) {
//       console.error('Error saving vehicle:', error);
//       toast.error('Failed to save vehicle');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const remove = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
//     try {
//       setLoading(true);
//       await axios.delete(`${API_BASE_URL}/vehicles/${id}`);
//       await fetchVehicles();
//       toast.success('Vehicle deleted successfully');
//     } catch (error) {
//       console.error('Error deleting vehicle:', error);
//       toast.error('Failed to delete vehicle');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeVehicleImage = async (vehicleId: string, imageIndex: number) => {
//     if (!confirm('Are you sure you want to remove this image?')) return;
    
//     try {
//       setLoading(true);
//       await axios.delete(`${API_BASE_URL}/vehicles/images/${vehicleId}/${imageIndex}`);
      
//       // Update local state
//       if (selectedVehicle && selectedVehicle.id === vehicleId) {
//         const updatedVehicle = { ...selectedVehicle };
//         updatedVehicle.images = updatedVehicle.images.filter((_, i) => i !== imageIndex);
//         setSelectedVehicle(updatedVehicle);
        
//         if (currentImageIndex >= imageIndex) {
//           setCurrentImageIndex(prev => Math.max(0, prev - 1));
//         }
//       }
      
//       await fetchVehicles();
//       toast.success('Image removed successfully');
//     } catch (error) {
//       console.error('Error removing image:', error);
//       toast.error('Failed to remove image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markSold = async (id: string) => {
//     try {
//       setLoading(true);
//       await axios.patch(`${API_BASE_URL}/vehicles/status/${id}`, {
//         status: 'soldout'
//       });
//       await fetchVehicles();
//       toast.success('Vehicle marked as sold');
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="animate-fade-in">
//       <PageHeader 
//         title="Vehicle Inventory" 
//         description={`${vehicles.length} vehicles`} 
//         actions={
//           <Button size="sm" onClick={openNew} disabled={loading}>
//             <Plus className="h-4 w-4 mr-1" />
//             Add Vehicle
//           </Button>
//         } 
//       />

//       {loading && vehicles.length === 0 ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {vehicles.map((v: VehicleWithImages, i) => (
//             <Card 
//               key={v.id} 
//               className="animate-fade-in overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//               style={{ animationDelay: `${i * 40}ms` }}
//               onClick={() => openGallery(v)}
//             >
//               <div className="aspect-video relative bg-muted">
//                 {v.images && v.images.length > 0 ? (
//                   <img 
//                     src={v.images[0]} 
//                     alt={`${v.name} ${v.model}`}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <ImageIcon className="h-12 w-12 text-muted-foreground" />
//                   </div>
//                 )}
//                 <div className="absolute top-2 right-2">
//                   <StatusBadge status={v.status} />
//                 </div>
//                 {v.images && v.images.length > 1 && (
//                   <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                     {v.images.length} photos
//                   </div>
//                 )}
//               </div>
              
//               <CardContent className="p-4">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h3 className="font-semibold">{v.name}</h3>
//                     <p className="text-sm text-muted-foreground">{v.model}</p>
//                   </div>
//                   <StatusBadge status={v.type} />
//                 </div>
                
//                 <div className="flex items-center justify-between mt-3">
//                   <span className="text-lg font-bold font-mono">{formatINR(v.price)}</span>
//                   <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
//                     {v.status === 'Available' && (
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="text-xs"
//                         onClick={() => markSold(v.id)}
//                         disabled={loading}
//                       >
//                         Sell
//                       </Button>
//                     )}
//                     <Button 
//                       variant="ghost" 
//                       size="icon" 
//                       className="h-8 w-8"
//                       onClick={() => openEdit(v)}
//                       disabled={loading}
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="icon" 
//                       className="h-8 w-8 text-destructive"
//                       onClick={() => remove(v.id)}
//                       disabled={loading}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {vehicles.length === 0 && !loading && (
//             <div className="col-span-full text-center py-12">
//               <p className="text-muted-foreground">No vehicles found. Click "Add Vehicle" to create one.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Add/Edit Vehicle Sheet */}
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetContent className="sm:max-w-md overflow-y-auto">
//           <SheetHeader>
//             <SheetTitle>{editing ? 'Edit Vehicle' : 'Add Vehicle'}</SheetTitle>
//           </SheetHeader>
          
//           <div className="space-y-4 mt-6">
//             <div>
//               <Label className="text-xs">Vehicle Type *</Label>
//               <Select 
//                 value={form.type} 
//                 onValueChange={(v) => setForm(f => ({ ...f, type: v as 'Bike' | 'Car' }))}
//                 disabled={loading}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Car">Car</SelectItem>
//                   <SelectItem value="bike">Bike</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label className="text-xs">Vehicle Name *</Label>
//               <Input 
//                 value={form.name} 
//                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
//                 placeholder="e.g. Honda"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <Label className="text-xs">Model *</Label>
//               <Input 
//                 value={form.model} 
//                 onChange={e => setForm(f => ({ ...f, model: e.target.value }))} 
//                 placeholder="e.g. City 2024"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <Label className="text-xs">Description</Label>
//               <Textarea 
//                 value={form.description || ''} 
//                 onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
//                 placeholder="Vehicle description..."
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <Label className="text-xs">Price (INR) *</Label>
//               <Input 
//                 type="number" 
//                 value={form.price || ''} 
//                 onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} 
//                 placeholder="0" 
//                 className="font-mono"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <Label className="text-xs">Status</Label>
//               <Select 
//                 value={form.status} 
//                 onValueChange={(v) => setForm(f => ({ ...f, status: v as 'Available' | 'Sold Out' }))}
//                 disabled={loading}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Available">Available</SelectItem>
//                   <SelectItem value="Sold Out">Sold Out</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label className="text-xs">Images</Label>
//               <div className="mt-2">
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageSelect}
//                   className="hidden"
//                   id="image-upload"
//                   disabled={loading}
//                 />
//                 <Label
//                   htmlFor="image-upload"
//                   className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
//                 >
//                   <div className="text-center">
//                     <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground">Click to upload images</p>
//                   </div>
//                 </Label>
//               </div>

//               {/* Image Previews */}
//               {(imagePreviews.length > 0 || (editing && editing.images?.length > 0)) && (
//                 <div className="grid grid-cols-3 gap-2 mt-3">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
//                       <img 
//                         src={preview} 
//                         alt={`Preview ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <button
//                         onClick={() => {
//                           if (editing && !selectedImages[index]) {
//                             // This is an existing image
//                             removeVehicleImage(editing.id, index);
//                           } else {
//                             // This is a newly selected image
//                             removeImage(index);
//                           }
//                         }}
//                         className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                         disabled={loading}
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <Button 
//               className="w-full" 
//               onClick={save} 
//               disabled={loading}
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>{editing ? 'Updating...' : 'Adding...'}</span>
//                 </div>
//               ) : (
//                 <span>{editing ? 'Update Vehicle' : 'Add Vehicle'}</span>
//               )}
//             </Button>
//           </div>
//         </SheetContent>
//       </Sheet>

//       {/* Image Gallery Dialog */}
//       <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
//         <DialogContent className="max-w-5xl border border-green-500">
//           <DialogHeader>
//             <DialogTitle>
//               {selectedVehicle?.name} {selectedVehicle?.model}
//             </DialogTitle>
//           </DialogHeader>

//           {selectedVehicle && (
//             <div className="space-y-4">
//               {/* Image Carousel */}
//               <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
//                 {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
//                   <>
//                     <img 
//                       src={selectedVehicle.images[currentImageIndex]} 
//                       alt={`${selectedVehicle.name} ${currentImageIndex + 1}`}
//                       className="w-full h-full object-contain"
//                     />
                    
//                     {/* Navigation Arrows */}
//                     {selectedVehicle.images.length > 1 && (
//                       <>
//                         <button
//                           onClick={() => setCurrentImageIndex(prev => 
//                             prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
//                           )}
//                           className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
//                         >
//                           <ChevronLeft className="h-6 w-6" />
//                         </button>
//                         <button
//                           onClick={() => setCurrentImageIndex(prev => 
//                             prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
//                           )}
//                           className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
//                         >
//                           <ChevronRight className="h-6 w-6" />
//                         </button>
//                       </>
//                     )}

//                     {/* Image Counter */}
//                     <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                       {currentImageIndex + 1} / {selectedVehicle.images.length}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <ImageIcon className="h-16 w-16 text-muted-foreground" />
//                   </div>
//                 )}
//               </div>

//               {/* Thumbnail Strip */}
//               {selectedVehicle.images && selectedVehicle.images.length > 1 && (
//                 <div className="flex gap-2 overflow-x-auto pb-2">
//                   {selectedVehicle.images.map((image, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentImageIndex(index)}
//                       className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
//                         currentImageIndex === index ? 'border-primary' : 'border-transparent'
//                       }`}
//                     >
//                       <img 
//                         src={image} 
//                         alt={`Thumbnail ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {/* Vehicle Details */}
//               <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Type</p>
//                   <p className="font-medium uppercase">{selectedVehicle.type}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Status</p>
//                   <StatusBadge status={selectedVehicle.status} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Price</p>
//                   <p className="font-bold font-mono">{formatINR(selectedVehicle.price)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Model</p>
//                   <p className="font-medium">{selectedVehicle.model}</p>
//                 </div>
//                 {selectedVehicle.description && (
//                   <div className="col-span-2">
//                     <p className="text-sm text-muted-foreground">Description</p>
//                     <p className="font-medium">{selectedVehicle.description}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { useData } from '@/lib/data-context';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { formatINR } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Upload, Image as ImageIcon } from 'lucide-react';
import { Vehicle } from '@/lib/types';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

const emptyVehicle: Omit<Vehicle, 'id' | 'images'> = { 
  type: 'Car', 
  name: '', 
  model: '', 
  price: 0, 
  status: 'Available',
  // description: ''
};

interface VehicleWithImages extends Vehicle {
  images: string[];
  description?: string;
}

export default function VehicleManagement() {
  const { vehicles, setVehicles } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleWithImages | null>(null);
  const [form, setForm] = useState<Omit<VehicleWithImages, 'id' | 'images'>>(emptyVehicle);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Gallery view states
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithImages | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch vehicles on component mount  
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/vehicles`);
      console.log(response)
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const openNew = () => { 
    setEditing(null); 
    setForm(emptyVehicle); 
    setSelectedImages([]);
    setImagePreviews([]);
    setOpen(true); 
  };

  const openEdit = (v: VehicleWithImages) => { 
    setEditing(v); 
    setForm({ 
      type: v.type, 
      name: v.name, 
      model: v.model, 
      price: v.price, 
      status: v.status,
      description: v.description || ''
    }); 
    setSelectedImages([]);
    setImagePreviews(v.images || []);
    setOpen(true); 
  };

  const openGallery = (vehicle: VehicleWithImages) => {
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setGalleryOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.model || form.price <= 0) { 
      toast.error('Please fill all required fields'); 
      return; 
    }

    try {
      setLoading(true);
      
      if (editing) {
        // Update vehicle details
        await axios.put(`${API_BASE_URL}/vehicles/${editing.id}`, {
          vehicleType: form.type.toLowerCase(),
          name: form.name,
          model: form.model,
          price: form.price.toString(),
          status: form.status.toLowerCase().replace(' ', ''),
          description: form.description
        });

        // Upload new images if any
        if (selectedImages.length > 0) {
          const formData = new FormData();
          selectedImages.forEach(image => {
            formData.append('images', image);
          });
          
          await axios.post(`${API_BASE_URL}/vehicles/${editing.id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        toast.success('Vehicle updated successfully');
      } else {
        // Create new vehicle
        const formData = new FormData();
        formData.append('vehicleType', form.type.toLowerCase());
        formData.append('name', form.name);
        formData.append('model', form.model);
        formData.append('price', form.price.toString());
        formData.append('status', form.status.toLowerCase().replace(' ', ''));
        if (form.description) {
          formData.append('description', form.description);
        }
        
        selectedImages.forEach(image => {
          formData.append('images', image);
        });

        await axios.post(`${API_BASE_URL}/vehicles`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast.success('Vehicle added successfully');
      }

      // Refresh vehicles list
      await fetchVehicles();
      setOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/vehicles/${id}`);
      await fetchVehicles();
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setLoading(false);
    }
  };

  const removeVehicleImage = async (vehicleId: string, imageIndex: number) => {
    if (!confirm('Are you sure you want to remove this image?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/vehicles/images/${vehicleId}/${imageIndex}`);
      
      // Update local state
      if (selectedVehicle && selectedVehicle.id === vehicleId) {
        const updatedVehicle = { ...selectedVehicle };
        updatedVehicle.images = updatedVehicle.images.filter((_, i) => i !== imageIndex);
        setSelectedVehicle(updatedVehicle);
        
        if (currentImageIndex >= imageIndex) {
          setCurrentImageIndex(prev => Math.max(0, prev - 1));
        }
      }
      
      await fetchVehicles();
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  const markSold = async (id: string) => {
    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/vehicles/status/${id}`, {
        status: 'soldout'
      });
      await fetchVehicles();
      toast.success('Vehicle marked as sold');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Vehicle Inventory" 
        description={`${vehicles.length} vehicles`} 
        actions={
          <Button size="sm" onClick={openNew} disabled={loading}>
            <Plus className="h-4 w-4 mr-1" />
            Add Vehicle
          </Button>
        } 
      />

      {loading && vehicles.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((v: VehicleWithImages, i) => (
            <Card 
              key={v.id} 
              className="animate-fade-in overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => openGallery(v)}
            >
              <div className="aspect-video relative bg-muted">
                {v.images && v.images.length > 0 ? (
                  <img 
                    src={v.images[0]} 
                    alt={`${v.name} ${v.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={v.status} />
                </div>
                {v.images && v.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {v.images.length} photos
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{v.name}</h3>
                    <p className="text-sm text-muted-foreground">{v.model}</p>
                  </div>
                  <StatusBadge status={v.type} />
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold font-mono">{formatINR(v.price)}</span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    {v.status === 'Available' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => markSold(v.id)}
                        disabled={loading}
                      >
                        Sell
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openEdit(v)}
                      disabled={loading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => remove(v.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {vehicles.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No vehicles found. Click "Add Vehicle" to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Vehicle Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Vehicle' : 'Add Vehicle'}</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            <div>
              <Label className="text-xs">Vehicle Type *</Label>
              <Select 
                value={form.type} 
                onValueChange={(v) => setForm(f => ({ ...f, type: v as 'Bike' | 'Car' }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Vehicle Name *</Label>
              <Input 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                placeholder="e.g. Honda"
                disabled={loading}
              />
            </div>

            <div>
              <Label className="text-xs">Model *</Label>
              <Input 
                value={form.model} 
                onChange={e => setForm(f => ({ ...f, model: e.target.value }))} 
                placeholder="e.g. City 2024"
                disabled={loading}
              />
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea 
                value={form.description || ''} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="Vehicle description..."
                disabled={loading}
              />
            </div>

            <div>
              <Label className="text-xs">Price (INR) *</Label>
              <Input 
                type="number" 
                value={form.price || ''} 
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} 
                placeholder="0" 
                className="font-mono"
                disabled={loading}
              />
            </div>

            <div>
              <Label className="text-xs">Status</Label>
              <Select 
                value={form.status} 
                onValueChange={(v) => setForm(f => ({ ...f, status: v as 'Available' | 'Sold Out' }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold Out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Images</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={loading}
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload images</p>
                  </div>
                </Label>
              </div>

              {/* Image Previews */}
              {(imagePreviews.length > 0 || (editing && editing.images?.length > 0)) && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          if (editing && !selectedImages[index]) {
                            // This is an existing image
                            removeVehicleImage(editing.id, index);
                          } else {
                            // This is a newly selected image
                            removeImage(index);
                          }
                        }}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              className="w-full" 
              onClick={save} 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{editing ? 'Updating...' : 'Adding...'}</span>
                </div>
              ) : (
                <span>{editing ? 'Update Vehicle' : 'Add Vehicle'}</span>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Image Gallery Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl border border-green-500">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle?.name} {selectedVehicle?.model}
            </DialogTitle>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-4">
              {/* Image Carousel */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                  <>
                    <img 
                      src={selectedVehicle.images[currentImageIndex]} 
                      alt={`${selectedVehicle.name} ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedVehicle.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
                          )}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {currentImageIndex + 1} / {selectedVehicle.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {selectedVehicle.images && selectedVehicle.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedVehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Vehicle Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium uppercase">{selectedVehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedVehicle.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-bold font-mono">{formatINR(selectedVehicle.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-medium">{selectedVehicle.model}</p>
                </div>
                {selectedVehicle.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedVehicle.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

