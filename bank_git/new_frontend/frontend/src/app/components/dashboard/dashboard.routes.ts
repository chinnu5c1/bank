import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full'
  },
  {
    path: 'customer',
    loadComponent: () => import('../customer/customer.component').then(m => m.CustomerComponent),
    canActivate: [AuthGuard],
    data: { role: 'CUSTOMER' }
  },
  {
    path: 'employee',
    loadComponent: () => import('../employee/employee.component').then(m => m.EmployeeComponent),
    canActivate: [AuthGuard],
    data: { role: 'EMPLOYEE' }
  },
  {
    path: 'manager',
    loadComponent: () => import('../manager/manager.component').then(m => m.ManagerComponent),
    canActivate: [AuthGuard],
    data: { role: 'MANAGER' }
  }
];