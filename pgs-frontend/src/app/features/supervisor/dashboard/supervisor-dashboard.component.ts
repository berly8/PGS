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
        <h2>Tableau de bord Encadrant 👨‍🏫</h2>
        <p>Bonjour, {{ auth.currentUser?.fullName }}</p>
      </div>

      <div class="stats-row">
        <div class="stat-card"><div class="stat-val">{{ internships.length }}</div><div class="stat-lbl">Stages assignés</div></div>
        <div class="stat-card"><div class="stat-val">{{ countByStatus('ACTIVE') }}</div><div class="stat-lbl">Stages actifs</div></div>
        <div class="stat-card"><div class="stat-val">{{ countByStatus('COMPLETED') }}</div><div class="stat-lbl">Stages terminés</div></div>
      </div>

      <a routerLink="/supervisor/internships" class="link-card">
        <span>📋</span>
        <strong>Mes stages à suivre</strong>
        <p>Valider, évaluer et rédiger des rapports</p>
      </a>

      <div class="section" *ngIf="internships.length > 0">
        <h3>Stages actifs</h3>
        <div class="intern-list">
          <div class="intern-item" *ngFor="let i of activeInternships()">
            <div>
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
    .page { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: white; border-radius: 10px; padding: 1.2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .stat-val { font-size: 2rem; font-weight: 800; color: #8b5cf6; }
    .stat-lbl { font-size: 0.8rem; color: #6b7280; margin-top: 0.2rem; }
    .link-card { background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; transition: all 0.2s; }
    .link-card:hover { border-color: #8b5cf6; box-shadow: 0 4px 12px rgba(124,58,237,0.15); }
    .link-card span { font-size: 2rem; }
    .link-card strong { display: block; color: #4f46e5; }
    .link-card p { margin: 0.2rem 0 0; color: #6b7280; font-size: 0.85rem; }
    .section h3 { font-size: 1.1rem; color: #4f46e5; margin-bottom: 1rem; }
    .intern-list { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .intern-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9; }
    .intern-item:last-child { border-bottom: none; }
    .intern-item strong { display: block; color: #4f46e5; font-size: 0.9rem; }
    .intern-item span { font-size: 0.8rem; color: #6b7280; }
    .date { font-size: 0.8rem; color: #9ca3af; white-space: nowrap; }
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
