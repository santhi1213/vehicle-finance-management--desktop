import { Vehicle, Customer, CollectionAgent, Sale, EMIRecord, Notification, User } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Vikram Sharma', role: 'admin', email: 'admin@vfm.com' },
  { id: 'u2', name: 'Rajesh Kumar', role: 'customer', email: 'rajesh@mail.com' },
  { id: 'u3', name: 'Priya Patel', role: 'customer', email: 'priya@mail.com' },
  { id: 'u4', name: 'Suresh Reddy', role: 'agent', email: 'suresh@vfm.com' },
  { id: 'u5', name: 'Amit Joshi', role: 'agent', email: 'amit@vfm.com' },
];

export const mockVehicles: Vehicle[] = [
  { id: 'V001', type: 'Car', name: 'Honda', model: 'City 2024', price: 1200000, status: 'Available' },
  { id: 'V002', type: 'Car', name: 'Hyundai', model: 'Creta 2024', price: 1500000, status: 'Sold Out' },
  { id: 'V003', type: 'Bike', name: 'Royal Enfield', model: 'Classic 350', price: 210000, status: 'Available' },
  { id: 'V004', type: 'Car', name: 'Maruti', model: 'Swift 2024', price: 850000, status: 'Available' },
  { id: 'V005', type: 'Bike', name: 'Honda', model: 'Activa 6G', price: 82000, status: 'Sold Out' },
  { id: 'V006', type: 'Car', name: 'Tata', model: 'Nexon 2024', price: 1100000, status: 'Available' },
  { id: 'V007', type: 'Bike', name: 'TVS', model: 'Apache RTR 200', price: 145000, status: 'Available' },
  { id: 'V008', type: 'Car', name: 'Kia', model: 'Seltos 2024', price: 1350000, status: 'Available' },
];

export const mockAgents: CollectionAgent[] = [
  { id: 'a1', name: 'Suresh Reddy', age: 32, aadhaar: '4567 8901 2345', address: '45, MG Road, Hyderabad', phone: '9876543210' },
  { id: 'a2', name: 'Amit Joshi', age: 28, aadhaar: '7890 1234 5678', address: '12, Gandhi Nagar, Pune', phone: '9876543211' },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Rajesh Kumar', phone: '9988776655', address: '23, Lajpat Nagar, New Delhi', aadhaar: '1234 5678 9012', assignedAgentId: 'a1' },
  { id: 'c2', name: 'Priya Patel', phone: '9988776656', address: '56, Koregaon Park, Pune', aadhaar: '2345 6789 0123', assignedAgentId: 'a2' },
  { id: 'c3', name: 'Arun Mehta', phone: '9988776657', address: '78, Banjara Hills, Hyderabad', aadhaar: '3456 7890 1234', assignedAgentId: 'a1' },
];

export const mockSales: Sale[] = [
  {
    id: 's1', vehicleId: 'V002', customerId: 'c1', sellingPrice: 1500000,
    paymentType: 'Finance', downPayment: 500000, paymentMode: 'Cash',
    financeAmount: 1000000, documentationCharges: 5000, rtoCharges: 25000,
    interestRate: 12, tenure: 36, emi: 33214, date: '2024-06-15',
  },
  {
    id: 's2', vehicleId: 'V005', customerId: 'c2', sellingPrice: 82000,
    paymentType: 'Finance', downPayment: 20000, paymentMode: 'Online',
    financeAmount: 62000, documentationCharges: 1000, rtoCharges: 3000,
    interestRate: 14, tenure: 12, emi: 5574, date: '2024-09-01',
  },
];

function generateEMIs(sale: Sale): EMIRecord[] {
  if (sale.paymentType !== 'Finance' || !sale.tenure || !sale.emi) return [];
  const emis: EMIRecord[] = [];
  const startDate = new Date(sale.date);
  for (let i = 1; i <= sale.tenure; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    const isPast = dueDate < new Date();
    const isPaid = isPast && Math.random() > 0.15;
    emis.push({
      id: `emi-${sale.id}-${i}`,
      saleId: sale.id,
      customerId: sale.customerId,
      installmentNo: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: sale.emi,
      status: isPaid ? 'Paid' : isPast ? 'Overdue' : 'Pending',
      paidDate: isPaid ? dueDate.toISOString().split('T')[0] : undefined,
    });
  }
  return emis;
}

export const mockEMIs: EMIRecord[] = mockSales.flatMap(generateEMIs);

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'emi_reminder', message: 'EMI of ₹33,214 due in 2 days for Rajesh Kumar', date: '2025-03-12', read: false, targetRole: 'customer', targetUserId: 'u2' },
  { id: 'n2', type: 'emi_paid', message: 'EMI payment of ₹5,574 received from Priya Patel', date: '2025-03-10', read: false, targetRole: 'admin' },
  { id: 'n3', type: 'emi_overdue', message: 'EMI overdue for customer Arun Mehta', date: '2025-03-08', read: true, targetRole: 'agent', targetUserId: 'u4' },
];

export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  return Math.round(principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1));
}

export function formatINR(amount: number): string {
  return amount.toLocaleString('en-IN');
}
