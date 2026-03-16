import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Gestion des utilisateurs</h2>
          <p>{{ filtered.length }} utilisateur(s)</p>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
                 placeholder="Rechercher par nom ou email..." class="search-input" />
        </div>
        <select [(ngModel)]="roleFilter" (ngModelChange)="applyFilter()" class="role-filter">
          <option value="">Tous les rôles</option>
          <option value="STUDENT">Étudiants</option>
          <option value="COMPANY">Entreprises</option>
          <option value="SUPERVISOR">Encadrants</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th><th>Email</th><th>Rôle</th><th>Détails</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filtered">
              <td><strong>{{ user.firstName }} {{ user.lastName }}</strong></td>
              <td class="email-cell">{{ user.email }}</td>
              <td><span class="badge" [class]="'badge-' + user.role.toLowerCase()">{{ roleLabel(user.role) }}</span></td>
              <td class="details">
                <span *ngIf="user.companyName">{{ user.companyName }}</span>
                <span *ngIf="user.studentNumber">{{ user.studentNumber }}</span>
                <span *ngIf="user.program">{{ user.program }}</span>
                <span *ngIf="user.department">{{ user.department }}</span>
              </td>
              <td>
                <span class="status" [class.active]="user.enabled" [class.inactive]="!user.enabled">
                  {{ user.enabled ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="actions">
                <button (click)="toggleUser(user)" class="btn-sm" [class.btn-warn]="user.enabled" [class.btn-success]="!user.enabled">
                  {{ user.enabled ? 'Désactiver' : 'Activer' }}
                </button>
                <button (click)="deleteUser(user)" class="btn-sm btn-danger" *ngIf="user.role !== 'ADMIN'">
                  Supprimer
                </button>
              </td>
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="6" class="empty">Aucun utilisateur trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page {
      padding: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-header h2 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #0a0e1a;
      margin: 0 0 0.35rem;
      letter-spacing: -0.02em;
    }
    .page-header p {
      color: #6b7280;
      margin: 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
    }
    .toolbar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .search-wrapper {
      flex: 1;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.8rem;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      background: #ffffff;
      color: #0a0e1a;
      box-sizing: border-box;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .search-input:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 4px rgba(76, 61, 206, 0.1);
    }
    .search-input::placeholder { color: #9ca3af; }
    .role-filter {
      padding: 0.75rem 1rem;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      background: #ffffff;
      color: #0a0e1a;
      cursor: pointer;
      transition: border-color 0.25s, box-shadow 0.25s;
      min-width: 180px;
    }
    .role-filter:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 4px rgba(76, 61, 206, 0.1);
    }
    .table-wrap {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
      border: 1px solid #e8e4de;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead {
      background: #faf6f1;
    }
    th {
      padding: 0.9rem 1.2rem;
      text-align: left;
      font-size: 0.78rem;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-family: 'DM Sans', sans-serif;
      border-bottom: 1px solid #e8e4de;
    }
    td {
      padding: 1rem 1.2rem;
      border-bottom: 1px solid #f3efe9;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      vertical-align: middle;
      color: #0a0e1a;
      transition: background 0.2s;
    }
    tr:last-child td { border-bottom: none; }
    tbody tr {
      transition: background 0.2s;
    }
    tbody tr:hover td {
      background: #faf6f1;
    }
    td strong {
      font-weight: 600;
      color: #0a0e1a;
    }
    .email-cell {
      color: #6b7280;
    }
    .badge {
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.01em;
    }
    .badge-admin { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .badge-student { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .badge-company { background: rgba(217, 119, 6, 0.1); color: #d97706; }
    .badge-supervisor { background: rgba(76, 61, 206, 0.1); color: #4c3dce; }
    .status {
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
    }
    .status.active { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .status.inactive { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .details span {
      display: block;
      font-size: 0.8rem;
      color: #6b7280;
      line-height: 1.6;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-sm {
      padding: 0.4rem 0.9rem;
      border: none;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-sm:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .btn-warn { background: rgba(217, 119, 6, 0.1); color: #d97706; }
    .btn-warn:hover { background: rgba(217, 119, 6, 0.18); }
    .btn-success { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .btn-success:hover { background: rgba(5, 150, 105, 0.18); }
    .btn-danger { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .btn-danger:hover { background: rgba(220, 38, 38, 0.18); }
    .empty {
      text-align: center;
      padding: 3.5rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  searchTerm = '';
  roleFilter = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: u => { this.users = u; this.applyFilter(); },
      error: () => {}
    });
  }

  applyFilter(): void {
    this.filtered = this.users.filter(u => {
      const matchSearch = !this.searchTerm ||
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = !this.roleFilter || u.role === this.roleFilter;
      return matchSearch && matchRole;
    });
  }

  toggleUser(user: User): void {
    this.adminService.toggleUser(user.id).subscribe(updated => {
      const idx = this.users.findIndex(u => u.id === updated.id);
      if (idx > -1) this.users[idx] = updated;
      this.applyFilter();
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Supprimer ${user.firstName} ${user.lastName} ?`)) return;
    this.adminService.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
      this.applyFilter();
    });
  }

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      ADMIN: 'Admin', STUDENT: 'Étudiant', COMPANY: 'Entreprise', SUPERVISOR: 'Encadrant'
    };
    return map[role] || role;
  }
}
