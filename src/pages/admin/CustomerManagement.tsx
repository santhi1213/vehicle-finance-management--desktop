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
// import { Plus, Pencil, Trash2, Eye, RefreshCw, AlertCircle, Loader2, User, Phone, Mail, MapPin, CreditCard, Briefcase, Calendar, DollarSign } from 'lucide-react';
// import { Customer } from '@/lib/types';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { formatINR } from '@/lib/mock-data';

// const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// // API Response Interfaces
// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// interface ApiCustomer {
//   _id: string;
//   name: string;
//   aadharNo: string;
//   panNo: string;
//   address?: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
//   phone: string;
//   alternatePhone?: string;
//   email?: string;
//   assignedAgent: string | ApiAgent;
//   dateOfBirth?: string;
//   occupation?: string;
//   annualIncome?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ApiAgent {
//   _id: string;
//   name: string;
//   phone: string;
//   contactDetails?: {
//     phone: string;
//   };
// }

// interface CustomerFormData {
//   name: string;
//   aadharNo: string;
//   panNo: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
//   phone: string;
//   alternatePhone: string;
//   email: string;
//   assignedAgent: string;
//   dateOfBirth: string;
//   occupation: string;
//   annualIncome: string;
// }

// const emptyCustomer: CustomerFormData = {
//   name: '',
//   aadharNo: '',
//   panNo: '',
//   address: {
//     street: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country: 'India'
//   },
//   phone: '',
//   alternatePhone: '',
//   email: '',
//   assignedAgent: '',
//   dateOfBirth: '',
//   occupation: '',
//   annualIncome: ''
// };

// // Extended Customer interface for UI
// interface CustomerWithDetails extends Omit<Customer, 'address'> {
//   _id?: string;
//   aadharNo?: string;
//   panNo?: string;
//   address?: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
//   alternatePhone?: string;
//   email?: string;
//   dateOfBirth?: string;
//   occupation?: string;
//   annualIncome?: string;
//   assignedAgent?: ApiAgent | string;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export default function CustomerManagement() {
//   const { customers, setCustomers, agents, sales } = useData();
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<CustomerWithDetails | null>(null);
//   const [form, setForm] = useState<CustomerFormData>(emptyCustomer);
//   const [viewDetails, setViewDetails] = useState<string | null>(null);
//   const [viewLoans, setViewLoans] = useState<string | null>(null);
//   const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithDetails | null>(null);
//   const [customerLoans, setCustomerLoans] = useState<any[]>([]);
//   const [agentsMap, setAgentsMap] = useState<Record<string, ApiAgent>>({});

//   // Fetch customers on component mount
//   useEffect(() => {
//     fetchCustomers();
//     fetchAgents();
//   }, []);

//   // Fetch agents for mapping
//   const fetchAgents = async () => {
//     try {
//       const token = localStorage.getItem('auth_token');
//       const response = await axios.get<ApiResponse<ApiAgent[]>>(`${API_BASE_URL}/agents?limit=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       console.log('Agents API Response:', response.data);
      
//       // Handle different response structures
//       const agentsData = response.data.data || response.data;
//       const agentList = Array.isArray(agentsData) ? agentsData : [];
      
//       // Create a map of agents by ID for easy lookup
//       const agentMap: Record<string, ApiAgent> = {};
//       agentList.forEach((agent: any) => {
//         agentMap[agent._id] = {
//           _id: agent._id,
//           name: agent.name,
//           phone: agent.contactDetails?.phone || agent.phone || ''
//         };
//       });
//       setAgentsMap(agentMap);
//     } catch (error) {
//       console.error('Error fetching agents:', error);
//     }
//   };

//   // Fetch customers from API
//   const fetchCustomers = async () => {
//     try {
//       setFetchLoading(true);
//       const token = localStorage.getItem('auth_token');
//       console.log(token)
//       const response = await axios.get(`${API_BASE_URL}/customers`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       console.log('Full API Response:', response);
//       console.log('Response Data:', response.data);
      
//       // Handle different response structures
//       let customersData = [];
      
//       if (response.data?.data?.data) {
//         // Case: { data: { data: [...] } }
//         customersData = response.data.data.data;
//       } else if (response.data?.data) {
//         // Case: { data: [...] }
//         customersData = response.data.data;
//       } else if (Array.isArray(response.data)) {
//         // Case: direct array
//         customersData = response.data;
//       } else if (response.data?.customers) {
//         // Case: { customers: [...] }
//         customersData = response.data.customers;
//       }
      
//       console.log('Extracted Customers Data:', customersData);
      
//       // Transform API data to match your Customer type
//       const transformedCustomers = customersData.map((cust: any) => ({
//         id: cust._id,
//         _id: cust._id,
//         name: cust.name || '',
//         phone: cust.phone || '',
//         address: cust.address ? 
//           `${cust.address.street || ''}, ${cust.address.city || ''}, ${cust.address.state || ''} - ${cust.address.pincode || ''}` : 
//           'N/A',
//         aadhaar: cust.aadharNo || 'N/A',
//         panNo: cust.panNo || '',
//         assignedAgentId: typeof cust.assignedAgent === 'object' ? cust.assignedAgent?._id : cust.assignedAgent,
//         assignedAgent: cust.assignedAgent,
//         isActive: cust.isActive !== false,
//         email: cust.email || '',
//         alternatePhone: cust.alternatePhone || '',
//         dateOfBirth: cust.dateOfBirth,
//         occupation: cust.occupation,
//         annualIncome: cust.annualIncome,
//         address_details: cust.address,
//         createdAt: cust.createdAt,
//         updatedAt: cust.updatedAt
//       }));
      
