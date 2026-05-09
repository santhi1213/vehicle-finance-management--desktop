// import { useState, useEffect } from 'react';
// import { useData } from '@/lib/data-context';
// import { PageHeader } from '@/components/PageHeader';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// import { Card, CardContent } from '@/components/ui/card';
// import { Plus, Pencil, Trash2, Eye, RefreshCw, Loader2, AlertCircle, Search, X, ChevronLeft, ChevronRight, User, Phone, MapPin, CreditCard, Briefcase, Landmark } from 'lucide-react';
// import { CollectionAgent } from '@/lib/types';
// import { toast } from 'sonner';
// import axios from 'axios';

// const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   withCredentials: false
// });

// interface Agent extends Omit<CollectionAgent, 'address'> {
//   _id?: string;
//   aadharNo?: string;
//   age: number;
//   contactDetails?: {
//     phone: string;
//     alternatePhone?: string;
//     email?: string;
//   };
//   address?: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
//   employmentDetails?: {
//     department?: string;
//     designation?: string;
//     joinDate?: string;
//     commission?: string;
//   };
//   bankDetails?: {
//     accountNumber?: string;
//     ifscCode?: string;
//     bankName?: string;
//     branchName?: string;
//   };
//   isActive?: boolean;
//   customerCount?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface AgentFormData {
//   name: string;
//   age: string;
//   aadharNo: string;
//   contactDetails: {
//     phone: string;
//     alternatePhone: string;
//     email: string;
//   };
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
//   employmentDetails: {
//     department: string;
//     designation: string;
//     joinDate: string;
//     commission: string;
//   };
//   bankDetails: {
//     accountNumber: string;
//     ifscCode: string;
//     bankName: string;
//     branchName: string;
//   };
// }

// const emptyAgent: AgentFormData = {
//   name: '',
//   age: '',
//   aadharNo: '',
//   contactDetails: {
//     phone: '',
//     alternatePhone: '',
//     email: ''
//   },
//   address: {
//     street: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country: 'India'
//   },
//   employmentDetails: {
//     department: 'collection',
//     designation: '',
//     joinDate: new Date().toISOString().split('T')[0],
//     commission: ''
//   },
//   bankDetails: {
//     accountNumber: '',
//     ifscCode: '',
//     bankName: '',
//     branchName: ''
//   }
// };

// export default function AgentManagement() {
//   const { agents, setAgents } = useData();
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<Agent | null>(null);
//   const [form, setForm] = useState<AgentFormData>(emptyAgent);
//   const [viewDetails, setViewDetails] = useState<string | null>(null);
//   const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState<string>('all');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAgents, setTotalAgents] = useState(0);

//   useEffect(() => {
//     fetchAgents();
//   }, [currentPage, departmentFilter, statusFilter, searchTerm]);

//   const fetchAgents = async () => {
//     try {
//       setFetchLoading(true);
      
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: '10'
//       });
      
//       if (searchTerm) params.append('search', searchTerm);
//       if (departmentFilter && departmentFilter !== 'all') params.append('department', departmentFilter);
//       if (statusFilter && statusFilter !== 'all') params.append('isActive', statusFilter);
      
//       const response = await apiClient.get(`/agents?${params.toString()}`);
      
//       const transformedAgents = response.data.data.map((agent: any) => ({
//         id: agent._id,
//         _id: agent._id,
//         name: agent.name,
//         age: agent.age,
//         aadhaar: agent.aadharNo,
//         aadharNo: agent.aadharNo,
//         phone: agent.contactDetails?.phone,
//         address: agent.address,
//         contactDetails: agent.contactDetails,
//         employmentDetails: agent.employmentDetails,
//         bankDetails: agent.bankDetails,
//         isActive: agent.isActive,
//         customerCount: agent.customerCount,
//         createdAt: agent.createdAt,
//         updatedAt: agent.updatedAt
//       }));
      
//       setAgents(transformedAgents);
//       setTotalPages(response.data.pages || 1);
//       setTotalAgents(response.data.total || transformedAgents.length);
//     } catch (error: any) {
//       console.error('Error fetching agents:', error);
//       toast.error(error.response?.data?.message || 'Failed to fetch agents');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const fetchAgentDetails = async (id: string) => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(`/agents/${id}`);
      
//       const agent = response.data.data;
//       setSelectedAgent({
//         id: agent._id,
//         _id: agent._id,
//         name: agent.name,
//         age: agent.age,
//         aadhaar: agent.aadharNo,
//         aadharNo: agent.aadharNo,
//         phone: agent.contactDetails?.phone,
//         address: agent.address,
//         contactDetails: agent.contactDetails,
//         employmentDetails: agent.employmentDetails,
//         bankDetails: agent.bankDetails,
//         isActive: agent.isActive,
//         customerCount: agent.customerCount,
//         createdAt: agent.createdAt,
//         updatedAt: agent.updatedAt
//       });
//     } catch (error: any) {
//       console.error('Error fetching agent details:', error);
//       toast.error(error.response?.data?.message || 'Failed to fetch agent details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (id: string) => {
//     setViewDetails(id);
//     fetchAgentDetails(id);
//   };

//   const openNew = () => {
//     setEditing(null);
//     setForm(emptyAgent);
//     setOpen(true);
//   };

//   const openEdit = async (agent: Agent) => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(`/agents/${agent.id}`);
      
