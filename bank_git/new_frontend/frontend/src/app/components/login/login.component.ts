import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="login-container">
        <div class="card">
          <div class="card-header text-center">
            <h1 class="text-2xl font-bold">Bank Login</h1>
            <p class="mt-2">Please select your role and enter your credentials</p>
          </div>
          
          <div class="card-body">
            <!-- Role Tabs -->
            <div class="tabs">
              <div class="tab" 
                   [class.active]="selectedRole === 'CUSTOMER'"
                   (click)="selectRole('CUSTOMER')">
                Customer
              </div>
              <div class="tab" 
                   [class.active]="selectedRole === 'EMPLOYEE'"
                   (click)="selectRole('EMPLOYEE')">
                Employee
              </div>
              <div class="tab" 
                   [class.active]="selectedRole === 'MANAGER'"
                   (click)="selectRole('MANAGER')">
                Manager
              </div>
            </div>

            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
              <div class="form-group">
                <label class="form-label">
                  {{ selectedRole === 'CUSTOMER' ? 'SSN' : 'Username/Email' }}
                </label>
                <input 
                  type="text" 
                  class="form-control"
                  [class.error]="loginForm.get('identifier')?.invalid && loginForm.get('identifier')?.touched"
                  formControlName="identifier"
                  [placeholder]="selectedRole === 'CUSTOMER' ? 'Enter your SSN' : 'Enter your username or email'"
                />
                <div class="error-message" 
                     *ngIf="loginForm.get('identifier')?.invalid && loginForm.get('identifier')?.touched">
                  This field is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control"
                  [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  formControlName="password"
                  placeholder="Enter your password"
                />
                <div class="error-message" 
                     *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  Password is required
                </div>
                <div class="mt-1" *ngIf="selectedRole === 'EMPLOYEE' || selectedRole === 'MANAGER'">
                  <small class="text-gray-600">
                    Password must be at least 6 characters
                  </small>
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-full"
                  [disabled]="loginForm.invalid || isLoading"
                >
                  <span *ngIf="isLoading">Logging in...</span>
                  <span *ngIf="!isLoading">Login</span>
                </button>
              </div>
            </form>

            <!-- Customer Registration Link -->
            <div class="text-center mt-4" *ngIf="selectedRole === 'CUSTOMER'">
              <p class="text-gray-600">
                Don't have an account? 
                <a routerLink="/register" class="text-blue-600 hover:underline font-semibold">
                  Register here
                </a>
              </p>
            </div>

            <!-- Demo Credentials -->
            <div class="demo-credentials">
              <h3 class="font-semibold mb-2">Demo Credentials:</h3>
              <div class="demo-item" *ngIf="selectedRole === 'CUSTOMER'">
                <strong>Customer:</strong> SSN: 1234567, Password: password123
              </div>
              <div class="demo-item" *ngIf="selectedRole === 'EMPLOYEE'">
                <strong>Employee:</strong> Username: employee1, Password: Employee123
              </div>
              <div class="demo-item" *ngIf="selectedRole === 'MANAGER'">
                <strong>Manager:</strong> Username: manager1, Password: Manager123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }

    .card {
      width: 100%;
      max-width: 480px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }

    .card-body {
      padding: 2rem;
    }

    .tabs {
      display: flex;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .tab {
      flex: 1;
      padding: 0.75rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;
      font-weight: 500;
    }

    .tab.active {
      color: #2563eb;
      border-bottom-color: #2563eb;
    }

    .tab:hover {
      background-color: #f9fafb;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-control.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-credentials {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .demo-item {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #475569;
    }

    .text-gray-600 {
      color: #4b5563;
    }

    .text-blue-600 {
      color: #2563eb;
    }

    .hover\\:underline:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 1rem;
      }

      .card-body {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  selectedRole: 'CUSTOMER' | 'EMPLOYEE' | 'MANAGER' = 'CUSTOMER';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    this.authService.getCurrentSession().subscribe({
      next: (session) => {
        if (session && session.role) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        // No active session, proceed with login
      }
    });
  }

  selectRole(role: 'CUSTOMER' | 'EMPLOYEE' | 'MANAGER'): void {
    this.selectedRole = role;
    this.loginForm.reset();
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const loginData = {
        username: this.loginForm.value.identifier,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.showSuccess(`Welcome back, ${response.user.username}!`);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.error || error.error?.message || 'Login failed. Please try again.';
          this.notificationService.showError(errorMessage);
        }
      });
    }
  }
}
