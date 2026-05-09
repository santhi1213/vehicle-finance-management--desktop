// import { useState, useEffect, useMemo } from 'react';
// import { PageHeader } from '@/components/PageHeader';
// import { StatusBadge } from '@/components/StatusBadge';
// import { formatINR } from '@/lib/mock-data';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import {
//   Loader2,
//   RefreshCw,
//   CreditCard,
//   Bell,
//   CheckCircle2,
//   AlertCircle,
//   ChevronDown,
//   ChevronUp,
//   Filter,
//   Search,
//   Calendar
// } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { motion, AnimatePresence } from 'framer-motion';

// const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// // Types
// interface EMI {
//   _id: string;
//   emiId: string;
//   saleId: {
//     _id: string;
//     saleId: string;
//     vehicleId: {
//       name: string;
//       model: string;
//     };
//     customerId: {
//       _id: string;
//       name: string;
//       phone: string;
//     };
//     sellingPrice: string;
//     tenure: number;
//     emi: string;
//     saleDate: string;
//   };
//   customerId: {
//     _id: string;
//     name: string;
//     phone: string;
//     email?: string;
//   };
//   installmentNo: number;
//   dueDate: string;
//   amount: string;
//   status: 'Pending' | 'Paid' | 'Overdue';
//   paidDate?: string;
//   paidAmount?: string;
//   paymentMode?: string;
//   transactionId?: string;
//   lateFee?: string;
//   reminderSent?: boolean;
//   reminderDate?: string;
// }

// interface Sale {
//   _id: string;
//   saleId: string;
//   customerId: {
//     _id: string;
//     name: string;
//     phone: string;
//   };
//   vehicleId: {
//     name: string;
//     model: string;
//   };
//   sellingPrice: string;
//   paymentType: string;
//   tenure: number;
//   emi: string;
//   saleDate: string;
// }

// interface EMIGroup {
//   saleId: string;
//   sale: Sale;
//   emis: EMI[];
//   customerName: string;
//   totalEmis: number;
//   paidEmis: number;
//   pendingEmis: number;
//   overdueEmis: number;
//   nextDueDate?: string;
//   nextEmiAmount?: number;
//   nextEmiNumber?: number;
// }

// export default function EMITracking() {
//   // State
//   const [emis, setEmis] = useState<EMI[]>([]);
//   const [sales, setSales] = useState<Sale[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [filter, setFilter] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
//   const [selectedEmi, setSelectedEmi] = useState<EMI | null>(null);
//   const [payDialogOpen, setPayDialogOpen] = useState(false);
//   const [payForm, setPayForm] = useState({
//     paymentMode: 'Cash',
//     transactionId: '',
//     paidAmount: '',
//     paidDate: new Date().toISOString().split('T')[0]
//   });
//   const [stats, setStats] = useState<any>(null);

//   // Fetch data on mount
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Fetch all data
//   const fetchAllData = async () => {
//     setFetchLoading(true);
//     try {
//       await Promise.all([
//         fetchEMIs(),
//         fetchSales(),
//         fetchStats()
//       ]);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // Fetch EMIs
//   const fetchEMIs = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (filter !== 'all') {
//         params.append('status', filter);
//       }

//       const response = await axios.get(`${API_BASE_URL}/emis?${params.toString()}&limit=1000`);
//       setEmis(response.data.data);
//     } catch (error) {
//       console.error('Error fetching EMIs:', error);
//       toast.error('Failed to fetch EMI data');
//     }
//   };

//   // Fetch sales
//   const fetchSales = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/sales?limit=100`);
//       setSales(response.data.data);
//     } catch (error) {
//       console.error('Error fetching sales:', error);
//     }
//   };

//   // Fetch stats
//   const fetchStats = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/emis/stats`);
//       setStats(response.data.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   // Group EMIs by sale and filter by search
//   const groupedEmis = useMemo(() => {
//     // First filter EMIs by search term if any
//     let filteredEmis = emis;
//     if (searchTerm) {
//       filteredEmis = emis.filter(emi =>
//         emi.customerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emi.saleId?.vehicleId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emi.saleId?.saleId.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Then group by sale
//     const groups: Record<string, EMIGroup> = {};

//     filteredEmis.forEach(emi => {
//       const saleId = typeof emi.saleId === 'string' ? emi.saleId : emi.saleId._id;

