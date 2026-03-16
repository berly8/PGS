import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';

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
      <!-- Decorative geometric element -->
      <div class="sidebar-deco" aria-hidden="true">
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <circle cx="140" cy="30" r="80" stroke="rgba(76,61,206,0.07)" stroke-width="1"/>
          <circle cx="140" cy="30" r="50" stroke="rgba(76,61,206,0.05)" stroke-width="1"/>
          <rect x="120" y="10" width="40" height="40" rx="8" stroke="rgba(76,61,206,0.06)" stroke-width="1" transform="rotate(15 140 30)"/>
        </svg>
      </div>

      <div class="sidebar-logo">
        <div class="logo-mark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="2" fill="#faf6f1"/>
            <rect x="11" y="2" width="7" height="7" rx="2" fill="rgba(250,246,241,0.5)"/>
            <rect x="2" y="11" width="7" height="7" rx="2" fill="rgba(250,246,241,0.5)"/>
            <rect x="11" y="11" width="7" height="7" rx="2" fill="#faf6f1"/>
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-title">PGS</span>
          <span class="logo-sub">Gestion des Stages</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <div class="sidebar-user">
        <div class="user-avatar">{{ initials }}</div>
        <div class="user-meta">
          <span class="user-name">{{ auth.currentUser?.fullName }}</span>
          <span class="user-role" [class]="'role-' + (auth.role || '')?.toLowerCase()">{{ roleLabel }}</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <div class="nav-section-label">Navigation</div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-divider"></div>

      <button class="sidebar-logout" (click)="auth.logout()">
        <span class="logout-icon">↩</span>
        <span>Déconnexion</span>
      </button>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      min-height: 100vh;
      background: linear-gradient(195deg, #0f1328 0%, #0a0e1a 40%, #080b15 100%);
      display: flex;
      flex-direction: column;
      padding: 1.75rem 1.15rem 1.5rem;
      position: sticky;
      top: 0;
      flex-shrink: 0;
      overflow: hidden;
    }

    /* Decorative background element */
    .sidebar-deco {
      position: absolute;
      top: -20px;
      right: -40px;
      pointer-events: none;
      opacity: 1;
    }

    /* ── Logo ── */
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 0.4rem;
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
    }
    .logo-mark {
      width: 40px;
      height: 40px;
      background: #4c3dce;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(76, 61, 206, 0.35);
    }
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    .logo-title {
      display: block;
      color: #faf6f1;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 1.2rem;
      line-height: 1.15;
      letter-spacing: 0.04em;
    }
    .logo-sub {
      display: block;
      color: #6b9080;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      margin-top: 1px;
    }

    /* ── Dividers ── */
    .sidebar-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(250, 246, 241, 0.06) 20%, rgba(250, 246, 241, 0.06) 80%, transparent);
      margin: 0.25rem 0.4rem 1.25rem;
    }

    /* ── User Card (Glassmorphism) ── */
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 0.85rem 0.9rem;
      margin-bottom: 1.25rem;
      position: relative;
      z-index: 1;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .sidebar-user:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.1);
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #4c3dce 0%, #6b5ce7 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      color: #faf6f1;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(76, 61, 206, 0.3);
    }
    .user-meta {
      min-width: 0;
    }
    .user-name {
      display: block;
      color: #faf6f1;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 145px;
    }
    .user-role {
      display: inline-block;
      margin-top: 4px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.66rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 6px;
      letter-spacing: 0.02em;
    }
    .role-admin { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .role-student { background: rgba(107, 144, 128, 0.2); color: #a3d9c5; }
    .role-company { background: rgba(194, 91, 58, 0.2); color: #f0b89e; }
    .role-supervisor { background: rgba(76, 61, 206, 0.2); color: #c4b5fd; }

    /* ── Nav Section ── */
    .nav-section-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6b9080;
      padding: 0 0.75rem;
      margin-bottom: 0.6rem;
    }
    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
      color: rgba(250, 246, 241, 0.55);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.86rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
      position: relative;
      border-left: 3px solid transparent;
      margin-left: -3px;
    }
    .nav-item:hover {
      color: #faf6f1;
      background: rgba(255, 255, 255, 0.03);
      border-left-color: rgba(76, 61, 206, 0.4);
      padding-left: calc(0.85rem + 2px);
    }
    .nav-item.active {
      color: #faf6f1;
      font-weight: 600;
      background: rgba(76, 61, 206, 0.08);
      border-left-color: #4c3dce;
      box-shadow: inset 0 0 0 0;
    }
    .nav-item.active .nav-icon {
      filter: drop-shadow(0 0 4px rgba(76, 61, 206, 0.5));
    }
    .nav-icon {
      font-size: 1rem;
      width: 22px;
      text-align: center;
      transition: transform 0.2s ease;
    }
    .nav-item:hover .nav-icon {
      transform: translateX(2px);
    }
    .nav-label {
      flex: 1;
    }

    /* ── Logout ── */
    .sidebar-logout {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 0.7rem 0.85rem;
      background: transparent;
      border: 1px solid rgba(250, 246, 241, 0.06);
      border-radius: 10px;
      color: rgba(250, 246, 241, 0.45);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.84rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .sidebar-logout:hover {
      background: rgba(194, 91, 58, 0.1);
      color: #c25b3a;
      border-color: rgba(194, 91, 58, 0.25);
    }
    .logout-icon {
      transition: transform 0.2s ease;
    }
    .sidebar-logout:hover .logout-icon {
      transform: translateX(-2px);
    }
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

