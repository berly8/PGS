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
        <div class="header-accent"></div>
        <h2>Tableau de bord Administrateur</h2>
        <p>Vue d'ensemble de la plateforme</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon-wrap blue-bg"><span class="stat-icon">👨‍🎓</span></div>
          <div class="stat-value">{{ stats.totalStudents }}</div>
          <div class="stat-label">Étudiants</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap orange-bg"><span class="stat-icon">🏢</span></div>
          <div class="stat-value">{{ stats.totalCompanies }}</div>
          <div class="stat-label">Entreprises</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap purple-bg"><span class="stat-icon">👨‍🏫</span></div>
          <div class="stat-value">{{ stats.totalSupervisors }}</div>
          <div class="stat-label">Encadrants</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap green-bg"><span class="stat-icon">📋</span></div>
          <div class="stat-value">{{ stats.openOffers }}</div>
          <div class="stat-label">Offres ouvertes</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap yellow-bg"><span class="stat-icon">📨</span></div>
          <div class="stat-value">{{ stats.totalApplications }}</div>
          <div class="stat-label">Candidatures totales</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap teal-bg"><span class="stat-icon">✅</span></div>
          <div class="stat-value">{{ stats.acceptedApplications }}</div>
          <div class="stat-label">Candidatures acceptées</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap indigo-bg"><span class="stat-icon">🏆</span></div>
          <div class="stat-value">{{ stats.activeInternships }}</div>
          <div class="stat-label">Stages actifs</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap gray-bg"><span class="stat-icon">🎓</span></div>
          <div class="stat-value">{{ stats.completedInternships }}</div>
          <div class="stat-label">Stages terminés</div>
        </div>
      </div>

      <div class="loading" *ngIf="!stats">
        <div class="loading-spinner"></div>
        <span>Chargement des statistiques...</span>
      </div>

      <div class="quick-actions">
        <h3>Actions rapides</h3>
        <div class="actions-grid">
          <a routerLink="/admin/users" class="action-card">
            <div class="action-icon">👥</div>
            <div class="action-text">
              <strong>Gérer les utilisateurs</strong>
              <p>Activer, désactiver ou supprimer des comptes</p>
            </div>
            <div class="action-arrow">→</div>
          </a>
          <div class="action-card" (click)="loadStats()">
            <div class="action-icon">🔄</div>
            <div class="action-text">
              <strong>Actualiser les données</strong>
              <p>Mettre à jour les statistiques</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .page {
      padding: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
      background: #faf6f1;
      min-height: 100vh;
    }
    .page-header {
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.5s ease-out;
    }
    .header-accent {
      width: 48px;
      height: 4px;
      background: #c25b3a;
      border-radius: 2px;
      margin-bottom: 1rem;
    }
    .page-header h2 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: #0a0e1a;
      margin: 0 0 0.4rem;
    }
    .page-header p {
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      margin: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 0.5s ease-out both;
      cursor: default;
    }
    .stat-card:nth-child(1) { animation-delay: 0.05s; }
    .stat-card:nth-child(2) { animation-delay: 0.1s; }
    .stat-card:nth-child(3) { animation-delay: 0.15s; }
    .stat-card:nth-child(4) { animation-delay: 0.2s; }
    .stat-card:nth-child(5) { animation-delay: 0.25s; }
    .stat-card:nth-child(6) { animation-delay: 0.3s; }
    .stat-card:nth-child(7) { animation-delay: 0.35s; }
    .stat-card:nth-child(8) { animation-delay: 0.4s; }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(10, 14, 26, 0.08);
      border-color: transparent;
    }
    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .stat-icon { font-size: 1.5rem; }
    .blue-bg { background: rgba(76, 61, 206, 0.1); }
    .orange-bg { background: rgba(217, 119, 6, 0.1); }
    .purple-bg { background: rgba(124, 58, 237, 0.1); }
    .green-bg { background: rgba(5, 150, 105, 0.1); }
    .yellow-bg { background: rgba(245, 158, 11, 0.1); }
    .teal-bg { background: rgba(6, 182, 212, 0.1); }
    .indigo-bg { background: rgba(99, 102, 241, 0.1); }
    .gray-bg { background: rgba(100, 116, 139, 0.1); }
    .stat-value {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: #0a0e1a;
      line-height: 1;
    }
    .stat-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      color: #6b7280;
      margin-top: 0.4rem;
      letter-spacing: 0.01em;
    }
    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loading-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #e8e4de;
      border-top-color: #c25b3a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .quick-actions {
      animation: fadeInUp 0.5s ease-out 0.45s both;
    }
    .quick-actions h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #0a0e1a;
      margin-bottom: 1rem;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    .action-card {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      padding: 1.5rem;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .action-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(194, 91, 58, 0.1);
      border-color: #c25b3a;
    }
    .action-icon {
      font-size: 1.75rem;
      width: 52px;
      height: 52px;
      background: rgba(194, 91, 58, 0.08);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .action-text {
      flex: 1;
    }
    .action-card strong {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #0a0e1a;
      margin-bottom: 0.2rem;
      font-size: 0.95rem;
    }
    .action-card p {
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      margin: 0;
      line-height: 1.4;
    }
    .action-arrow {
      font-size: 1.2rem;
      color: #c25b3a;
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.3s ease;
      font-weight: 600;
    }
    .action-card:hover .action-arrow {
      opacity: 1;
      transform: translateX(0);
    }
    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 500px) {
      .stats-grid { grid-template-columns: 1fr; }
      .page { padding: 1.5rem; }
    }
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