//       if (!groups[saleId]) {
//         const sale = sales.find(s => s._id === saleId);
//         groups[saleId] = {
//           saleId,
//           sale: sale as Sale,
//           emis: [],
//           customerName: emi.customerId?.name || 'Unknown',
//           totalEmis: 0,
//           paidEmis: 0,
//           pendingEmis: 0,
//           overdueEmis: 0
//         };
//       }

//       groups[saleId].emis.push(emi);
//     });

//     // Process each group
//     Object.values(groups).forEach(group => {
//       // Sort EMIs by installment number
//       group.emis.sort((a, b) => a.installmentNo - b.installmentNo);
//       group.totalEmis = group.emis.length;

//       // Count statuses
//       group.paidEmis = group.emis.filter(e => e.status === 'Paid').length;
//       group.pendingEmis = group.emis.filter(e => e.status === 'Pending').length;
//       group.overdueEmis = group.emis.filter(e => e.status === 'Overdue').length;

//       // Find next due date (first pending or overdue EMI)
//       const pendingEmis = group.emis.filter(e => e.status === 'Pending' || e.status === 'Overdue');
//       if (pendingEmis.length > 0) {
//         const nextEmi = pendingEmis.sort((a, b) =>
//           new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
//         )[0];
//         group.nextDueDate = new Date(nextEmi.dueDate).toLocaleDateString('en-IN', {
//           day: 'numeric',
//           month: 'short',
//           year: 'numeric'
//         });
//         group.nextEmiAmount = parseFloat(nextEmi.amount);
//         group.nextEmiNumber = nextEmi.installmentNo;
//       }
//     });

//     return Object.values(groups);
//   }, [emis, sales, searchTerm]);

//   // Toggle group expansion
//   const toggleGroup = (saleId: string) => {
//     const newExpanded = new Set(expandedGroups);
//     if (newExpanded.has(saleId)) {
//       newExpanded.delete(saleId);
//     } else {
//       newExpanded.add(saleId);
//     }
//     setExpandedGroups(newExpanded);
//   };

//   // Handle pay EMI
//   // const handlePayEmi = async () => {
//   //   if (!selectedEmi) return;

//   //   setLoading(true);
//   //   try {
//   //     console.log('Paying EMI:', selectedEmi._id);
//   //     console.log('Payment data:', payForm);

//   //     const response = await axios({
//   //       method: 'patch',
//   //       url: `${API_BASE_URL}/emis/${selectedEmi._id}/pay`,
//   //       data: {
//   //         paymentMode: payForm.paymentMode,
//   //         transactionId: payForm.transactionId || undefined,
//   //         paidAmount: payForm.paidAmount || selectedEmi.amount,
//   //         paidDate: payForm.paidDate
//   //       },
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Accept': 'application/json'
//   //       },
//   //       withCredentials: false
//   //     });

//   //     if (response.data.success) {
//   //       toast.success('EMI marked as paid successfully');
//   //       await fetchEMIs();
//   //       await fetchStats();
//   //       setPayDialogOpen(false);
//   //       setSelectedEmi(null);

//   //       // Reset form
//   //       setPayForm({
//   //         paymentMode: 'Cash',
//   //         transactionId: '',
//   //         paidAmount: '',
//   //         paidDate: new Date().toISOString().split('T')[0]
//   //       });
//   //     }
//   //   } catch (error: any) {
//   //     console.error('Error paying EMI:', error);

//   //     if (error.code === 'ERR_NETWORK') {
//   //       toast.error('Cannot connect to server. Please check if backend is running.');
//   //     } else if (error.response) {
//   //       console.error('Error response:', error.response.data);
//   //       toast.error(error.response.data?.message || 'Failed to mark EMI as paid');
//   //     } else if (error.request) {
//   //       toast.error('No response from server');
//   //     } else {
//   //       toast.error('Error: ' + error.message);
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Handle pay EMI
//   const handlePayEmi = async () => {
//     if (!selectedEmi) return;

//     setLoading(true);
//     try {
//       console.log('Paying EMI:', selectedEmi._id);
//       console.log('Payment data:', payForm);

//       const response = await axios({
//         method: 'put',
//         url: `${API_BASE_URL}/emis/${selectedEmi._id}/pay`,
//         data: {
//           paymentMode: payForm.paymentMode,
//           transactionId: payForm.transactionId || undefined,
//           paidAmount: payForm.paidAmount || selectedEmi.amount,
//           paidDate: payForm.paidDate
//         },
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         withCredentials: false
//       });