//       console.log('Transformed Customers:', transformedCustomers);
//       setCustomers(transformedCustomers);
//       toast.success(`Loaded ${transformedCustomers.length} customers`);
//     } catch (error: any) {
//       console.error('Error fetching customers:', error);
      
//       // Show more detailed error message
//       if (error.response) {
//         console.error('Error response:', error.response.data);
//         toast.error(`Failed to fetch customers: ${error.response.data?.message || error.response.statusText}`);
//       } else if (error.request) {
//         toast.error('No response from server. Please check if the server is running.');
//       } else {
//         toast.error('Error setting up the request. Please try again.');
//       }
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // Fetch customer details by ID
//   const fetchCustomerDetails = async (id: string) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('auth_token');
//       const response = await axios.get(`${API_BASE_URL}/customers/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       console.log('Customer Details Response:', response.data);
      
//       // Handle different response structures
//       let customerData = response.data?.data || response.data;
      
//       setSelectedCustomer({
//         id: customerData._id,
//         _id: customerData._id,
//         name: customerData.name,
//         phone: customerData.phone,
//         address: customerData.address,
//         aadhaar: customerData.aadharNo,
//         aadharNo: customerData.aadharNo,
//         panNo: customerData.panNo,
//         email: customerData.email,
//         alternatePhone: customerData.alternatePhone,
//         dateOfBirth: customerData.dateOfBirth,
//         occupation: customerData.occupation,
//         annualIncome: customerData.annualIncome,
//         assignedAgentId: typeof customerData.assignedAgent === 'object' ? customerData.assignedAgent?._id : customerData.assignedAgent,
//         assignedAgent: customerData.assignedAgent,
//         isActive: customerData.isActive,
//         createdAt: customerData.createdAt,
//         updatedAt: customerData.updatedAt
//       });
//     } catch (error: any) {
//       console.error('Error fetching customer details:', error);
//       toast.error(error.response?.data?.message || 'Failed to fetch customer details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle view details
//   const handleViewDetails = (id: string) => {
//     setViewDetails(id);
//     fetchCustomerDetails(id);
//   };

//   // Handle view loans
//   const handleViewLoans = (id: string) => {
//     setViewLoans(id);
//     // Filter sales for this customer
//     const loans = sales.filter(s => s.customerId === id);
//     setCustomerLoans(loans);
//   };

//   // Open new customer form
//   const openNew = () => {
//     setEditing(null);
//     setForm(emptyCustomer);
//     setOpen(true);
//   };

//   // Open edit customer form
//   const openEdit = async (c: CustomerWithDetails) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('auth_token');
//       const response = await axios.get(`${API_BASE_URL}/customers/${c.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       console.log('Edit Customer Response:', response.data);
      
//       // Handle different response structures
//       const cust = response.data?.data || response.data;
      
//       setEditing(cust);
//       setForm({
//         name: cust.name || '',
//         aadharNo: cust.aadharNo || '',
//         panNo: cust.panNo || '',
//         address: cust.address || {
//           street: '',
//           city: '',
//           state: '',
//           pincode: '',
//           country: 'India'
//         },
//         phone: cust.phone || '',
//         alternatePhone: cust.alternatePhone || '',
//         email: cust.email || '',
//         assignedAgent: typeof cust.assignedAgent === 'object' ? cust.assignedAgent?._id : cust.assignedAgent || '',
//         dateOfBirth: cust.dateOfBirth ? new Date(cust.dateOfBirth).toISOString().split('T')[0] : '',
//         occupation: cust.occupation || '',
//         annualIncome: cust.annualIncome || ''
//       });
//       setOpen(true);
//     } catch (error: any) {
//       console.error('Error fetching customer for edit:', error);
//       toast.error(error.response?.data?.message || 'Failed to load customer details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Validate form
//   const validateForm = (): boolean => {
//     if (!form.name?.trim()) {
//       toast.error('Name is required');
//       return false;
//     }

//     if (!form.phone?.trim()) {
//       toast.error('Phone number is required');
//       return false;
//     }
    
//     if (!form.aadharNo || !/^\d{12}$/.test(form.aadharNo)) {
//       toast.error('Aadhar number must be 12 digits');
//       return false;
//     }

//     if (!form.panNo || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNo.toUpperCase())) {
//       toast.error('Please enter a valid PAN number (e.g., ABCDE1234F)');
//       return false;
//     }

//     if (!form.address.street?.trim() || !form.address.city?.trim() || !form.address.state?.trim() || !form.address.pincode?.trim()) {
//       toast.error('Please fill complete address');
//       return false;
//     }

//     if (!/^\d{6}$/.test(form.address.pincode)) {
//       toast.error('Pincode must be 6 digits');
//       return false;
//     }

//     // if (!form.assignedAgent) {
//     //   toast.error('Please select an assigned agent');
//     //   return false;
//     // }

//     if (form.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }
    
//     return true;
//   };

//   // Save customer (create or update)
//   const saveCustomer = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('auth_token');

//       const customerData = {
//         name: form.name.trim(),
//         phone: form.phone.trim(),
//         aadharNo: form.aadharNo,
//         panNo: form.panNo.toUpperCase(),
//         address: form.address,
//         alternatePhone: form.alternatePhone?.trim() || undefined,
//         email: form.email?.trim() || undefined,
//         assignedAgent: form.assignedAgent,
//         dateOfBirth: form.dateOfBirth || undefined,
//         occupation: form.occupation?.trim() || undefined,
//         annualIncome: form.annualIncome?.trim() || undefined
//       };