//       const a = response.data.data;
//       setEditing(a);
//       setForm({
//         name: a.name || '',
//         age: a.age?.toString() || '',
//         aadharNo: a.aadharNo || '',
//         contactDetails: {
//           phone: a.contactDetails?.phone || '',
//           alternatePhone: a.contactDetails?.alternatePhone || '',
//           email: a.contactDetails?.email || ''
//         },
//         address: {
//           street: a.address?.street || '',
//           city: a.address?.city || '',
//           state: a.address?.state || '',
//           pincode: a.address?.pincode || '',
//           country: a.address?.country || 'India'
//         },
//         employmentDetails: {
//           department: a.employmentDetails?.department || 'collection',
//           designation: a.employmentDetails?.designation || '',
//           joinDate: a.employmentDetails?.joinDate ? 
//             new Date(a.employmentDetails.joinDate).toISOString().split('T')[0] : 
//             new Date().toISOString().split('T')[0],
//           commission: a.employmentDetails?.commission || ''
//         },
//         bankDetails: {
//           accountNumber: a.bankDetails?.accountNumber || '',
//           ifscCode: a.bankDetails?.ifscCode || '',
//           bankName: a.bankDetails?.bankName || '',
//           branchName: a.bankDetails?.branchName || ''
//         }
//       });
//       setOpen(true);
//     } catch (error: any) {
//       console.error('Error fetching agent for edit:', error);
//       toast.error(error.response?.data?.message || 'Failed to load agent details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = (): boolean => {
//     if (!form.name) {
//       toast.error('Name is required');
//       return false;
//     }
    
//     if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 100) {
//       toast.error('Age must be between 18 and 100');
//       return false;
//     }
    
//     if (!form.aadharNo || !/^\d{12}$/.test(form.aadharNo)) {
//       toast.error('Aadhar number must be 12 digits');
//       return false;
//     }
    
//     if (!form.contactDetails.phone) {
//       toast.error('Phone number is required');
//       return false;
//     }
    
//     if (!form.address.street || !form.address.city || !form.address.state || !form.address.pincode) {
//       toast.error('Please fill complete address');
//       return false;
//     }
    
//     if (!/^\d{6}$/.test(form.address.pincode)) {
//       toast.error('Pincode must be 6 digits');
//       return false;
//     }
    
//     if (form.contactDetails.email && 
//         !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.contactDetails.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }
    
//     return true;
//   };

//   const saveAgent = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       const agentData = {
//         name: form.name,
//         age: parseInt(form.age),
//         aadharNo: form.aadharNo,
//         contactDetails: {
//           phone: form.contactDetails.phone,
//           alternatePhone: form.contactDetails.alternatePhone || undefined,
//           email: form.contactDetails.email || undefined
//         },
//         address: {
//           street: form.address.street,
//           city: form.address.city,
//           state: form.address.state,
//           pincode: form.address.pincode,
//           country: form.address.country
//         },
//         employmentDetails: {
//           department: form.employmentDetails.department,
//           designation: form.employmentDetails.designation || undefined,
//           joinDate: form.employmentDetails.joinDate || undefined,
//           commission: form.employmentDetails.commission || undefined
//         },
//         bankDetails: form.bankDetails.accountNumber ? {
//           accountNumber: form.bankDetails.accountNumber,
//           ifscCode: form.bankDetails.ifscCode,
//           bankName: form.bankDetails.bankName,
//           branchName: form.bankDetails.branchName
//         } : undefined
//       };

//       if (editing) {
//         await apiClient.put(`/agents/${editing._id}`, agentData);
//         toast.success('Agent updated successfully');
//       } else {
//         await apiClient.post('/agents', agentData);
//         toast.success('Agent added successfully');
//       }

//       await fetchAgents();
//       setOpen(false);
//     } catch (error: any) {
//       console.error('Error saving agent:', error);
//       toast.error(error.response?.data?.message || 'Failed to save agent');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAgent = async () => {
//     if (!deleteDialog.id) return;

//     try {
//       setLoading(true);
//       await apiClient.delete(`/agents/${deleteDialog.id}`);
//       toast.success('Agent deleted successfully');
//       await fetchAgents();
//       setDeleteDialog({ open: false, id: null });
//     } catch (error: any) {
//       console.error('Error deleting agent:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete agent');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAgentStatus = async (id: string, currentStatus: boolean) => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(`${API_BASE_URL}/agents/toggle_status/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json' 
//         }
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         toast.success(`Agent ${currentStatus ? 'deactivated' : 'activated'} successfully`);
//         await fetchAgents();
        
//         if (selectedAgent && selectedAgent.id === id) {
//           setSelectedAgent({
//             ...selectedAgent,
//             isActive: !currentStatus
//           });
//         }
//       } else {
//         toast.error(data.message || 'Failed to update agent status');
//       }
//     } catch (error: any) {
//       console.error('Error toggling agent status:', error);
//       toast.error('Failed to update agent status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setDepartmentFilter('all');
//     setStatusFilter('all');
//     setCurrentPage(1);
//   };

//   return (
//     <div className="animate-fade-in p-4 md:p-6">
//       <PageHeader 
//         title="Collection Agents" 
//         description={`${totalAgents} agents total`} 
//         actions={
//           <div className="flex gap-2">
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={fetchAgents} 
//               disabled={fetchLoading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
//               <span className="hidden sm:inline">Refresh</span>
//             </Button>
//             <Button size="sm" onClick={openNew} disabled={loading}>
//               <Plus className="h-4 w-4 mr-1" />
//               <span className="hidden sm:inline">Add Agent</span>
//               <span className="sm:hidden">Add</span>
//             </Button>
//           </div>
//         } 
//       />