//       if (response.data.success) {
//         toast.success('EMI marked as paid successfully');
//         await fetchEMIs();
//         await fetchStats();
//         setPayDialogOpen(false);
//         setSelectedEmi(null);

//         // Reset form
//         setPayForm({
//           paymentMode: 'Cash',
//           transactionId: '',
//           paidAmount: '',
//           paidDate: new Date().toISOString().split('T')[0]
//         });
//       }
//     } catch (error: any) {
//       console.error('Error paying EMI:', error);

//       if (error.code === 'ERR_NETWORK') {
//         toast.error('Cannot connect to server. Please check if backend is running.');
//       } else if (error.response) {
//         console.error('Error response:', error.response.data);
//         toast.error(error.response.data?.message || 'Failed to mark EMI as paid');
//       } else if (error.request) {
//         toast.error('No response from server');
//       } else {
//         toast.error('Error: ' + error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle send reminder
//   const handleSendReminder = async (emi: EMI) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/emis/${emi._id}/remind`);
//       if (response.data.success) {
//         toast.success('Reminder sent successfully');
//         await fetchEMIs();
//       }
//     } catch (error: any) {
//       console.error('Error sending reminder:', error);
//       toast.error('Failed to send reminder');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get status counts
//   const totalEmis = emis.length;
//   const paidEmis = emis.filter(e => e.status === 'Paid').length;
//   const pendingEmis = emis.filter(e => e.status === 'Pending').length;
//   const overdueEmis = emis.filter(e => e.status === 'Overdue').length;

//   // Format date to show day and month
//   const formatDueDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Check if a date is overdue
//   const isOverdue = (dueDate: string, status: string) => {
//     if (status === 'Paid') return false;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const due = new Date(dueDate);
//     due.setHours(0, 0, 0, 0);
//     return due < today;
//   };

//   return (
//     <div className="animate-fade-in p-6">
//       <PageHeader
//         title="EMI Tracking"
//         description={`${totalEmis} installments across ${groupedEmis.length} loans`}
//         actions={
//           <div className="flex gap-2">
//             <div className="relative">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search customer or vehicle..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-8 w-[250px]"
//               />
//             </div>
//             <Select value={filter} onValueChange={(v) => {
//               setFilter(v);
//               fetchEMIs();
//             }}>
//               <SelectTrigger className="w-[140px]">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All EMIs</SelectItem>
//                 <SelectItem value="Paid">Paid</SelectItem>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="Overdue">Overdue</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchAllData}
//               disabled={fetchLoading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//           </div>
//         }
//       />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total EMIs</p>
//                 <p className="text-2xl font-bold">{totalEmis}</p>
//               </div>
//               <CreditCard className="h-8 w-8 text-muted-foreground/30" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Paid</p>
//                 <p className="text-2xl font-bold text-green-600">{paidEmis}</p>
//               </div>
//               <CheckCircle2 className="h-8 w-8 text-green-600/30" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Pending</p>
//                 <p className="text-2xl font-bold text-yellow-600">{pendingEmis}</p>
//               </div>
//               <Calendar className="h-8 w-8 text-yellow-600/30" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Overdue</p>
//                 <p className="text-2xl font-bold text-red-600">{overdueEmis}</p>
//               </div>
//               <AlertCircle className="h-8 w-8 text-red-600/30" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Loading State */}
//       {fetchLoading && (
//         <div className="flex justify-center items-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <span className="ml-2 text-muted-foreground">Loading EMI data...</span>
//         </div>
//       )}

//       {/* EMI Groups */}
//       {!fetchLoading && groupedEmis.length === 0 && (
//         <div className="text-center py-12 bg-card border border-border rounded-lg">
//           <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
//           <p className="text-muted-foreground">No EMI records found</p>
//         </div>
//       )}

//       <AnimatePresence>
//         {groupedEmis.map((group) => (
//           <motion.div
//             key={group.saleId}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="mb-6 bg-card border border-border rounded-lg overflow-hidden"
//           >
//             {/* Group Header */}
//             <div
//               className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
//               onClick={() => toggleGroup(group.saleId)}
//             >
//               <div className="flex items-center gap-3 flex-wrap">
//                 <Button variant="ghost" size="icon" className="h-6 w-6">
//                   {expandedGroups.has(group.saleId) ? (
//                     <ChevronUp className="h-4 w-4" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4" />
//                   )}
//                 </Button>

