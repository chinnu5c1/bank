import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';
import { Customer, Transaction } from '../../models/user.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="customer-dashboard">
      <div class="dashboard-header">
        <h2 class="text-2xl font-bold">Customer Dashboard</h2>
        <p class="text-gray-600">Manage your banking activities</p>
      </div>

      <!-- Account Summary Card -->
      <div class="card mb-4" *ngIf="customer">
        <div class="card-header">
          <h3 class="text-xl font-semibold">Account Summary</h3>
        </div>
        <div class="card-body">
          <div class="account-info">
            <div class="info-item">
              <label>Account Number:</label>
              <span>{{ customer.accountNumber }}</span>
            </div>
            <div class="info-item">
              <label>Account Type:</label>
              <span>{{ customer.accountType | titlecase }}</span>
            </div>
            <div class="info-item">
              <label>Customer Name:</label>
              <span>{{ customer.customerName }}</span>
            </div>
            <div class="info-item balance">
              <label>Current Balance:</label>
              <span class="balance-amount">₹{{ (customer.balance || 0) | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="grid grid-cols-4 mb-4">
        <div class="card action-card" (click)="showProfileForm()">
          <div class="card-body text-center">
            <div class="action-icon">👤</div>
            <h4>Profile</h4>
            <p>Update Details</p>
          </div>
        </div>
        
        <div class="card action-card" (click)="showDepositForm()">
          <div class="card-body text-center">
            <div class="action-icon">💰</div>
            <h4>Deposit</h4>
            <p>Add Money</p>
          </div>
        </div>
        
        <div class="card action-card" (click)="showWithdrawForm()">
          <div class="card-body text-center">
            <div class="action-icon">💸</div>
            <h4>Withdraw</h4>
            <p>Take Money</p>
          </div>
        </div>
        
        <div class="card action-card" (click)="showTransferForm()">
          <div class="card-body text-center">
            <div class="action-icon">🔄</div>
            <h4>Transfer</h4>
            <p>Send Money</p>
          </div>
        </div>
      </div>

      <!-- Profile Form Modal -->
      <div class="modal" [class.show]="showProfile" *ngIf="showProfile">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Update Profile</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Customer Name</label>
                    <input type="text" class="form-control" formControlName="customerName">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" formControlName="email">
                  </div>
                </div>
                
                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Contact Number</label>
                    <input type="tel" class="form-control" formControlName="contactNumber">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Aadhaar Number</label>
                    <input type="text" class="form-control" formControlName="aadharNumber">
                  </div>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">PAN Number</label>
                    <input type="text" class="form-control" formControlName="panNumber">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" formControlName="dateOfBirth">
                  </div>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Gender</label>
                    <select class="form-control" formControlName="gender">
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control" formControlName="city">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Address</label>
                  <textarea class="form-control" formControlName="address" rows="3"></textarea>
                </div>

                <div class="card-footer">
                  <button type="button" class="btn btn-secondary" (click)="hideProfile()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || isLoading">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Deposit Form Modal -->
      <div class="modal" [class.show]="showDeposit" *ngIf="showDeposit">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Deposit Money</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="depositForm" (ngSubmit)="onDeposit()">
                <div class="form-group">
                  <label class="form-label">Amount</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    formControlName="amount" 
                    placeholder="Enter amount to deposit"
                    min="1"
                  >
                  <div class="error-message" *ngIf="depositForm.get('amount')?.invalid && depositForm.get('amount')?.touched">
                    Please enter a valid amount (minimum ₹1)
                  </div>
                </div>
              </form>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary" (click)="hideDeposit()">Cancel</button>
              <button type="button" class="btn btn-success" (click)="onDeposit()" [disabled]="depositForm.invalid || isLoading">
                Deposit ₹{{ depositForm.value.amount || 0 }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Withdraw Form Modal -->
      <div class="modal" [class.show]="showWithdraw" *ngIf="showWithdraw">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Withdraw Money</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="withdrawForm" (ngSubmit)="onWithdraw()">
                <div class="form-group">
                  <label class="form-label">Amount</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    formControlName="amount" 
                    placeholder="Enter amount to withdraw"
                    min="1000"
                  >
                  <small class="text-gray-600">Minimum withdrawal: ₹1,000</small>
                  <div class="error-message" *ngIf="withdrawForm.get('amount')?.invalid && withdrawForm.get('amount')?.touched">
                    Minimum withdrawal amount is ₹1,000
                  </div>
                </div>
                <div class="alert alert-warning" *ngIf="customer">
                  <strong>Available Balance:</strong> ₹{{ (customer.balance || 0) | number:'1.2-2' }}<br>
                  <strong>Balance after withdrawal:</strong> ₹{{ ((customer.balance || 0) - (withdrawForm.value.amount || 0)) | number:'1.2-2' }}
                </div>
              </form>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary" (click)="hideWithdraw()">Cancel</button>
              <button type="button" class="btn btn-warning" (click)="onWithdraw()" [disabled]="withdrawForm.invalid || isLoading">
                Withdraw ₹{{ withdrawForm.value.amount || 0 }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Transfer Form Modal -->
      <div class="modal" [class.show]="showTransfer" *ngIf="showTransfer">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Transfer Money</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="transferForm" (ngSubmit)="onTransfer()">
                <div class="form-group">
                  <label class="form-label">To Account Number</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="destinationAccount" 
                    placeholder="Enter destination account number"
                  >
                  <div class="error-message" *ngIf="transferForm.get('destinationAccount')?.invalid && transferForm.get('destinationAccount')?.touched">
                    Please enter a valid account number
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Amount</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    formControlName="amount" 
                    placeholder="Enter amount to transfer"
                    min="1"
                  >
                  <div class="error-message" *ngIf="transferForm.get('amount')?.invalid && transferForm.get('amount')?.touched">
                    Please enter a valid amount (minimum ₹1)
                  </div>
                </div>
                <div class="alert alert-warning" *ngIf="customer && transferForm.value.amount">
                  <strong>Available Balance:</strong> ₹{{ (customer.balance || 0) | number:'1.2-2' }}<br>
                  <strong>Balance after transfer:</strong> ₹{{ ((customer.balance || 0) - (transferForm.value.amount || 0)) | number:'1.2-2' }}
                </div>
              </form>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary" (click)="hideTransfer()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="onTransfer()" [disabled]="transferForm.invalid || isLoading">
                Transfer ₹{{ transferForm.value.amount || 0 }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-xl font-semibold">Recent Transactions</h3>
        </div>
        <div class="card-body">
          <div class="transactions-list" *ngIf="transactions.length > 0">
            <div class="transaction-item" *ngFor="let transaction of transactions">
              <div class="transaction-info">
                <div class="transaction-type">
                  <span class="type-badge" [class]="getTransactionClass(transaction.transactionType)">
                    {{ transaction.transactionType | titlecase }}
                  </span>
                </div>
                <div class="transaction-details">
                  <p class="amount">₹{{ transaction.amount | number:'1.2-2' }}</p>
                  <p class="description">{{ transaction.description }}</p>
                  <p class="timestamp">{{ transaction.timestamp | date:'short' }}</p>
                </div>
                <div class="transaction-balance">
                  <p class="balance">Balance: ₹{{ (customer?.balance || 0) | number:'1.2-2' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="transactions.length === 0">
            <p>No transactions found</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .account-info {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-item label {
      font-weight: 600;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .info-item span {
      font-weight: 600;
      color: #374151;
    }

    .balance-amount {
      color: #059669 !important;
      font-size: 1.25rem !important;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .action-card h4 {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .action-card p {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .transaction-item {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .transaction-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .transaction-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .transaction-details {
      flex: 1;
      margin-left: 1rem;
    }

    .transaction-details .amount {
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    .transaction-details .description {
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .transaction-details .timestamp {
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .type-deposit {
      background-color: #dcfce7;
      color: #166534;
    }

    .type-withdrawal {
      background-color: #fef3c7;
      color: #92400e;
    }

    .type-transfer {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .transaction-balance .balance {
      font-weight: 600;
      color: #059669;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
    }

    @media (max-width: 1024px) {
      .account-info {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .account-info {
        grid-template-columns: 1fr;
      }
      
      .grid-cols-4 {
        grid-template-columns: 1fr;
      }
      
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }

      .transaction-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .transaction-details {
        margin-left: 0;
      }
    }
  `]
})
export class CustomerComponent implements OnInit {
  customer: Customer | null = null;
  transactions: Transaction[] = [];
  isLoading = false;

  // Modal states
  showProfile = false;
  showDeposit = false;
  showWithdraw = false;
  showTransfer = false;

  // Forms
  profileForm: FormGroup;
  depositForm: FormGroup;
  withdrawForm: FormGroup;
  transferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadharNumber: ['', [Validators.pattern(/^\d{12}$/)]],
      panNumber: ['', [Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)]],
      dateOfBirth: [''],
      gender: ['M', [Validators.pattern(/^(M|F)$/)]],
      city: [''],
      address: ['']
    });

    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1000)]]
    });

    this.transferForm = this.fb.group({
      destinationAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCustomerData();
    this.loadTransactions();
  }

  loadCustomerData(): void {
    this.authService.getCurrentSession().subscribe({
      next: (session) => {
        if (session && session.role === 'CUSTOMER') {
          // For customers, we need to get the customer by SSN ID
          // The session userId should contain the SSN ID for customers
          this.customerService.getCustomerBySsnId(session.userId.toString()).subscribe({
            next: (customer) => {
              if (customer) {
                this.customer = customer;
                this.populateProfileForm();
              } else {
                this.notificationService.showError('Customer data not found');
              }
            },
            error: (error) => {
              this.notificationService.showError('Failed to load customer data: ' + (error.error?.message || error.message));
            }
          });
        } else {
          this.notificationService.showError('Invalid session or user role');
        }
      },
      error: (error) => {
        this.notificationService.showError('No active session');
      }
    });
  }

  loadTransactions(): void {
    if (this.customer?.accountNumber) {
      this.customerService.getTransactions(this.customer.accountNumber).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
        },
        error: (error) => {
          this.notificationService.showError('Failed to load transactions: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  populateProfileForm(): void {
    if (this.customer) {
      this.profileForm.patchValue({
        customerName: this.customer.customerName,
        email: this.customer.email,
        contactNumber: this.customer.contactNumber,
        aadharNumber: this.customer.aadharNumber,
        panNumber: this.customer.panNumber,
        dateOfBirth: this.customer.dateOfBirth ? this.formatDateForInput(this.customer.dateOfBirth) : '',
        gender: this.customer.gender || 'M',
        city: this.customer.city,
        address: this.customer.address
      });
    }
  }

  formatDateForInput(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Modal handlers
  showProfileForm(): void {
    this.showProfile = true;
  }

  hideProfile(): void {
    this.showProfile = false;
  }

  showDepositForm(): void {
    this.showDeposit = true;
  }

  hideDeposit(): void {
    this.showDeposit = false;
    this.depositForm.reset();
  }

  showWithdrawForm(): void {
    this.showWithdraw = true;
  }

  hideWithdraw(): void {
    this.showWithdraw = false;
    this.withdrawForm.reset();
  }

  showTransferForm(): void {
    this.showTransfer = true;
  }

  hideTransfer(): void {
    this.showTransfer = false;
    this.transferForm.reset();
  }

  // Form handlers
  onUpdateProfile(): void {
    if (this.profileForm.valid && this.customer) {
      this.isLoading = true;
      const updates = this.profileForm.value;
      
      this.customerService.updateCustomer(this.customer.ssnId, updates).subscribe({
        next: (updatedCustomer) => {
          this.isLoading = false;
          this.customer = updatedCustomer;
          this.hideProfile();
          this.notificationService.showSuccess('Profile updated successfully!');
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Failed to update profile');
        }
      });
    }
  }

  onDeposit(): void {
    if (this.depositForm.valid && this.customer?.accountNumber) {
      this.isLoading = true;
      const amount = this.depositForm.value.amount;
      
      this.customerService.deposit(this.customer.accountNumber, amount).subscribe({
        next: (transaction) => {
          this.isLoading = false;
          this.customerService.getCustomerBySsnId(this.customer!.ssnId).subscribe({
            next: (updatedCustomer) => {
              this.customer = updatedCustomer;
              this.loadTransactions();
              this.hideDeposit();
              this.notificationService.showSuccess(`Successfully deposited ₹${amount}`);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Deposit failed');
        }
      });
    }
  }

  onWithdraw(): void {
    if (this.withdrawForm.valid && this.customer?.accountNumber) {
      this.isLoading = true;
      const amount = this.withdrawForm.value.amount;
      
      this.customerService.withdraw(this.customer.accountNumber, amount).subscribe({
        next: (transaction) => {
          this.isLoading = false;
          this.customerService.getCustomerBySsnId(this.customer!.ssnId).subscribe({
            next: (updatedCustomer) => {
              this.customer = updatedCustomer;
              this.loadTransactions();
              this.hideWithdraw();
              this.notificationService.showSuccess(`Successfully withdrew ₹${amount}`);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Withdrawal failed');
        }
      });
    }
  }

  onTransfer(): void {
    if (this.transferForm.valid && this.customer?.accountNumber) {
      this.isLoading = true;
      const { destinationAccount, amount } = this.transferForm.value;
      
      this.customerService.transfer(this.customer.accountNumber, destinationAccount, amount).subscribe({
        next: (transaction) => {
          this.isLoading = false;
          this.customerService.getCustomerBySsnId(this.customer!.ssnId).subscribe({
            next: (updatedCustomer) => {
              this.customer = updatedCustomer;
              this.loadTransactions();
              this.hideTransfer();
              this.notificationService.showSuccess(`Successfully transferred ₹${amount} to ${destinationAccount}`);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Transfer failed');
        }
      });
    }
  }

  getTransactionClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
}
