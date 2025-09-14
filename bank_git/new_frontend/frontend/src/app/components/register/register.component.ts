import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';
import { CustomerRegistration } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="register-container">
        <div class="card">
          <div class="card-header text-center">
            <h1 class="text-2xl font-bold">Customer Registration</h1>
            <p class="mt-2">Create your banking account</p>
          </div>
          
          <div class="card-body">
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">SSN *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [class.error]="registerForm.get('ssnId')?.invalid && registerForm.get('ssnId')?.touched"
                    formControlName="ssnId"
                    placeholder="1234567"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('ssnId')?.invalid && registerForm.get('ssnId')?.touched">
                    <div *ngIf="registerForm.get('ssnId')?.errors?.['required']">SSN is required</div>
                    <div *ngIf="registerForm.get('ssnId')?.errors?.['pattern']">SSN must be 7 digits</div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control"
                    [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                    formControlName="email"
                    placeholder="john@example.com"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                    <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="registerForm.get('email')?.errors?.['email']">Invalid email format</div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Customer Name *</label>
                <input 
                  type="text" 
                  class="form-control"
                  [class.error]="registerForm.get('customerName')?.invalid && registerForm.get('customerName')?.touched"
                  formControlName="customerName"
                  placeholder="John Doe"
                />
                <div class="error-message" 
                     *ngIf="registerForm.get('customerName')?.invalid && registerForm.get('customerName')?.touched">
                  Customer name is required
                </div>
              </div>

              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">Password *</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                    formControlName="password"
                    placeholder="Enter password"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Confirm Password *</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                    formControlName="confirmPassword"
                    placeholder="Confirm password"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirm password is required</div>
                    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">Contact Number *</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    [class.error]="registerForm.get('contactNumber')?.invalid && registerForm.get('contactNumber')?.touched"
                    formControlName="contactNumber"
                    placeholder="9876543210"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('contactNumber')?.invalid && registerForm.get('contactNumber')?.touched">
                    <div *ngIf="registerForm.get('contactNumber')?.errors?.['required']">Contact number is required</div>
                    <div *ngIf="registerForm.get('contactNumber')?.errors?.['pattern']">Contact number must be 10 digits</div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Initial Deposit *</label>
                  <input 
                    type="number" 
                    class="form-control"
                    [class.error]="registerForm.get('initialDeposit')?.invalid && registerForm.get('initialDeposit')?.touched"
                    formControlName="initialDeposit"
                    placeholder="1000"
                    min="0.01"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('initialDeposit')?.invalid && registerForm.get('initialDeposit')?.touched">
                    <div *ngIf="registerForm.get('initialDeposit')?.errors?.['required']">Initial deposit is required</div>
                    <div *ngIf="registerForm.get('initialDeposit')?.errors?.['min']">Initial deposit must be greater than 0</div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">Aadhaar Number *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [class.error]="registerForm.get('aadharNumber')?.invalid && registerForm.get('aadharNumber')?.touched"
                    formControlName="aadharNumber"
                    placeholder="123456789012"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('aadharNumber')?.invalid && registerForm.get('aadharNumber')?.touched">
                    <div *ngIf="registerForm.get('aadharNumber')?.errors?.['required']">Aadhaar number is required</div>
                    <div *ngIf="registerForm.get('aadharNumber')?.errors?.['pattern']">Aadhaar must be 12 digits</div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">PAN Number *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [class.error]="registerForm.get('panNumber')?.invalid && registerForm.get('panNumber')?.touched"
                    formControlName="panNumber"
                    placeholder="ABCDE1234F"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('panNumber')?.invalid && registerForm.get('panNumber')?.touched">
                    <div *ngIf="registerForm.get('panNumber')?.errors?.['required']">PAN number is required</div>
                    <div *ngIf="registerForm.get('panNumber')?.errors?.['pattern']">Invalid PAN format</div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">Account Number *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [class.error]="registerForm.get('accountNumber')?.invalid && registerForm.get('accountNumber')?.touched"
                    formControlName="accountNumber"
                    placeholder="ACC123456789"
                  />
                  <div class="error-message" 
                       *ngIf="registerForm.get('accountNumber')?.invalid && registerForm.get('accountNumber')?.touched">
                    Account number is required
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Account Type</label>
                  <select 
                    class="form-control"
                    formControlName="accountType"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Address *</label>
                <textarea 
                  class="form-control"
                  [class.error]="registerForm.get('address')?.invalid && registerForm.get('address')?.touched"
                  formControlName="address"
                  rows="3"
                  placeholder="Enter your full address"
                ></textarea>
                <div class="error-message" 
                     *ngIf="registerForm.get('address')?.invalid && registerForm.get('address')?.touched">
                  Address is required
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-full"
                  [disabled]="registerForm.invalid || isLoading"
                >
                  <span *ngIf="isLoading">Creating Account...</span>
                  <span *ngIf="!isLoading">Register</span>
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="text-gray-600">
                Already have an account? 
                <a href="/login" class="text-blue-600 hover:underline font-semibold">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>

        <!-- Success Card -->
        <div class="card mt-4" *ngIf="registrationSuccess && newCustomer">
          <div class="card-header">
            <h2 class="text-xl font-bold text-green-600">Registration Successful!</h2>
          </div>
          <div class="card-body">
            <div class="success-details">
              <p><strong>Customer Name:</strong> {{ newCustomer.customerName }}</p>
              <p><strong>Account Number:</strong> {{ newCustomer.accountNumber }}</p>
              <p><strong>Email:</strong> {{ newCustomer.email }}</p>
              <p><strong>SSN:</strong> {{ newCustomer.ssnId }}</p>
            </div>
            <div class="mt-4">
              <button class="btn btn-primary" (click)="goToLogin()">
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }

    .card {
      width: 100%;
      max-width: 600px;
    }

    .success-details p {
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background-color: #f0fdf4;
      border-radius: 4px;
      border-left: 4px solid #22c55e;
    }

    .text-green-600 {
      color: #16a34a;
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

    @media (max-width: 768px) {
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  registrationSuccess = false;
  newCustomer: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      ssnId: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      customerName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      initialDeposit: [0, [Validators.required, Validators.min(0.01)]],
      aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)]],
      accountNumber: ['', [Validators.required, Validators.maxLength(20)]],
      accountType: ['Savings', [Validators.pattern(/^(Current|Savings)$/)]],
      address: ['', [Validators.required, Validators.maxLength(100)]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const registration: CustomerRegistration = this.registerForm.value;
      registration.username = registration.email; // Use email as username for auth

      // First, register user in Auth Service
      this.authService.register(registration).subscribe({
        next: (response) => {
          // Then create customer
          this.customerService.createCustomer(registration).subscribe({
            next: (customer) => {
              this.isLoading = false;
              this.registrationSuccess = true;
              this.newCustomer = customer;
              this.notificationService.showSuccess('Registration successful! Your account has been created.');
            },
            error: (error) => {
              this.isLoading = false;
              this.notificationService.showError(error.error?.message || 'Failed to create customer account');
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Registration failed. Please try again.');
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}