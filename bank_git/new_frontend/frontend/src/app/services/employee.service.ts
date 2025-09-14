import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError,of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  private readonly apiUrl = 'http://localhost:8081/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(page: number = 1, pageSize: number = 8): Observable<{employees: Employee[], total: number}> {
    // Backend doesn't support pagination yet, so fetch all and slice client-side
    return this.getAllEmployees().pipe(
      map(employees => {
        const total = employees.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedEmployees = employees.slice(startIndex, endIndex);
        return { employees: paginatedEmployees, total };
      }),
      catchError(error => {
        console.error('Failed to load employees:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to load employees'));
      })
    );
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}`, { withCredentials: true }).pipe(
      map(employees => {
        this.employeesSubject.next(employees);
        return employees;
      }),
      catchError(error => {
        console.error('Failed to load all employees:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to load employees'));
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee | null> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to fetch employee:', error);
        return of(null);
      })
    );
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    const employeeData = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      contactNumber: employee.contactNumber,
      designation: employee.designation,
      salary: employee.salary
    };

    return this.http.post<Employee>(`${this.apiUrl}`, employeeData, { withCredentials: true }).pipe(
      map(createdEmployee => {
        this.employeesSubject.next([...this.employeesSubject.value, createdEmployee]);
        return createdEmployee;
      }),
      catchError(error => {
        console.error('Failed to create employee:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create employee'));
      })
    );
  }

  updateEmployee(id: number, updates: Partial<Employee>): Observable<Employee> {
    // Remove immutable fields
    const { employeeId: _, ...updateData } = updates;

    return this.http.put<Employee>(`${this.apiUrl}/${id}`, updateData, { withCredentials: true }).pipe(
      map(updatedEmployee => {
        const currentEmployees = this.employeesSubject.value;
        const index = currentEmployees.findIndex(e => e.employeeId === id);
        if (index !== -1) {
          const newEmployees = [...currentEmployees];
          newEmployees[index] = updatedEmployee;
          this.employeesSubject.next(newEmployees);
        }
        return updatedEmployee;
      }),
      catchError(error => {
        console.error('Failed to update employee:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update employee'));
      })
    );
  }

  deleteEmployee(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Failed to delete employee:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete employee'));
      })
    );
  }

  getEmployeesByDesignation(designation: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/designation/${designation}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to fetch employees by designation:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch employees by designation'));
      })
    );
  }

  addSalaryToClerkEmployees(amount: number): Observable<Employee[]> {
    return this.http.put<Employee[]>(`${this.apiUrl}/salary/clerk/add/${amount}`, {}, { withCredentials: true }).pipe(
      map(employees => {
        this.employeesSubject.next(this.employeesSubject.value.map(emp => 
          emp.designation === 'Clerk' ? employees.find(e => e.employeeId === emp.employeeId) || emp : emp
        ));
        return employees;
      }),
      catchError(error => {
        console.error('Failed to add salary to clerks:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to add salary'));
      })
    );
  }

  addPercentageSalaryToManagers(percentage: number): Observable<Employee[]> {
    return this.http.put<Employee[]>(`${this.apiUrl}/salary/manager/percentage/${percentage}`, {}, { withCredentials: true }).pipe(
      map(employees => {
        this.employeesSubject.next(this.employeesSubject.value.map(emp => 
          emp.designation === 'Manager' ? employees.find(e => e.employeeId === emp.employeeId) || emp : emp
        ));
        return employees;
      }),
      catchError(error => {
        console.error('Failed to add percentage salary to managers:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to add percentage salary'));
      })
    );
  }

  getUpdatedEmployeesByDesignation(designation: string): Observable<Employee[]> {
    return this.getEmployeesByDesignation(designation);
  }
}