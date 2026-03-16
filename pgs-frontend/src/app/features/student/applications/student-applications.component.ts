import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Mes candidatures</h2>
        <p>{{ applications.length }} candidature(s)</p>
      </div>

      <div class="app-list" *ngIf="applications.length > 0">
        <div class="app-card" *ngFor="let app of applications">
          <div class="app-left">
            <h3>{{ app.offerTitle }}</h3>
            <span class="company">{{ app.companyName }}</span>
            <p class="date">Postule le {{ app.appliedAt | date:'dd/MM/yyyy HH:mm' }}</p>
            <p class="note" *ngIf="app.companyNote"><strong>Note entreprise :</strong> {{ app.companyNote }}</p>
          </div>
          <div class="app-right">
            <span class="status-badge" [class]="'status-' + app.status.toLowerCase()">
              {{ statusLabel(app.status) }}
            </span>
            <button class="btn-withdraw"
                    *ngIf="app.status === 'PENDING' || app.status === 'REVIEWING'"
                    (click)="withdraw(app)">
              Retirer
            </button>
          </div>
        </div>
      </div>

      <div class="empty" *ngIf="applications.length === 0">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
        </div>
        <p class="empty-title">Aucune candidature pour l'instant.</p>
        <p class="empty-sub">Explorez les offres et postulez !</p>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page {
      padding: 2.5rem;
      max-width: 900px;
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
    .app-list {
      display: grid;
      gap: 0.85rem;
    }
    .app-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e8e4de;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .app-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08);
    }
    .app-left { flex: 1; }
    .app-left h3 {
      margin: 0 0 0.4rem;
      color: #0a0e1a;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.05rem;
      font-weight: 600;
    }
    .company {
      font-size: 0.85rem;
      color: #6b7280;
      display: block;
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', sans-serif;
    }
    .date {
      font-size: 0.8rem;
      color: #9ca3af;
      margin: 0 0 0.5rem;
      font-family: 'DM Sans', sans-serif;
    }
    .note {
      font-size: 0.85rem;
      color: #0a0e1a;
      margin: 0.6rem 0 0;
      background: #faf6f1;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      border-left: 3px solid #4c3dce;
      font-family: 'DM Sans', sans-serif;
      line-height: 1.5;
    }
    .app-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.8rem;
      flex-shrink: 0;
    }
    .status-badge {
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
    }
    .status-pending { background: rgba(217, 119, 6, 0.1); color: #d97706; }
    .status-reviewing { background: rgba(76, 61, 206, 0.1); color: #4c3dce; }
    .status-accepted { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .status-rejected { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .status-withdrawn { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
    .btn-withdraw {
      padding: 0.45rem 1.1rem;
      background: rgba(220, 38, 38, 0.08);
      color: #dc2626;
      border: none;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-withdraw:hover {
      background: rgba(220, 38, 38, 0.15);
      transform: translateY(-1px);
    }
    .empty {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
    .empty-icon {
      margin-bottom: 1.2rem;
      color: #d5d0c8;
    }
    .empty-title {
      margin: 0 0 0.3rem;
      font-size: 1.05rem;
      color: #6b7280;
      font-weight: 500;
    }
    .empty-sub {
      margin: 0;
      font-size: 0.9rem;
      color: #9ca3af;
    }
  `]
})
export class StudentApplicationsComponent implements OnInit {
  applications: Application[] = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.getMyApplications().subscribe({ next: a => this.applications = a, error: () => {} });
  }

  withdraw(app: Application): void {
    if (!confirm('Retirer cette candidature ?')) return;
    this.applicationService.withdraw(app.id).subscribe(() => {
      app.status = 'WITHDRAWN';
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'En attente', REVIEWING: 'En révision',
      ACCEPTED: 'Acceptée', REJECTED: 'Refusée', WITHDRAWN: 'Retirée'
    };
    return map[status] || status;
  }
}
