export interface User {
  id: number;
  username: string;
  password?: string; // Optional, never sent to frontend in responses
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER' | 'EMPLOYEE';
  enabled?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  sessionId?: string;
}

export interface CustomerRegistration {
  ssnId: string;
  customerName: string;
  email: string;
  password: string;
  username?: string; // Derived from email
  contactNumber: string;
  initialDeposit: number;
  aadharNumber: string;
  panNumber: string;
  accountNumber: string;
  accountType: 'Current' | 'Savings';
  address: string;
}

export interface Customer {
  ssnId: string;
  customerName: string;
  email: string;
  address: string;
  contactNumber: string;
  aadharNumber: string;
  panNumber: string;
  accountNumber: string;
  initialDeposit: number;
  age?: number;
  dateOfBirth?: string;
  city?: string;
  gender?: 'M' | 'F';
  accountType?: 'Current' | 'Savings';
  balance: number;
}

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  designation: 'Clerk' | 'Manager' | 'Accountant';
  salary: number;
}

export interface Manager {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  designation: 'Manager';
  salary: number;
}

export interface Transaction {
  id: number;
  sourceAccount: string;
  destinationAccount: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  description?: string;
}

