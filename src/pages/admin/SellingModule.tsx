// import { useState, useMemo, useEffect } from 'react';
// import { PageHeader } from '@/components/PageHeader';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';
// import { Loader2, Car, User, CreditCard, FileText, RefreshCw, Plus, MapPin, Briefcase, Phone, Mail } from 'lucide-react';
// import axios from 'axios';

// const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// // Types based on actual API responses
// interface Vehicle {
//   _id: string;
//   name: string;
//   model: string;
//   price: string;
//   vehicleType: 'bike' | 'car';
//   status: 'available' | 'sold out';
//   images?: string[];
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   email?: string;
//   aadharNo: string;
//   isActive: boolean;
//   address?: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
// }

// interface Agent {
//   _id: string;
//   name: string;
//   phone: string;
//   email?: string;
//   isActive: boolean;
//   employmentDetails?: {
//     employeeId?: string;
//     department?: string;
//   };
// }

// interface SaleResponse {
//   success: boolean;
//   data: {
//     _id: string;
//     saleId: string;
//     vehicleId: Vehicle;
//     customerId: Customer;
//     agentId?: Agent;
//     sellingPrice: string;
//     paymentType: 'Full Payment' | 'Finance';
//     paymentMode?: 'Cash' | 'Online';
//     downPayment?: string;
//     financeAmount?: string;
//     interestRate?: string;
//     tenure?: number;
//     emi?: string;
//     charges1?: string;
//     charges2?: string;
//     documentationCharges: string;
//     rtoCharges: string;
//     status: string;
//     saleDate: string;
//   };
// }

// // Quick Create Form Data Interfaces
// interface QuickCustomerForm {
//   name: string;
//   phone: string;
//   aadharNo: string;
//   panNo: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
//   email: string;
//   alternatePhone: string;
// }

// interface QuickAgentForm {
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
//   };
// }

// interface QuickVehicleForm {
//   type: string;
//   name: string;
//   model: string;
//   price: string;
//   description: string;
// }

// // EMI Calculator function
// const calculateEMI = (principal: number, rate: number, tenure: number): number => {
//   const monthlyRate = rate / 12 / 100;
//   const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
//   return isNaN(emi) ? 0 : Math.round(emi);
// };

// // Format INR function
// const formatINR = (amount: number): string => {
//   return new Intl.NumberFormat('en-IN', {
//     maximumFractionDigits: 0,
//     style: 'currency',
//     currency: 'INR'
//   }).format(amount).replace('₹', '₹ ');
// };

// export default function SellingModule() {
//   // State for API data
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [recentSales, setRecentSales] = useState<any[]>([]);
  
//   // Loading states
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [quickCreateLoading, setQuickCreateLoading] = useState(false);
  
//   // Quick Create Dialogs state
//   const [quickCustomerOpen, setQuickCustomerOpen] = useState(false);
//   const [quickAgentOpen, setQuickAgentOpen] = useState(false);
//   const [quickVehicleOpen, setQuickVehicleOpen] = useState(false);
  
//   // Quick Create form data
//   const [quickCustomerForm, setQuickCustomerForm] = useState<QuickCustomerForm>({
//     name: '',
//     phone: '',
//     aadharNo: '',
//     panNo: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       pincode: '',
//       country: 'India'
//     },
//     email: '',
//     alternatePhone: ''
//   });
  
//   const [quickAgentForm, setQuickAgentForm] = useState<QuickAgentForm>({
//     name: '',
//     age: '',
//     aadharNo: '',
//     contactDetails: {
//       phone: '',
//       alternatePhone: '',
//       email: ''
//     },
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       pincode: '',
//       country: 'India'
//     },
//     employmentDetails: {
//       department: 'collection',
//       designation: '',
//       joinDate: new Date().toISOString().split('T')[0]
//     }
//   });
  
//   const [quickVehicleForm, setQuickVehicleForm] = useState<QuickVehicleForm>({
//     type: 'Car',
//     name: '',
//     model: '',
//     price: '',
//     description: ''
//   });
  
//   // Form state - ALL ORIGINAL FIELDS PRESERVED
//   const [vehicleId, setVehicleId] = useState('');
//   const [customerId, setCustomerId] = useState('');
//   const [agentId, setAgentId] = useState('none');
//   const [paymentType, setPaymentType] = useState<'Full Payment' | 'Finance'>('Finance');
//   const [downPayment, setDownPayment] = useState(0);
//   const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online'>('Cash');
//   const [docCharges, setDocCharges] = useState(5000);
//   const [rtoCharges, setRtoCharges] = useState(25000);
//   const [interestRate, setInterestRate] = useState(12);
//   const [tenure, setTenure] = useState(36);
//   const [charges1, setCharges1] = useState(0);
//   const [charges2, setCharges2] = useState(0);
  
//   // UI state
//   const [showRecent, setShowRecent] = useState(false);

//   // Fetch all required data on component mount
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Fetch all data from APIs
//   const fetchAllData = async () => {
//     setFetchLoading(true);
//     try {
//       await Promise.all([
//         fetchVehicles(),
//         fetchCustomers(),
//         fetchAgents(),
//         fetchRecentSales()
//       ]);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load some data');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // Fetch vehicles from API
//   const fetchVehicles = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/vehicles`);
//       const availableVehicles = response.data.data.filter(
//         (v: any) => v.status === 'available'
//       );
//       setVehicles(availableVehicles);
//     } catch (error) {
//       console.error('Error fetching vehicles:', error);
//       toast.error('Failed to fetch vehicles');
//     }
//   };

//   // Fetch customers from API
//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/customers?isActive=true`);
//       setCustomers(response.data.data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       toast.error('Failed to fetch customers');
//     }
//   };

//   // Fetch agents from API
//   const fetchAgents = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/agents?isActive=true`);
//       setAgents(response.data.data);
//     } catch (error) {
//       console.error('Error fetching agents:', error);
//     }
//   };

//   // Fetch recent sales
//   const fetchRecentSales = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/sales?limit=5&sortBy=saleDate&sortOrder=desc`);
//       setRecentSales(response.data.data);
//     } catch (error) {
//       console.error('Error fetching recent sales:', error);
//     }
//   };

//   // Quick Create Customer
//   const createQuickCustomer = async () => {
//     if (!quickCustomerForm.name || !quickCustomerForm.phone || !quickCustomerForm.aadharNo || !quickCustomerForm.panNo) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       setQuickCreateLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/customers`, {
//         name: quickCustomerForm.name,
//         phone: quickCustomerForm.phone,
//         aadharNo: quickCustomerForm.aadharNo,
//         panNo: quickCustomerForm.panNo.toUpperCase(),
//         address: quickCustomerForm.address,
//         email: quickCustomerForm.email || undefined,
//         alternatePhone: quickCustomerForm.alternatePhone || undefined
//       });
      
//       const newCustomer = response.data.data || response.data;
//       setCustomers(prev => [...prev, newCustomer]);
//       setCustomerId(newCustomer._id);
//       toast.success('Customer created successfully');
//       setQuickCustomerOpen(false);
//       resetQuickCustomerForm();
//     } catch (error: any) {
//       console.error('Error creating customer:', error);
//       toast.error(error.response?.data?.message || 'Failed to create customer');
//     } finally {
//       setQuickCreateLoading(false);
//     }
//   };

