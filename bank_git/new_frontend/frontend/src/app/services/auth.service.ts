import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, CustomerRegistration } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private readonly apiUrl = 'http://localhost:8084/api/auth';

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.getCurrentSession().subscribe({
      next: (session) => {
        if (session) {
          const user: User = {
            id: session.userId,
            username: session.username,
            email: '', // Fetch full user if needed
            role: session.role as 'CUSTOMER' | 'EMPLOYEE' | 'MANAGER',
            enabled: true,
            createdAt: '',
            lastLogin: ''
          };
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
        }
      },
      error: () => {
        // No active session
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
      }
    });
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest, { withCredentials: true }).pipe(
      map(response => {
        if (response.user) {
          this.currentUserSubject.next(response.user);
          this.isLoggedInSubject.next(true);
        }
        return response;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => new Error(error.error?.error || error.error?.message || 'Login failed'));
      })
    );
  }

  register(registration: CustomerRegistration): Observable<User> {
    // First, register user in Auth Service
    const userData = {
      username: registration.email, // Use email as username
      password: registration.password,
      email: registration.email,
      role: 'CUSTOMER'
    };

    return this.http.post<User>(`${this.apiUrl}/register`, userData, { withCredentials: true }).pipe(
      map(user => {
        // User registration successful
        return user;
      }),
      catchError(error => {
        console.error('User registration failed:', error);
        return throwError(() => new Error(error.error?.message || 'User registration failed'));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
        return { message: 'Logout successful' };
      }),
      catchError(error => {
        console.error('Logout failed:', error);
        // Force logout on frontend even if backend fails
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
        return throwError(() => new Error(error.error?.message || 'Logout failed'));
      })
    );
  }

  getCurrentSession(): Observable<{ userId: number, username: string, role: string } | null> {
    return this.http.get<{ userId: number, username: string, role: string }>(`${this.apiUrl}/session`, { withCredentials: true }).pipe(
      map(session => session || null),
      catchError(error => {
        console.error('Session check failed:', error);
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role.toUpperCase() === role.toUpperCase() : false;
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`, { withCredentials: true }).pipe(
      map(user => {
        // Hide password if present
        user.password = undefined;
        return user;
      }),
      catchError(error => {
        console.error('Failed to fetch user:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch user'));
      })
    );
  }
}

