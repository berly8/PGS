import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-company-candidatures',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Candidatures reçues</h2>
        <p>{{ filtered.length }} candidature(s)</p>
      </div>

      <div class="filters">
        <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()">
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="REVIEWING">En révision</option>
          <option value="ACCEPTED">Acceptées</option>
          <option value="REJECTED">Refusées</option>
        </select>
        <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Rechercher un candidat ou une offre..." class="search" />
      </div>

      <div class="app-list">
        <div class="app-card" *ngFor="let app of filtered">
          <div class="app-top">
            <div>
              <h3>{{ app.studentName }}</h3>
              <span class="email">{{ app.studentEmail }}</span>
            </div>
            <span class="status-badge" [class]="'status-' + app.status.toLowerCase()">{{ statusLabel(app.status) }}</span>
          </div>
          <div class="offer-line">📋 {{ app.offerTitle }}</div>
          <p class="cover" *ngIf="app.coverLetter">{{ app.coverLetter | slice:0:200 }}{{ app.coverLetter.length > 200 ? '...' : '' }}</p>
          <a *ngIf="app.cvUrl" [href]="app.cvUrl" target="_blank" class="cv-link">📎 Voir le CV</a>
          <p class="date">Candidature reçue le {{ app.appliedAt | date:'dd/MM/yyyy' }}</p>

          <div class="action-row" *ngIf="app.status === 'PENDING' || app.status === 'REVIEWING'">
            <input [(ngModel)]="notes[app.id]" placeholder="Commentaire (optionnel)" class="note-input" />
            <button (click)="updateStatus(app, 'REVIEWING')" class="btn-review" *ngIf="app.status === 'PENDING'">
              En révision
            </button>
            <button (click)="updateStatus(app, 'ACCEPTED')" class="btn-accept">✓ Accepter</button>
            <button (click)="updateStatus(app, 'REJECTED')" class="btn-reject">✗ Refuser</button>
          </div>
          <p class="note-display" *ngIf="app.companyNote">💬 {{ app.companyNote }}</p>
        </div>
      </div>

      <div class="empty" *ngIf="filtered.length === 0">Aucune candidature trouvée.</div>
    </div>
  </div></div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .filters { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; }
    select, .search { padding: 0.7rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.9rem; outline: none; }
    .search { flex: 1; }
    select:focus, .search:focus { border-color: #f59e0b; }
    .app-list { display: grid; gap: 1.2rem; }
    .app-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .app-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .app-top h3 { margin: 0 0 0.2rem; color: #4f46e5; }
    .email { font-size: 0.82rem; color: #6b7280; }
    .offer-line { font-size: 0.85rem; color: #374151; margin: 0.5rem 0; font-weight: 500; }
    .cover { font-size: 0.85rem; color: #4b5563; line-height: 1.5; margin: 0.5rem 0; background: #f8fafc; padding: 0.8rem; border-radius: 8px; }
    .cv-link { font-size: 0.85rem; color: #2563eb; text-decoration: none; display: inline-block; margin: 0.3rem 0; }
    .date { font-size: 0.78rem; color: #9ca3af; margin: 0.3rem 0; }
    .action-row { display: flex; gap: 0.6rem; align-items: center; margin-top: 1rem; flex-wrap: wrap; }
    .note-input { flex: 1; min-width: 160px; padding: 0.5rem 0.8rem; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.85rem; outline: none; }
    .btn-review { padding: 0.45rem 1rem; background: #dbeafe; color: #1d4ed8; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .btn-accept { padding: 0.45rem 1rem; background: #d1fae5; color: #10b981; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .btn-reject { padding: 0.45rem 1rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .note-display { font-size: 0.82rem; color: #374151; margin-top: 0.5rem; background: #f1f5f9; padding: 0.5rem 0.8rem; border-radius: 6px; border-left: 3px solid #f59e0b; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .status-pending { background: #fef3c7; color: #f59e0b; }
    .status-reviewing { background: #dbeafe; color: #2563eb; }
    .status-accepted { background: #d1fae5; color: #10b981; }
    .status-rejected { background: #fee2e2; color: #dc2626; }
    .status-withdrawn { background: #f3f4f6; color: #6b7280; }
    .empty { text-align: center; padding: 4rem; color: #9ca3af; }
  `]
})
export class CompanyCandidaturesComponent implements OnInit {
  applications: Application[] = [];
  filtered: Application[] = [];
  statusFilter = '';
  searchTerm = '';
  notes: Record<number, string> = {};

  constructor(private appService: ApplicationService) {}

  ngOnInit(): void {
    this.appService.getCompanyApplications().subscribe({
      next: a => { this.applications = a; this.applyFilter(); },
      error: () => {}
    });
  }

  applyFilter(): void {
    this.filtered = this.applications.filter(a => {
      const matchStatus = !this.statusFilter || a.status === this.statusFilter;
      const matchSearch = !this.searchTerm ||
        `${a.studentName} ${a.studentEmail} ${a.offerTitle}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  updateStatus(app: Application, status: ApplicationStatus): void {
    const note = this.notes[app.id];
    this.appService.updateStatus(app.id, status, note).subscribe(updated => {
      const idx = this.applications.findIndex(a => a.id === updated.id);
      if (idx > -1) this.applications[idx] = updated;
      this.applyFilter();
    });
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      PENDING: 'En attente', REVIEWING: 'En révision',
      ACCEPTED: 'Acceptée', REJECTED: 'Refusée', WITHDRAWN: 'Retirée'
    };
    return map[s] || s;
  }
}
