import { Routes } from '@angular/router';
export const SUPERVISOR_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./dashboard/supervisor-dashboard.component').then(m => m.SupervisorDashboardComponent) },
  { path: 'internships', loadComponent: () => import('./internships/supervisor-internships.component').then(m => m.SupervisorInternshipsComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