//   // Quick Create Agent
//   const createQuickAgent = async () => {
//     if (!quickAgentForm.name || !quickAgentForm.age || !quickAgentForm.aadharNo || !quickAgentForm.contactDetails.phone) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       setQuickCreateLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/agents`, {
//         name: quickAgentForm.name,
//         age: parseInt(quickAgentForm.age),
//         aadharNo: quickAgentForm.aadharNo,
//         contactDetails: quickAgentForm.contactDetails,
//         address: quickAgentForm.address,
//         employmentDetails: quickAgentForm.employmentDetails
//       });
      
//       const newAgent = response.data.data || response.data;
//       setAgents(prev => [...prev, newAgent]);
//       setAgentId(newAgent._id);
//       toast.success('Agent created successfully');
//       setQuickAgentOpen(false);
//       resetQuickAgentForm();
//     } catch (error: any) {
//       console.error('Error creating agent:', error);
//       toast.error(error.response?.data?.message || 'Failed to create agent');
//     } finally {
//       setQuickCreateLoading(false);
//     }
//   };

//   // Quick Create Vehicle
//   const createQuickVehicle = async () => {
//     if (!quickVehicleForm.name || !quickVehicleForm.model || !quickVehicleForm.price) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       setQuickCreateLoading(true);
//       const formData = new FormData();
//       formData.append('vehicleType', quickVehicleForm.type.toLowerCase());
//       formData.append('name', quickVehicleForm.name);
//       formData.append('model', quickVehicleForm.model);
//       formData.append('price', quickVehicleForm.price);
//       formData.append('status', 'available');
//       if (quickVehicleForm.description) {
//         formData.append('description', quickVehicleForm.description);
//       }

//       const response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       const newVehicle = response.data.data || response.data;
//       setVehicles(prev => [...prev, newVehicle]);
//       setVehicleId(newVehicle._id);
//       toast.success('Vehicle created successfully');
//       setQuickVehicleOpen(false);
//       resetQuickVehicleForm();
//     } catch (error: any) {
//       console.error('Error creating vehicle:', error);
//       toast.error(error.response?.data?.message || 'Failed to create vehicle');
//     } finally {
//       setQuickCreateLoading(false);
//     }
//   };

//   const resetQuickCustomerForm = () => {
//     setQuickCustomerForm({
//       name: '',
//       phone: '',
//       aadharNo: '',
//       panNo: '',
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         pincode: '',
//         country: 'India'
//       },
//       email: '',
//       alternatePhone: ''
//     });
//   };

//   const resetQuickAgentForm = () => {
//     setQuickAgentForm({
//       name: '',
//       age: '',
//       aadharNo: '',
//       contactDetails: {
//         phone: '',
//         alternatePhone: '',
//         email: ''
//       },
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         pincode: '',
//         country: 'India'
//       },
//       employmentDetails: {
//         department: 'collection',
//         designation: '',
//         joinDate: new Date().toISOString().split('T')[0]
//       }
//     });
//   };

//   const resetQuickVehicleForm = () => {
//     setQuickVehicleForm({
//       type: 'Car',
//       name: '',
//       model: '',
//       price: '',
//       description: ''
//     });
//   };

//   // Get selected vehicle details
//   const selectedVehicle = vehicles.find(v => v._id === vehicleId);
//   const sellingPrice = selectedVehicle ? parseFloat(selectedVehicle.price) : 0;
//   const financeAmount = sellingPrice - downPayment;
  
//   // Total additional charges including new charges
//   const totalAdditionalCharges = docCharges + rtoCharges + charges1 + charges2;

//   // Calculate EMI
//   const emi = useMemo(() => {
//     if (paymentType !== 'Finance' || financeAmount <= 0 || tenure <= 0 || interestRate <= 0) return 0;
//     return calculateEMI(financeAmount, interestRate, tenure);
//   }, [financeAmount, interestRate, tenure, paymentType]);

//   // Calculate totals
//   const totalInterest = emi * tenure - financeAmount;
//   const totalPayable = financeAmount + totalInterest + totalAdditionalCharges;

//   // Validate form
//   const validateForm = (): boolean => {
//     if (!vehicleId) {
//       toast.error('Please select a vehicle');
//       return false;
//     }
    
//     if (!customerId) {
//       toast.error('Please select a customer');
//       return false;
//     }
    
//     if (paymentType === 'Finance') {
//       if (downPayment >= sellingPrice) {
//         toast.error('Down payment must be less than vehicle price');
//         return false;
//       }
      
//       if (downPayment < 0) {
//         toast.error('Down payment cannot be negative');
//         return false;
//       }
      
//       if (tenure <= 0) {
//         toast.error('Please enter valid tenure');
//         return false;
//       }
      
//       if (interestRate <= 0) {
//         toast.error('Please enter valid interest rate');
//         return false;
//       }
      
//       if (charges1 < 0) {
//         toast.error('Charge 1 cannot be negative');
//         return false;
//       }
      
//       if (charges2 < 0) {
//         toast.error('Charge 2 cannot be negative');
//         return false;
//       }
//     }
    
//     return true;
//   };

//   // Create sale
//   const createSale = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const saleData = {
//         vehicleId: vehicleId,
//         customerId: customerId,
//         agentId: agentId !== 'none' ? agentId : undefined,
//         sellingPrice: sellingPrice.toString(),
//         paymentType: paymentType,
//         paymentMode: paymentType === 'Finance' ? paymentMode : undefined,
//         downPayment: paymentType === 'Finance' ? downPayment.toString() : undefined,
//         financeAmount: paymentType === 'Finance' ? financeAmount.toString() : undefined,
//         interestRate: paymentType === 'Finance' ? interestRate.toString() : undefined,
//         tenure: paymentType === 'Finance' ? tenure : undefined,
//         emi: paymentType === 'Finance' ? emi.toString() : undefined,
//         charges1: paymentType === 'Finance' ? charges1.toString() : '0',
//         charges2: paymentType === 'Finance' ? charges2.toString() : '0',
//         documentationCharges: docCharges.toString(),
//         rtoCharges: rtoCharges.toString(),
//         saleDate: new Date().toISOString()
//       };

//       const response = await axios.post<SaleResponse>(`${API_BASE_URL}/sales`, saleData);

//       if (response.data.success) {
//         toast.success(`Sale created successfully! Sale ID: ${response.data.data.saleId}`);
        
//         await Promise.all([
//           fetchVehicles(),
//           fetchRecentSales()
//         ]);
        
//         // Reset form
//         setVehicleId('');
//         setCustomerId('');
//         setAgentId('none');
//         setDownPayment(0);
//         setDocCharges(5000);
//         setRtoCharges(25000);
//         setInterestRate(12);
//         setTenure(36);
//         setCharges1(0);
//         setCharges2(0);
//       }
//     } catch (error: any) {
//       console.error('Error creating sale:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to create sale';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const availableVehicles = vehicles.filter(v => v.status === 'available');

//   return (
//     <div className="animate-fade-in p-6">
//       <PageHeader 
//         title="New Sale" 
//         description="Create a vehicle sale and generate loan schedule"
//         actions={
//           <div className="flex gap-2">
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={fetchAllData}
//               disabled={fetchLoading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
//               Refresh Data
//             </Button>
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={() => setShowRecent(!showRecent)}
//             >
//               {showRecent ? 'Hide Recent' : 'Show Recent Sales'}
//             </Button>
//           </div>
//         }
//       />

