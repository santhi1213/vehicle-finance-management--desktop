
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Truck, ShoppingCart, Receipt, AlertTriangle, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
// import { useData } from '@/lib/data-context';
// // import { StatCard } from '@/components/StatCard';
// // import { PageHeader } from '@/components/PageHeader';
// // import { Truck, ShoppingCart, Receipt, AlertTriangle, Users } from 'lucide-react';
// // import { formatINR } from '@/lib/mock-data';
// // import { StatusBadge } from '@/components/StatusBadge';
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// const formatINR = (amount) => {
//   if (!amount && amount !== 0) return '0';
//   return new Intl.NumberFormat('en-IN', {
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const getStatusColor = () => {
//     switch (status?.toLowerCase()) {
//       case 'paid':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'overdue':
//         return 'bg-red-100 text-red-800';
//       case 'active':
//         return 'bg-blue-100 text-blue-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
//       {status || 'Unknown'}
//     </span>
//   );
// };

// // Stat Card Component
// const StatCard = ({ title, value, icon: Icon, trend = undefined }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//           {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
//         </div>
//         <div className="p-3 bg-blue-50 rounded-full">
//           <Icon className="h-5 w-5 text-blue-600" />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Loading Skeleton Component
// const DashboardSkeleton = () => {
//   return (
//     <div className="animate-pulse">
//       <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
      
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
//             <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
//             <div className="h-8 w-16 bg-gray-200 rounded" />
//           </div>
//         ))}
//       </div>
      
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
//           <div className="h-12 w-full bg-gray-200 rounded mb-2" />
//           <div className="h-2 w-full bg-gray-200 rounded" />
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="flex items-center gap-3 mb-3">
//               <div className="h-4 w-12 bg-gray-200 rounded" />
//               <div className="h-8 flex-1 bg-gray-200 rounded" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function AdminDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     summary: {
//       totalVehicles: 0,
//       soldVehicles: 0,
//       activeLoans: 0,
//       pendingEmis: 0,
//       totalPendingAmount: 0,
//       paidEmis: 0,
//       totalEmis: 0,
//       efficiency: 0,
//       totalCustomers: 0,
//       totalRevenue: 0
//     },
//     recentOverdue: [],
//     charts: {
//       monthlyCollection: [],
//       vehicleTypeDistribution: [],
//       topAgents: []
//     }
//   });

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://finance-vfm-backend.onrender.com/api';

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch dashboard statistics
//       const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      
//       if (statsResponse.data.success) {
//         setStats(statsResponse.data.data);
//       }

//       // Fetch additional data for customers and revenue if needed
//       const customersResponse = await axios.get(`${API_BASE_URL}/customers?limit=1`);
//       const salesResponse = await axios.get(`${API_BASE_URL}/sales/stats`);
      
//       if (customersResponse.data.success) {
//         setStats(prev => ({
//           ...prev,
//           summary: {
//             ...prev.summary,
//             totalCustomers: customersResponse.data.total || 0
//           }
//         }));
//       }

//       if (salesResponse.data.success && salesResponse.data.data.summary) {
//         setStats(prev => ({
//           ...prev,
//           summary: {
//             ...prev.summary,
//             totalRevenue: salesResponse.data.data.summary.totalRevenue || 0
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       // You can add toast notification here if you have a toast system
//       alert('Failed to fetch dashboard data. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <DashboardSkeleton />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Vehicle Portfolio Overview</h1>
//           <p className="text-gray-600 mt-1">Dashboard & Analytics</p>
//         </div>

//         {/* Stats Cards - Row 1 */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatCard 
//             title="Total Vehicles" 
//             value={stats.summary.totalVehicles} 
//             icon={Truck} 
//           />
//           <StatCard 
//             title="Sold Vehicles" 
//             value={stats.summary.soldVehicles} 
//             icon={ShoppingCart} 
//           />
//           <StatCard 
//             title="Active Loans" 
//             value={stats.summary.activeLoans} 
//             icon={Receipt} 
//           />
//           <StatCard 
//             title="Pending EMIs" 
//             value={stats.summary.pendingEmis} 
//             icon={AlertTriangle} 
//             trend={`₹${formatINR(stats.summary.totalPendingAmount)} outstanding`}
//           />
//         </div>

//         {/* Stats Cards - Row 2 */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard 
//             title="Total Customers" 
//             value={stats.summary.totalCustomers} 
//             icon={Users} 
//           />
//           <StatCard 
//             title="Total Revenue" 
//             value={`₹${formatINR(stats.summary.totalRevenue)}`} 
//             icon={DollarSign} 
//           />
//           <StatCard 
//             title="Collection Efficiency" 
//             value={`${stats.summary.efficiency}%`} 
//             icon={TrendingUp} 
//           />
//           <StatCard 
//             title="Total EMIs" 
//             value={`${stats.summary.paidEmis}/${stats.summary.totalEmis}`} 
//             icon={Clock} 
//           />
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* Collection Efficiency Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
//               Collection Efficiency
//             </h3>
//             <div className="text-4xl font-mono font-bold tabular-nums text-blue-600">
//               {stats.summary.efficiency}%
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               {stats.summary.paidEmis} of {stats.summary.totalEmis} EMIs collected
//             </p>
//             <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-blue-600 rounded-full transition-all" 
//                 style={{ width: `${stats.summary.efficiency}%` }} 
//               />
//             </div>
//           </div>

//           {/* Monthly Collection Chart */}
//           <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
//               Monthly Collection Trend
//             </h3>
//             {stats.charts.monthlyCollection && stats.charts.monthlyCollection.length > 0 ? (
//               <div className="space-y-3">
//                 {stats.charts.monthlyCollection.map((month, index) => {
//                   const maxAmount = Math.max(...stats.charts.monthlyCollection.map(m => m.amount), 1);
//                   const percentage = (month.amount / maxAmount) * 100;
//                   return (
//                     <div key={index} className="flex items-center gap-3">
//                       <span className="text-sm font-mono w-12">{month.month}</span>
//                       <div className="flex-1 relative">
//                         <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
//                           <div 
//                             className="h-full bg-blue-600 rounded-full flex items-center justify-end px-3 text-xs text-white font-medium"
//                             style={{ width: `${percentage}%` }}
//                           >
//                             {month.amount > 0 && `₹${formatINR(month.amount)}`}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No collection data available</p>
//             )}
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6 mt-6">
//           {/* Overdue EMIs Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
//               Overdue EMIs
//             </h3>
//             {stats.recentOverdue && stats.recentOverdue.length === 0 ? (
//               <p className="text-sm text-gray-500">No overdue EMIs</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Customer</th>
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Amount (INR)</th>
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Due Date</th>
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stats.recentOverdue.map((emi) => (
//                       <tr key={emi._id} className="border-b border-gray-100">
//                         <td className="text-sm py-2">{emi.customer?.name || '-'}</td>
//                         <td className="text-sm font-mono tabular-nums py-2">
//                           ₹{formatINR(emi.amount)}
//                         </td>
//                         <td className="text-sm font-mono tabular-nums py-2">
//                           {new Date(emi.dueDate).toLocaleDateString()}
//                         </td>
//                         <td className="py-2">
//                           <StatusBadge status={emi.status} />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Top Performing Agents Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
//               Top Performing Agents
//             </h3>
//             {stats.charts.topAgents && stats.charts.topAgents.length === 0 ? (
//               <p className="text-sm text-gray-500">No agent data available</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Agent Name</th>
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Total Sales</th>
//                       <th className="text-left text-xs font-medium text-gray-500 pb-2">Revenue (INR)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stats.charts.topAgents?.map((agent) => (
//                       <tr key={agent._id} className="border-b border-gray-100">
//                         <td className="text-sm font-medium py-2">{agent.name}</td>
//                         <td className="text-sm py-2">{agent.totalSales}</td>
//                         <td className="text-sm font-mono tabular-nums py-2">
//                           ₹{formatINR(agent.totalRevenue)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Vehicle Type Distribution */}
//         <div className="mt-6">
//           <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
//               Vehicle Type Distribution
//             </h3>
//             {stats.charts.vehicleTypeDistribution && stats.charts.vehicleTypeDistribution.length === 0 ? (
//               <p className="text-sm text-gray-500">No vehicle data available</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {stats.charts.vehicleTypeDistribution?.map((type, index) => (
//                   <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium capitalize">{type.type}</p>
//                       <p className="text-xs text-gray-500">
//                         Available: {type.available} | Sold: {type.sold}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold">{type.count}</p>
//                       <p className="text-xs text-gray-500">Total</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Refresh Button */}
//         <div className="mt-8 flex justify-center">
//           <button
//             onClick={fetchDashboardData}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Loading...' : 'Refresh Dashboard'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, ShoppingCart, Receipt, AlertTriangle, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useData } from '@/lib/data-context';
// import { StatCard } from '@/components/StatCard';
// import { PageHeader } from '@/components/PageHeader';
// import { Truck, ShoppingCart, Receipt, AlertTriangle, Users } from 'lucide-react';
// import { formatINR } from '@/lib/mock-data';
// import { StatusBadge } from '@/components/StatusBadge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formatINR = (amount) => {
  if (!amount && amount !== 0) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend = undefined }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-12 w-full bg-gray-200 rounded mb-2" />
          <div className="h-2 w-full bg-gray-200 rounded" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="h-4 w-12 bg-gray-200 rounded" />
              <div className="h-8 flex-1 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    summary: {
      totalVehicles: 0,
      soldVehicles: 0,
      activeLoans: 0,
      pendingEmis: 0,
      totalPendingAmount: 0,
      paidEmis: 0,
      totalEmis: 0,
      efficiency: 0,
      totalCustomers: 0,
      totalRevenue: 0
    },
    recentOverdue: [],
    charts: {
      monthlyCollection: [],
      vehicleTypeDistribution: [],
      topAgents: []
    }
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://finance-vfm-backend.onrender.com/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch additional data for customers and revenue if needed
      const customersResponse = await axios.get(`${API_BASE_URL}/customers?limit=1`);
      const salesResponse = await axios.get(`${API_BASE_URL}/sales/stats`);
      
      if (customersResponse.data.success) {
        setStats(prev => ({
          ...prev,
          summary: {
            ...prev.summary,
            totalCustomers: customersResponse.data.total || 0
          }
        }));
      }

      if (salesResponse.data.success && salesResponse.data.data.summary) {
        setStats(prev => ({
          ...prev,
          summary: {
            ...prev.summary,
            totalRevenue: salesResponse.data.data.summary.totalRevenue || 0
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // You can add toast notification here if you have a toast system
      alert('Failed to fetch dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Portfolio Overview</h1>
          <p className="text-gray-600 mt-1">Dashboard & Analytics</p>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Vehicles" 
            value={stats.summary.totalVehicles} 
            icon={Truck} 
          />
          <StatCard 
            title="Sold Vehicles" 
            value={stats.summary.soldVehicles} 
            icon={ShoppingCart} 
          />
          <StatCard 
            title="Active Loans" 
            value={stats.summary.activeLoans} 
            icon={Receipt} 
          />
          <StatCard 
            title="Pending EMIs" 
            value={stats.summary.pendingEmis} 
            icon={AlertTriangle} 
            trend={`₹${formatINR(stats.summary.totalPendingAmount)} outstanding`}
          />
        </div>

        {/* Stats Cards - Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Customers" 
            value={stats.summary.totalCustomers} 
            icon={Users} 
          />
          <StatCard 
            title="Total Revenue" 
            value={`₹${formatINR(stats.summary.totalRevenue)}`} 
            icon={DollarSign} 
          />
          <StatCard 
            title="Collection Efficiency" 
            value={`${stats.summary.efficiency}%`} 
            icon={TrendingUp} 
          />
          <StatCard 
            title="Total EMIs" 
            value={`${stats.summary.paidEmis}/${stats.summary.totalEmis}`} 
            icon={Clock} 
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Collection Efficiency Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Collection Efficiency
            </h3>
            <div className="text-4xl font-mono font-bold tabular-nums text-blue-600">
              {stats.summary.efficiency}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.summary.paidEmis} of {stats.summary.totalEmis} EMIs collected
            </p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all" 
                style={{ width: `${stats.summary.efficiency}%` }} 
              />
            </div>
          </div>

          {/* Monthly Collection Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Monthly Collection Trend
            </h3>
            {stats.charts.monthlyCollection && stats.charts.monthlyCollection.length > 0 ? (
              <div className="space-y-3">
                {stats.charts.monthlyCollection.map((month, index) => {
                  const maxAmount = Math.max(...stats.charts.monthlyCollection.map(m => m.amount), 1);
                  const percentage = (month.amount / maxAmount) * 100;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-mono w-12">{month.month}</span>
                      <div className="flex-1 relative">
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full flex items-center justify-end px-3 text-xs text-white font-medium"
                            style={{ width: `${percentage}%` }}
                          >
                            {month.amount > 0 && `₹${formatINR(month.amount)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No collection data available</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Overdue EMIs Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Overdue EMIs
            </h3>
            {stats.recentOverdue && stats.recentOverdue.length === 0 ? (
              <p className="text-sm text-gray-500">No overdue EMIs</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Customer</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Amount (INR)</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Due Date</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOverdue.map((emi) => (
                      <tr key={emi._id} className="border-b border-gray-100">
                        <td className="text-sm py-2">{emi.customer?.name || '-'}</td>
                        <td className="text-sm font-mono tabular-nums py-2">
                          ₹{formatINR(emi.amount)}
                        </td>
                        <td className="text-sm font-mono tabular-nums py-2">
                          {new Date(emi.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          <StatusBadge status={emi.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Performing Agents Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Top Performing Agents
            </h3>
            {stats.charts.topAgents && stats.charts.topAgents.length === 0 ? (
              <p className="text-sm text-gray-500">No agent data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Agent Name</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Total Sales</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Revenue (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.charts.topAgents?.map((agent) => (
                      <tr key={agent._id} className="border-b border-gray-100">
                        <td className="text-sm font-medium py-2">{agent.name}</td>
                        <td className="text-sm py-2">{agent.totalSales}</td>
                        <td className="text-sm font-mono tabular-nums py-2">
                          ₹{formatINR(agent.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Vehicle Type Distribution
            </h3>
            {stats.charts.vehicleTypeDistribution && stats.charts.vehicleTypeDistribution.length === 0 ? (
              <p className="text-sm text-gray-500">No vehicle data available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.charts.vehicleTypeDistribution?.map((type, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{type.type}</p>
                      <p className="text-xs text-gray-500">
                        Available: {type.available} | Sold: {type.sold}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{type.count}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Refresh Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}