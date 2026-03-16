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
            <span class="company">🏢 {{ app.companyName }}</span>
            <p class="date">Postulé le {{ app.appliedAt | date:'dd/MM/yyyy HH:mm' }}</p>
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
        <p>🗂️ Aucune candidature pour l'instant.</p>
        <p>Explorez les offres et postulez !</p>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .app-list { display: grid; gap: 1rem; }
    .app-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .app-left { flex: 1; }
    .app-left h3 { margin: 0 0 0.3rem; color: #4f46e5; }
    .company { font-size: 0.85rem; color: #6b7280; display: block; margin-bottom: 0.4rem; }
    .date { font-size: 0.8rem; color: #9ca3af; margin: 0 0 0.5rem; }
    .note { font-size: 0.85rem; color: #374151; margin: 0.5rem 0 0; background: #f8fafc; padding: 0.5rem; border-radius: 6px; border-left: 3px solid #6366f1; }
    .app-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.8rem; }
    .status-badge { padding: 0.3rem 0.9rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .status-pending { background: #fef3c7; color: #f59e0b; }
    .status-reviewing { background: #dbeafe; color: #2563eb; }
    .status-accepted { background: #d1fae5; color: #10b981; }
    .status-rejected { background: #fee2e2; color: #dc2626; }
    .status-withdrawn { background: #f3f4f6; color: #6b7280; }
    .btn-withdraw { padding: 0.4rem 1rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .btn-withdraw:hover { background: #fecaca; }
    .empty { text-align: center; padding: 4rem; color: #9ca3af; }
    .empty p { margin: 0.3rem 0; }
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