//       {/* Recent Sales Section */}
//       {showRecent && recentSales.length > 0 && (
//         <motion.div 
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <Card>
//             <CardContent className="p-4">
//               <h3 className="text-sm font-medium mb-3">Recent Sales</h3>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {recentSales.map((sale: any) => (
//                   <div key={sale._id} className="text-sm p-3 bg-muted rounded flex flex-wrap gap-2 justify-between items-center">
//                     <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">
//                       {sale.saleId}
//                     </span>
//                     <span className="font-medium">
//                       {sale.vehicleId?.name} {sale.vehicleId?.model}
//                     </span>
//                     <span className="text-muted-foreground">
//                       {sale.customerId?.name}
//                     </span>
//                     <span className="font-mono">
//                       {formatINR(parseFloat(sale.sellingPrice))}
//                     </span>
//                     <span className="text-xs text-muted-foreground">
//                       {new Date(sale.saleDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}

//       {/* Loading State */}
//       {fetchLoading && (
//         <div className="flex justify-center items-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <span className="ml-2 text-muted-foreground">Loading data...</span>
//         </div>
//       )}

//       {/* Main Form - ALL ORIGINAL LAYOUT PRESERVED */}
//       {!fetchLoading && (
//         <div className="grid lg:grid-cols-5 gap-6">
//           <div className="lg:col-span-3 space-y-5">
//             {/* Sale Details Card */}
//             <div className="bg-card border border-border rounded-lg p-5 space-y-4">
//               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
//                 <Car className="h-3 w-3" />
//                 Sale Details
//               </h3>
              
//               <div className="grid sm:grid-cols-2 gap-4">
//                 {/* Vehicle Selection with Plus Button */}
//                 <div>
//                   <Label className="text-xs">Vehicle *</Label>
//                   <div className="flex gap-2">
//                     <Select value={vehicleId} onValueChange={setVehicleId} disabled={loading}>
//                       <SelectTrigger className="flex-1">
//                         <SelectValue placeholder="Select vehicle" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availableVehicles.length === 0 ? (
//                           <SelectItem value="no-vehicles" disabled>No vehicles available</SelectItem>
//                         ) : (
//                           availableVehicles.map(v => (
//                             <SelectItem key={v._id} value={v._id}>
//                               {v.name} {v.model} — {formatINR(parseFloat(v.price))}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="icon"
//                       onClick={() => setQuickVehicleOpen(true)}
//                       title="Add new vehicle"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   {availableVehicles.length === 0 && (
//                     <p className="text-xs text-amber-600 mt-1">No vehicles available for sale</p>
//                   )}
//                 </div>
                
//                 {/* Customer Selection with Plus Button */}
//                 <div>
//                   <Label className="text-xs">Customer *</Label>
//                   <div className="flex gap-2">
//                     <Select value={customerId} onValueChange={setCustomerId} disabled={loading}>
//                       <SelectTrigger className="flex-1">
//                         <SelectValue placeholder="Select customer" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {customers.length === 0 ? (
//                           <SelectItem value="no-customers" disabled>No customers found</SelectItem>
//                         ) : (
//                           customers.map(c => (
//                             <SelectItem key={c._id} value={c._id}>
//                               {c.name} - {c.phone}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="icon"
//                       onClick={() => setQuickCustomerOpen(true)}
//                       title="Add new customer"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 {/* Agent Selection with Plus Button */}
//                 <div>
//                   <Label className="text-xs">Assigned Agent (Optional)</Label>
//                   <div className="flex gap-2">
//                     <Select value={agentId} onValueChange={setAgentId} disabled={loading}>
//                       <SelectTrigger className="flex-1">
//                         <SelectValue placeholder="Select agent" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">None</SelectItem>
//                         {agents.map(a => (
//                           <SelectItem key={a._id} value={a._id}>
//                             {a.name} {a.employmentDetails?.employeeId ? `(${a.employmentDetails.employeeId})` : ''}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="icon"
//                       onClick={() => setQuickAgentOpen(true)}
//                       title="Add new agent"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
                
//                 <div>
//                   <Label className="text-xs">Payment Type</Label>
//                   <Select 
//                     value={paymentType} 
//                     onValueChange={v => setPaymentType(v as 'Full Payment' | 'Finance')}
//                     disabled={loading}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Full Payment">Full Payment</SelectItem>
//                       <SelectItem value="Finance">Finance</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             {/* Finance Details Card - PRESERVED FULLY */}
//             {paymentType === 'Finance' && (
//               <motion.div 
//                 initial={{ opacity: 0, y: 4 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 className="bg-card border border-border rounded-lg p-5 space-y-4"
//               >
//                 <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
//                   <CreditCard className="h-3 w-3" />
//                   Finance Details
//                 </h3>
                
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-xs">Down Payment (₹)</Label>
//                     <Input 
//                       type="number" 
//                       value={downPayment || ''} 
//                       onChange={e => setDownPayment(Number(e.target.value))} 
//                       className="font-mono"
//                       min="0"
//                       max={sellingPrice - 1}
//                       disabled={loading}
//                       placeholder="Enter down payment"
//                     />
//                   </div>
                  
//                   <div>
//                     <Label className="text-xs">Payment Mode</Label>
//                     <Select 
//                       value={paymentMode} 
//                       onValueChange={v => setPaymentMode(v as 'Cash' | 'Online')}
//                       disabled={loading}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Cash">Cash</SelectItem>
//                         <SelectItem value="Online">Online</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   <div>
//                     <Label className="text-xs">Documentation Charges (₹)</Label>
//                     <Input 
//                       type="number" 
//                       value={docCharges || ''} 
//                       onChange={e => setDocCharges(Number(e.target.value))} 
//                       className="font-mono"
//                       min="0"
//                       disabled={loading}
//                       placeholder="Documentation charges"
//                     />
//                   </div>
                  
//                   <div>
//                     <Label className="text-xs">RTO Charges (₹)</Label>
//                     <Input 
//                       type="number" 
//                       value={rtoCharges || ''} 
//                       onChange={e => setRtoCharges(Number(e.target.value))} 
//                       className="font-mono"
//                       min="0"
//                       disabled={loading}
//                       placeholder="RTO charges"
//                     />
//                   </div>

//                   <div>
//                     <Label className="text-xs">Additional Charge 1 (₹)</Label>
//                     <Input 
//                       type="number" 
//                       value={charges1 || ''} 
//                       onChange={e => setCharges1(Number(e.target.value))} 
//                       className="font-mono"
//                       min="0"
//                       disabled={loading}
//                       placeholder="Additional charge 1"
//                     />
//                   </div>
                  
//                   <div>
//                     <Label className="text-xs">Additional Charge 2 (₹)</Label>
//                     <Input 
//                       type="number" 
//                       value={charges2 || ''} 
//                       onChange={e => setCharges2(Number(e.target.value))} 
//                       className="font-mono"
//                       min="0"
//                       disabled={loading}
//                       placeholder="Additional charge 2"
//                     />
//                   </div>
                  
//                   <div>
//                     <Label className="text-xs">Interest Rate (%)</Label>
//                     <Input 
//                       type="number" 
//                       value={interestRate || ''} 
//                       onChange={e => setInterestRate(Number(e.target.value))} 
//                       className="font-mono"
//                       min="0"
//                       max="100"
//                       step="0.1"
//                       disabled={loading}
//                       placeholder="Interest rate"
//                     />
//                   </div>
                  
//                   <div>
//                     <Label className="text-xs">Tenure (months)</Label>
//                     <Input 
//                       type="number" 
//                       value={tenure || ''} 
//                       onChange={e => setTenure(Number(e.target.value))} 
//                       className="font-mono"
//                       min="1"
//                       max="120"
//                       disabled={loading}
//                       placeholder="Loan tenure"
//                     />
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             <Button 
//               onClick={createSale} 
//               className="w-full sm:w-auto"
//               disabled={loading || !vehicleId || !customerId || availableVehicles.length === 0}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 'Finalize Sale'
//               )}
//             </Button>
//           </div>