//       console.log('Saving customer data:', customerData);

//       if (editing) {
//         // Update existing customer
//         await axios.put(`${API_BASE_URL}/customers/${editing._id}`, customerData, {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         toast.success('Customer updated successfully');
//       } else {
//         // Create new customer
//         await axios.post(`${API_BASE_URL}/customers`, customerData, {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         toast.success('Customer added successfully');
//       }

//       // Refresh customer list
//       await fetchCustomers();
//       setOpen(false);
//     } catch (error: any) {
//       console.error('Error saving customer:', error);
      
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.response?.data?.errors) {
//         const errors = Object.values(error.response.data.errors).join(', ');
//         toast.error(errors);
//       } else {
//         toast.error('Failed to save customer');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete customer (soft delete)
//   const deleteCustomer = async () => {
//     if (!deleteDialog.id) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('auth_token');
//       await axios.delete(`${API_BASE_URL}/customers/${deleteDialog.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success('Customer deleted successfully');
//       await fetchCustomers();
//       setDeleteDialog({ open: false, id: null });
//     } catch (error: any) {
//       console.error('Error deleting customer:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete customer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle customer status
//   const toggleCustomerStatus = async (id: string, currentStatus: boolean) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('auth_token');
//       await axios.patch(`${API_BASE_URL}/customers/${id}/toggle-status`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success(`Customer ${currentStatus ? 'deactivated' : 'activated'} successfully`);
//       await fetchCustomers();
//     } catch (error: any) {
//       console.error('Error toggling customer status:', error);
//       toast.error(error.response?.data?.message || 'Failed to update customer status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get agent name by ID
//   const getAgentName = (agentId: string | undefined | any): string => {
//     if (!agentId) return '-';
    
//     // Check if it's a populated agent object
//     if (typeof agentId === 'object' && agentId !== null) {
//       return agentId?.name || '-';
//     }
    
//     // Look up in agents map
//     return agentsMap[agentId]?.name || '-';
//   };

//   return (
//     <div className="animate-fade-in p-6">
//       <PageHeader 
//         title="Customer Management" 
//         description={`${customers.length} customers`} 
//         actions={
//           <div className="flex gap-2">
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={fetchCustomers} 
//               disabled={fetchLoading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//             <Button size="sm" onClick={openNew} disabled={loading}>
//               <Plus className="h-4 w-4 mr-1" />
//               Add Customer
//             </Button>
//           </div>
//         } 
//       />

//       {fetchLoading && customers.length === 0 ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-xs">Name</TableHead>
//                 <TableHead className="text-xs">Phone</TableHead>
//                 <TableHead className="text-xs">Aadhaar</TableHead>
//                 <TableHead className="text-xs">PAN</TableHead>
//                 <TableHead className="text-xs">Agent</TableHead>
//                 <TableHead className="text-xs">Status</TableHead>
//                 <TableHead className="text-xs text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {customers.map((c: any, i) => {
//                 const agentName = getAgentName(c.assignedAgentId || c.assignedAgent);
//                 return (
//                   <TableRow key={c.id} className="animate-fade-in hover:bg-muted/50" style={{ animationDelay: `${i * 40}ms` }}>
//                     <TableCell className="text-sm font-medium">{c.name || '-'}</TableCell>
//                     <TableCell className="text-sm font-mono">{c.phone || '-'}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{c.aadhaar || '-'}</TableCell>
//                     <TableCell className="text-sm font-mono uppercase">{c.panNo || '-'}</TableCell>
//                     <TableCell className="text-sm">
//                       {agentName}
//                     </TableCell>
//                     <TableCell className="text-sm">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         c.isActive !== false 
//                           ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
//                           : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
//                       }`}>
//                         {c.isActive !== false ? 'Active' : 'Inactive'}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-1">
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-xs"
//                           onClick={() => handleViewDetails(c.id)}
//                         >
//                           <Eye className="h-3 w-3 mr-1" />
//                           View
//                         </Button>
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-xs"
//                           onClick={() => handleViewLoans(c.id)}
//                         >
//                           Loans
//                         </Button>
//                         <Button 
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-7 w-7"
//                           onClick={() => openEdit(c)}
//                           disabled={loading}
//                         >
//                           <Pencil className="h-3 w-3" />
//                         </Button>
//                         <Button 
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-7 w-7 text-destructive"
//                           onClick={() => setDeleteDialog({ open: true, id: c.id })}
//                           disabled={loading}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}

//               {customers.length === 0 && !fetchLoading && (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     No customers found. Click "Add Customer" to create one.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       {/* Add/Edit Customer Sheet - Keep the same as before */}
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetContent className="sm:max-w-2xl overflow-y-auto">
//           <SheetHeader>
//             <SheetTitle>{editing ? 'Edit Customer' : 'Add Customer'}</SheetTitle>
//           </SheetHeader>
          
//           <div className="space-y-4 mt-6">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-medium flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Basic Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Full Name *</Label>
//                   <Input 
//                     value={form.name} 
//                     onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
//                     placeholder="Enter full name"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs flex items-center gap-1">
//                     <Phone className="h-3 w-3" />
//                     Phone Number *
//                   </Label>
//                   <Input 
//                     value={form.phone} 
//                     onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
//                     placeholder="+91 9876543210"
//                     className="font-mono"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Aadhar Number *</Label>
//                   <Input 
//                     value={form.aadharNo} 
//                     onChange={e => setForm(f => ({ ...f, aadharNo: e.target.value }))} 
//                     placeholder="12 digits"
//                     className="font-mono"
//                     maxLength={12}
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">PAN Number *</Label>
//                   <Input 
//                     value={form.panNo} 
//                     onChange={e => setForm(f => ({ ...f, panNo: e.target.value.toUpperCase() }))} 
//                     placeholder="ABCDE1234F"
//                     className="font-mono uppercase"
//                     maxLength={10}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs flex items-center gap-1">
//                     <Mail className="h-3 w-3" />
//                     Email
//                   </Label>
//                   <Input 
//                     type="email"
//                     value={form.email} 
//                     onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
//                     placeholder="customer@example.com"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Alternate Phone</Label>
//                   <Input 
//                     value={form.alternatePhone} 
//                     onChange={e => setForm(f => ({ ...f, alternatePhone: e.target.value }))} 
//                     placeholder="+91 9876543211"
//                     className="font-mono"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Details */}
//             <div className="space-y-4 pt-4 border-t">
//               <h3 className="text-sm font-medium flex items-center gap-2">
//                 <MapPin className="h-4 w-4" />
//                 Address Details
//               </h3>
//               <div>
//                 <Label className="text-xs">Street Address *</Label>
//                 <Textarea 
//                   value={form.address.street} 
//                   onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} 
//                   placeholder="Enter street address"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">City *</Label>
//                   <Input 
//                     value={form.address.city} 
//                     onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} 
//                     placeholder="Enter city"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">State *</Label>
//                   <Input 
//                     value={form.address.state} 
//                     onChange={e => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} 
//                     placeholder="Enter state"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Pincode *</Label>
//                   <Input 
//                     value={form.address.pincode} 
//                     onChange={e => setForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} 
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
//                     onChange={e => setForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} 
//                     placeholder="India"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Additional Details */}
//             <div className="space-y-4 pt-4 border-t">
//               <h3 className="text-sm font-medium flex items-center gap-2">
//                 <Briefcase className="h-4 w-4" />
//                 Additional Details
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs flex items-center gap-1">
//                     <Calendar className="h-3 w-3" />
//                     Date of Birth
//                   </Label>
//                   <Input 
//                     type="date"
//                     value={form.dateOfBirth} 
//                     onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} 
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Occupation</Label>
//                   <Input 
//                     value={form.occupation} 
//                     onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} 
//                     placeholder="e.g., Software Engineer"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-xs flex items-center gap-1">
//                   <DollarSign className="h-3 w-3" />
//                   Annual Income
//                 </Label>
//                 <Input 
//                   value={form.annualIncome} 
//                   onChange={e => setForm(f => ({ ...f, annualIncome: e.target.value }))} 
//                   placeholder="e.g., 500000"
//                   className="font-mono"
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Assigned Agent */}
//             <div className="space-y-4 pt-4 border-t">
//               <h3 className="text-sm font-medium">Assignment</h3>
//               <div>
//                 <Label className="text-xs">Assigned Collection Agent *</Label>
//                 <Select 
//                   value={form.assignedAgent} 
//                   onValueChange={v => setForm(f => ({ ...f, assignedAgent: v }))}
//                   disabled={loading}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select agent" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Object.values(agentsMap).map(a => (
//                       <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <Button 
//               className="w-full" 
//               onClick={saveCustomer} 
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   {editing ? 'Updating...' : 'Adding...'}
//                 </>
//               ) : (
//                 <>{editing ? 'Update Customer' : 'Add Customer'}</>
//               )}
//             </Button>
//           </div>
//         </SheetContent>
//       </Sheet>

