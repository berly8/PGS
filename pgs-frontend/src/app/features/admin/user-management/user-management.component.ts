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
        <h2>Gestion des utilisateurs</h2>
        <p>{{ filtered.length }} utilisateur(s)</p>
      </div>

      <div class="toolbar">
        <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
               placeholder="Rechercher par nom ou email..." class="search-input" />
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
              <td>{{ user.email }}</td>
              <td><span class="badge" [class]="'badge-' + user.role.toLowerCase()">{{ roleLabel(user.role) }}</span></td>
              <td class="details">
                <span *ngIf="user.companyName">🏢 {{ user.companyName }}</span>
                <span *ngIf="user.studentNumber">🎓 {{ user.studentNumber }}</span>
                <span *ngIf="user.program">📚 {{ user.program }}</span>
                <span *ngIf="user.department">🏫 {{ user.department }}</span>
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
    .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .toolbar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .search-input {
      flex: 1; padding: 0.7rem 1rem; border: 2px solid #e5e7eb;
      border-radius: 8px; font-size: 0.95rem; outline: none;
    }
    .search-input:focus { border-color: #6366f1; }
    .role-filter {
      padding: 0.7rem 1rem; border: 2px solid #e5e7eb;
      border-radius: 8px; font-size: 0.95rem; outline: none;
    }
    .table-wrap { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f8fafc; }
    th { padding: 1rem; text-align: left; font-size: 0.85rem; color: #6b7280; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
    td { padding: 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8fafc; }
    .badge { padding: 0.25rem 0.7rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-admin { background: #fee2e2; color: #dc2626; }
    .badge-student { background: #d1fae5; color: #10b981; }
    .badge-company { background: #fef3c7; color: #f59e0b; }
    .badge-supervisor { background: #ede9fe; color: #8b5cf6; }
    .status { padding: 0.25rem 0.7rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .status.active { background: #d1fae5; color: #10b981; }
    .status.inactive { background: #fee2e2; color: #dc2626; }
    .details span { display: block; font-size: 0.8rem; color: #6b7280; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-sm { padding: 0.35rem 0.8rem; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
    .btn-sm:hover { opacity: 0.85; }
    .btn-warn { background: #fef3c7; color: #f59e0b; }
    .btn-success { background: #d1fae5; color: #10b981; }
    .btn-danger { background: #fee2e2; color: #dc2626; }
    .empty { text-align: center; padding: 3rem; color: #9ca3af; }
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
