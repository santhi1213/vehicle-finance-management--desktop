// import { useAuth } from '@/lib/auth-context';
// import { useData } from '@/lib/data-context';
// import { PageHeader } from '@/components/PageHeader';
// import { StatusBadge } from '@/components/StatusBadge';
// import { formatINR } from '@/lib/mock-data';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// export default function CustomerLoans() {
//   const { user } = useAuth();
//   const { customers, sales, emis, setEmis, vehicles } = useData();

//   const customer = customers.find(c => c.name === user?.name);
//   const customerSales = customer ? sales.filter(s => s.customerId === customer.id) : [];
//   const customerEmis = customer ? emis.filter(e => e.customerId === customer.id) : [];

//   const markPaid = (emiId: string) => {
//     setEmis(prev => prev.map(e => e.id === emiId ? { ...e, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : e));
//     toast.success('Payment recorded');
//   };

//   return (
//     <div className="animate-fade-in">
//       <PageHeader title="My Loans" description={`${customerSales.length} active loans`} />

//       {customerSales.map(sale => {
//         const vehicle = vehicles.find(v => v.id === sale.vehicleId);
//         const saleEmis = customerEmis.filter(e => e.saleId === sale.id);
//         const paid = saleEmis.filter(e => e.status === 'Paid').length;
//         const total = saleEmis.length;

//         return (
//           <div key={sale.id} className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-5 py-4 border-b border-border">
//               <div className="flex flex-wrap items-center gap-3 mb-2">
//                 <span className="font-medium text-sm">{vehicle?.name} {vehicle?.model}</span>
//                 <StatusBadge status={sale.paymentType} />
//               </div>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
//                 <div><span className="text-xs text-muted-foreground block">Selling Price</span><span className="font-mono tabular-nums">₹{formatINR(sale.sellingPrice)}</span></div>
//                 {sale.financeAmount && <div><span className="text-xs text-muted-foreground block">Finance Amount</span><span className="font-mono tabular-nums">₹{formatINR(sale.financeAmount)}</span></div>}
//                 {sale.emi && <div><span className="text-xs text-muted-foreground block">Monthly EMI</span><span className="font-mono tabular-nums">₹{formatINR(sale.emi)}</span></div>}
//                 <div><span className="text-xs text-muted-foreground block">Progress</span><span className="font-mono tabular-nums">{paid}/{total} paid</span></div>
//               </div>
//             </div>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-xs">#</TableHead>
//                   <TableHead className="text-xs">Due Date</TableHead>
//                   <TableHead className="text-xs">Amount (INR)</TableHead>
//                   <TableHead className="text-xs">Status</TableHead>
//                   <TableHead className="text-xs text-right">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {saleEmis.map(emi => (
//                   <TableRow key={emi.id}>
//                     <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{emi.dueDate}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
//                     <TableCell><StatusBadge status={emi.status} /></TableCell>
//                     <TableCell className="text-right">
//                       {emi.status !== 'Paid' && <Button size="sm" variant="outline" className="text-xs" onClick={() => markPaid(emi.id)}>Pay</Button>}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         );
//       })}
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { formatINR } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { CreditCard, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://finance-vfm-backend.onrender.com/api';

// Razorpay Payment Component
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  emiId: string;
  customerId: string;
  amount: number;
  emiNo: number;
  onSuccess: () => void;
  onClose: () => void;
}