//       {/* View Customer Details Dialog */}
//       <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
//         <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Customer Details</DialogTitle>
//           </DialogHeader>
          
//           {loading && !selectedCustomer ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : selectedCustomer ? (
//             <div className="space-y-6">
//               {/* Header with Status */}
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
//                   <p className="text-sm text-muted-foreground">Customer ID: {selectedCustomer._id}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`px-3 py-1 rounded-full text-sm ${
//                     selectedCustomer.isActive !== false 
//                       ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
//                       : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
//                   }`}>
//                     {selectedCustomer.isActive !== false ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>
//               </div>

//               {/* Basic Information Card */}
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Basic Information
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Phone</p>
//                       <p className="font-mono">{selectedCustomer.phone || '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Aadhar Number</p>
//                       <p className="font-mono">{selectedCustomer.aadharNo || '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">PAN Number</p>
//                       <p className="font-mono uppercase">{selectedCustomer.panNo || '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Email</p>
//                       <p>{selectedCustomer.email || '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Alternate Phone</p>
//                       <p className="font-mono">{selectedCustomer.alternatePhone || '-'}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Address Card */}
//               {selectedCustomer.address && (
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
//                       <MapPin className="h-4 w-4" />
//                       Address
//                     </h3>
//                     <p className="text-sm">
//                       {selectedCustomer.address.street},<br />
//                       {selectedCustomer.address.city}, {selectedCustomer.address.state}<br />
//                       {selectedCustomer.address.pincode}, {selectedCustomer.address.country}
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Additional Details Card */}
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
//                     <Briefcase className="h-4 w-4" />
//                     Additional Details
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Date of Birth</p>
//                       <p>{selectedCustomer.dateOfBirth ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString() : '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Occupation</p>
//                       <p>{selectedCustomer.occupation || '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Annual Income</p>
//                       <p className="font-mono">{selectedCustomer.annualIncome ? formatINR(parseInt(selectedCustomer.annualIncome)) : '-'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Assigned Agent</p>
//                       <p>{getAgentName(selectedCustomer.assignedAgent)}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Metadata */}
//               <div className="text-xs text-muted-foreground border-t pt-4">
//                 <p>Created: {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleString() : '-'}</p>
//                 <p>Last Updated: {selectedCustomer.updatedAt ? new Date(selectedCustomer.updatedAt).toLocaleString() : '-'}</p>
//               </div>
//             </div>
//           ) : null}
//         </DialogContent>
//       </Dialog>

