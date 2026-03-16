import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-mark">P</div>
        <div class="logo-text">
          <span class="logo-title">PGS</span>
          <span class="logo-sub">Gestion des Stages</span>
        </div>
      </div>

      <div class="sidebar-user">
        <div class="user-avatar">{{ initials }}</div>
        <div class="user-meta">
          <span class="user-name">{{ auth.currentUser?.fullName }}</span>
          <span class="user-role" [class]="'role-' + (auth.role || '').toLowerCase()">{{ roleLabel }}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>

      <button class="sidebar-logout" (click)="auth.logout()">
        <span>↩</span> Déconnexion
      </button>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px; min-height: 100vh; background: var(--sidebar-bg);
      display: flex; flex-direction: column; padding: 1.5rem 1rem;
      position: sticky; top: 0; flex-shrink: 0;
    }
    .sidebar-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; padding: 0 0.5rem; }
    .logo-mark {
      width: 36px; height: 36px; background: var(--primary); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; font-weight: 800; color: white; flex-shrink: 0;
    }
    .logo-title { display: block; color: white; font-weight: 700; font-size: 1rem; line-height: 1.1; }
    .logo-sub { display: block; color: var(--sidebar-text); font-size: 0.68rem; }

    .sidebar-user {
      display: flex; align-items: center; gap: 10px;
      background: #1e293b; border-radius: 10px; padding: 0.75rem;
      margin-bottom: 1.8rem;
    }
    .user-avatar {
      width: 34px; height: 34px; background: var(--primary); border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.78rem; font-weight: 700; color: white; flex-shrink: 0;
    }
    .user-name { display: block; color: white; font-size: 0.82rem; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
    .user-role { display: inline-block; margin-top: 3px; font-size: 0.68rem; font-weight: 600; padding: 2px 7px; border-radius: 4px; }
    .role-admin { background: rgba(239,68,68,0.2); color: #fca5a5; }
    .role-student { background: rgba(16,185,129,0.2); color: #6ee7b7; }
    .role-company { background: rgba(245,158,11,0.2); color: #fcd34d; }
    .role-supervisor { background: rgba(139,92,246,0.2); color: #c4b5fd; }

    .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex; align-items: center; gap: 10px; padding: 0.65rem 0.75rem;
      border-radius: 8px; color: var(--sidebar-text); font-size: 0.88rem;
      transition: all 0.15s; cursor: pointer;
    }
    .nav-item:hover { background: var(--sidebar-hover); color: white; }
    .nav-item.active { background: var(--primary); color: white; font-weight: 600; }
    .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
    .nav-label { flex: 1; }

    .sidebar-logout {
      margin-top: 1.5rem; display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 0.65rem 0.75rem; background: transparent;
      border: 1px solid #1e293b; border-radius: 8px; color: var(--sidebar-text);
      font-size: 0.85rem; cursor: pointer; transition: all 0.15s;
    }
    .sidebar-logout:hover { background: #1e293b; color: #ef4444; border-color: #ef4444; }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [];
  roleLabel = '';
  initials = '';

  constructor(public auth: AuthService) {
    const role = this.auth.role || '';

    const labels: Record<string, string> = {
      ADMIN: 'Administrateur', STUDENT: 'Étudiant',
      COMPANY: 'Entreprise', SUPERVISOR: 'Encadrant'
    };
    this.roleLabel = labels[role] || '';

    const name = this.auth.currentUser?.fullName || '';
    this.initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const menus: Record<string, NavItem[]> = {
      ADMIN: [
        { label: 'Tableau de bord', icon: '◈', route: '/admin/dashboard' },
        { label: 'Utilisateurs', icon: '◉', route: '/admin/users' },
      ],
      STUDENT: [
        { label: 'Tableau de bord', icon: '◈', route: '/student/dashboard' },
        { label: 'Offres de stage', icon: '◎', route: '/student/offers' },
        { label: 'Mes candidatures', icon: '◉', route: '/student/applications' },
      ],
      COMPANY: [
        { label: 'Tableau de bord', icon: '◈', route: '/company/dashboard' },
        { label: 'Mes offres', icon: '◎', route: '/company/offers' },
        { label: 'Candidatures', icon: '◉', route: '/company/candidatures' },
      ],
      SUPERVISOR: [
        { label: 'Tableau de bord', icon: '◈', route: '/supervisor/dashboard' },
        { label: 'Mes stages', icon: '◎', route: '/supervisor/internships' },
      ],
    };
    this.navItems = menus[role] || [];
  }
}

