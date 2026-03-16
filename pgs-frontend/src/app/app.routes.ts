import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'student',
    canActivate: [authGuard],
    data: { roles: ['STUDENT'] },
    loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES)
  },
  {
    path: 'company',
    canActivate: [authGuard],
    data: { roles: ['COMPANY'] },
    loadChildren: () => import('./features/company/company.routes').then(m => m.COMPANY_ROUTES)
  },
  {
    path: 'supervisor',
    canActivate: [authGuard],
    data: { roles: ['SUPERVISOR'] },
    loadChildren: () => import('./features/supervisor/supervisor.routes').then(m => m.SUPERVISOR_ROUTES)
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];