//       {/* View Loans Dialog */}
//       <Dialog open={!!viewLoans} onOpenChange={() => setViewLoans(null)}>
//         <DialogContent className="sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Loan History</DialogTitle>
//             <DialogDescription>
//               {customers.find(c => c.id === viewLoans)?.name}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-3 max-h-[400px] overflow-y-auto">
//             {customerLoans.length === 0 ? (
//               <p className="text-center py-8 text-muted-foreground">No loans found for this customer</p>
//             ) : (
//               customerLoans.map(s => (
//                 <div key={s.id} className="border border-border rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <span className="font-medium">Sale #{s.id}</span>
//                       <span className="text-sm text-muted-foreground ml-2">({s.date})</span>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
//                     }`}>
//                       {s.status}
//                     </span>
//                   </div>
                  
//                   <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
//                     <div>
//                       <p className="text-muted-foreground">Vehicle</p>
//                       <p className="font-medium">{s.vehicle}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Selling Price</p>
//                       <p className="font-mono font-medium">{formatINR(s.sellingPrice)}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Down Payment</p>
//                       <p className="font-mono">{formatINR(s.downpayment)}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Monthly EMI</p>
//                       <p className="font-mono">{s.emi ? formatINR(s.emi) : '-'}</p>
//                     </div>
//                     {s.tenure && (
//                       <div>
//                         <p className="text-muted-foreground">Tenure</p>
//                         <p>{s.tenure} months</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
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
//               Are you sure you want to delete this customer? This action cannot be undone.
//               The customer will be deactivated and moved to inactive list.
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
//               onClick={deleteCustomer}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 'Delete Customer'
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
import { Plus, Pencil, Trash2, Eye, RefreshCw, AlertCircle, Loader2, User, Phone, Mail, MapPin, Briefcase, Calendar, DollarSign, CheckCircle, CreditCard, Landmark, Receipt, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { formatINR } from '@/lib/mock-data';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

interface LoanDetail {
  _id: string;
  saleId: string;
  vehicleId: {
    _id: string;
    name: string;
    model: string;
    price: string;
  };
  sellingPrice: string;
  paymentType: string;
  downPayment?: string;
  financeAmount?: string;
  interestRate?: string;
  tenure?: number;
  emi?: string;
  status: string;
  saleDate: string;
  emis?: EMI[];
}

interface EMI {
  _id: string;
  emiId: string;
  installmentNo: number;
  dueDate: string;
  amount: string;
  status: string;
  paidDate?: string;
  paymentMode?: string;
}

export default function CustomerManagement() {
  const { customers, setCustomers } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    name: '',
    aadharNo: '',
    panNo: '',
    address: { street: '', city: '', state: '', pincode: '', country: 'India' },
    phone: '',
    alternatePhone: '',
    email: '',
    assignedAgent: '',
    dateOfBirth: '',
    occupation: '',
    annualIncome: ''
  });
  const [viewDetails, setViewDetails] = useState<string | null>(null);
  const [viewLoans, setViewLoans] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerLoans, setCustomerLoans] = useState<LoanDetail[]>([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [agentsMap, setAgentsMap] = useState<Record<string, any>>({});
  const [emailSent, setEmailSent] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/agents?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const agentsData = response.data.data || response.data;
      const agentList = Array.isArray(agentsData) ? agentsData : [];
      
      const agentMap: Record<string, any> = {};
      agentList.forEach((agent: any) => {
        agentMap[agent._id] = {
          _id: agent._id,
          name: agent.name,
          phone: agent.contactDetails?.phone || agent.phone || ''
        };
      });
      setAgentsMap(agentMap);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let customersData = [];
      
      if (response.data?.data?.data) {
        customersData = response.data.data.data;
      } else if (response.data?.data) {
        customersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        customersData = response.data;
      } else if (response.data?.customers) {
        customersData = response.data.customers;
      }
      
      const transformedCustomers = customersData.map((cust: any) => ({
        id: cust._id,
        _id: cust._id,
        name: cust.name || '',
        phone: cust.phone || '',
        address: cust.address ? 
          `${cust.address.street || ''}, ${cust.address.city || ''}, ${cust.address.state || ''} - ${cust.address.pincode || ''}` : 
          'N/A',
        aadhaar: cust.aadharNo || 'N/A',
        panNo: cust.panNo || '',
        assignedAgentId: typeof cust.assignedAgent === 'object' ? cust.assignedAgent?._id : cust.assignedAgent,
        assignedAgent: cust.assignedAgent,
        isActive: cust.isActive !== false,
        email: cust.email || '',
        alternatePhone: cust.alternatePhone || '',
        dateOfBirth: cust.dateOfBirth,
        occupation: cust.occupation,
        annualIncome: cust.annualIncome,
        address_details: cust.address,
        createdAt: cust.createdAt,
        updatedAt: cust.updatedAt
      }));
      
      setCustomers(transformedCustomers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCustomerDetails = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let customerData = response.data?.data || response.data;
      
      setSelectedCustomer({
        id: customerData._id,
        _id: customerData._id,
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        aadhaar: customerData.aadharNo,
        aadharNo: customerData.aadharNo,
        panNo: customerData.panNo,
        email: customerData.email,
        alternatePhone: customerData.alternatePhone,
        dateOfBirth: customerData.dateOfBirth,
        occupation: customerData.occupation,
        annualIncome: customerData.annualIncome,
        assignedAgentId: typeof customerData.assignedAgent === 'object' ? customerData.assignedAgent?._id : customerData.assignedAgent,
        assignedAgent: customerData.assignedAgent,
        isActive: customerData.isActive,
        createdAt: customerData.createdAt,
        updatedAt: customerData.updatedAt
      });
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  };

  // ========== FIXED: Fetch loans from API instead of local context ==========
  const fetchCustomerLoans = async (customerId: string) => {
    try {
      setLoansLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Use the dedicated endpoint for customer loans
      const response = await axios.get(`${API_BASE_URL}/sales/customer/${customerId}/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Loans API response:', response.data);
      
      if (response.data.success) {
        const loans = response.data.data || [];
        setCustomerLoans(loans);
      } else {
        setCustomerLoans([]);
        toast.error(response.data.message || 'Failed to fetch loans');
      }
    } catch (error: any) {
      console.error('Error fetching customer loans:', error);
      
      // Fallback: Try the regular sales endpoint
      try {
        const token = localStorage.getItem('auth_token');
        const fallbackResponse = await axios.get(`${API_BASE_URL}/sales?customerId=${customerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (fallbackResponse.data.success) {
          const sales = fallbackResponse.data.data || [];
          setCustomerLoans(sales);
        } else {
          setCustomerLoans([]);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setCustomerLoans([]);
        toast.error('Failed to load loan details');
      }
    } finally {
      setLoansLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    setViewDetails(id);
    fetchCustomerDetails(id);
  };

  // ========== FIXED: Handle loans button click ==========
  const handleViewLoans = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    setViewLoans(customerId);
    await fetchCustomerLoans(customerId);
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      name: '',
      aadharNo: '',
      panNo: '',
      address: { street: '', city: '', state: '', pincode: '', country: 'India' },
      phone: '',
      alternatePhone: '',
      email: '',
      assignedAgent: '',
      dateOfBirth: '',
      occupation: '',
      annualIncome: ''
    });
    setEmailSent(null);
    setOpen(true);
  };

  const openEdit = async (c: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/customers/${c.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const cust = response.data?.data || response.data;
      
      setEditing(cust);
      setForm({
        name: cust.name || '',
        aadharNo: cust.aadharNo || '',
        panNo: cust.panNo || '',
        address: cust.address || { street: '', city: '', state: '', pincode: '', country: 'India' },
        phone: cust.phone || '',
        alternatePhone: cust.alternatePhone || '',
        email: cust.email || '',
        assignedAgent: typeof cust.assignedAgent === 'object' ? cust.assignedAgent?._id : cust.assignedAgent || '',
        dateOfBirth: cust.dateOfBirth ? new Date(cust.dateOfBirth).toISOString().split('T')[0] : '',
        occupation: cust.occupation || '',
        annualIncome: cust.annualIncome || ''
      });
      setEmailSent(null);
      setOpen(true);
    } catch (error: any) {
      console.error('Error fetching customer for edit:', error);
      toast.error(error.response?.data?.message || 'Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name?.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!form.phone?.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!form.aadharNo || !/^\d{12}$/.test(form.aadharNo)) {
      toast.error('Aadhar number must be 12 digits');
      return false;
    }
    if (!form.panNo || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNo.toUpperCase())) {
      toast.error('Please enter a valid PAN number (e.g., ABCDE1234F)');
      return false;
    }
    if (!form.email) {
      toast.error('Email is required for login credentials');
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!form.address.street?.trim() || !form.address.city?.trim() || !form.address.state?.trim() || !form.address.pincode?.trim()) {
      toast.error('Please fill complete address');
      return false;
    }
    if (!/^\d{6}$/.test(form.address.pincode)) {
      toast.error('Pincode must be 6 digits');
      return false;
    }
    return true;
  };

  const saveCustomer = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const customerData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        aadharNo: form.aadharNo,
        panNo: form.panNo.toUpperCase(),
        address: form.address,
        alternatePhone: form.alternatePhone?.trim() || undefined,
        email: form.email?.trim(),
        assignedAgent: form.assignedAgent || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        occupation: form.occupation?.trim() || undefined,
        annualIncome: form.annualIncome?.trim() || undefined
      };

      let response;
      if (editing) {
        response = await axios.put(`${API_BASE_URL}/customers/${editing._id}`, customerData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Customer updated successfully');
      } else {
        response = await axios.post(`${API_BASE_URL}/customers`, customerData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const emailSentFlag = response.data.emailSent || response.data.data?.emailSent;
        const customerEmail = response.data.email || response.data.data?.email || form.email;
        
        if (emailSentFlag) {
          toast.success(
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Customer Created Successfully!</p>
                <p className="text-sm mt-0.5">Login credentials sent to <strong>{customerEmail}</strong></p>
              </div>
            </div>,
            { duration: 6000 }
          );
          setEmailSent(customerEmail);
        } else {
          toast.success('Customer added successfully');
        }
      }

      await fetchCustomers();
      
      if (!editing && response?.data?.emailSent) {
        setTimeout(() => {
          setOpen(false);
          setEmailSent(null);
        }, 3000);
      } else {
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast.error(error.response?.data?.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async () => {
    if (!deleteDialog.id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_BASE_URL}/customers/${deleteDialog.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Customer deleted successfully');
      await fetchCustomers();
      setDeleteDialog({ open: false, id: null });
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      await axios.patch(`${API_BASE_URL}/customers/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Customer ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      await fetchCustomers();
    } catch (error: any) {
      console.error('Error toggling customer status:', error);
      toast.error(error.response?.data?.message || 'Failed to update customer status');
    } finally {
      setLoading(false);
    }
  };

  const getAgentName = (agentId: string | undefined | any): string => {
    if (!agentId) return '-';
    if (typeof agentId === 'object' && agentId !== null) {
      return agentId?.name || '-';
    }
    return agentsMap[agentId]?.name || '-';
  };

  // Helper to get customer name for dialog
  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return '';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || '';
  };

  // Calculate loan summary
  const getLoanSummary = (loans: LoanDetail[]) => {
    const totalLoanAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.sellingPrice || '0'), 0);
    const activeLoans = loans.filter(l => l.status === 'Active').length;
    const completedLoans = loans.filter(l => l.status === 'Completed').length;
    const totalEmis = loans.reduce((sum, loan) => sum + (loan.emis?.length || 0), 0);
    const paidEmis = loans.reduce((sum, loan) => sum + (loan.emis?.filter(e => e.status === 'Paid').length || 0), 0);
    
    return { totalLoanAmount, activeLoans, completedLoans, totalEmis, paidEmis };
  };

  const summary = getLoanSummary(customerLoans);

  return (
    <div className="animate-fade-in p-6">
      <PageHeader 
        title="Customer Management" 
        description={`${customers.length} customers`} 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchCustomers} disabled={fetchLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={openNew} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" />
              Add Customer
            </Button>
          </div>
        } 
      />

      {fetchLoading && customers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Phone</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Aadhaar</TableHead>
                <TableHead className="text-xs">PAN</TableHead>
                <TableHead className="text-xs">Agent</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c: any, i) => {
                const agentName = getAgentName(c.assignedAgentId || c.assignedAgent);
                return (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="text-sm font-medium">{c.name || '-'}</TableCell>
                    <TableCell className="text-sm font-mono">{c.phone || '-'}</TableCell>
                    <TableCell className="text-sm">{c.email || '-'}</TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">{c.aadhaar || '-'}</TableCell>
                    <TableCell className="text-sm font-mono uppercase">{c.panNo || '-'}</TableCell>
                    <TableCell className="text-sm">{agentName}</TableCell>
                    <TableCell className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        c.isActive !== false 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {c.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewDetails(c.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewLoans(c.id)}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Loans
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => openEdit(c)}
                          disabled={loading}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={() => setDeleteDialog({ open: true, id: c.id })}
                          disabled={loading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {customers.length === 0 && !fetchLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No customers found. Click "Add Customer" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Customer Sheet - Same as before */}
      <Sheet open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEmailSent(null);
          setOpen(false);
        }
      }}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Customer' : 'Add Customer'}</SheetTitle>
          </SheetHeader>
          
          {emailSent && !editing && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">Credentials Sent!</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Login credentials have been sent to <strong>{emailSent}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Phone Number *</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Aadhar Number *</Label>
                <Input value={form.aadharNo} onChange={e => setForm(f => ({ ...f, aadharNo: e.target.value }))} maxLength={12} />
              </div>
              <div>
                <Label className="text-xs">PAN Number *</Label>
                <Input value={form.panNo} onChange={e => setForm(f => ({ ...f, panNo: e.target.value.toUpperCase() }))} maxLength={10} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email Address *
                </Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Alternate Phone</Label>
                <Input value={form.alternatePhone} onChange={e => setForm(f => ({ ...f, alternatePhone: e.target.value }))} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address Details
              </h3>
              <div>
                <Label className="text-xs">Street Address *</Label>
                <Textarea value={form.address.street} onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="text-xs">City *</Label>
                  <Input value={form.address.city} onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
                </div>
                <div>
                  <Label className="text-xs">State *</Label>
                  <Input value={form.address.state} onChange={e => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="text-xs">Pincode *</Label>
                  <Input value={form.address.pincode} onChange={e => setForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} maxLength={6} />
                </div>
                <div>
                  <Label className="text-xs">Country</Label>
                  <Input value={form.address.country} onChange={e => setForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Additional Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Date of Birth</Label>
                  <Input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Occupation</Label>
                  <Input value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} />
                </div>
              </div>
              <div className="mt-3">
                <Label className="text-xs">Annual Income</Label>
                <Input value={form.annualIncome} onChange={e => setForm(f => ({ ...f, annualIncome: e.target.value }))} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Assignment</h3>
              <div>
                <Label className="text-xs">Assigned Collection Agent (Optional)</Label>
                <Select value={form.assignedAgent} onValueChange={v => setForm(f => ({ ...f, assignedAgent: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {Object.values(agentsMap).map(a => (
                      <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={saveCustomer} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {editing ? 'Update Customer' : 'Create Customer & Send Credentials'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* View Customer Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {loading && !selectedCustomer ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedCustomer ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-sm text-muted-foreground">Customer ID: {selectedCustomer._id}</p>
                  <p className="text-sm text-muted-foreground">Email: {selectedCustomer.email || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedCustomer.isActive !== false 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {selectedCustomer.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" /> Basic Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-mono">{selectedCustomer.phone || '-'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Aadhar Number</p><p className="font-mono">{selectedCustomer.aadharNo || '-'}</p></div>
                    <div><p className="text-xs text-muted-foreground">PAN Number</p><p className="font-mono uppercase">{selectedCustomer.panNo || '-'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Alternate Phone</p><p className="font-mono">{selectedCustomer.alternatePhone || '-'}</p></div>
                  </div>
                </CardContent>
              </Card>

              {selectedCustomer.address && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</h3>
                    <p className="text-sm">
                      {selectedCustomer.address.street},<br />
                      {selectedCustomer.address.city}, {selectedCustomer.address.state}<br />
                      {selectedCustomer.address.pincode}, {selectedCustomer.address.country}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Additional Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div><p className="text-xs text-muted-foreground">Date of Birth</p><p>{selectedCustomer.dateOfBirth ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString() : '-'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Occupation</p><p>{selectedCustomer.occupation || '-'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Annual Income</p><p className="font-mono">{selectedCustomer.annualIncome ? formatINR(parseInt(selectedCustomer.annualIncome)) : '-'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Assigned Agent</p><p>{getAgentName(selectedCustomer.assignedAgent)}</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ========== FIXED: Loans Dialog with proper data display ========== */}
      <Dialog open={!!viewLoans} onOpenChange={() => {
        setViewLoans(null);
        setCustomerLoans([]);
      }}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Loan History
            </DialogTitle>
            <DialogDescription>
              {getCustomerName(viewLoans)}
            </DialogDescription>
          </DialogHeader>
          
          {loansLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : customerLoans.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No loans found for this customer</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Total Loan Amount</p>
                    <p className="text-lg font-bold">{formatINR(summary.totalLoanAmount)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Active Loans</p>
                    <p className="text-lg font-bold text-blue-600">{summary.activeLoans}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">EMI Progress</p>
                    <p className="text-lg font-bold">{summary.paidEmis}/{summary.totalEmis}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Completed Loans</p>
                    <p className="text-lg font-bold text-green-600">{summary.completedLoans}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Loans List */}
              <div className="space-y-4">
                {customerLoans.map((loan) => {
                  const emis = loan.emis || [];
                  const paidCount = emis.filter(e => e.status === 'Paid').length;
                  const progress = emis.length > 0 ? (paidCount / emis.length) * 100 : 0;
                  
                  return (
                    <Card key={loan._id} className="border-border">
                      <CardContent className="p-4">
                        {/* Loan Header */}
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-4 pb-3 border-b">
                          <div>
                            <h4 className="font-semibold">
                              {loan.vehicleId?.name} {loan.vehicleId?.model}
                            </h4>
                            <p className="text-xs text-muted-foreground">Sale ID: {loan.saleId}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              loan.status === 'Active' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {loan.status}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                              {loan.paymentType}
                            </span>
                          </div>
                        </div>

                        {/* Loan Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Selling Price</p>
                            <p className="font-mono">{formatINR(parseFloat(loan.sellingPrice))}</p>
                          </div>
                          {loan.downPayment && (
                            <div>
                              <p className="text-xs text-muted-foreground">Down Payment</p>
                              <p className="font-mono">{formatINR(parseFloat(loan.downPayment))}</p>
                            </div>
                          )}
                          {loan.financeAmount && (
                            <div>
                              <p className="text-xs text-muted-foreground">Finance Amount</p>
                              <p className="font-mono">{formatINR(parseFloat(loan.financeAmount))}</p>
                            </div>
                          )}
                          {loan.emi && (
                            <div>
                              <p className="text-xs text-muted-foreground">Monthly EMI</p>
                              <p className="font-mono font-medium text-cobalt">{formatINR(parseFloat(loan.emi))}</p>
                            </div>
                          )}
                        </div>

                        {/* EMI Progress Bar */}
                        {emis.length > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span>EMI Progress</span>
                              <span>{paidCount}/{emis.length} paid</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-cobalt rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}

                        {/* EMI Table */}
                        {emis.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-2">Installments</p>
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/30">
                                    <TableHead className="text-xs w-16">#</TableHead>
                                    <TableHead className="text-xs">Due Date</TableHead>
                                    <TableHead className="text-xs">Amount</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="text-xs">Paid Date</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {emis.map((emi) => (
                                    <TableRow key={emi._id} className={emi.status === 'Overdue' ? 'bg-red-50/50 dark:bg-red-950/20' : ''}>
                                      <TableCell className="text-sm font-mono">{emi.installmentNo}</TableCell>
                                      <TableCell className="text-sm">
                                        {new Date(emi.dueDate).toLocaleDateString('en-IN')}
                                        {emi.status === 'Overdue' && (
                                          <span className="ml-2 text-xs text-red-500">
                                            (Overdue)
                                          </span>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-sm font-mono">{formatINR(parseFloat(emi.amount))}</TableCell>
                                      <TableCell>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                          emi.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                          emi.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                          'bg-yellow-100 text-yellow-700'
                                        }`}>
                                          {emi.status}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {emi.paidDate ? new Date(emi.paidDate).toLocaleDateString('en-IN') : '-'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
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
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCustomer} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

