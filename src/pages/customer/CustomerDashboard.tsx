// import { useAuth } from '@/lib/auth-context';
// import { useData } from '@/lib/data-context';
// import { StatCard } from '@/components/StatCard';
// import { PageHeader } from '@/components/PageHeader';
// import { StatusBadge } from '@/components/StatusBadge';
// import { formatINR } from '@/lib/mock-data';
// import { Receipt, AlertTriangle, CheckCircle } from 'lucide-react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// export default function CustomerDashboard() {
//   const { user } = useAuth();
//   const { customers, sales, emis, setEmis, vehicles } = useData();

//   const customer = customers.find(c => c.name === user?.name);
//   const customerSales = customer ? sales.filter(s => s.customerId === customer.id) : [];
//   const customerEmis = customer ? emis.filter(e => e.customerId === customer.id) : [];
//   const pendingEmis = customerEmis.filter(e => e.status !== 'Paid');
//   const paidEmis = customerEmis.filter(e => e.status === 'Paid');
//   const totalOutstanding = pendingEmis.reduce((s, e) => s + e.amount, 0);

//   const markPaid = (emiId: string) => {
//     setEmis(prev => prev.map(e => e.id === emiId ? { ...e, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : e));
//     toast.success('EMI marked as paid');
//   };

//   return (
//     <div className="animate-fade-in">
//       <PageHeader title="My Dashboard" description={`Welcome, ${user?.name}`} />
//       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         <StatCard title="Active Loans" value={customerSales.length} icon={Receipt} />
//         <StatCard title="Pending EMIs" value={pendingEmis.length} icon={AlertTriangle} trend={`₹${formatINR(totalOutstanding)} due`} />
//         <StatCard title="Paid EMIs" value={paidEmis.length} icon={CheckCircle} />
//       </div>

//       {customerSales.map(sale => {
//         const vehicle = vehicles.find(v => v.id === sale.vehicleId);
//         const saleEmis = customerEmis.filter(e => e.saleId === sale.id);
//         return (
//           <div key={sale.id} className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center gap-3">
//               <span className="text-sm font-medium">{vehicle?.name} {vehicle?.model}</span>
//               <StatusBadge status={sale.paymentType} />
//               {sale.emi && <span className="text-xs text-muted-foreground font-mono">EMI ₹{formatINR(sale.emi)} × {sale.tenure}mo</span>}
//             </div>

//             {/* Repayment Thread */}
//             <div className="p-4">
//               <div className="flex flex-wrap gap-1.5">
//                 {saleEmis.map(emi => (
//                   <div
//                     key={emi.id}
//                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-mono font-bold
//                       ${emi.status === 'Paid' ? 'bg-cobalt border-cobalt text-cobalt-foreground' :
//                         emi.status === 'Overdue' ? 'border-destructive text-destructive border-dashed' :
//                         'border-border text-muted-foreground border-dashed'}`}
//                     title={`#${emi.installmentNo} - ${emi.status}`}
//                   >
//                     {emi.installmentNo}
//                   </div>
//                 ))}
//               </div>
//               <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
//                 Solid = Paid · Dashed = Pending/Overdue
//               </p>
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
//                 {saleEmis.filter(e => e.status !== 'Paid').slice(0, 6).map((emi, i) => (
//                   <TableRow key={emi.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
//                     <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{emi.dueDate}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
//                     <TableCell><StatusBadge status={emi.status} /></TableCell>
//                     <TableCell className="text-right">
//                       <Button size="sm" variant="outline" className="text-xs" onClick={() => markPaid(emi.id)}>
//                         Pay Now
//                       </Button>
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
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { formatINR } from '@/lib/mock-data';
import { Receipt, AlertTriangle, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://finance-vfm-backend.onrender.com/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payingEmi, setPayingEmi] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/customer/dashboard`, getAuthHeaders());
      setDashboard(response.data.data);
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (emiId: string) => {
    setPayingEmi(emiId);
    try {
      await axios.post(`${API_URL}/customer/pay-emi/${emiId}`, 
        { paymentMode: 'Online' }, 
        getAuthHeaders()
      );
      toast.success('EMI paid successfully');
      fetchDashboard();
    } catch (error: any) {
      console.error('Error paying EMI:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setPayingEmi(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button onClick={fetchDashboard} className="mt-4">Retry</Button>
      </div>
    );
  }

  const { summary, sales, emis } = dashboard;

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Dashboard" description={`Welcome, ${user?.name}`} />
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Active Loans" value={summary.activeLoans} icon={Receipt} />
        <StatCard 
          title="Pending EMIs" 
          value={summary.pendingEmis} 
          icon={AlertTriangle} 
          trend={`₹${formatINR(summary.totalOutstanding)} due`} 
        />
        <StatCard title="Paid EMIs" value={summary.paidEmis} icon={CheckCircle} />
      </div>

      {sales.map((sale: any) => {
        const saleEmis = emis.filter((e: any) => e.saleId === sale._id);
        const vehicle = sale.vehicleId;
        
        return (
          <div key={sale._id} className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">{vehicle?.name} {vehicle?.model}</span>
              <StatusBadge status={sale.paymentType} />
              {sale.emi && (
                <span className="text-xs text-muted-foreground font-mono">
                  EMI ₹{formatINR(sale.emi)} × {sale.tenure}mo
                </span>
              )}
            </div>

            {/* Repayment Thread */}
            <div className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {saleEmis.map((emi: any) => (
                  <div
                    key={emi._id}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-mono font-bold
                      ${emi.status === 'Paid' ? 'bg-cobalt border-cobalt text-cobalt-foreground' :
                        emi.status === 'Overdue' ? 'border-destructive text-destructive border-dashed' :
                        'border-border text-muted-foreground border-dashed'}`}
                    title={`#${emi.installmentNo} - ${emi.status}`}
                  >
                    {emi.installmentNo}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                Solid = Paid · Dashed = Pending/Overdue
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Due Date</TableHead>
                  <TableHead className="text-xs">Amount (INR)</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  {/* <TableHead className="text-xs text-right">Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleEmis.filter((e: any) => e.status !== 'Paid').slice(0, 6).map((emi: any, i: number) => (
                  <TableRow key={emi._id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">
                      {new Date(emi.dueDate).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
                    <TableCell><StatusBadge status={emi.status} /></TableCell>
                    {/* <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => markPaid(emi._id)}
                        disabled={payingEmi === emi._id}
                      >
                        {payingEmi === emi._id ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
      
      {sales.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No active loans found</p>
        </div>
      )}
    </div>
  );
}