//       {/* Filters - Responsive grid */}
//       <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         <div className="relative">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search agents..."
//             value={searchTerm}
//             onChange={(e) => handleSearch(e.target.value)}
//             className="pl-8"
//           />
//         </div>
        
//         <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
//           <SelectTrigger>
//             <SelectValue placeholder="All Departments" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Departments</SelectItem>
//             <SelectItem value="collection">Collection</SelectItem>
//             <SelectItem value="sales">Sales</SelectItem>
//             <SelectItem value="service">Service</SelectItem>
//             <SelectItem value="management">Management</SelectItem>
//           </SelectContent>
//         </Select>
        
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger>
//             <SelectValue placeholder="All Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="true">Active</SelectItem>
//             <SelectItem value="false">Inactive</SelectItem>
//           </SelectContent>
//         </Select>
        
//         <Button variant="ghost" onClick={clearFilters} className="text-xs">
//           <X className="h-3 w-3 mr-1" />
//           Clear Filters
//         </Button>
//       </div>

//       {/* Agents Table - Horizontal scroll on mobile */}
//       <div className="bg-card border border-border rounded-lg overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="text-xs">Name</TableHead>
//               <TableHead className="text-xs">Age</TableHead>
//               <TableHead className="text-xs">Phone</TableHead>
//               <TableHead className="text-xs hidden md:table-cell">Aadhaar</TableHead>
//               <TableHead className="text-xs">Dept</TableHead>
//               <TableHead className="text-xs">Status</TableHead>
//               <TableHead className="text-xs text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {fetchLoading && agents.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-8">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
//                 </TableCell>
//               </TableRow>
//             ) : agents.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                   No agents found. Click "Add Agent" to create one.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               agents.map((agent: any, i) => (
//                 <TableRow key={agent.id} className="hover:bg-muted/50" style={{ animationDelay: `${i * 40}ms` }}>
//                   <TableCell className="text-sm font-medium">{agent.name}</TableCell>
//                   <TableCell className="text-sm font-mono tabular-nums">{agent.age}</TableCell>
//                   <TableCell className="text-sm font-mono">{agent.phone}</TableCell>
//                   <TableCell className="text-sm font-mono tabular-nums hidden md:table-cell">{agent.aadhaar}</TableCell>
//                   <TableCell className="text-sm capitalize">{agent.employmentDetails?.department || '-'}</TableCell>
//                   <TableCell className="text-sm">
//                     <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
//                       agent.isActive !== false 
//                         ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
//                         : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
//                     }`}>
//                       {agent.isActive !== false ? 'Active' : 'Inactive'}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-1">
//                       <Button 
//                         variant="ghost" 
//                         size="sm" 
//                         className="text-xs"
//                         onClick={() => handleViewDetails(agent.id)}
//                       >
//                         <Eye className="h-3 w-3 sm:mr-1" />
//                         <span className="hidden sm:inline">View</span>
//                       </Button>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="h-7 w-7"
//                         onClick={() => openEdit(agent)}
//                         disabled={loading}
//                       >
//                         <Pencil className="h-3 w-3" />
//                       </Button>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="h-7 w-7 text-destructive"
//                         onClick={() => setDeleteDialog({ open: true, id: agent.id })}
//                         disabled={loading}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
//           <p className="text-sm text-muted-foreground order-2 sm:order-1">
//             Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalAgents)} of {totalAgents} agents
//           </p>
//           <div className="flex gap-2 order-1 sm:order-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <span className="px-3 py-1 text-sm border rounded-md flex items-center">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Agent Sheet - Single scrollable form (no tabs) */}
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
//           <SheetHeader className="sticky top-0 bg-background pb-4 border-b mb-4">
//             <SheetTitle>{editing ? 'Edit Agent' : 'Add New Agent'}</SheetTitle>
//           </SheetHeader>
          
//           <div className="space-y-6 pb-6">
//             {/* Basic Information Section */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
//                 <User className="h-4 w-4" />
//                 Basic Information
//               </h3>
              
//               <div>
//                 <Label className="text-xs flex items-center gap-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input 
//                   value={form.name} 
//                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
//                   placeholder="Enter full name"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Age <span className="text-red-500">*</span></Label>
//                   <Input 
//                     type="number"
//                     value={form.age} 
//                     onChange={e => setForm(f => ({ ...f, age: e.target.value }))} 
//                     placeholder="25"
//                     className="font-mono"
//                     min="18"
//                     max="100"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Aadhar Number <span className="text-red-500">*</span></Label>
//                   <Input 
//                     value={form.aadharNo} 
//                     onChange={e => setForm(f => ({ ...f, aadharNo: e.target.value }))} 
//                     placeholder="12 digits"
//                     className="font-mono"
//                     maxLength={12}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Contact Details Section */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
//                 <Phone className="h-4 w-4" />
//                 Contact Details
//               </h3>
              