//           {/* Summary Card - PRESERVED FULLY */}
//           <div className="lg:col-span-2">
//             <div className="bg-muted/50 border border-border rounded-lg p-6 sticky top-8">
//               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1">
//                 <FileText className="h-3 w-3" />
//                 Finance Summary
//               </h3>
              
//               {selectedVehicle ? (
//                 <>
//                   {paymentType === 'Finance' && financeAmount > 0 ? (
//                     <>
//                       <div className="text-3xl font-mono font-bold tabular-nums text-cobalt">
//                         {formatINR(emi)}
//                       </div>
//                       <p className="text-xs text-muted-foreground mt-1">Monthly Installment</p>
                      
//                       <div className="mt-6 space-y-3 border-t border-border pt-4">
//                         {[
//                           ['Vehicle Price', sellingPrice],
//                           ['Down Payment', downPayment],
//                           ['Finance Amount', financeAmount],
//                           ['Total Interest', totalInterest],
//                           ['Documentation Charges', docCharges],
//                           ['RTO Charges', rtoCharges],
//                           ['Additional Charge 1', charges1],
//                           ['Additional Charge 2', charges2],
//                           ['Total Additional Charges', totalAdditionalCharges],
//                           ['Total Payable', totalPayable],
//                         ].map(([label, val]) => (
//                           <div key={String(label)} className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">{label}</span>
//                             <span className="font-mono tabular-nums">{formatINR(val as number)}</span>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="mt-4 p-3 bg-primary/10 rounded-lg">
//                         <p className="text-xs text-muted-foreground">Loan Summary</p>
//                         <p className="text-sm mt-1">
//                           {tenure} months at {interestRate}% interest
//                         </p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           {tenure} EMIs of {formatINR(emi)} each
//                         </p>
//                       </div>
//                     </>
//                   ) : (
//                     <div>
//                       <div className="text-3xl font-mono font-bold tabular-nums">
//                         {formatINR(sellingPrice)}
//                       </div>
//                       <p className="text-xs text-muted-foreground mt-1">Full Payment</p>
                      
//                       <div className="mt-6 space-y-3 border-t border-border pt-4">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Vehicle Price</span>
//                           <span className="font-mono tabular-nums">{formatINR(sellingPrice)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Documentation Charges</span>
//                           <span className="font-mono tabular-nums">{formatINR(docCharges)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">RTO Charges</span>
//                           <span className="font-mono tabular-nums">{formatINR(rtoCharges)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm font-bold pt-2 border-t">
//                           <span>Total Payable</span>
//                           <span className="font-mono">{formatINR(sellingPrice + docCharges + rtoCharges)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <Car className="h-12 w-12 mx-auto mb-3 opacity-20" />
//                   <p className="text-sm">Select a vehicle to see summary</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Quick Create Customer Dialog */}
//       <Dialog open={quickCustomerOpen} onOpenChange={setQuickCustomerOpen}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Add New Customer
//             </DialogTitle>
//             <DialogDescription>Fill in the customer details below.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 mt-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div><Label>Full Name *</Label><Input value={quickCustomerForm.name} onChange={e => setQuickCustomerForm(f => ({ ...f, name: e.target.value }))} /></div>
//               <div><Label>Phone Number *</Label><Input value={quickCustomerForm.phone} onChange={e => setQuickCustomerForm(f => ({ ...f, phone: e.target.value }))} /></div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div><Label>Aadhar Number *</Label><Input value={quickCustomerForm.aadharNo} onChange={e => setQuickCustomerForm(f => ({ ...f, aadharNo: e.target.value }))} maxLength={12} /></div>
//               <div><Label>PAN Number *</Label><Input value={quickCustomerForm.panNo} onChange={e => setQuickCustomerForm(f => ({ ...f, panNo: e.target.value.toUpperCase() }))} maxLength={10} /></div>
//             </div>
//             <div><Label>Email</Label><Input type="email" value={quickCustomerForm.email} onChange={e => setQuickCustomerForm(f => ({ ...f, email: e.target.value }))} /></div>
//             <div className="border-t pt-4">
//               <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address Details</h4>
//               <div><Label>Street Address *</Label><Textarea value={quickCustomerForm.address.street} onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} /></div>
//               <div className="grid grid-cols-2 gap-4 mt-3">
//                 <div><Label>City *</Label><Input value={quickCustomerForm.address.city} onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} /></div>
//                 <div><Label>State *</Label><Input value={quickCustomerForm.address.state} onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} /></div>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mt-3">
//                 <div><Label>Pincode *</Label><Input value={quickCustomerForm.address.pincode} onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} maxLength={6} /></div>
//                 <div><Label>Country</Label><Input value={quickCustomerForm.address.country} onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} /></div>
//               </div>
//             </div>
//           </div>
//           <DialogFooter className="mt-6">
//             <Button variant="outline" onClick={() => setQuickCustomerOpen(false)}>Cancel</Button>
//             <Button onClick={createQuickCustomer} disabled={quickCreateLoading}>
//               {quickCreateLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//               Create Customer
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Quick Create Agent Dialog */}
//       <Dialog open={quickAgentOpen} onOpenChange={setQuickAgentOpen}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Briefcase className="h-5 w-5" />
//               Add New Agent
//             </DialogTitle>
//             <DialogDescription>Fill in the agent details below.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 mt-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div><Label>Full Name *</Label><Input value={quickAgentForm.name} onChange={e => setQuickAgentForm(f => ({ ...f, name: e.target.value }))} /></div>
//               <div><Label>Age *</Label><Input type="number" value={quickAgentForm.age} onChange={e => setQuickAgentForm(f => ({ ...f, age: e.target.value }))} /></div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div><Label>Aadhar Number *</Label><Input value={quickAgentForm.aadharNo} onChange={e => setQuickAgentForm(f => ({ ...f, aadharNo: e.target.value }))} maxLength={12} /></div>
//               <div><Label>Phone Number *</Label><Input value={quickAgentForm.contactDetails.phone} onChange={e => setQuickAgentForm(f => ({ ...f, contactDetails: { ...f.contactDetails, phone: e.target.value } }))} /></div>
//             </div>
//             <div><Label>Designation</Label><Input value={quickAgentForm.employmentDetails.designation} onChange={e => setQuickAgentForm(f => ({ ...f, employmentDetails: { ...f.employmentDetails, designation: e.target.value } }))} /></div>
//             <div className="border-t pt-4">
//               <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address Details</h4>
//               <div><Label>Street Address *</Label><Textarea value={quickAgentForm.address.street} onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} /></div>
//               <div className="grid grid-cols-2 gap-4 mt-3">
//                 <div><Label>City *</Label><Input value={quickAgentForm.address.city} onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} /></div>
//                 <div><Label>State *</Label><Input value={quickAgentForm.address.state} onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} /></div>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mt-3">
//                 <div><Label>Pincode *</Label><Input value={quickAgentForm.address.pincode} onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} maxLength={6} /></div>
//                 <div><Label>Country</Label><Input value={quickAgentForm.address.country} onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} /></div>
//               </div>
//             </div>
//           </div>
//           <DialogFooter className="mt-6">
//             <Button variant="outline" onClick={() => setQuickAgentOpen(false)}>Cancel</Button>
//             <Button onClick={createQuickAgent} disabled={quickCreateLoading}>
//               {quickCreateLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//               Create Agent
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Quick Create Vehicle Dialog */}
//       <Dialog open={quickVehicleOpen} onOpenChange={setQuickVehicleOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Car className="h-5 w-5" />
//               Add New Vehicle
//             </DialogTitle>
//             <DialogDescription>Fill in the vehicle details below.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 mt-4">
//             <div><Label>Vehicle Type</Label><Select value={quickVehicleForm.type} onValueChange={(v) => setQuickVehicleForm(f => ({ ...f, type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Car">Car</SelectItem><SelectItem value="Bike">Bike</SelectItem></SelectContent></Select></div>
//             <div><Label>Vehicle Name *</Label><Input value={quickVehicleForm.name} onChange={e => setQuickVehicleForm(f => ({ ...f, name: e.target.value }))} /></div>
//             <div><Label>Model *</Label><Input value={quickVehicleForm.model} onChange={e => setQuickVehicleForm(f => ({ ...f, model: e.target.value }))} /></div>
//             <div><Label>Price (₹) *</Label><Input type="number" value={quickVehicleForm.price} onChange={e => setQuickVehicleForm(f => ({ ...f, price: e.target.value }))} /></div>
//             <div><Label>Description</Label><Textarea value={quickVehicleForm.description} onChange={e => setQuickVehicleForm(f => ({ ...f, description: e.target.value }))} /></div>
//           </div>
//           <DialogFooter className="mt-6">
//             <Button variant="outline" onClick={() => setQuickVehicleOpen(false)}>Cancel</Button>
//             <Button onClick={createQuickVehicle} disabled={quickCreateLoading}>
//               {quickCreateLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//               Create Vehicle
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2, Car, User, CreditCard, FileText, RefreshCw, Plus, MapPin, Briefcase, Phone, Mail, CheckCircle, Landmark, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// Types based on actual API responses
interface Vehicle {
  _id: string;
  name: string;
  model: string;
  price: string;
  vehicleType: 'bike' | 'car';
  status: 'available' | 'sold out';
  images?: string[];
}

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  aadharNo: string;
  isActive: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface Agent {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  isActive: boolean;
  employmentDetails?: {
    employeeId?: string;
    department?: string;
  };
}

