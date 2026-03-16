import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { InternshipService } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';
import { Internship } from '../../../core/models/internship.model';

@Component({
  selector: 'app-supervisor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <div class="header-accent"></div>
        <h2>Tableau de bord Encadrant 👨‍🏫</h2>
        <p>Bonjour, {{ auth.currentUser?.fullName }}</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon-wrap">📚</div>
          <div class="stat-val">{{ internships.length }}</div>
          <div class="stat-lbl">Stages assignés</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap">🟢</div>
          <div class="stat-val">{{ countByStatus('ACTIVE') }}</div>
          <div class="stat-lbl">Stages actifs</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap">✅</div>
          <div class="stat-val">{{ countByStatus('COMPLETED') }}</div>
          <div class="stat-lbl">Stages terminés</div>
        </div>
      </div>

      <a routerLink="/supervisor/internships" class="link-card">
        <div class="link-icon">📋</div>
        <div class="link-text">
          <strong>Mes stages à suivre</strong>
          <p>Valider, évaluer et rédiger des rapports</p>
        </div>
        <div class="link-arrow">→</div>
      </a>

      <div class="section" *ngIf="internships.length > 0">
        <h3>Stages actifs</h3>
        <div class="intern-list">
          <div class="intern-item" *ngFor="let i of activeInternships()">
            <div class="intern-info">
              <strong>{{ i.studentName }}</strong>
              <span>{{ i.offerTitle }} — {{ i.companyName }}</span>
            </div>
            <span class="date">{{ i.startDate | date:'dd/MM/yyyy' }} → {{ i.endDate | date:'dd/MM/yyyy' }}</span>
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
      max-width: 900px;
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
      background: #7c3aed;
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
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
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
    .stat-card:nth-child(1) { animation-delay: 0.05s; }
    .stat-card:nth-child(2) { animation-delay: 0.1s; }
    .stat-card:nth-child(3) { animation-delay: 0.15s; }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(10, 14, 26, 0.08);
      border-color: transparent;
    }
    .stat-icon-wrap {
      font-size: 1.25rem;
      width: 44px;
      height: 44px;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
    }
    .stat-val {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: #0a0e1a;
      line-height: 1;
    }
    .stat-lbl {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      color: #6b7280;
      margin-top: 0.4rem;
    }
    .link-card {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 0.5s ease-out 0.2s both;
    }
    .link-card:hover {
      transform: translateY(-3px);
      border-color: #7c3aed;
      box-shadow: 0 12px 32px rgba(124, 58, 237, 0.1);
    }
    .link-icon {
      font-size: 1.5rem;
      width: 48px;
      height: 48px;
      background: rgba(124, 58, 237, 0.08);
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
      color: #7c3aed;
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
      animation: fadeInUp 0.5s ease-out 0.25s both;
    }
    .section h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #0a0e1a;
      margin-bottom: 1rem;
    }
    .intern-list {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      overflow: hidden;
    }
    .intern-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.1rem 1.5rem;
      border-bottom: 1px solid #f3f0eb;
      transition: background 0.2s ease;
    }
    .intern-item:last-child { border-bottom: none; }
    .intern-item:hover { background: #faf6f1; }
    .intern-info strong {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #0a0e1a;
      font-size: 0.9rem;
    }
    .intern-info span {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: #6b7280;
    }
    .date {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: #9ca3af;
      white-space: nowrap;
      background: rgba(124, 58, 237, 0.06);
      padding: 0.3rem 0.75rem;
      border-radius: 8px;
    }
    @media (max-width: 700px) {
      .stats-row { grid-template-columns: 1fr; }
      .page { padding: 1.5rem; }
    }
  `]
})
export class SupervisorDashboardComponent implements OnInit {
  internships: Internship[] = [];

  constructor(public auth: AuthService, private internshipService: InternshipService) {}

  ngOnInit(): void {
    this.internshipService.getMyInternships().subscribe({ next: i => this.internships = i, error: () => {} });
  }

  countByStatus(s: string): number { return this.internships.filter(i => i.status === s).length; }
  activeInternships(): Internship[] { return this.internships.filter(i => i.status === 'ACTIVE'); }
}
