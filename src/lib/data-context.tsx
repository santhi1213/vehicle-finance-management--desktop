import React, { createContext, useContext, useState } from 'react';
import { Vehicle, Customer, CollectionAgent, Sale, EMIRecord, Notification } from './types';
import { mockVehicles, mockCustomers, mockAgents, mockSales, mockEMIs, mockNotifications } from './mock-data';

interface DataContextType {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  agents: CollectionAgent[];
  setAgents: React.Dispatch<React.SetStateAction<CollectionAgent[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  emis: EMIRecord[];
  setEmis: React.Dispatch<React.SetStateAction<EMIRecord[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [agents, setAgents] = useState<CollectionAgent[]>(mockAgents);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [emis, setEmis] = useState<EMIRecord[]>(mockEMIs);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  return (
    <DataContext.Provider value={{ vehicles, setVehicles, customers, setCustomers, agents, setAgents, sales, setSales, emis, setEmis, notifications, setNotifications }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
