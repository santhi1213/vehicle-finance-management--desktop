export type Role = 'admin' | 'customer' | 'agent';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface Vehicle {
  id: string;
  type: 'Bike' | 'Car';
  name: string;
  model: string;
  price: number;
  status: 'Available' | 'Sold Out';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  aadhaar: string;
  assignedAgentId: string;
}

export interface CollectionAgent {
  id: string;
  name: string;
  age: number;
  aadhaar: string;
  address: string;
  phone: string;
  photoUrl?: string;
  aadhaarImageUrl?: string;
}

export interface Sale {
  id: string;
  vehicleId: string;
  customerId: string;
  sellingPrice: number;
  paymentType: 'Full Payment' | 'Finance';
  downPayment?: number;
  paymentMode?: 'Cash' | 'Online';
  financeAmount?: number;
  documentationCharges?: number;
  rtoCharges?: number;
  interestRate?: number;
  tenure?: number;
  emi?: number;
  date: string;
}

export interface EMIRecord {
  id: string;
  saleId: string;
  customerId: string;
  installmentNo: number;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
}

export interface Notification {
  id: string;
  type: 'emi_reminder' | 'emi_paid' | 'emi_overdue';
  message: string;
  date: string;
  read: boolean;
  targetRole: Role;
  targetUserId?: string;
}
