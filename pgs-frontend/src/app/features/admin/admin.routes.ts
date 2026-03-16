import { Routes } from '@angular/router';
export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'users', loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