//               <div>
//                 <Label className="text-xs">Phone Number <span className="text-red-500">*</span></Label>
//                 <Input 
//                   value={form.contactDetails.phone} 
//                   onChange={e => setForm(f => ({ 
//                     ...f, 
//                     contactDetails: { ...f.contactDetails, phone: e.target.value }
//                   }))} 
//                   placeholder="+91 9876543210"
//                   className="font-mono"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Alternate Phone</Label>
//                   <Input 
//                     value={form.contactDetails.alternatePhone} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       contactDetails: { ...f.contactDetails, alternatePhone: e.target.value }
//                     }))} 
//                     placeholder="+91 9876543211"
//                     className="font-mono"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Email</Label>
//                   <Input 
//                     type="email"
//                     value={form.contactDetails.email} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       contactDetails: { ...f.contactDetails, email: e.target.value }
//                     }))} 
//                     placeholder="agent@example.com"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Section */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
//                 <MapPin className="h-4 w-4" />
//                 Address Details
//               </h3>

//               <div>
//                 <Label className="text-xs">Street Address <span className="text-red-500">*</span></Label>
//                 <Textarea 
//                   value={form.address.street} 
//                   onChange={e => setForm(f => ({ 
//                     ...f, 
//                     address: { ...f.address, street: e.target.value }
//                   }))} 
//                   placeholder="Enter street address"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">City <span className="text-red-500">*</span></Label>
//                   <Input 
//                     value={form.address.city} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       address: { ...f.address, city: e.target.value }
//                     }))} 
//                     placeholder="Enter city"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">State <span className="text-red-500">*</span></Label>
//                   <Input 
//                     value={form.address.state} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       address: { ...f.address, state: e.target.value }
//                     }))} 
//                     placeholder="Enter state"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Pincode <span className="text-red-500">*</span></Label>
//                   <Input 
//                     value={form.address.pincode} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       address: { ...f.address, pincode: e.target.value }
//                     }))} 
//                     placeholder="6 digits"
//                     className="font-mono"
//                     maxLength={6}
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Country</Label>
//                   <Input 
//                     value={form.address.country} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       address: { ...f.address, country: e.target.value }
//                     }))} 
//                     placeholder="India"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Employment Details Section - Employee ID removed */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
//                 <Briefcase className="h-4 w-4" />
//                 Employment Details
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Department</Label>
//                   <Select 
//                     value={form.employmentDetails.department} 
//                     onValueChange={v => setForm(f => ({ 
//                       ...f, 
//                       employmentDetails: { ...f.employmentDetails, department: v }
//                     }))}
//                     disabled={loading}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="collection">Collection</SelectItem>
//                       <SelectItem value="sales">Sales</SelectItem>
//                       <SelectItem value="service">Service</SelectItem>
//                       <SelectItem value="management">Management</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="text-xs">Designation</Label>
//                   <Input 
//                     value={form.employmentDetails.designation} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       employmentDetails: { ...f.employmentDetails, designation: e.target.value }
//                     }))} 
//                     placeholder="Senior Agent"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Join Date</Label>
//                   <Input 
//                     type="date"
//                     value={form.employmentDetails.joinDate} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       employmentDetails: { ...f.employmentDetails, joinDate: e.target.value }
//                     }))} 
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Salary</Label>
//                   <Input 
//                     value={form.employmentDetails.commission} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       employmentDetails: { ...f.employmentDetails, commission: e.target.value }
//                     }))} 
//                     placeholder="15000"
//                     className="font-mono"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Bank Details Section */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
//                 <Landmark className="h-4 w-4" />
//                 Bank Details (Optional)
//               </h3>

//               <div>
//                 <Label className="text-xs">Account Number</Label>
//                 <Input 
//                   value={form.bankDetails.accountNumber} 
//                   onChange={e => setForm(f => ({ 
//                     ...f, 
//                     bankDetails: { ...f.bankDetails, accountNumber: e.target.value }
//                   }))} 
//                   placeholder="1234567890"
//                   className="font-mono"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">IFSC Code</Label>
//                   <Input 
//                     value={form.bankDetails.ifscCode} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       bankDetails: { ...f.bankDetails, ifscCode: e.target.value.toUpperCase() }
//                     }))} 
//                     placeholder="SBIN0001234"
//                     className="font-mono uppercase"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Bank Name</Label>
//                   <Input 
//                     value={form.bankDetails.bankName} 
//                     onChange={e => setForm(f => ({ 
//                       ...f, 
//                       bankDetails: { ...f.bankDetails, bankName: e.target.value }
//                     }))} 
//                     placeholder="State Bank of India"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-xs">Branch Name</Label>
//                 <Input 
//                   value={form.bankDetails.branchName} 
//                   onChange={e => setForm(f => ({ 
//                     ...f, 
//                     bankDetails: { ...f.bankDetails, branchName: e.target.value }
//                   }))} 
//                   placeholder="Main Branch"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t mt-4 flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
//               Cancel
//             </Button>
//             <Button onClick={saveAgent} disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   {editing ? 'Updating...' : 'Adding...'}
//                 </>
//               ) : (
//                 <>{editing ? 'Update Agent' : 'Add Agent'}</>
//               )}
//             </Button>
//           </div>
//         </SheetContent>
//       </Sheet>

//       {/* View Agent Details Dialog */}
//       <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
//         <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Agent Details</DialogTitle>
//           </DialogHeader>
          
//           {loading && !selectedAgent ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : selectedAgent ? (
//             <div className="space-y-6">
//               {/* Status and Basic Info */}
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
//                 <div>
//                   <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
//                   <p className="text-sm text-muted-foreground">
//                     Agent ID: {selectedAgent._id?.slice(-8) || 'Not assigned'}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`px-3 py-1 rounded-full text-sm ${
//                     selectedAgent.isActive !== false 
//                       ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
//                       : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
//                   }`}>
//                     {selectedAgent.isActive !== false ? 'Active' : 'Inactive'}
//                   </span>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => toggleAgentStatus(selectedAgent.id, selectedAgent.isActive !== false)}
//                     disabled={loading}
//                   >
//                     Toggle Status
//                   </Button>
//                 </div>
//               </div>

