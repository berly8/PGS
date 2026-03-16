import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApplicationService } from '../../../core/services/application.service';
import { InternshipService } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application } from '../../../core/models/application.model';
import { Internship } from '../../../core/models/internship.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Bonjour, {{ auth.currentUser?.fullName }} 👋</h2>
        <p>Gérez vos candidatures et suivez votre stage</p>
      </div>

      <!-- Active internship banner -->
      <div class="internship-banner" *ngIf="internship">
        <div class="banner-icon">🏆</div>
        <div>
          <strong>Stage en cours : {{ internship.offerTitle }}</strong>
          <p>Entreprise : {{ internship.companyName }} &nbsp;|&nbsp; Encadrant : {{ internship.supervisorName || 'Non assigné' }}</p>
        </div>
        <span class="status-badge active">{{ internship.status }}</span>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-val">{{ applications.length }}</div>
          <div class="stat-lbl">Candidatures totales</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ countByStatus('PENDING') }}</div>
          <div class="stat-lbl">En attente</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ countByStatus('ACCEPTED') }}</div>
          <div class="stat-lbl">Acceptées</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ countByStatus('REJECTED') }}</div>
          <div class="stat-lbl">Refusées</div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="quick-links">
        <a routerLink="/student/offers" class="link-card">
          <span>🔍</span>
          <strong>Parcourir les offres</strong>
          <p>Trouvez votre stage idéal</p>
        </a>
        <a routerLink="/student/applications" class="link-card">
          <span>📋</span>
          <strong>Mes candidatures</strong>
          <p>Suivez l'état de vos candidatures</p>
        </a>
      </div>

      <!-- Recent applications -->
      <div class="section" *ngIf="applications.length > 0">
        <h3>Candidatures récentes</h3>
        <div class="app-list">
          <div class="app-item" *ngFor="let app of applications.slice(0,5)">
            <div class="app-info">
              <strong>{{ app.offerTitle }}</strong>
              <span>{{ app.companyName }}</span>
            </div>
            <span class="app-status" [class]="'status-' + app.status.toLowerCase()">
              {{ statusLabel(app.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .internship-banner {
      background: linear-gradient(135deg, #10b981, #10b981); color: white;
      border-radius: 12px; padding: 1.2rem 1.5rem; display: flex; align-items: center;
      gap: 1rem; margin-bottom: 1.5rem;
    }
    .banner-icon { font-size: 2rem; }
    .internship-banner strong { display: block; font-size: 1rem; }
    .internship-banner p { margin: 0.2rem 0 0; font-size: 0.85rem; opacity: 0.9; }
    .status-badge { padding: 0.3rem 0.8rem; background: rgba(255,255,255,0.25); border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-left: auto; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: white; border-radius: 10px; padding: 1.2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .stat-val { font-size: 2rem; font-weight: 800; color: #4f46e5; }
    .stat-lbl { font-size: 0.8rem; color: #6b7280; margin-top: 0.2rem; }
    .quick-links { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
    .link-card {
      background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem;
      text-decoration: none; color: inherit; transition: all 0.2s; display: block;
    }
    .link-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(5,150,105,0.15); }
    .link-card span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .link-card strong { display: block; color: #4f46e5; }
    .link-card p { margin: 0.2rem 0 0; color: #6b7280; font-size: 0.85rem; }
    .section h3 { font-size: 1.1rem; color: #4f46e5; margin-bottom: 1rem; }
    .app-list { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .app-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9; }
    .app-item:last-child { border-bottom: none; }
    .app-info strong { display: block; font-size: 0.9rem; color: #4f46e5; }
    .app-info span { font-size: 0.8rem; color: #6b7280; }
    .app-status { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .status-pending { background: #fef3c7; color: #f59e0b; }
    .status-reviewing { background: #dbeafe; color: #2563eb; }
    .status-accepted { background: #d1fae5; color: #10b981; }
    .status-rejected { background: #fee2e2; color: #dc2626; }
    .status-withdrawn { background: #f3f4f6; color: #6b7280; }
  `]
})
export class StudentDashboardComponent implements OnInit {
  applications: Application[] = [];
  internship: Internship | null = null;

  constructor(
    public auth: AuthService,
    private applicationService: ApplicationService,
    private internshipService: InternshipService
  ) {}

  ngOnInit(): void {
    this.applicationService.getMyApplications().subscribe({ next: a => this.applications = a, error: () => {} });
    this.internshipService.getStudentInternship().subscribe({
      next: i => this.internship = i,
      error: () => {}
    });
  }

  countByStatus(status: string): number {
    return this.applications.filter(a => a.status === status).length;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'En attente', REVIEWING: 'En révision',
      ACCEPTED: 'Acceptée', REJECTED: 'Refusée', WITHDRAWN: 'Retirée'
    };
    return map[status] || status;
  }
}
