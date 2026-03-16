import { Routes } from '@angular/router';
export const STUDENT_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
  { path: 'offers', loadComponent: () => import('./offers/student-offers.component').then(m => m.StudentOffersComponent) },
  { path: 'applications', loadComponent: () => import('./applications/student-applications.component').then(m => m.StudentApplicationsComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