//               {/* Basic Information */}
//               <Card>
//                 <CardContent className="p-4">
//                   <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
//                     <User className="h-4 w-4" />
//                     Basic Information
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Age</p>
//                       <p className="font-mono">{selectedAgent.age} years</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Aadhar Number</p>
//                       <p className="font-mono">{selectedAgent.aadhaar}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Customers Assigned</p>
//                       <p className="font-mono">{selectedAgent.customerCount || 0}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Contact Information */}
//               <Card>
//                 <CardContent className="p-4">
//                   <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
//                     <Phone className="h-4 w-4" />
//                     Contact Information
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Phone</p>
//                       <p className="font-mono">{selectedAgent.contactDetails?.phone}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Alternate Phone</p>
//                       <p className="font-mono">{selectedAgent.contactDetails?.alternatePhone || '-'}</p>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <p className="text-xs text-muted-foreground">Email</p>
//                       <p>{selectedAgent.contactDetails?.email || '-'}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Address */}
//               {selectedAgent.address && (
//                 <Card>
//                   <CardContent className="p-4">
//                     <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       Address
//                     </h3>
//                     <p className="text-sm">
//                       {selectedAgent.address.street},<br />
//                       {selectedAgent.address.city}, {selectedAgent.address.state}<br />
//                       {selectedAgent.address.pincode}, {selectedAgent.address.country}
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Employment Details */}
//               {selectedAgent.employmentDetails && (
//                 <Card>
//                   <CardContent className="p-4">
//                     <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
//                       <Briefcase className="h-4 w-4" />
//                       Employment Details
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-xs text-muted-foreground">Department</p>
//                         <p className="capitalize">{selectedAgent.employmentDetails.department || '-'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Designation</p>
//                         <p>{selectedAgent.employmentDetails.designation || '-'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Join Date</p>
//                         <p>{selectedAgent.employmentDetails.joinDate ? 
//                           new Date(selectedAgent.employmentDetails.joinDate).toLocaleDateString() : '-'}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Commission</p>
//                         <p className="font-mono">{selectedAgent.employmentDetails.commission || '0'}%</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Bank Details */}
//               {selectedAgent.bankDetails && selectedAgent.bankDetails.accountNumber && (
//                 <Card>
//                   <CardContent className="p-4">
//                     <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
//                       <Landmark className="h-4 w-4" />
//                       Bank Details
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-xs text-muted-foreground">Account Number</p>
//                         <p className="font-mono">{selectedAgent.bankDetails.accountNumber}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">IFSC Code</p>
//                         <p className="font-mono uppercase">{selectedAgent.bankDetails.ifscCode}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Bank Name</p>
//                         <p>{selectedAgent.bankDetails.bankName}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground">Branch</p>
//                         <p>{selectedAgent.bankDetails.branchName}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Metadata */}
//               <div className="text-xs text-muted-foreground border-t pt-4">
//                 <p>Created: {selectedAgent.createdAt ? new Date(selectedAgent.createdAt).toLocaleString() : '-'}</p>
//                 <p>Last Updated: {selectedAgent.updatedAt ? new Date(selectedAgent.updatedAt).toLocaleString() : '-'}</p>
//               </div>
//             </div>
//           ) : null}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-destructive" />
//               Confirm Delete
//             </DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this agent? This action cannot be undone.
//               The agent will be deactivated and removed from active list.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setDeleteDialog({ open: false, id: null })}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={deleteAgent}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 'Delete Agent'
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { useData } from '@/lib/data-context';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, RefreshCw, Loader2, AlertCircle, Search, X, ChevronLeft, ChevronRight, User, Phone, MapPin, CreditCard, Briefcase, Landmark, Mail, CheckCircle } from 'lucide-react';
import { CollectionAgent } from '@/lib/types';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

interface Agent extends Omit<CollectionAgent, 'address'> {
  _id?: string;
  aadharNo?: string;
  age: number;
  contactDetails?: {
    phone: string;
    alternatePhone?: string;
    email?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  employmentDetails?: {
    department?: string;
    designation?: string;
    joinDate?: string;
    commission?: string;
  };
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
  };
  isActive?: boolean;
  customerCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AgentFormData {
  name: string;
  age: string;
  aadharNo: string;
  contactDetails: {
    phone: string;
    alternatePhone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  employmentDetails: {
    department: string;
    designation: string;
    joinDate: string;
    commission: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  };
}

const emptyAgent: AgentFormData = {
  name: '',
  age: '',
  aadharNo: '',
  contactDetails: {
    phone: '',
    alternatePhone: '',
    email: ''
  },
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  },
  employmentDetails: {
    department: 'collection',
    designation: '',
    joinDate: new Date().toISOString().split('T')[0],
    commission: ''
  },
  bankDetails: {
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: ''
  }
};

export default function AgentManagement() {
  const { agents, setAgents } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [form, setForm] = useState<AgentFormData>(emptyAgent);
  const [viewDetails, setViewDetails] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [emailSent, setEmailSent] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, [currentPage, departmentFilter, statusFilter, searchTerm]);

