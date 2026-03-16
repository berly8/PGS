import { Routes } from '@angular/router';
export const COMPANY_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent) },
  { path: 'offers', loadComponent: () => import('./offers/company-offers.component').then(m => m.CompanyOffersComponent) },
  { path: 'candidatures', loadComponent: () => import('./candidatures/company-candidatures.component').then(m => m.CompanyCandidaturesComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