function RazorpayPaymentModal({ emiId, customerId, amount, emiNo, onSuccess, onClose }: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      // Create order on backend
      const orderResponse = await axios.post(
        `${API_URL}/payments/create-order`,
        { emiId, customerId, amount: Math.round(amount) },
        getAuthHeaders()
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { orderId, keyId } = orderResponse.data.data;

      // Initialize Razorpay options
      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Vehicle Finance Management',
        description: `EMI Payment - Installment ${emiNo}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${API_URL}/payments/verify`,
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                emiId,
                customerId
              },
              getAuthHeaders()
            );

            if (verifyResponse.data.success) {
              setPaymentStatus('success');
              toast.success(
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Payment successful! EMI has been marked as paid.</span>
                </div>,
                { duration: 5000 }
              );
              setTimeout(() => {
                onSuccess();
                onClose();
              }, 2000);
            } else {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            toast.error(error.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('idle');
            setLoading(false);
            toast.info('Payment cancelled');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#2563eb'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('failed');
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Make Payment
          </DialogTitle>
          <DialogDescription>
            Pay EMI Installment #{emiNo} of ₹{amount.toLocaleString('en-IN')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {paymentStatus === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your EMI has been marked as paid. The page will refresh shortly.
              </p>
            </div>
          ) : paymentStatus === 'failed' ? (
            <div className="text-center py-6">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Something went wrong. Please try again.
              </p>
              <Button onClick={handlePayment} className="mt-4" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount to Pay:</span>
                  <span className="font-bold text-lg">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>Credit/Debit Card, UPI, NetBanking</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-400">
                <p className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Secure payment powered by Razorpay
                </p>
              </div>
            </>
          )}
        </div>

        {paymentStatus === 'idle' && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={loading} className="flex-1 gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Pay Now
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CustomerLoans() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmi, setSelectedEmi] = useState<{ id: string; amount: number; emiNo: number } | null>(null);
  const [customerId, setCustomerId] = useState<string>('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchCustomerAndLoans();
  }, []);

  const fetchCustomerAndLoans = async () => {
    try {
      setLoading(true);
      
      // First get customer profile to get customerId
      const profileResponse = await axios.get(`${API_URL}/customer/profile`, getAuthHeaders());
      if (profileResponse.data.success) {
        setCustomerId(profileResponse.data.data._id);
      }
      
      // Then fetch loans
      await fetchLoans();
    } catch (error: any) {
      console.error('Error fetching customer data:', error);
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`${API_URL}/customer/loans`, getAuthHeaders());
      setLoans(response.data.data);
    } catch (error: any) {
      console.error('Error fetching loans:', error);
      toast.error(error.response?.data?.message || 'Failed to load loans');
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh loans data after successful payment
    fetchLoans();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt"></div>
      </div>
    );
  }

  // Flatten all EMIs from all loans for easy display
  const allEmis = loans.flatMap((sale: any) => {
    const vehicle = sale.vehicleId;
    const emis = sale.emis || [];
    return emis.map((emi: any) => ({
      ...emi,
      vehicleName: vehicle?.name,
      vehicleModel: vehicle?.model,
      saleId: sale._id,
      sale: sale
    }));
  });

  const pendingEmis = allEmis.filter((emi: any) => emi.status !== 'Paid');
  const paidEmis = allEmis.filter((emi: any) => emi.status === 'Paid');

  return (
    <div className="animate-fade-in p-6">
      <PageHeader 
        title="My Loans & EMIs" 
        description={`${pendingEmis.length} pending payments • ${paidEmis.length} completed`} 
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Active Loans</p>
            <p className="text-2xl font-bold">{loans.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending EMIs</p>
            <p className="text-2xl font-bold text-orange-600">{pendingEmis.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Pending Amount</p>
            <p className="text-2xl font-bold">
              ₹{pendingEmis.reduce((sum, e: any) => sum + parseFloat(e.amount), 0).toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loans List with EMIs */}
      {loans.map((sale: any) => {
        const vehicle = sale.vehicleId;
        const saleEmis = sale.emis || [];
        const paid = sale.paidCount || saleEmis.filter((e: any) => e.status === 'Paid').length;
        const total = sale.totalCount || saleEmis.length;
        const progress = total > 0 ? (paid / total) * 100 : 0;

        return (
          <div key={sale._id} className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
            {/* Loan Header */}
            <div className="px-5 py-4 border-b border-border bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <span className="font-semibold text-lg">
                    {vehicle?.name} {vehicle?.model}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Sale ID: {sale.saleId}
                  </span>
                </div>
                <StatusBadge status={(sale.status === 'Active' ? 'Active' : 'Completed') as any} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-3">
                <div>
                  <span className="text-xs text-muted-foreground block">Selling Price</span>
                  <span className="font-mono font-medium">₹{formatINR(parseFloat(sale.sellingPrice))}</span>
                </div>
                {sale.financeAmount && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Finance Amount</span>
                    <span className="font-mono">₹{formatINR(parseFloat(sale.financeAmount))}</span>
                  </div>
                )}
                {sale.emi && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Monthly EMI</span>
                    <span className="font-mono font-medium text-cobalt">₹{formatINR(parseFloat(sale.emi))}</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground block">Progress</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cobalt rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{paid}/{total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EMIs Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-16">#</TableHead>
                  <TableHead className="text-xs">Due Date</TableHead>
                  <TableHead className="text-xs">Amount (₹)</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleEmis.map((emi: any) => (
                  <TableRow 
                    key={emi._id} 
                    className={emi.status === 'Overdue' ? 'bg-red-50/50 dark:bg-red-950/20' : ''}
                  >
                    <TableCell className="text-sm font-mono tabular-nums font-medium">
                      {emi.installmentNo}
                    </TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">
                      {new Date(emi.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {emi.status === 'Overdue' && (
                        <span className="ml-2 text-xs text-red-500">
                          (Overdue by {Math.ceil((new Date().getTime() - new Date(emi.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">
                      ₹{formatINR(parseFloat(emi.amount))}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={emi.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {emi.status !== 'Paid' && (
                        <Button 
                          size="sm" 
                          variant={emi.status === 'Overdue' ? 'destructive' : 'default'}
                          className="gap-2"
                          onClick={() => setSelectedEmi({
                            id: emi._id,
                            amount: parseFloat(emi.amount),
                            emiNo: emi.installmentNo
                          })}
                        >
                          <CreditCard className="h-3 w-3" />
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}

      {loans.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No active loans found</p>
        </div>
      )}

      {/* Razorpay Payment Modal */}
      {selectedEmi && customerId && (
        <RazorpayPaymentModal
          emiId={selectedEmi.id}
          customerId={customerId}
          amount={selectedEmi.amount}
          emiNo={selectedEmi.emiNo}
          onSuccess={handlePaymentSuccess}
          onClose={() => setSelectedEmi(null)}
        />
      )}
    </div>
  );
}
