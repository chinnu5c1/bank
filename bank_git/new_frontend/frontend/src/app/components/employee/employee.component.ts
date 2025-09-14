import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';
import { Customer } from '../../models/user.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="employee-dashboard">
      <div class="dashboard-header">
        <h2 class="text-2xl font-bold">Employee Dashboard</h2>
        <p class="text-gray-600">Manage customer accounts and operations</p>
      </div>

      <!-- Action Cards -->
      <div class="grid grid-cols-4 mb-4">
        <div class="card action-card" (click)="showSearchForm()">
          <div class="card-body text-center">
            <div class="action-icon">🔍</div>
            <h4>Search Customer</h4>
            <p>Find by SSN</p>
          </div>
        </div>
        
        <div class="card action-card" (click)="showCreateForm()">
          <div class="card-body text-center">
            <div class="action-icon">➕</div>
            <h4>Create Customer</h4>
            <p>Add New Account</p>
          </div>
        </div>
        
        <div class="card action-card" (click)="loadActiveCustomers()">
          <div class="card-body text-center">
            <div class="action-icon">👥</div>
            <h4>Active Customers</h4>
            <p>View All</p>
          </div>
        </div>
        
        <div class="card action-card" (click)="refreshData()">
          <div class="card-body text-center">
            <div class="action-icon">🔄</div>
            <h4>Refresh</h4>
            <p>Update Data</p>
          </div>
        </div>
      </div>

      <!-- Search Form Modal -->
      <div class="modal" [class.show]="showSearch" *ngIf="showSearch">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Search Customer by SSN</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
                <div class="form-group">
                  <label class="form-label">SSN</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="ssnId" 
                    placeholder="Enter 7-digit SSN"
                  >
                  <div class="error-message" *ngIf="searchForm.get('ssnId')?.invalid && searchForm.get('ssnId')?.touched">
                    SSN must be 7 digits
                  </div>
                </div>
              </form>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary" (click)="hideSearch()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="onSearch()" [disabled]="searchForm.invalid || isLoading">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Customer Form Modal -->
      <div class="modal" [class.show]="showCreate" *ngIf="showCreate">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Create New Customer</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="createForm" (ngSubmit)="onCreate()">
                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">SSN *</label>
                    <input type="text" class="form-control" formControlName="ssnId" placeholder="1234567">
                    <div class="error-message" *ngIf="createForm.get('ssnId')?.invalid && createForm.get('ssnId')?.touched">
                      SSN must be 7 digits
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Customer Name *</label>
                    <input type="text" class="form-control" formControlName="customerName" placeholder="Full Name">
                    <div class="error-message" *ngIf="createForm.get('customerName')?.invalid && createForm.get('customerName')?.touched">
                      Customer name is required
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" formControlName="email" placeholder="customer@email.com">
                    <div class="error-message" *ngIf="createForm.get('email')?.invalid && createForm.get('email')?.touched">
                      Valid email is required
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Contact Number *</label>
                    <input type="tel" class="form-control" formControlName="contactNumber" placeholder="1234567890">
                    <div class="error-message" *ngIf="createForm.get('contactNumber')?.invalid && createForm.get('contactNumber')?.touched">
                      Contact number must be 10 digits
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Aadhaar Number *</label>
                    <input type="text" class="form-control" formControlName="aadharNumber" placeholder="123456789012">
                    <div class="error-message" *ngIf="createForm.get('aadharNumber')?.invalid && createForm.get('aadharNumber')?.touched">
                      Aadhaar number must be 12 digits
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">PAN Number *</label>
                    <input type="text" class="form-control" formControlName="panNumber" placeholder="ABCDE1234F">
                    <div class="error-message" *ngIf="createForm.get('panNumber')?.invalid && createForm.get('panNumber')?.touched">
                      Valid PAN number is required
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Account Number *</label>
                    <input type="text" class="form-control" formControlName="accountNumber" placeholder="Account Number">
                    <div class="error-message" *ngIf="createForm.get('accountNumber')?.invalid && createForm.get('accountNumber')?.touched">
                      Account number is required
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Initial Deposit *</label>
                    <input type="number" class="form-control" formControlName="initialDeposit" placeholder="1000">
                    <div class="error-message" *ngIf="createForm.get('initialDeposit')?.invalid && createForm.get('initialDeposit')?.touched">
                      Initial deposit must be greater than 0
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Account Type</label>
                    <select class="form-control" formControlName="accountType">
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" formControlName="password" placeholder="Temporary password">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Address *</label>
                  <textarea class="form-control" formControlName="address" rows="3" placeholder="Customer address"></textarea>
                  <div class="error-message" *ngIf="createForm.get('address')?.invalid && createForm.get('address')?.touched">
                    Address is required
                  </div>
                </div>
              </form>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary" (click)="hideCreate()">Cancel</button>
              <button type="button" class="btn btn-success" (click)="onCreate()" [disabled]="createForm.invalid || isLoading">
                Create Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Customer Form Modal -->
      <div class="modal" [class.show]="showEdit" *ngIf="showEdit && selectedCustomer">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">Edit Customer</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="editForm">
                <div class="form-group">
                  <label class="form-label">SSN (Cannot be changed)</label>
                  <input type="text" class="form-control" [value]="selectedCustomer.ssnId" disabled>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Customer Name</label>
                  <input type="text" class="form-control" formControlName="customerName">
                  <div class="error-message" *ngIf="editForm.get('customerName')?.invalid && editForm.get('customerName')?.touched">
                    Customer name is required
                  </div>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" formControlName="email">
                    <div class="error-message" *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched">
                      Valid email is required
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Contact Number</label>
                    <input type="tel" class="form-control" formControlName="contactNumber">
                    <div class="error-message" *ngIf="editForm.get('contactNumber')?.invalid && editForm.get('contactNumber')?.touched">
                      Contact number must be 10 digits
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Address</label>
                  <textarea class="form-control" formControlName="address" rows="3"></textarea>
                </div>

                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control" formControlName="city">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Account Type</label>
                    <select class="form-control" formControlName="accountType">
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary" (click)="hideEdit()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="onUpdate()" [disabled]="editForm.invalid || isLoading">
                Update Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results / Customer List -->
      <div class="card" *ngIf="searchResult">
        <div class="card-header">
          <h3 class="text-xl font-semibold">Search Result</h3>
        </div>
        <div class="card-body">
          <div class="customer-card">
            <div class="customer-info">
              <h4>{{ searchResult.customerName }}</h4>
              <p><strong>SSN:</strong> {{ searchResult.ssnId }}</p>
              <p><strong>Email:</strong> {{ searchResult.email }}</p>
              <p><strong>Account Number:</strong> {{ searchResult.accountNumber }}</p>
              <p><strong>Balance:</strong> ₹{{ searchResult.balance | number:'1.2-2' }}</p>
              <p><strong>City:</strong> {{ searchResult.city || 'Not specified' }}</p>
            </div>
            <div class="customer-actions">
              <button class="btn btn-primary" (click)="editCustomer(searchResult)">Edit</button>
              <button class="btn btn-danger" (click)="deleteCustomer(searchResult)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card" *ngIf="customers.length > 0 && !searchResult">
        <div class="card-header">
          <h3 class="text-xl font-semibold">Active Customers ({{ totalCustomers }})</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2 customers-grid">
            <div class="customer-card" *ngFor="let customer of customers">
              <div class="customer-info">
                <h4>{{ customer.customerName }}</h4>
                <p><strong>SSN:</strong> {{ customer.ssnId }}</p>
                <p><strong>Email:</strong> {{ customer.email }}</p>
                <p><strong>Account Number:</strong> {{ customer.accountNumber }}</p>
                <p><strong>Balance:</strong> ₹{{ customer.balance | number:'1.2-2' }}</p>
                <p><strong>City:</strong> {{ customer.city || 'Not specified' }}</p>
              </div>
              <div class="customer-actions">
                <button class="btn btn-primary" (click)="editCustomer(customer)">Edit</button>
                <button class="btn btn-danger" (click)="deleteCustomer(customer)">Delete</button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
            <span *ngFor="let page of getPageNumbers()" 
                  class="page-number" 
                  [class.active]="page === currentPage"
                  (click)="goToPage(page)">
              {{ page }}
            </span>
            <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="card text-center" *ngIf="isLoading">
        <div class="card-body">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div class="card text-center" *ngIf="!isLoading && customers.length === 0 && !searchResult">
        <div class="card-body">
          <div class="empty-icon">📋</div>
          <h3>No customers found</h3>
          <p>Click "Active Customers" to load customer data or create a new customer.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .employee-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
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

    .customer-card {
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      transition: all 0.2s ease;
      margin-bottom: 1rem;
    }

    .customer-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .customer-info {
      flex: 1;
    }

    .customer-info h4 {
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
      color: #1f2937;
    }

    .customer-info p {
      margin-bottom: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .customer-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 120px;
    }

    .customer-actions button {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }

    .customers-grid .customer-card {
      margin-bottom: 0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .pagination button,
    .page-number {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      background: white;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .pagination button:hover:not(:disabled),
    .page-number:hover {
      background-color: #f3f4f6;
    }

    .page-number.active {
      background-color: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
      color: #6b7280;
    }

    .empty-state p {
      color: #9ca3af;
    }

    @media (max-width: 1024px) {
      .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .customers-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .grid-cols-4 {
        grid-template-columns: 1fr;
      }
      
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }

      .customer-card {
        flex-direction: column;
        gap: 1rem;
      }

      .customer-actions {
        flex-direction: row;
        justify-content: flex-start;
        min-width: auto;
      }
    }
  `]
})
export class EmployeeComponent implements OnInit {
  customers: Customer[] = [];
  searchResult: Customer | null = null;
  selectedCustomer: Customer | null = null;
  isLoading = false;

  // Pagination
  currentPage = 1;
  totalCustomers = 0;
  pageSize = 8;
  totalPages = 0;

  // Modal states
  showSearch = false;
  showCreate = false;
  showEdit = false;

  // Forms
  searchForm: FormGroup;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {
    this.searchForm = this.fb.group({
      ssnId: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]]
    });

    this.createForm = this.fb.group({
      ssnId: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      customerName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)]],
      accountNumber: ['', [Validators.required, Validators.maxLength(20)]],
      initialDeposit: ['', [Validators.required, Validators.min(0.01)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      accountType: ['Savings', [Validators.pattern(/^(Current|Savings)$/)]],
      password: ['temp123', Validators.minLength(6)]
    });

    this.editForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.pattern(/^\d{10}$/)],
      address: ['', Validators.maxLength(100)],
      city: ['', Validators.maxLength(50)],
      accountType: ['Savings', [Validators.pattern(/^(Current|Savings)$/)]]
    });
  }

  ngOnInit(): void {
    // Dashboard loads empty initially
  }

  // Modal handlers
  showSearchForm(): void {
    this.showSearch = true;
    this.searchResult = null;
  }

  hideSearch(): void {
    this.showSearch = false;
    this.searchForm.reset();
  }

  showCreateForm(): void {
    this.showCreate = true;
  }

  hideCreate(): void {
    this.showCreate = false;
    this.createForm.reset();
  }

  showEditForm(customer: Customer): void {
    this.selectedCustomer = customer;
    this.editForm.patchValue({
      customerName: customer.customerName,
      email: customer.email,
      contactNumber: customer.contactNumber,
      address: customer.address,
      city: customer.city,
      accountType: customer.accountType || 'Savings'
    });
    this.showEdit = true;
  }

  hideEdit(): void {
    this.showEdit = false;
    this.selectedCustomer = null;
    this.editForm.reset();
  }

  // Search operations
  onSearch(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const ssnId = this.searchForm.value.ssnId;
      
      this.customerService.searchCustomerBySsnId(ssnId).subscribe({
        next: (customer) => {
          this.isLoading = false;
          this.searchResult = customer;
          this.customers = []; // Clear customer list when showing search result
          if (customer) {
            this.notificationService.showSuccess('Customer found successfully!');
          } else {
            this.notificationService.showWarning('No customer found with this SSN');
          }
          this.hideSearch();
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Search failed. Please try again.');
        }
      });
    }
  }

  // Customer operations
  onCreate(): void {
    if (this.createForm.valid) {
      this.isLoading = true;
      const customerData = this.createForm.value;
      
      // First, register user in Auth Service
      this.customerService.registerUser({
        username: customerData.email, // Using email as username
        password: customerData.password,
        email: customerData.email,
        role: 'CUSTOMER'
      }).subscribe({
        next: () => {
          // Then create customer
          this.customerService.createCustomer(customerData).subscribe({
            next: (customer) => {
              this.isLoading = false;
              this.hideCreate();
              this.notificationService.showSuccess(`Customer created successfully! Account: ${customer.accountNumber}`);
              this.loadActiveCustomers(); // Refresh the list
            },
            error: (error) => {
              this.isLoading = false;
              this.notificationService.showError(error.error?.message || 'Failed to create customer');
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Failed to register user');
        }
      });
    }
  }

  editCustomer(customer: Customer): void {
    this.showEditForm(customer);
  }

  onUpdate(): void {
    if (this.editForm.valid && this.selectedCustomer) {
      this.isLoading = true;
      const updates = this.editForm.value;
      
      this.customerService.updateCustomer(this.selectedCustomer.ssnId, updates).subscribe({
        next: (updatedCustomer) => {
          this.isLoading = false;
          this.hideEdit();
          this.notificationService.showSuccess('Customer updated successfully!');
          
          // Update the customer in the list or search result
          if (this.searchResult && this.searchResult.ssnId === updatedCustomer.ssnId) {
            this.searchResult = updatedCustomer;
          }
          
          const index = this.customers.findIndex(c => c.ssnId === updatedCustomer.ssnId);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Failed to update customer');
        }
      });
    }
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete customer ${customer.customerName}?`)) {
      this.isLoading = true;
      
      this.customerService.deleteCustomer(customer.ssnId).subscribe({
        next: () => {
          this.isLoading = false;
          this.notificationService.showSuccess('Customer deleted successfully!');
          
          // Remove from search result or list
          if (this.searchResult && this.searchResult.ssnId === customer.ssnId) {
            this.searchResult = null;
          }
          
          this.customers = this.customers.filter(c => c.ssnId !== customer.ssnId);
          this.totalCustomers--;
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.error?.message || 'Failed to delete customer');
        }
      });
    }
  }

  loadActiveCustomers(): void {
    this.isLoading = true;
    this.searchResult = null; // Clear search result when loading all customers
    this.currentPage = 1;
    
    this.customerService.getActiveCustomers(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.customers = result.customers;
        this.totalCustomers = result.total;
        this.totalPages = Math.ceil(this.totalCustomers / this.pageSize);
        this.notificationService.showSuccess(`Loaded ${result.customers.length} active customers`);
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError(error.error?.message || 'Failed to load customers');
      }
    });
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCustomersForPage();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCustomersForPage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCustomersForPage();
    }
  }

  private loadCustomersForPage(): void {
    this.isLoading = true;
    
    this.customerService.getActiveCustomers(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.customers = result.customers;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError(error.error?.message || 'Failed to load customers');
      }
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  refreshData(): void {
    if (this.customers.length > 0) {
      this.loadActiveCustomers();
    } else {
      this.notificationService.showInfo('Click "Active Customers" to load data');
    }
  }
}