//                 <div>
//                   <span className="text-sm font-medium">{group.customerName}</span>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-xs text-muted-foreground font-mono">
//                       Sale #{group.sale?.saleId || group.saleId}
//                     </span>
//                     <span className="text-xs text-muted-foreground">
//                       {group.sale?.vehicleId?.name} {group.sale?.vehicleId?.model}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 {group.nextDueDate && group.nextEmiNumber && (
//                   <div className="text-xs text-muted-foreground hidden md:block">
//                     Next EMI #{group.nextEmiNumber}: <span className="font-mono">{group.nextDueDate}</span> •
//                     <span className="font-mono ml-1">{formatINR(group.nextEmiAmount || 0)}</span>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-2">
//                   <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
//                     {group.paidEmis}/{group.totalEmis} Paid
//                   </Badge>
//                   {group.overdueEmis > 0 && (
//                     <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
//                       {group.overdueEmis} Overdue
//                     </Badge>
//                   )}
//                 </div>
//                 <span className="text-xs text-muted-foreground font-mono">
//                   EMI ₹{formatINR(parseFloat(group.sale?.emi || '0'))}
//                 </span>
//               </div>
//             </div>

//             {/* EMI Table */}
//             {expandedGroups.has(group.saleId) && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//               >
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="text-xs w-16">#</TableHead>
//                       <TableHead className="text-xs">Due Date (5th of month)</TableHead>
//                       <TableHead className="text-xs">Amount (₹)</TableHead>
//                       <TableHead className="text-xs">Status</TableHead>
//                       <TableHead className="text-xs">Paid Date</TableHead>
//                       <TableHead className="text-xs">Payment Mode</TableHead>
//                       <TableHead className="text-xs text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {group.emis.map((emi, i) => {
//                       const overdue = isOverdue(emi.dueDate, emi.status);
//                       const status = overdue ? 'Overdue' : emi.status;

//                       return (
//                         <TableRow key={emi._id} className="animate-fade-in hover:bg-muted/50">
//                           <TableCell className="text-sm font-mono tabular-nums">
//                             {emi.installmentNo}
//                           </TableCell>
//                           <TableCell className="text-sm font-mono tabular-nums">
//                             <div className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3 text-muted-foreground" />
//                               {formatDueDate(emi.dueDate)}
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-sm font-mono tabular-nums">
//                             {formatINR(parseFloat(emi.amount))}
//                           </TableCell>
//                           <TableCell>
//                             <StatusBadge status={status} />
//                           </TableCell>
//                           <TableCell className="text-sm font-mono tabular-nums">
//                             {emi.paidDate ? formatDueDate(emi.paidDate) : '-'}
//                           </TableCell>
//                           <TableCell className="text-sm">
//                             {emi.paymentMode || '-'}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end gap-1">
//                               {emi.status !== 'Paid' && (
//                                 <>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="text-xs"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setSelectedEmi(emi);
//                                       setPayForm({
//                                         ...payForm,
//                                         paidAmount: emi.amount,
//                                         paidDate: new Date().toISOString().split('T')[0]
//                                       });
//                                       setPayDialogOpen(true);
//                                     }}
//                                   >
//                                     <CreditCard className="h-3 w-3 mr-1" />
//                                     Pay
//                                   </Button>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="text-xs"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleSendReminder(emi);
//                                     }}
//                                     disabled={loading}
//                                   >
//                                     <Bell className="h-3 w-3 mr-1" />
//                                     Remind
//                                   </Button>
//                                 </>
//                               )}
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>

//                 <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/20">
//                   <div className="flex items-center gap-4">
//                     <span>📅 All EMIs are due on the 5th of every month</span>
//                     <span>• Total EMIs: {group.totalEmis}</span>
//                     <span>• EMI Amount: {formatINR(parseFloat(group.sale?.emi || '0'))}</span>
//                     <span>• Loan started: {group.sale?.saleDate ? new Date(group.sale.saleDate).toLocaleDateString('en-IN') : '-'}</span>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       {/* Pay EMI Dialog */}
//       <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Mark EMI as Paid</DialogTitle>
//           </DialogHeader>