interface SaleResponse {
  success: boolean;
  data: {
    _id: string;
    saleId: string;
    vehicleId: Vehicle;
    customerId: Customer;
    agentId?: Agent;
    sellingPrice: string;
    paymentType: 'Full Payment' | 'Finance';
    paymentMode?: 'Cash' | 'Online';
    downPayment?: string;
    financeAmount?: string;
    interestRate?: string;
    tenure?: number;
    emi?: string;
    charges1?: string;
    charges2?: string;
    documentationCharges: string;
    rtoCharges: string;
    status: string;
    saleDate: string;
  };
}

// Quick Create Form Data Interfaces
interface QuickCustomerForm {
  name: string;
  phone: string;
  aadharNo: string;
  panNo: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  email: string;
  alternatePhone: string;
}

interface QuickAgentForm {
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
  };
}

interface QuickVehicleForm {
  type: string;
  name: string;
  model: string;
  price: string;
  description: string;
}

// EMI Calculator function
const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return isNaN(emi) ? 0 : Math.round(emi);
};

// Format INR function
const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR'
  }).format(amount).replace('₹', '₹ ');
};

export default function SellingModule() {
  // State for API data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [quickCreateLoading, setQuickCreateLoading] = useState(false);
  
  // Quick Create Dialogs state
  const [quickCustomerOpen, setQuickCustomerOpen] = useState(false);
  const [quickAgentOpen, setQuickAgentOpen] = useState(false);
  const [quickVehicleOpen, setQuickVehicleOpen] = useState(false);
  
  // Email sent tracking for quick create
  const [quickCustomerEmailSent, setQuickCustomerEmailSent] = useState<string | null>(null);
  const [quickAgentEmailSent, setQuickAgentEmailSent] = useState<string | null>(null);
  
  // Quick Create form data
  const [quickCustomerForm, setQuickCustomerForm] = useState<QuickCustomerForm>({
    name: '',
    phone: '',
    aadharNo: '',
    panNo: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    email: '',
    alternatePhone: ''
  });
  
  const [quickAgentForm, setQuickAgentForm] = useState<QuickAgentForm>({
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
      joinDate: new Date().toISOString().split('T')[0]
    }
  });
  
  const [quickVehicleForm, setQuickVehicleForm] = useState<QuickVehicleForm>({
    type: 'Car',
    name: '',
    model: '',
    price: '',
    description: ''
  });
  
  // Form state - ALL ORIGINAL FIELDS PRESERVED
  const [vehicleId, setVehicleId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [agentId, setAgentId] = useState('none');
  const [paymentType, setPaymentType] = useState<'Full Payment' | 'Finance'>('Finance');
  const [downPayment, setDownPayment] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online'>('Cash');
  const [docCharges, setDocCharges] = useState(5000);
  const [rtoCharges, setRtoCharges] = useState(25000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(36);
  const [charges1, setCharges1] = useState(0);
  const [charges2, setCharges2] = useState(0);
  
  // UI state
  const [showRecent, setShowRecent] = useState(false);

  // Fetch all required data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data from APIs
  const fetchAllData = async () => {
    setFetchLoading(true);
    try {
      await Promise.all([
        fetchVehicles(),
        fetchCustomers(),
        fetchAgents(),
        fetchRecentSales()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load some data');
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`);
      const availableVehicles = response.data.data.filter(
        (v: any) => v.status === 'available'
      );
      setVehicles(availableVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    }
  };

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/customers?isActive=true`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      let customersData = response.data?.data || response.data;
      if (customersData?.data) customersData = customersData.data;
      if (!Array.isArray(customersData)) customersData = [];
      
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/agents?isActive=true`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      let agentsData = response.data?.data || response.data;
      if (agentsData?.data) agentsData = agentsData.data;
      if (!Array.isArray(agentsData)) agentsData = [];
      
      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Fetch recent sales
  const fetchRecentSales = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/sales?limit=5&sortBy=saleDate&sortOrder=desc`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setRecentSales(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent sales:', error);
    }
  };

  // Quick Create Customer with Email
  const createQuickCustomer = async () => {
    if (!quickCustomerForm.name || !quickCustomerForm.phone || !quickCustomerForm.aadharNo || !quickCustomerForm.panNo) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!quickCustomerForm.email) {
      toast.error('Email is required - login credentials will be sent to this email');
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(quickCustomerForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setQuickCreateLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/customers`, {
        name: quickCustomerForm.name,
        phone: quickCustomerForm.phone,
        aadharNo: quickCustomerForm.aadharNo,
        panNo: quickCustomerForm.panNo.toUpperCase(),
        address: quickCustomerForm.address,
        email: quickCustomerForm.email,
        alternatePhone: quickCustomerForm.alternatePhone || undefined
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const newCustomer = response.data.data || response.data;
      setCustomers(prev => [...prev, newCustomer]);
      setCustomerId(newCustomer._id);
      
      // Show email sent success message
      const emailSentFlag = response.data.emailSent || response.data.data?.emailSent;
      if (emailSentFlag) {
        setQuickCustomerEmailSent(quickCustomerForm.email);
        toast.success(
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Customer Created Successfully!</p>
              <p className="text-sm mt-0.5">Login credentials sent to <strong>{quickCustomerForm.email}</strong></p>
            </div>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success('Customer created successfully');
      }
      
      // Auto close after 2 seconds if email sent
      setTimeout(() => {
        setQuickCustomerOpen(false);
        setQuickCustomerEmailSent(null);
        resetQuickCustomerForm();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating customer:', error);
      toast.error(error.response?.data?.message || 'Failed to create customer');
    } finally {
      setQuickCreateLoading(false);
    }
  };

  // Quick Create Agent with Email
  const createQuickAgent = async () => {
    if (!quickAgentForm.name || !quickAgentForm.age || !quickAgentForm.aadharNo || !quickAgentForm.contactDetails.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!quickAgentForm.contactDetails.email) {
      toast.error('Email is required - login credentials will be sent to this email');
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(quickAgentForm.contactDetails.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setQuickCreateLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/agents`, {
        name: quickAgentForm.name,
        age: parseInt(quickAgentForm.age),
        aadharNo: quickAgentForm.aadharNo,
        contactDetails: quickAgentForm.contactDetails,
        address: quickAgentForm.address,
        employmentDetails: quickAgentForm.employmentDetails
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const newAgent = response.data.data || response.data;
      setAgents(prev => [...prev, newAgent]);
      setAgentId(newAgent._id);
      
      // Show email sent success message
      const emailSentFlag = response.data.emailSent || response.data.data?.emailSent;
      if (emailSentFlag) {
        setQuickAgentEmailSent(quickAgentForm.contactDetails.email);
        toast.success(
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Agent Created Successfully!</p>
              <p className="text-sm mt-0.5">Login credentials sent to <strong>{quickAgentForm.contactDetails.email}</strong></p>
            </div>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success('Agent created successfully');
      }
      
      // Auto close after 2 seconds if email sent
      setTimeout(() => {
        setQuickAgentOpen(false);
        setQuickAgentEmailSent(null);
        resetQuickAgentForm();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating agent:', error);
      toast.error(error.response?.data?.message || 'Failed to create agent');
    } finally {
      setQuickCreateLoading(false);
    }
  };

  // Quick Create Vehicle
  const createQuickVehicle = async () => {
    if (!quickVehicleForm.name || !quickVehicleForm.model || !quickVehicleForm.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setQuickCreateLoading(true);
      const formData = new FormData();
      formData.append('vehicleType', quickVehicleForm.type.toLowerCase());
      formData.append('name', quickVehicleForm.name);
      formData.append('model', quickVehicleForm.model);
      formData.append('price', quickVehicleForm.price);
      formData.append('status', 'available');
      if (quickVehicleForm.description) {
        formData.append('description', quickVehicleForm.description);
      }

      const response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newVehicle = response.data.data || response.data;
      setVehicles(prev => [...prev, newVehicle]);
      setVehicleId(newVehicle._id);
      toast.success('Vehicle created successfully');
      setQuickVehicleOpen(false);
      resetQuickVehicleForm();
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to create vehicle');
    } finally {
      setQuickCreateLoading(false);
    }
  };

  const resetQuickCustomerForm = () => {
    setQuickCustomerForm({
      name: '',
      phone: '',
      aadharNo: '',
      panNo: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      email: '',
      alternatePhone: ''
    });
    setQuickCustomerEmailSent(null);
  };

  const resetQuickAgentForm = () => {
    setQuickAgentForm({
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
        joinDate: new Date().toISOString().split('T')[0]
      }
    });
    setQuickAgentEmailSent(null);
  };

  const resetQuickVehicleForm = () => {
    setQuickVehicleForm({
      type: 'Car',
      name: '',
      model: '',
      price: '',
      description: ''
    });
  };

  // Get selected vehicle details
  const selectedVehicle = vehicles.find(v => v._id === vehicleId);
  const sellingPrice = selectedVehicle ? parseFloat(selectedVehicle.price) : 0;
  const financeAmount = sellingPrice - downPayment;
  
  // Total additional charges including new charges
  const totalAdditionalCharges = docCharges + rtoCharges + charges1 + charges2;

  // Calculate EMI
  const emi = useMemo(() => {
    if (paymentType !== 'Finance' || financeAmount <= 0 || tenure <= 0 || interestRate <= 0) return 0;
    return calculateEMI(financeAmount, interestRate, tenure);
  }, [financeAmount, interestRate, tenure, paymentType]);

  // Calculate totals
  const totalInterest = emi * tenure - financeAmount;
  const totalPayable = financeAmount + totalInterest + totalAdditionalCharges;

  // Validate form
  const validateForm = (): boolean => {
    if (!vehicleId) {
      toast.error('Please select a vehicle');
      return false;
    }
    
    if (!customerId) {
      toast.error('Please select a customer');
      return false;
    }
    
    if (paymentType === 'Finance') {
      if (downPayment >= sellingPrice) {
        toast.error('Down payment must be less than vehicle price');
        return false;
      }
      
      if (downPayment < 0) {
        toast.error('Down payment cannot be negative');
        return false;
      }
      
      if (tenure <= 0) {
        toast.error('Please enter valid tenure');
        return false;
      }
      
      if (interestRate <= 0) {
        toast.error('Please enter valid interest rate');
        return false;
      }
      
      if (charges1 < 0) {
        toast.error('Charge 1 cannot be negative');
        return false;
      }
      
      if (charges2 < 0) {
        toast.error('Charge 2 cannot be negative');
        return false;
      }
    }
    
    return true;
  };

  // Create sale
  const createSale = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const saleData = {
        vehicleId: vehicleId,
        customerId: customerId,
        agentId: agentId !== 'none' ? agentId : undefined,
        sellingPrice: sellingPrice.toString(),
        paymentType: paymentType,
        paymentMode: paymentType === 'Finance' ? paymentMode : undefined,
        downPayment: paymentType === 'Finance' ? downPayment.toString() : undefined,
        financeAmount: paymentType === 'Finance' ? financeAmount.toString() : undefined,
        interestRate: paymentType === 'Finance' ? interestRate.toString() : undefined,
        tenure: paymentType === 'Finance' ? tenure : undefined,
        emi: paymentType === 'Finance' ? emi.toString() : undefined,
        charges1: paymentType === 'Finance' ? charges1.toString() : '0',
        charges2: paymentType === 'Finance' ? charges2.toString() : '0',
        documentationCharges: docCharges.toString(),
        rtoCharges: rtoCharges.toString(),
        saleDate: new Date().toISOString()
      };

      const response = await axios.post<SaleResponse>(`${API_BASE_URL}/sales`, saleData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        toast.success(`Sale created successfully! Sale ID: ${response.data.data.saleId}`);
        
        await Promise.all([
          fetchVehicles(),
          fetchRecentSales()
        ]);
        
        // Reset form
        setVehicleId('');
        setCustomerId('');
        setAgentId('none');
        setDownPayment(0);
        setDocCharges(5000);
        setRtoCharges(25000);
        setInterestRate(12);
        setTenure(36);
        setCharges1(0);
        setCharges2(0);
      }
    } catch (error: any) {
      console.error('Error creating sale:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create sale';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const availableVehicles = vehicles.filter(v => v.status === 'available');

  return (
    <div className="animate-fade-in p-6">
      <PageHeader 
        title="New Sale" 
        description="Create a vehicle sale and generate loan schedule"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAllData}
              disabled={fetchLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRecent(!showRecent)}
            >
              {showRecent ? 'Hide Recent' : 'Show Recent Sales'}
            </Button>
          </div>
        }
      />

      {/* Recent Sales Section */}
      {showRecent && recentSales.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Recent Sales</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentSales.map((sale: any) => (
                  <div key={sale._id} className="text-sm p-3 bg-muted rounded flex flex-wrap gap-2 justify-between items-center">
                    <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                      {sale.saleId}
                    </span>
                    <span className="font-medium">
                      {sale.vehicleId?.name} {sale.vehicleId?.model}
                    </span>
                    <span className="text-muted-foreground">
                      {sale.customerId?.name}
                    </span>
                    <span className="font-mono">
                      {formatINR(parseFloat(sale.sellingPrice))}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {fetchLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading data...</span>
        </div>
      )}

      {/* Main Form - ALL ORIGINAL LAYOUT PRESERVED */}
      {!fetchLoading && (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            {/* Sale Details Card */}
            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Car className="h-3 w-3" />
                Sale Details
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Vehicle Selection with Plus Button */}
                <div>
                  <Label className="text-xs">Vehicle *</Label>
                  <div className="flex gap-2">
                    <Select value={vehicleId} onValueChange={setVehicleId} disabled={loading}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.length === 0 ? (
                          <SelectItem value="no-vehicles" disabled>No vehicles available</SelectItem>
                        ) : (
                          availableVehicles.map(v => (
                            <SelectItem key={v._id} value={v._id}>
                              {v.name} {v.model} — {formatINR(parseFloat(v.price))}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuickVehicleOpen(true)}
                      title="Add new vehicle"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {availableVehicles.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No vehicles available for sale</p>
                  )}
                </div>
                
                {/* Customer Selection with Plus Button */}
                <div>
                  <Label className="text-xs">Customer *</Label>
                  <div className="flex gap-2">
                    <Select value={customerId} onValueChange={setCustomerId} disabled={loading}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.length === 0 ? (
                          <SelectItem value="no-customers" disabled>No customers found</SelectItem>
                        ) : (
                          customers.map(c => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name} - {c.phone}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuickCustomerOpen(true)}
                      title="Add new customer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Agent Selection with Plus Button */}
                <div>
                  <Label className="text-xs">Assigned Agent (Optional)</Label>
                  <div className="flex gap-2">
                    <Select value={agentId} onValueChange={setAgentId} disabled={loading}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {agents.map(a => (
                          <SelectItem key={a._id} value={a._id}>
                            {a.name} {a.employmentDetails?.employeeId ? `(${a.employmentDetails.employeeId})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuickAgentOpen(true)}
                      title="Add new agent"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Payment Type</Label>
                  <Select 
                    value={paymentType} 
                    onValueChange={v => setPaymentType(v as 'Full Payment' | 'Finance')}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Payment">Full Payment</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Finance Details Card - PRESERVED FULLY */}
            {paymentType === 'Finance' && (
              <motion.div 
                initial={{ opacity: 0, y: 4 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-card border border-border rounded-lg p-5 space-y-4"
              >
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Finance Details
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Down Payment (₹)</Label>
                    <Input 
                      type="number" 
                      value={downPayment || ''} 
                      onChange={e => setDownPayment(Number(e.target.value))} 
                      className="font-mono"
                      min="0"
                      max={sellingPrice - 1}
                      disabled={loading}
                      placeholder="Enter down payment"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Payment Mode</Label>
                    <Select 
                      value={paymentMode} 
                      onValueChange={v => setPaymentMode(v as 'Cash' | 'Online')}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Documentation Charges (₹)</Label>
                    <Input 
                      type="number" 
                      value={docCharges || ''} 
                      onChange={e => setDocCharges(Number(e.target.value))} 
                      className="font-mono"
                      min="0"
                      disabled={loading}
                      placeholder="Documentation charges"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">RTO Charges (₹)</Label>
                    <Input 
                      type="number" 
                      value={rtoCharges || ''} 
                      onChange={e => setRtoCharges(Number(e.target.value))} 
                      className="font-mono"
                      min="0"
                      disabled={loading}
                      placeholder="RTO charges"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Additional Charge 1 (₹)</Label>
                    <Input 
                      type="number" 
                      value={charges1 || ''} 
                      onChange={e => setCharges1(Number(e.target.value))} 
                      className="font-mono"
                      min="0"
                      disabled={loading}
                      placeholder="Additional charge 1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Additional Charge 2 (₹)</Label>
                    <Input 
                      type="number" 
                      value={charges2 || ''} 
                      onChange={e => setCharges2(Number(e.target.value))} 
                      className="font-mono"
                      min="0"
                      disabled={loading}
                      placeholder="Additional charge 2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Interest Rate (%)</Label>
                    <Input 
                      type="number" 
                      value={interestRate || ''} 
                      onChange={e => setInterestRate(Number(e.target.value))} 
                      className="font-mono"
                      min="0"
                      max="100"
                      step="0.1"
                      disabled={loading}
                      placeholder="Interest rate"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Tenure (months)</Label>
                    <Input 
                      type="number" 
                      value={tenure || ''} 
                      onChange={e => setTenure(Number(e.target.value))} 
                      className="font-mono"
                      min="1"
                      max="120"
                      disabled={loading}
                      placeholder="Loan tenure"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <Button 
              onClick={createSale} 
              className="w-full sm:w-auto"
              disabled={loading || !vehicleId || !customerId || availableVehicles.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Finalize Sale'
              )}
            </Button>
          </div>

          {/* Summary Card - PRESERVED FULLY */}
          <div className="lg:col-span-2">
            <div className="bg-muted/50 border border-border rounded-lg p-6 sticky top-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Finance Summary
              </h3>
              
              {selectedVehicle ? (
                <>
                  {paymentType === 'Finance' && financeAmount > 0 ? (
                    <>
                      <div className="text-3xl font-mono font-bold tabular-nums text-cobalt">
                        {formatINR(emi)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Monthly Installment</p>
                      
                      <div className="mt-6 space-y-3 border-t border-border pt-4">
                        {[
                          ['Vehicle Price', sellingPrice],
                          ['Down Payment', downPayment],
                          ['Finance Amount', financeAmount],
                          ['Total Interest', totalInterest],
                          ['Documentation Charges', docCharges],
                          ['RTO Charges', rtoCharges],
                          ['Additional Charge 1', charges1],
                          ['Additional Charge 2', charges2],
                          ['Total Additional Charges', totalAdditionalCharges],
                          ['Total Payable', totalPayable],
                        ].map(([label, val]) => (
                          <div key={String(label)} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-mono tabular-nums">{formatINR(val as number)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-xs text-muted-foreground">Loan Summary</p>
                        <p className="text-sm mt-1">
                          {tenure} months at {interestRate}% interest
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tenure} EMIs of {formatINR(emi)} each
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="text-3xl font-mono font-bold tabular-nums">
                        {formatINR(sellingPrice)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Full Payment</p>
                      
                      <div className="mt-6 space-y-3 border-t border-border pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vehicle Price</span>
                          <span className="font-mono tabular-nums">{formatINR(sellingPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Documentation Charges</span>
                          <span className="font-mono tabular-nums">{formatINR(docCharges)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">RTO Charges</span>
                          <span className="font-mono tabular-nums">{formatINR(rtoCharges)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-2 border-t">
                          <span>Total Payable</span>
                          <span className="font-mono">{formatINR(sellingPrice + docCharges + rtoCharges)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Select a vehicle to see summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Create Customer Dialog - WITH EMAIL INTEGRATION */}
      <Dialog open={quickCustomerOpen} onOpenChange={(open) => {
        if (!open) {
          resetQuickCustomerForm();
          setQuickCustomerOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Add New Customer
            </DialogTitle>
            <DialogDescription>Fill in the customer details below. Login credentials will be sent to their email.</DialogDescription>
          </DialogHeader>
          
          {/* Email Success Message */}
          {quickCustomerEmailSent && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">Credentials Sent!</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Login credentials have been sent to <strong>{quickCustomerEmailSent}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickCustomerForm.name} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="Enter full name"
                  disabled={quickCreateLoading}
                />
              </div>
              <div>
                <Label>Phone Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickCustomerForm.phone} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, phone: e.target.value }))} 
                  placeholder="+91 9876543210"
                  className="font-mono"
                  disabled={quickCreateLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aadhar Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickCustomerForm.aadharNo} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, aadharNo: e.target.value }))} 
                  placeholder="12 digits"
                  className="font-mono"
                  maxLength={12}
                  disabled={quickCreateLoading}
                />
              </div>
              <div>
                <Label>PAN Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickCustomerForm.panNo} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, panNo: e.target.value.toUpperCase() }))} 
                  placeholder="ABCDE1234F"
                  className="font-mono uppercase"
                  maxLength={10}
                  disabled={quickCreateLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="email"
                  value={quickCustomerForm.email} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, email: e.target.value }))} 
                  placeholder="customer@example.com"
                  disabled={quickCreateLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Login credentials will be sent to this email
                </p>
              </div>
              <div>
                <Label>Alternate Phone</Label>
                <Input 
                  value={quickCustomerForm.alternatePhone} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, alternatePhone: e.target.value }))} 
                  placeholder="+91 9876543211"
                  className="font-mono"
                  disabled={quickCreateLoading}
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Details
              </h4>
              <div>
                <Label>Street Address <span className="text-red-500">*</span></Label>
                <Textarea 
                  value={quickCustomerForm.address.street} 
                  onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} 
                  placeholder="Enter street address"
                  disabled={quickCreateLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input 
                    value={quickCustomerForm.address.city} 
                    onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} 
                    placeholder="Enter city"
                    disabled={quickCreateLoading}
                  />
                </div>
                <div>
                  <Label>State <span className="text-red-500">*</span></Label>
                  <Input 
                    value={quickCustomerForm.address.state} 
                    onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} 
                    placeholder="Enter state"
                    disabled={quickCreateLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label>Pincode <span className="text-red-500">*</span></Label>
                  <Input 
                    value={quickCustomerForm.address.pincode} 
                    onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} 
                    placeholder="6 digits"
                    className="font-mono"
                    maxLength={6}
                    disabled={quickCreateLoading}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input 
                    value={quickCustomerForm.address.country} 
                    onChange={e => setQuickCustomerForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} 
                    placeholder="India"
                    disabled={quickCreateLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setQuickCustomerOpen(false)} disabled={quickCreateLoading}>
              Cancel
            </Button>
            <Button onClick={createQuickCustomer} disabled={quickCreateLoading}>
              {quickCreateLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Customer & Send Credentials'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Create Agent Dialog - WITH EMAIL INTEGRATION */}
      <Dialog open={quickAgentOpen} onOpenChange={(open) => {
        if (!open) {
          resetQuickAgentForm();
          setQuickAgentOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Add New Agent
            </DialogTitle>
            <DialogDescription>Fill in the agent details below. Login credentials will be sent to their email.</DialogDescription>
          </DialogHeader>
          
          {/* Email Success Message */}
          {quickAgentEmailSent && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">Credentials Sent!</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Login credentials have been sent to <strong>{quickAgentEmailSent}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickAgentForm.name} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="Enter full name"
                  disabled={quickCreateLoading}
                />
              </div>
              <div>
                <Label>Age <span className="text-red-500">*</span></Label>
                <Input 
                  type="number" 
                  value={quickAgentForm.age} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, age: e.target.value }))} 
                  placeholder="25"
                  className="font-mono"
                  min="18"
                  max="100"
                  disabled={quickCreateLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aadhar Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickAgentForm.aadharNo} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, aadharNo: e.target.value }))} 
                  placeholder="12 digits"
                  className="font-mono"
                  maxLength={12}
                  disabled={quickCreateLoading}
                />
              </div>
              <div>
                <Label>Phone Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={quickAgentForm.contactDetails.phone} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, contactDetails: { ...f.contactDetails, phone: e.target.value } }))} 
                  placeholder="+91 9876543210"
                  className="font-mono"
                  disabled={quickCreateLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="email"
                  value={quickAgentForm.contactDetails.email} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, contactDetails: { ...f.contactDetails, email: e.target.value } }))} 
                  placeholder="agent@example.com"
                  disabled={quickCreateLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Login credentials will be sent to this email
                </p>
              </div>
              <div>
                <Label>Designation</Label>
                <Input 
                  value={quickAgentForm.employmentDetails.designation} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, employmentDetails: { ...f.employmentDetails, designation: e.target.value } }))} 
                  placeholder="Senior Agent"
                  disabled={quickCreateLoading}
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Details
              </h4>
              <div>
                <Label>Street Address <span className="text-red-500">*</span></Label>
                <Textarea 
                  value={quickAgentForm.address.street} 
                  onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} 
                  placeholder="Enter street address"
                  disabled={quickCreateLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input 
                    value={quickAgentForm.address.city} 
                    onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} 
                    placeholder="Enter city"
                    disabled={quickCreateLoading}
                  />
                </div>
                <div>
                  <Label>State <span className="text-red-500">*</span></Label>
                  <Input 
                    value={quickAgentForm.address.state} 
                    onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} 
                    placeholder="Enter state"
                    disabled={quickCreateLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label>Pincode <span className="text-red-500">*</span></Label>
                  <Input 
                    value={quickAgentForm.address.pincode} 
                    onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} 
                    placeholder="6 digits"
                    className="font-mono"
                    maxLength={6}
                    disabled={quickCreateLoading}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input 
                    value={quickAgentForm.address.country} 
                    onChange={e => setQuickAgentForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} 
                    placeholder="India"
                    disabled={quickCreateLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setQuickAgentOpen(false)} disabled={quickCreateLoading}>
              Cancel
            </Button>
            <Button onClick={createQuickAgent} disabled={quickCreateLoading}>
              {quickCreateLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Agent & Send Credentials'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Create Vehicle Dialog */}
      <Dialog open={quickVehicleOpen} onOpenChange={setQuickVehicleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Add New Vehicle
            </DialogTitle>
            <DialogDescription>Fill in the vehicle details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Vehicle Type</Label>
              <Select 
                value={quickVehicleForm.type} 
                onValueChange={(v) => setQuickVehicleForm(f => ({ ...f, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vehicle Name <span className="text-red-500">*</span></Label>
              <Input 
                value={quickVehicleForm.name} 
                onChange={e => setQuickVehicleForm(f => ({ ...f, name: e.target.value }))} 
                placeholder="e.g., Maruti Suzuki"
                disabled={quickCreateLoading}
              />
            </div>
            <div>
              <Label>Model <span className="text-red-500">*</span></Label>
              <Input 
                value={quickVehicleForm.model} 
                onChange={e => setQuickVehicleForm(f => ({ ...f, model: e.target.value }))} 
                placeholder="e.g., Swift"
                disabled={quickCreateLoading}
              />
            </div>
            <div>
              <Label>Price (₹) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                value={quickVehicleForm.price} 
                onChange={e => setQuickVehicleForm(f => ({ ...f, price: e.target.value }))} 
                placeholder="e.g., 800000"
                className="font-mono"
                disabled={quickCreateLoading}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                value={quickVehicleForm.description} 
                onChange={e => setQuickVehicleForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="Vehicle description..."
                disabled={quickCreateLoading}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setQuickVehicleOpen(false)} disabled={quickCreateLoading}>
              Cancel
            </Button>
            <Button onClick={createQuickVehicle} disabled={quickCreateLoading}>
              {quickCreateLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Vehicle'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

