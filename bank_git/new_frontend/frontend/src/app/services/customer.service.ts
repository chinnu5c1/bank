import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError,of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Customer, Transaction, CustomerRegistration } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  private readonly customerApiUrl = 'http://localhost:8082/api/customers';
  private readonly accountApiUrl = 'http://localhost:8083/api/accounts';

  constructor(private http: HttpClient) {}

  getCustomers(page: number = 1, pageSize: number = 8): Observable<{customers: Customer[], total: number}> {
    // Backend doesn't support pagination yet, so fetch all and slice client-side
    return this.getAllCustomers().pipe(
      map(customers => {
        const total = customers.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCustomers = customers.slice(startIndex, endIndex);
        return { customers: paginatedCustomers, total };
      }),
      catchError(error => {
        console.error('Failed to load customers:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to load customers'));
      })
    );
  }

  getActiveCustomers(page: number = 1, pageSize: number = 8): Observable<{customers: Customer[], total: number}> {
    // Assume all customers are active (backend has no isActive field)
    return this.getCustomers(page, pageSize);
  }

  getCustomerById(id: string): Observable<Customer | null> {
    // Assuming ID is SSN for customers
    return this.getCustomerBySsnId(id).pipe(
      map(customer => customer || null)
    );
  }

  getCustomerBySsnId(ssnId: string): Observable<Customer | null> {
    return this.http.get<Customer>(`${this.customerApiUrl}/${ssnId}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to fetch customer:', error);
        return of(null);
      })
    );
  }

  searchCustomerBySsnId(ssnId: string): Observable<Customer | null> {
    return this.getCustomerBySsnId(ssnId);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    const customerData = {
      ssnId: customer.ssnId,
      customerName: customer.customerName,
      email: customer.email,
      contactNumber: customer.contactNumber,
      aadharNumber: customer.aadharNumber,
      panNumber: customer.panNumber,
      accountNumber: customer.accountNumber,
      initialDeposit: customer.initialDeposit,
      address: customer.address,
      city: customer.city || '',
      age: customer.age,
      dateOfBirth: customer.dateOfBirth,
      gender: customer.gender,
      accountType: customer.accountType,
      balance: customer.initialDeposit || 0
    };

    return this.http.post<Customer>(`${this.customerApiUrl}`, customerData, { withCredentials: true }).pipe(
      map(createdCustomer => {
        this.customersSubject.next([...this.customersSubject.value, createdCustomer]);
        return createdCustomer;
      }),
      catchError(error => {
        console.error('Failed to create customer:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create customer'));
      })
    );
  }

  updateCustomer(ssnId: string, updates: Partial<Customer>): Observable<Customer> {
    // Remove immutable fields
    const { ssnId: _, ...updateData } = updates;

    return this.http.put<Customer>(`${this.customerApiUrl}/${ssnId}`, updateData, { withCredentials: true }).pipe(
      map(updatedCustomer => {
        const currentCustomers = this.customersSubject.value;
        const index = currentCustomers.findIndex(c => c.ssnId === ssnId);
        if (index !== -1) {
          const newCustomers = [...currentCustomers];
          newCustomers[index] = updatedCustomer;
          this.customersSubject.next(newCustomers);
        }
        return updatedCustomer;
      }),
      catchError(error => {
        console.error('Failed to update customer:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update customer'));
      })
    );
  }

  deleteCustomer(ssnId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.customerApiUrl}/${ssnId}`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Failed to delete customer:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete customer'));
      })
    );
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.customerApiUrl}`, { withCredentials: true }).pipe(
      map(customers => {
        this.customersSubject.next(customers);
        return customers;
      }),
      catchError(error => {
        console.error('Failed to load all customers:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to load customers'));
      })
    );
  }

  existsByAccountNumber(accountNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.customerApiUrl}/exists/account/${accountNumber}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to check account existence:', error);
        return of(false);
      })
    );
  }

  getTotalCustomerCount(): Observable<number> {
    return this.http.get<number>(`${this.customerApiUrl}/count`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to get customer count:', error);
        return of(0);
      })
    );
  }

  // Banking operations (via Account Service)
  deposit(accountNumber: string, amount: number): Observable<Transaction> {
    const depositData = { amount };
    return this.http.post<Transaction>(`${this.accountApiUrl}/${accountNumber}/deposit`, depositData, { withCredentials: true }).pipe(
      map(transaction => {
        this.transactionsSubject.next([...this.transactionsSubject.value, transaction]);
        return transaction;
      }),
      catchError(error => {
        console.error('Deposit failed:', error);
        return throwError(() => new Error(error.error?.message || 'Deposit failed'));
      })
    );
  }

  withdraw(accountNumber: string, amount: number): Observable<Transaction> {
    const withdrawData = { amount };
    return this.http.post<Transaction>(`${this.accountApiUrl}/${accountNumber}/withdraw`, withdrawData, { withCredentials: true }).pipe(
      map(transaction => {
        this.transactionsSubject.next([...this.transactionsSubject.value, transaction]);
        return transaction;
      }),
      catchError(error => {
        console.error('Withdrawal failed:', error);
        return throwError(() => new Error(error.error?.message || 'Withdrawal failed'));
      })
    );
  }

  transfer(sourceAccount: string, destinationAccount: string, amount: number): Observable<Transaction> {
    const transferData = { sourceAccount, destinationAccount, amount };
    return this.http.post<Transaction>(`${this.accountApiUrl}/transfer`, transferData, { withCredentials: true }).pipe(
      map(transaction => {
        this.transactionsSubject.next([...this.transactionsSubject.value, transaction]);
        return transaction;
      }),
      catchError(error => {
        console.error('Transfer failed:', error);
        return throwError(() => new Error(error.error?.message || 'Transfer failed'));
      })
    );
  }

  getTransactions(accountNumber: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.accountApiUrl}/${accountNumber}/transactions`, { withCredentials: true }).pipe(
      map(transactions => {
        this.transactionsSubject.next(transactions);
        return transactions;
      }),
      catchError(error => {
        console.error('Failed to load transactions:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to load transactions'));
      })
    );
  }

  // Convenience methods for chaining with AuthService
  registerUser(userData: { username: string, password: string, email: string, role: string }): Observable<User> {
    return this.http.post<User>('http://localhost:8084/api/auth/register', userData, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to register user:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to register user'));
      })
    );
  }

  getCustomerByAccountNumber(accountNumber: string): Observable<Customer | null> {
    return this.http.get<Customer>(`${this.customerApiUrl}/account/${accountNumber}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to fetch customer by account:', error);
        return of(null);
      })
    );
  }
}