//           {selectedEmi && (
//             <div className="space-y-4 py-4">
//               <div className="bg-muted p-3 rounded-lg">
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <p className="text-muted-foreground">Installment</p>
//                     <p className="font-medium">#{selectedEmi.installmentNo}</p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Due Date</p>
//                     <p className="font-medium">
//                       {formatDueDate(selectedEmi.dueDate)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Amount</p>
//                     <p className="font-medium font-mono">
//                       {formatINR(parseFloat(selectedEmi.amount))}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Customer</p>
//                     <p className="font-medium">{selectedEmi.customerId?.name}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <Label className="text-xs">Payment Mode</Label>
//                   <Select
//                     value={payForm.paymentMode}
//                     onValueChange={v => setPayForm({ ...payForm, paymentMode: v })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Cash">Cash</SelectItem>
//                       <SelectItem value="Online">Online</SelectItem>
//                       <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="text-xs">Paid Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     value={payForm.paidAmount}
//                     onChange={e => setPayForm({ ...payForm, paidAmount: e.target.value })}
//                     className="font-mono"
//                     min="0"
//                     step="100"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-xs">Paid Date</Label>
//                   <Input
//                     type="date"
//                     value={payForm.paidDate}
//                     onChange={e => setPayForm({ ...payForm, paidDate: e.target.value })}
//                     className="font-mono"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-xs">Transaction ID (Optional)</Label>
//                   <Input
//                     value={payForm.transactionId}
//                     onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })}
//                     placeholder="Enter transaction ID"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setPayDialogOpen(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handlePayEmi}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 'Confirm Payment'
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { formatINR } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  RefreshCw,
  CreditCard,
  Bell,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// Types
interface EMI {
  _id: string;
  emiId: string;
  saleId: {
    _id: string;
    saleId: string;
    vehicleId: {
      name: string;
      model: string;
    };
    customerId: {
      _id: string;
      name: string;
      phone: string;
    };
    sellingPrice: string;
    tenure: number;
    emi: string;
    saleDate: string;
  };
  customerId: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  installmentNo: number;
  dueDate: string;
  amount: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  paidDate?: string;
  paidAmount?: string;
  paymentMode?: string;
  transactionId?: string;
  lateFee?: string;
  reminderSent?: boolean;
  reminderDate?: string;
}

interface Sale {
  _id: string;
  saleId: string;
  customerId: {
    _id: string;
    name: string;
    phone: string;
  };
  vehicleId: {
    name: string;
    model: string;
  };
  sellingPrice: string;
  paymentType: string;
  tenure: number;
  emi: string;
  saleDate: string;
}

interface EMIGroup {
  saleId: string;
  sale: Sale;
  emis: EMI[];
  customerName: string;
  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  overdueEmis: number;
  nextDueDate?: string;
  nextEmiAmount?: number;
  nextEmiNumber?: number;
}