  const fetchAgents = async () => {
    try {
      setFetchLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (departmentFilter && departmentFilter !== 'all') params.append('department', departmentFilter);
      if (statusFilter && statusFilter !== 'all') params.append('isActive', statusFilter);
      
      const response = await apiClient.get(`/agents?${params.toString()}`);
      
      const transformedAgents = response.data.data.map((agent: any) => ({
        id: agent._id,
        _id: agent._id,
        name: agent.name,
        age: agent.age,
        aadhaar: agent.aadharNo,
        aadharNo: agent.aadharNo,
        phone: agent.contactDetails?.phone,
        address: agent.address,
        contactDetails: agent.contactDetails,
        employmentDetails: agent.employmentDetails,
        bankDetails: agent.bankDetails,
        isActive: agent.isActive,
        customerCount: agent.customerCount,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt
      }));
      
      setAgents(transformedAgents);
      setTotalPages(response.data.pages || 1);
      setTotalAgents(response.data.total || transformedAgents.length);
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch agents');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchAgentDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/agents/${id}`);
      
      const agent = response.data.data;
      setSelectedAgent({
        id: agent._id,
        _id: agent._id,
        name: agent.name,
        age: agent.age,
        aadhaar: agent.aadharNo,
        aadharNo: agent.aadharNo,
        phone: agent.contactDetails?.phone,
        address: agent.address,
        contactDetails: agent.contactDetails,
        employmentDetails: agent.employmentDetails,
        bankDetails: agent.bankDetails,
        isActive: agent.isActive,
        customerCount: agent.customerCount,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt
      });
    } catch (error: any) {
      console.error('Error fetching agent details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch agent details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    setViewDetails(id);
    fetchAgentDetails(id);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyAgent);
    setEmailSent(null);
    setOpen(true);
  };

  const openEdit = async (agent: Agent) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/agents/${agent.id}`);
      
      const a = response.data.data;
      setEditing(a);
      setForm({
        name: a.name || '',
        age: a.age?.toString() || '',
        aadharNo: a.aadharNo || '',
        contactDetails: {
          phone: a.contactDetails?.phone || '',
          alternatePhone: a.contactDetails?.alternatePhone || '',
          email: a.contactDetails?.email || ''
        },
        address: {
          street: a.address?.street || '',
          city: a.address?.city || '',
          state: a.address?.state || '',
          pincode: a.address?.pincode || '',
          country: a.address?.country || 'India'
        },
        employmentDetails: {
          department: a.employmentDetails?.department || 'collection',
          designation: a.employmentDetails?.designation || '',
          joinDate: a.employmentDetails?.joinDate ? 
            new Date(a.employmentDetails.joinDate).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          commission: a.employmentDetails?.commission || ''
        },
        bankDetails: {
          accountNumber: a.bankDetails?.accountNumber || '',
          ifscCode: a.bankDetails?.ifscCode || '',
          bankName: a.bankDetails?.bankName || '',
          branchName: a.bankDetails?.branchName || ''
        }
      });
      setEmailSent(null);
      setOpen(true);
    } catch (error: any) {
      console.error('Error fetching agent for edit:', error);
      toast.error(error.response?.data?.message || 'Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name) {
      toast.error('Name is required');
      return false;
    }
    
    if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 100) {
      toast.error('Age must be between 18 and 100');
      return false;
    }
    
    if (!form.aadharNo || !/^\d{12}$/.test(form.aadharNo)) {
      toast.error('Aadhar number must be 12 digits');
      return false;
    }
    
    if (!form.contactDetails.phone) {
      toast.error('Phone number is required');
      return false;
    }
    
    if (!form.contactDetails.email) {
      toast.error('Email is required for login credentials');
      return false;
    }
    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.contactDetails.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!form.address.street || !form.address.city || !form.address.state || !form.address.pincode) {
      toast.error('Please fill complete address');
      return false;
    }
    
    if (!/^\d{6}$/.test(form.address.pincode)) {
      toast.error('Pincode must be 6 digits');
      return false;
    }
    
    return true;
  };

  const saveAgent = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const agentData = {
        name: form.name,
        age: parseInt(form.age),
        aadharNo: form.aadharNo,
        contactDetails: {
          phone: form.contactDetails.phone,
          alternatePhone: form.contactDetails.alternatePhone || undefined,
          email: form.contactDetails.email
        },
        address: {
          street: form.address.street,
          city: form.address.city,
          state: form.address.state,
          pincode: form.address.pincode,
          country: form.address.country
        },
        employmentDetails: {
          department: form.employmentDetails.department,
          designation: form.employmentDetails.designation || undefined,
          joinDate: form.employmentDetails.joinDate || undefined,
          commission: form.employmentDetails.commission || undefined
        },
        bankDetails: form.bankDetails.accountNumber ? {
          accountNumber: form.bankDetails.accountNumber,
          ifscCode: form.bankDetails.ifscCode,
          bankName: form.bankDetails.bankName,
          branchName: form.bankDetails.branchName
        } : undefined
      };

      let response;
      if (editing) {
        response = await apiClient.put(`/agents/${editing._id}`, agentData);
        toast.success('Agent updated successfully');
      } else {
        response = await apiClient.post('/agents', agentData);
        
        // Check if email was sent from backend
        const emailSentFlag = response.data.emailSent || response.data.data?.emailSent;
        const agentEmail = response.data.email || response.data.data?.email || form.contactDetails.email;
        
        if (emailSentFlag) {
          toast.success(
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Agent Created Successfully!</p>
                <p className="text-sm mt-0.5">Login credentials have been sent to <strong>{agentEmail}</strong></p>
                <p className="text-xs text-muted-foreground mt-1">The agent will receive an email with their login details.</p>
              </div>
            </div>,
            { duration: 6000 }
          );
          setEmailSent(agentEmail);
        } else {
          toast.success('Agent added successfully');
        }
      }

      await fetchAgents();
      
      // Don't close the form immediately if email was sent - show success state
      if (!editing && response?.data?.emailSent) {
        // Keep form open to show success, but clear after 3 seconds
        setTimeout(() => {
          setOpen(false);
          setEmailSent(null);
        }, 3000);
      } else {
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Error saving agent:', error);
      toast.error(error.response?.data?.message || 'Failed to save agent');
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async () => {
    if (!deleteDialog.id) return;

    try {
      setLoading(true);
      await apiClient.delete(`/agents/${deleteDialog.id}`);
      toast.success('Agent deleted successfully');
      await fetchAgents();
      setDeleteDialog({ open: false, id: null });
    } catch (error: any) {
      console.error('Error deleting agent:', error);
      toast.error(error.response?.data?.message || 'Failed to delete agent');
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/agents/toggle_status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        }
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Agent ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        await fetchAgents();
        
        if (selectedAgent && selectedAgent.id === id) {
          setSelectedAgent({
            ...selectedAgent,
            isActive: !currentStatus
          });
        }
      } else {
        toast.error(data.message || 'Failed to update agent status');
      }
    } catch (error: any) {
      console.error('Error toggling agent status:', error);
      toast.error('Failed to update agent status');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in p-4 md:p-6">
      <PageHeader 
        title="Collection Agents" 
        description={`${totalAgents} agents total`} 
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAgents} 
              disabled={fetchLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" onClick={openNew} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add Agent</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        } 
      />

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="collection">Collection</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="management">Management</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="ghost" onClick={clearFilters} className="text-xs">
          <X className="h-3 w-3 mr-1" />
          Clear Filters
        </Button>
      </div>

      {/* Agents Table */}
      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Age</TableHead>
              <TableHead className="text-xs">Phone</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Email</TableHead>
              <TableHead className="text-xs">Dept</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading && agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No agents found. Click "Add Agent" to create one.
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent: any, i) => (
                <TableRow key={agent.id} className="hover:bg-muted/50" style={{ animationDelay: `${i * 40}ms` }}>
                  <TableCell className="text-sm font-medium">{agent.name}</TableCell>
                  <TableCell className="text-sm font-mono tabular-nums">{agent.age}</TableCell>
                  <TableCell className="text-sm font-mono">{agent.phone}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell">{agent.contactDetails?.email || '-'}</TableCell>
                  <TableCell className="text-sm capitalize">{agent.employmentDetails?.department || '-'}</TableCell>
                  <TableCell className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      agent.isActive !== false 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {agent.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleViewDetails(agent.id)}
                      >
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => openEdit(agent)}
                        disabled={loading}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive"
                        onClick={() => setDeleteDialog({ open: true, id: agent.id })}
                        disabled={loading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalAgents)} of {totalAgents} agents
          </p>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm border rounded-md flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Agent Sheet */}
      <Sheet open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEmailSent(null);
          setOpen(false);
        }
      }}>
        <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
          <SheetHeader className="sticky top-0 bg-background pb-4 border-b mb-4">
            <SheetTitle>{editing ? 'Edit Agent' : 'Add New Agent'}</SheetTitle>
          </SheetHeader>
          
          {/* Email Success Message */}
          {emailSent && !editing && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">Credentials Sent!</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Login credentials have been sent to <strong>{emailSent}</strong>
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                    The agent can now login using their email and the password sent via email.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6 pb-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                <User className="h-4 w-4" />
                Basic Information
              </h3>
              
              <div>
                <Label className="text-xs flex items-center gap-1">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Age <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number"
                    value={form.age} 
                    onChange={e => setForm(f => ({ ...f, age: e.target.value }))} 
                    placeholder="25"
                    className="font-mono"
                    min="18"
                    max="100"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-xs">Aadhar Number <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.aadharNo} 
                    onChange={e => setForm(f => ({ ...f, aadharNo: e.target.value }))} 
                    placeholder="12 digits"
                    className="font-mono"
                    maxLength={12}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                <Phone className="h-4 w-4" />
                Contact Details
              </h3>
              
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="email"
                  value={form.contactDetails.email} 
                  onChange={e => setForm(f => ({ 
                    ...f, 
                    contactDetails: { ...f.contactDetails, email: e.target.value }
                  }))} 
                  placeholder="agent@example.com"
                  disabled={loading}
                />
                {!editing && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Login credentials will be sent to this email address
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.contactDetails.phone} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      contactDetails: { ...f.contactDetails, phone: e.target.value }
                    }))} 
                    placeholder="+91 9876543210"
                    className="font-mono"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-xs">Alternate Phone</Label>
                  <Input 
                    value={form.contactDetails.alternatePhone} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      contactDetails: { ...f.contactDetails, alternatePhone: e.target.value }
                    }))} 
                    placeholder="+91 9876543211"
                    className="font-mono"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                <MapPin className="h-4 w-4" />
                Address Details
              </h3>

              <div>
                <Label className="text-xs">Street Address <span className="text-red-500">*</span></Label>
                <Textarea 
                  value={form.address.street} 
                  onChange={e => setForm(f => ({ 
                    ...f, 
                    address: { ...f.address, street: e.target.value }
                  }))} 
                  placeholder="Enter street address"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">City <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.address.city} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      address: { ...f.address, city: e.target.value }
                    }))} 
                    placeholder="Enter city"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-xs">State <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.address.state} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      address: { ...f.address, state: e.target.value }
                    }))} 
                    placeholder="Enter state"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Pincode <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.address.pincode} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      address: { ...f.address, pincode: e.target.value }
                    }))} 
                    placeholder="6 digits"
                    className="font-mono"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-xs">Country</Label>
                  <Input 
                    value={form.address.country} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      address: { ...f.address, country: e.target.value }
                    }))} 
                    placeholder="India"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Employment Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                <Briefcase className="h-4 w-4" />
                Employment Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Department</Label>
                  <Select 
                    value={form.employmentDetails.department} 
                    onValueChange={v => setForm(f => ({ 
                      ...f, 
                      employmentDetails: { ...f.employmentDetails, department: v }
                    }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Designation</Label>
                  <Input 
                    value={form.employmentDetails.designation} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      employmentDetails: { ...f.employmentDetails, designation: e.target.value }
                    }))} 
                    placeholder="Senior Agent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Join Date</Label>
                  <Input 
                    type="date"
                    value={form.employmentDetails.joinDate} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      employmentDetails: { ...f.employmentDetails, joinDate: e.target.value }
                    }))} 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-xs">Commission (%)</Label>
                  <Input 
                    value={form.employmentDetails.commission} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      employmentDetails: { ...f.employmentDetails, commission: e.target.value }
                    }))} 
                    placeholder="5"
                    className="font-mono"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                <Landmark className="h-4 w-4" />
                Bank Details (Optional)
              </h3>

              <div>
                <Label className="text-xs">Account Number</Label>
                <Input 
                  value={form.bankDetails.accountNumber} 
                  onChange={e => setForm(f => ({ 
                    ...f, 
                    bankDetails: { ...f.bankDetails, accountNumber: e.target.value }
                  }))} 
                  placeholder="1234567890"
                  className="font-mono"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">IFSC Code</Label>
                  <Input 
                    value={form.bankDetails.ifscCode} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      bankDetails: { ...f.bankDetails, ifscCode: e.target.value.toUpperCase() }
                    }))} 
                    placeholder="SBIN0001234"
                    className="font-mono uppercase"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-xs">Bank Name</Label>
                  <Input 
                    value={form.bankDetails.bankName} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      bankDetails: { ...f.bankDetails, bankName: e.target.value }
                    }))} 
                    placeholder="State Bank of India"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Branch Name</Label>
                <Input 
                  value={form.bankDetails.branchName} 
                  onChange={e => setForm(f => ({ 
                    ...f, 
                    bankDetails: { ...f.bankDetails, branchName: e.target.value }
                  }))} 
                  placeholder="Main Branch"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={saveAgent} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{editing ? 'Update Agent' : 'Create Agent & Send Credentials'}</>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* View Agent Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          
          {loading && !selectedAgent ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedAgent ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Agent ID: {selectedAgent._id?.slice(-8) || 'Not assigned'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedAgent.isActive !== false 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {selectedAgent.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAgentStatus(selectedAgent.id, selectedAgent.isActive !== false)}
                    disabled={loading}
                  >
                    Toggle Status
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="font-mono">{selectedAgent.age} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Aadhar Number</p>
                      <p className="font-mono">{selectedAgent.aadhaar}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Customers Assigned</p>
                      <p className="font-mono">{selectedAgent.customerCount || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-mono">{selectedAgent.contactDetails?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Alternate Phone</p>
                      <p className="font-mono">{selectedAgent.contactDetails?.alternatePhone || '-'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p>{selectedAgent.contactDetails?.email || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedAgent.address && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Address
                    </h3>
                    <p className="text-sm">
                      {selectedAgent.address.street},<br />
                      {selectedAgent.address.city}, {selectedAgent.address.state}<br />
                      {selectedAgent.address.pincode}, {selectedAgent.address.country}
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedAgent.employmentDetails && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Employment Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="capitalize">{selectedAgent.employmentDetails.department || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Designation</p>
                        <p>{selectedAgent.employmentDetails.designation || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Join Date</p>
                        <p>{selectedAgent.employmentDetails.joinDate ? 
                          new Date(selectedAgent.employmentDetails.joinDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Commission</p>
                        <p className="font-mono">{selectedAgent.employmentDetails.commission || '0'}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedAgent.bankDetails && selectedAgent.bankDetails.accountNumber && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                      <Landmark className="h-4 w-4" />
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Account Number</p>
                        <p className="font-mono">{selectedAgent.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">IFSC Code</p>
                        <p className="font-mono uppercase">{selectedAgent.bankDetails.ifscCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bank Name</p>
                        <p>{selectedAgent.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Branch</p>
                        <p>{selectedAgent.bankDetails.branchName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-muted-foreground border-t pt-4">
                <p>Created: {selectedAgent.createdAt ? new Date(selectedAgent.createdAt).toLocaleString() : '-'}</p>
                <p>Last Updated: {selectedAgent.updatedAt ? new Date(selectedAgent.updatedAt).toLocaleString() : '-'}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this agent? This action cannot be undone.
              The agent will be deactivated and removed from active list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteAgent}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Agent'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}