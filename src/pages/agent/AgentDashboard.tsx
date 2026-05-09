// import { useAuth } from '@/lib/auth-context';
// import { useData } from '@/lib/data-context';
// import { StatCard } from '@/components/StatCard';
// import { PageHeader } from '@/components/PageHeader';
// import { StatusBadge } from '@/components/StatusBadge';
// import { formatINR } from '@/lib/mock-data';
// import { Users, Receipt, CheckCircle } from 'lucide-react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// export default function AgentDashboard() {
//   const { user } = useAuth();
//   const { agents, customers, emis, setEmis } = useData();

//   const agent = agents.find(a => a.name === user?.name);
//   const assignedCustomers = agent ? customers.filter(c => c.assignedAgentId === agent.id) : [];
//   const customerIds = assignedCustomers.map(c => c.id);
//   const agentEmis = emis.filter(e => customerIds.includes(e.customerId));
//   const pendingEmis = agentEmis.filter(e => e.status !== 'Paid');
//   const paidEmis = agentEmis.filter(e => e.status === 'Paid');

//   const markCollected = (emiId: string) => {
//     setEmis(prev => prev.map(e => e.id === emiId ? { ...e, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : e));
//     toast.success('EMI marked as collected');
//   };

//   return (
//     <div className="animate-fade-in">
//       <PageHeader title="Collection Dashboard" description={`Agent: ${user?.name}`} />
//       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         <StatCard title="Assigned Customers" value={assignedCustomers.length} icon={Users} />
//         <StatCard title="Pending Collections" value={pendingEmis.length} icon={Receipt} trend={`₹${formatINR(pendingEmis.reduce((s, e) => s + e.amount, 0))} to collect`} />
//         <StatCard title="Collected" value={paidEmis.length} icon={CheckCircle} />
//       </div>

//       <div className="bg-card border border-border rounded-lg overflow-hidden">
//         <div className="px-4 py-3 border-b border-border bg-muted/30">
//           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Collections</span>
//         </div>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="text-xs">Customer</TableHead>
//               <TableHead className="text-xs">EMI #</TableHead>
//               <TableHead className="text-xs">Due Date</TableHead>
//               <TableHead className="text-xs">Amount (INR)</TableHead>
//               <TableHead className="text-xs">Status</TableHead>
//               <TableHead className="text-xs text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {pendingEmis.slice(0, 20).map((emi, i) => {
//               const cust = assignedCustomers.find(c => c.id === emi.customerId);
//               return (
//                 <TableRow key={emi.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
//                   <TableCell className="text-sm font-medium">{cust?.name || '-'}</TableCell>
//                   <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
//                   <TableCell className="text-sm font-mono tabular-nums">{emi.dueDate}</TableCell>
//                   <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
//                   <TableCell><StatusBadge status={emi.status} /></TableCell>
//                   <TableCell className="text-right">
//                     <Button size="sm" variant="outline" className="text-xs" onClick={() => markCollected(emi.id)}>
//                       Mark Collected
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { formatINR } from '@/lib/mock-data';
import { Users, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://finance-vfm-backend.onrender.com/api';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collectingEmi, setCollectingEmi] = useState<string | null>(null);

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
      const response = await axios.get(`${API_URL}/agent/dashboard`, getAuthHeaders());
      setDashboard(response.data.data);
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markCollected = async (emiId: string) => {
    setCollectingEmi(emiId);
    try {
      await axios.post(`${API_URL}/agent/collect-emi/${emiId}`, 
        { paymentMode: 'Cash' }, 
        getAuthHeaders()
      );
      toast.success('EMI marked as collected');
      fetchDashboard();
    } catch (error: any) {
      console.error('Error collecting EMI:', error);
      toast.error(error.response?.data?.message || 'Failed to collect EMI');
    } finally {
      setCollectingEmi(null);
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

  const { summary, assignedCustomers, pendingEmis } = dashboard;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Collection Dashboard" description={`Agent: ${user?.name}`} />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Assigned Customers" value={summary.assignedCustomers} icon={Users} />
        <StatCard 
          title="Pending Collections" 
          value={summary.pendingCollections} 
          icon={Receipt} 
          trend={`₹${formatINR(summary.totalToCollect)} to collect`} 
        />
        <StatCard title="Collected" value={summary.completedCollections} icon={CheckCircle} />
        <StatCard title="Overdue" value={summary.overdueCollections} icon={AlertCircle} trend="Needs attention" />
      </div>

      {/* Pending Collections Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Pending Collections ({pendingEmis?.length || 0})
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">EMI #</TableHead>
              <TableHead className="text-xs">Due Date</TableHead>
              <TableHead className="text-xs">Amount (INR)</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingEmis?.slice(0, 20).map((emi: any, i: number) => {
              const cust = assignedCustomers?.find((c: any) => c._id === emi.customerId?._id);
              const isOverdue = new Date(emi.dueDate) < new Date();
              
              return (
                <TableRow key={emi._id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <TableCell className="text-sm font-medium">{cust?.name || emi.customerId?.name || '-'}</TableCell>
                  <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
                  <TableCell className="text-sm font-mono tabular-nums">
                    {new Date(emi.dueDate).toLocaleDateString('en-IN')}
                    {isOverdue && emi.status !== 'Paid' && (
                      <span className="ml-2 text-xs text-destructive">(Overdue)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
                  <TableCell><StatusBadge status={emi.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => markCollected(emi._id)}
                      disabled={collectingEmi === emi._id}
                    >
                      {collectingEmi === emi._id ? 'Processing...' : 'Mark Collected'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {(!pendingEmis || pendingEmis.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No pending collections
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

