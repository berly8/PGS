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
        <div class="header-accent"></div>
        <h2>Bonjour, {{ auth.currentUser?.fullName }} 👋</h2>
        <p>Gérez vos candidatures et suivez votre stage</p>
      </div>

      <!-- Active internship banner -->
      <div class="internship-banner" *ngIf="internship">
        <div class="banner-glow"></div>
        <div class="banner-content">
          <div class="banner-icon">🏆</div>
          <div class="banner-info">
            <strong>Stage en cours : {{ internship.offerTitle }}</strong>
            <p>Entreprise : {{ internship.companyName }} &nbsp;|&nbsp; Encadrant : {{ internship.supervisorName || 'Non assigné' }}</p>
          </div>
          <span class="status-badge active">{{ internship.status }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon-dot total">📄</div>
          <div class="stat-val">{{ applications.length }}</div>
          <div class="stat-lbl">Candidatures totales</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-dot pending">⏳</div>
          <div class="stat-val">{{ countByStatus('PENDING') }}</div>
          <div class="stat-lbl">En attente</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-dot accepted">✅</div>
          <div class="stat-val">{{ countByStatus('ACCEPTED') }}</div>
          <div class="stat-lbl">Acceptées</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-dot rejected">❌</div>
          <div class="stat-val">{{ countByStatus('REJECTED') }}</div>
          <div class="stat-lbl">Refusées</div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="quick-links">
        <a routerLink="/student/offers" class="link-card">
          <div class="link-icon">🔍</div>
          <div class="link-text">
            <strong>Parcourir les offres</strong>
            <p>Trouvez votre stage idéal</p>
          </div>
          <div class="link-arrow">→</div>
        </a>
        <a routerLink="/student/applications" class="link-card">
          <div class="link-icon">📋</div>
          <div class="link-text">
            <strong>Mes candidatures</strong>
            <p>Suivez l'état de vos candidatures</p>
          </div>
          <div class="link-arrow">→</div>
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
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bannerShimmer {
      0% { opacity: 0.4; }
      50% { opacity: 0.7; }
      100% { opacity: 0.4; }
    }
    .page {
      padding: 2.5rem;
      max-width: 1000px;
      margin: 0 auto;
      background: #faf6f1;
      min-height: 100vh;
    }
    .page-header {
      margin-bottom: 2rem;
      animation: fadeInUp 0.5s ease-out;
    }
    .header-accent {
      width: 48px;
      height: 4px;
      background: #059669;
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
    .internship-banner {
      position: relative;
      background: linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%);
      color: white;
      border-radius: 20px;
      padding: 1.75rem 2rem;
      margin-bottom: 2rem;
      overflow: hidden;
      animation: fadeInUp 0.5s ease-out 0.1s both;
    }
    .banner-glow {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
      animation: bannerShimmer 4s ease-in-out infinite;
    }
    .banner-content {
      position: relative;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .banner-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }
    .banner-info {
      flex: 1;
    }
    .internship-banner strong {
      display: block;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
    }
    .internship-banner p {
      margin: 0.35rem 0 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      opacity: 0.85;
    }
    .status-badge {
      padding: 0.4rem 1rem;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      margin-left: auto;
      white-space: nowrap;
      letter-spacing: 0.02em;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 0.5s ease-out both;
    }
    .stat-card:nth-child(1) { animation-delay: 0.15s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.25s; }
    .stat-card:nth-child(4) { animation-delay: 0.3s; }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(10, 14, 26, 0.08);
      border-color: transparent;
    }
    .stat-icon-dot {
      font-size: 1.25rem;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
    }
    .stat-icon-dot.total { background: rgba(76, 61, 206, 0.1); }
    .stat-icon-dot.pending { background: rgba(245, 158, 11, 0.1); }
    .stat-icon-dot.accepted { background: rgba(5, 150, 105, 0.1); }
    .stat-icon-dot.rejected { background: rgba(220, 38, 38, 0.1); }
    .stat-val {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2.25rem;
      font-weight: 800;
      color: #0a0e1a;
      line-height: 1;
    }
    .stat-lbl {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 0.35rem;
    }
    .quick-links {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .link-card {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: fadeInUp 0.5s ease-out 0.35s both;
    }
    .link-card:hover {
      transform: translateY(-3px);
      border-color: #059669;
      box-shadow: 0 12px 32px rgba(5, 150, 105, 0.1);
    }
    .link-icon {
      font-size: 1.5rem;
      width: 48px;
      height: 48px;
      background: rgba(5, 150, 105, 0.08);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .link-text { flex: 1; }
    .link-card strong {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #0a0e1a;
      font-size: 0.95rem;
    }
    .link-card p {
      margin: 0.2rem 0 0;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
    }
    .link-arrow {
      font-size: 1.2rem;
      color: #059669;
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.3s ease;
      font-weight: 600;
    }
    .link-card:hover .link-arrow {
      opacity: 1;
      transform: translateX(0);
    }
    .section {
      animation: fadeInUp 0.5s ease-out 0.4s both;
    }
    .section h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #0a0e1a;
      margin-bottom: 1rem;
    }
    .app-list {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      overflow: hidden;
    }
    .app-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.1rem 1.5rem;
      border-bottom: 1px solid #f3f0eb;
      transition: background 0.2s ease;
    }
    .app-item:last-child { border-bottom: none; }
    .app-item:hover { background: #faf6f1; }
    .app-info strong {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #0a0e1a;
    }
    .app-info span {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: #6b7280;
    }
    .app-status {
      padding: 0.3rem 0.85rem;
      border-radius: 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .status-pending { background: #fef3c7; color: #b45309; }
    .status-reviewing { background: #dbeafe; color: #1d4ed8; }
    .status-accepted { background: #d1fae5; color: #047857; }
    .status-rejected { background: #fee2e2; color: #b91c1c; }
    .status-withdrawn { background: #f3f4f6; color: #6b7280; }
    @media (max-width: 700px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .quick-links { grid-template-columns: 1fr; }
      .page { padding: 1.5rem; }
    }
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