export default function EMITracking() {
  // State
  const [emis, setEmis] = useState<EMI[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedEmi, setSelectedEmi] = useState<EMI | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payForm, setPayForm] = useState({
    paymentMode: 'Cash',
    transactionId: '',
    paidAmount: '',
    paidDate: new Date().toISOString().split('T')[0]
  });
  const [stats, setStats] = useState<any>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data
  const fetchAllData = async () => {
    setFetchLoading(true);
    try {
      await Promise.all([
        fetchEMIs(),
        fetchSales(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch EMIs
  const fetchEMIs = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await axios.get(`${API_BASE_URL}/emis?${params.toString()}&limit=1000`);
      setEmis(response.data.data);
    } catch (error) {
      console.error('Error fetching EMIs:', error);
      toast.error('Failed to fetch EMI data');
    }
  };

  // Fetch sales
  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sales?limit=100`);
      setSales(response.data.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/emis/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Group EMIs by sale and filter by search
  const groupedEmis = useMemo(() => {
    // First filter EMIs by search term if any
    let filteredEmis = emis;
    if (searchTerm) {
      filteredEmis = emis.filter(emi =>
        emi.customerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emi.saleId?.vehicleId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emi.saleId?.saleId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Then group by sale
    const groups: Record<string, EMIGroup> = {};

    filteredEmis.forEach(emi => {
      const saleId = typeof emi.saleId === 'string' ? emi.saleId : emi.saleId._id;

      if (!groups[saleId]) {
        const sale = sales.find(s => s._id === saleId);
        groups[saleId] = {
          saleId,
          sale: sale as Sale,
          emis: [],
          customerName: emi.customerId?.name || 'Unknown',
          totalEmis: 0,
          paidEmis: 0,
          pendingEmis: 0,
          overdueEmis: 0
        };
      }

      groups[saleId].emis.push(emi);
    });

    // Process each group
    Object.values(groups).forEach(group => {
      // Sort EMIs by installment number
      group.emis.sort((a, b) => a.installmentNo - b.installmentNo);
      group.totalEmis = group.emis.length;

      // Count statuses
      group.paidEmis = group.emis.filter(e => e.status === 'Paid').length;
      group.pendingEmis = group.emis.filter(e => e.status === 'Pending').length;
      group.overdueEmis = group.emis.filter(e => e.status === 'Overdue').length;

      // Find next due date (first pending or overdue EMI)
      const pendingEmis = group.emis.filter(e => e.status === 'Pending' || e.status === 'Overdue');
      if (pendingEmis.length > 0) {
        const nextEmi = pendingEmis.sort((a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )[0];
        group.nextDueDate = new Date(nextEmi.dueDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        group.nextEmiAmount = parseFloat(nextEmi.amount);
        group.nextEmiNumber = nextEmi.installmentNo;
      }
    });

    return Object.values(groups);
  }, [emis, sales, searchTerm]);

  // Toggle group expansion
  const toggleGroup = (saleId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedGroups(newExpanded);
  };

  // Handle pay EMI
  const handlePayEmi = async () => {
    if (!selectedEmi) return;

    setLoading(true);
    try {
      console.log('Paying EMI:', selectedEmi._id);
      console.log('Payment data:', payForm);

      const response = await axios({
        method: 'put',
        url: `${API_BASE_URL}/emis/${selectedEmi._id}/pay`,
        data: {
          paymentMode: payForm.paymentMode,
          transactionId: payForm.transactionId || undefined,
          paidAmount: payForm.paidAmount || selectedEmi.amount,
          paidDate: payForm.paidDate
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      if (response.data.success) {
        toast.success('EMI marked as paid successfully');
        await fetchEMIs();
        await fetchStats();
        setPayDialogOpen(false);
        setSelectedEmi(null);

        // Reset form
        setPayForm({
          paymentMode: 'Cash',
          transactionId: '',
          paidAmount: '',
          paidDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error: any) {
      console.error('Error paying EMI:', error);

      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data?.message || 'Failed to mark EMI as paid');
      } else if (error.request) {
        toast.error('No response from server');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle send reminder
  // const handleSendReminder = async (emi: EMI) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/emis/${emi._id}/remind`);
  //     if (response.data.success) {
  //       toast.success('Reminder sent successfully');
  //       await fetchEMIs();
  //     }
  //   } catch (error: any) {
  //     console.error('Error sending reminder:', error);
  //     toast.error('Failed to send reminder');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // In EMITracking.tsx, the handleSendReminder function
const handleSendReminder = async (emi: EMI) => {
  setLoading(true);
  try {
    const response = await axios.post(`${API_BASE_URL}/emis/${emi._id}/remind`);
    if (response.data.success) {
      toast.success('Reminder sent successfully');
      await fetchEMIs(); // Refresh to update reminderSent status
    } else {
      toast.error(response.data.message || 'Failed to send reminder');
    }
  } catch (error: any) {
    console.error('Error sending reminder:', error);
    toast.error(error.response?.data?.message || 'Failed to send reminder');
  } finally {
    setLoading(false);
  }
};

  // Get status counts
  const totalEmis = emis.length;
  const paidEmis = emis.filter(e => e.status === 'Paid').length;
  const pendingEmis = emis.filter(e => e.status === 'Pending').length;
  const overdueEmis = emis.filter(e => e.status === 'Overdue').length;

  // Format date to show day and month
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Check if a date is overdue
  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Paid') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className="animate-fade-in p-6">
      <PageHeader
        title="EMI Tracking"
        description={`${totalEmis} installments across ${groupedEmis.length} loans`}
        actions={
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customer or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Select value={filter} onValueChange={(v) => {
              setFilter(v);
              fetchEMIs();
            }}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All EMIs</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              disabled={fetchLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${fetchLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total EMIs</p>
                <p className="text-2xl font-bold">{totalEmis}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-green-600">{paidEmis}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingEmis}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueEmis}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {fetchLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading EMI data...</span>
        </div>
      )}

      {/* EMI Groups */}
      {!fetchLoading && groupedEmis.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">No EMI records found</p>
        </div>
      )}

      <AnimatePresence>
        {groupedEmis.map((group) => (
          <motion.div
            key={group.saleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Group Header */}
            <div
              className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleGroup(group.saleId)}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {expandedGroups.has(group.saleId) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                <div>
                  <span className="text-sm font-medium">{group.customerName}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      Sale #{group.sale?.saleId || group.saleId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {group.sale?.vehicleId?.name} {group.sale?.vehicleId?.model}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {group.nextDueDate && group.nextEmiNumber && (
                  <div className="text-xs text-muted-foreground hidden md:block">
                    Next EMI #{group.nextEmiNumber}: <span className="font-mono">{group.nextDueDate}</span> •
                    <span className="font-mono ml-1">{formatINR(group.nextEmiAmount || 0)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    {group.paidEmis}/{group.totalEmis} Paid
                  </Badge>
                  {group.overdueEmis > 0 && (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                      {group.overdueEmis} Overdue
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  EMI ₹{formatINR(parseFloat(group.sale?.emi || '0'))}
                </span>
              </div>
            </div>

            {/* EMI Table */}
            {expandedGroups.has(group.saleId) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs w-16">#</TableHead>
                      <TableHead className="text-xs">Due Date (5th of month)</TableHead>
                      <TableHead className="text-xs">Amount (₹)</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Paid Date</TableHead>
                      <TableHead className="text-xs">Payment Mode</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.emis.map((emi, i) => {
                      const overdue = isOverdue(emi.dueDate, emi.status);
                      const status = overdue ? 'Overdue' : emi.status;

                      return (
                        <TableRow key={emi._id} className="animate-fade-in hover:bg-muted/50">
                          <TableCell className="text-sm font-mono tabular-nums">
                            {emi.installmentNo}
                          </TableCell>
                          <TableCell className="text-sm font-mono tabular-nums">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDueDate(emi.dueDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-mono tabular-nums">
                            {formatINR(parseFloat(emi.amount))}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={status} />
                          </TableCell>
                          <TableCell className="text-sm font-mono tabular-nums">
                            {emi.paidDate ? formatDueDate(emi.paidDate) : '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {emi.paymentMode || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {emi.status !== 'Paid' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEmi(emi);
                                      setPayForm({
                                        ...payForm,
                                        paidAmount: emi.amount,
                                        paidDate: new Date().toISOString().split('T')[0]
                                      });
                                      setPayDialogOpen(true);
                                    }}
                                  >
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Pay
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSendReminder(emi);
                                    }}
                                    disabled={loading}
                                  >
                                    <Bell className="h-3 w-3 mr-1" />
                                    Remind
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/20">
                  <div className="flex items-center gap-4">
                    <span>📅 All EMIs are due on the 5th of every month</span>
                    <span>• Total EMIs: {group.totalEmis}</span>
                    <span>• EMI Amount: {formatINR(parseFloat(group.sale?.emi || '0'))}</span>
                    <span>• Loan started: {group.sale?.saleDate ? new Date(group.sale.saleDate).toLocaleDateString('en-IN') : '-'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pay EMI Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark EMI as Paid</DialogTitle>
          </DialogHeader>

          {selectedEmi && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Installment</p>
                    <p className="font-medium">#{selectedEmi.installmentNo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">
                      {formatDueDate(selectedEmi.dueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium font-mono">
                      {formatINR(parseFloat(selectedEmi.amount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedEmi.customerId?.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Payment Mode</Label>
                  <Select
                    value={payForm.paymentMode}
                    onValueChange={v => setPayForm({ ...payForm, paymentMode: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Paid Amount (₹)</Label>
                  <Input
                    type="number"
                    value={payForm.paidAmount}
                    onChange={e => setPayForm({ ...payForm, paidAmount: e.target.value })}
                    className="font-mono"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <Label className="text-xs">Paid Date</Label>
                  <Input
                    type="date"
                    value={payForm.paidDate}
                    onChange={e => setPayForm({ ...payForm, paidDate: e.target.value })}
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label className="text-xs">Transaction ID (Optional)</Label>
                  <Input
                    value={payForm.transactionId}
                    onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })}
                    placeholder="Enter transaction ID"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPayDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayEmi}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

