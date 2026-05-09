// import { useAuth } from '@/lib/auth-context';
// import { useData } from '@/lib/data-context';
// import { PageHeader } from '@/components/PageHeader';
// import { StatusBadge } from '@/components/StatusBadge';
// import { formatINR } from '@/lib/mock-data';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// export default function AgentCollections() {
//   const { user } = useAuth();
//   const { agents, customers, emis, setEmis, sales, vehicles } = useData();

//   const agent = agents.find(a => a.name === user?.name);
//   const assignedCustomers = agent ? customers.filter(c => c.assignedAgentId === agent.id) : [];
//   const customerIds = assignedCustomers.map(c => c.id);
//   const agentEmis = emis.filter(e => customerIds.includes(e.customerId));

//   const markCollected = (emiId: string) => {
//     setEmis(prev => prev.map(e => e.id === emiId ? { ...e, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : e));
//     toast.success('EMI collected');
//   };

//   return (
//     <div className="animate-fade-in">
//       <PageHeader title="All Collections" description={`${agentEmis.length} total EMIs`} />

//       {assignedCustomers.map(cust => {
//         const custEmis = agentEmis.filter(e => e.customerId === cust.id);
//         if (custEmis.length === 0) return null;
//         return (
//           <div key={cust.id} className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border bg-muted/30">
//               <span className="text-sm font-medium">{cust.name}</span>
//               <span className="text-xs text-muted-foreground ml-2 font-mono">{cust.phone}</span>
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
//                 {custEmis.slice(0, 12).map((emi, i) => (
//                   <TableRow key={emi.id}>
//                     <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{emi.dueDate}</TableCell>
//                     <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
//                     <TableCell><StatusBadge status={emi.status} /></TableCell>
//                     <TableCell className="text-right">
//                       {emi.status !== 'Paid' && (
//                         <Button size="sm" variant="outline" className="text-xs" onClick={() => markCollected(emi.id)}>Collect</Button>
//                       )}
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://finance-vfm-backend.onrender.com/api';

export default function AgentCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collectingEmi, setCollectingEmi] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}/agent/collections`, getAuthHeaders());
      setCollections(response.data.data);
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      toast.error(error.response?.data?.message || 'Failed to load collections');
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
      toast.success('EMI collected successfully');
      fetchCollections();
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

  if (!collections) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load collections data</p>
        <Button onClick={fetchCollections} className="mt-4">Retry</Button>
      </div>
    );
  }

  const { groupedByCustomer, allEmis, pending, paid } = collections;
  
  const filterEmisByStatus = (status: string) => {
    if (status === 'pending') {
      return allEmis?.filter((e: any) => e.status !== 'Paid') || [];
    }
    return allEmis?.filter((e: any) => e.status === 'Paid') || [];
  };

  const displayedEmis = filterEmisByStatus(activeTab);

  return (
    <div className="animate-fade-in">
      <PageHeader title="All Collections" description={`${allEmis?.length || 0} total EMIs`} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paid || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {/* Grouped by Customer View for Pending */}
          {groupedByCustomer?.map((group: any) => {
            const pendingEmis = group.emis.filter((e: any) => e.status !== 'Paid');
            if (pendingEmis.length === 0) return null;
            
            return (
              <div key={group.customer._id} className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <span className="text-sm font-medium">{group.customer.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 font-mono">{group.customer.phone}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({pendingEmis.length} pending)
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">#</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Amount (INR)</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEmis.slice(0, 12).map((emi: any) => {
                      const isOverdue = new Date(emi.dueDate) < new Date();
                      return (
                        <TableRow key={emi._id}>
                          <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
                          <TableCell className="text-sm font-mono tabular-nums">
                            {new Date(emi.dueDate).toLocaleDateString('en-IN')}
                            {isOverdue && (
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
                              {collectingEmi === emi._id ? 'Processing...' : 'Collect'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="paid">
          {/* Paid EMIs Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">EMI #</TableHead>
                  <TableHead className="text-xs">Amount (INR)</TableHead>
                  <TableHead className="text-xs">Paid Date</TableHead>
                  <TableHead className="text-xs">Payment Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedEmis.map((emi: any) => (
                  <TableRow key={emi._id}>
                    <TableCell className="text-sm font-medium">{emi.customerId?.name || '-'}</TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">{emi.installmentNo}</TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">{formatINR(emi.amount)}</TableCell>
                    <TableCell className="text-sm font-mono tabular-nums">
                      {emi.paidDate ? new Date(emi.paidDate).toLocaleDateString('en-IN') : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{emi.paymentMode || 'Cash'}</TableCell>
                  </TableRow>
                ))}
                {displayedEmis.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No paid collections found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}