import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { Statistics } from '../../../core/models/internship.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Tableau de bord Administrateur</h2>
        <p>Vue d'ensemble de la plateforme</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card blue">
          <div class="stat-icon">👨‍🎓</div>
          <div class="stat-value">{{ stats.totalStudents }}</div>
          <div class="stat-label">Étudiants</div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">🏢</div>
          <div class="stat-value">{{ stats.totalCompanies }}</div>
          <div class="stat-label">Entreprises</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-value">{{ stats.totalSupervisors }}</div>
          <div class="stat-label">Encadrants</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">📋</div>
          <div class="stat-value">{{ stats.openOffers }}</div>
          <div class="stat-label">Offres ouvertes</div>
        </div>
        <div class="stat-card yellow">
          <div class="stat-icon">📨</div>
          <div class="stat-value">{{ stats.totalApplications }}</div>
          <div class="stat-label">Candidatures totales</div>
        </div>
        <div class="stat-card teal">
          <div class="stat-icon">✅</div>
          <div class="stat-value">{{ stats.acceptedApplications }}</div>
          <div class="stat-label">Candidatures acceptées</div>
        </div>
        <div class="stat-card indigo">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ stats.activeInternships }}</div>
          <div class="stat-label">Stages actifs</div>
        </div>
        <div class="stat-card gray">
          <div class="stat-icon">🎓</div>
          <div class="stat-value">{{ stats.completedInternships }}</div>
          <div class="stat-label">Stages terminés</div>
        </div>
      </div>

      <div class="loading" *ngIf="!stats">Chargement des statistiques...</div>

      <div class="quick-actions">
        <h3>Actions rapides</h3>
        <div class="actions-grid">
          <a routerLink="/admin/users" class="action-card">
            <span>👥</span>
            <strong>Gérer les utilisateurs</strong>
            <p>Activer, désactiver ou supprimer des comptes</p>
          </a>
          <div class="action-card" (click)="loadStats()">
            <span>🔄</span>
            <strong>Actualiser les données</strong>
            <p>Mettre à jour les statistiques</p>
          </div>
        </div>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.2rem; margin-bottom: 2.5rem; }
    .stat-card {
      border-radius: 12px; padding: 1.5rem; color: white; text-align: center;
    }
    .stat-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .stat-value { font-size: 2.2rem; font-weight: 800; line-height: 1; }
    .stat-label { font-size: 0.85rem; opacity: 0.9; margin-top: 0.3rem; }
    .blue { background: #4f46e5; }
    .orange { background: #f97316; }
    .purple { background: #8b5cf6; }
    .green { background: #10b981; }
    .yellow { background: #f59e0b; }
    .teal { background: #06b6d4; }
    .indigo { background: #6366f1; }
    .gray { background: #64748b; }
    .loading { text-align: center; padding: 3rem; color: #6b7280; }
    .quick-actions h3 { font-size: 1.2rem; color: #4f46e5; margin-bottom: 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
    .action-card {
      background: white; border: 2px solid #e5e7eb; border-radius: 12px;
      padding: 1.5rem; cursor: pointer; text-decoration: none; color: inherit;
      transition: all 0.2s; display: block;
    }
    .action-card:hover { border-color: #6366f1; box-shadow: 0 4px 12px rgba(45,106,159,0.15); }
    .action-card span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .action-card strong { display: block; color: #4f46e5; margin-bottom: 0.3rem; }
    .action-card p { color: #6b7280; font-size: 0.85rem; margin: 0; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: Statistics | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.loadStats(); }

  loadStats(): void {
    this.adminService.getStatistics().subscribe({
      next: s => this.stats = s,
      error: () => {}
    });
  }
}
