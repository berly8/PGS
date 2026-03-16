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
        <h2>Candidatures recues</h2>
        <p>{{ filtered.length }} candidature(s)</p>
      </div>

      <div class="filters">
        <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="REVIEWING">En revision</option>
          <option value="ACCEPTED">Acceptees</option>
          <option value="REJECTED">Refusees</option>
        </select>
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Rechercher un candidat ou une offre..." class="search" />
        </div>
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
          <div class="offer-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
            {{ app.offerTitle }}
          </div>
          <p class="cover" *ngIf="app.coverLetter">{{ app.coverLetter | slice:0:200 }}{{ app.coverLetter.length > 200 ? '...' : '' }}</p>
          <a *ngIf="app.cvUrl" [href]="app.cvUrl" target="_blank" class="cv-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            Voir le CV
          </a>
          <p class="date">Candidature recue le {{ app.appliedAt | date:'dd/MM/yyyy' }}</p>

          <div class="action-row" *ngIf="app.status === 'PENDING' || app.status === 'REVIEWING'">
            <input [(ngModel)]="notes[app.id]" placeholder="Commentaire (optionnel)" class="note-input" />
            <button (click)="updateStatus(app, 'REVIEWING')" class="btn-review" *ngIf="app.status === 'PENDING'">
              En revision
            </button>
            <button (click)="updateStatus(app, 'ACCEPTED')" class="btn-accept">Accepter</button>
            <button (click)="updateStatus(app, 'REJECTED')" class="btn-reject">Refuser</button>
          </div>
          <p class="note-display" *ngIf="app.companyNote">{{ app.companyNote }}</p>
        </div>
      </div>

      <div class="empty" *ngIf="filtered.length === 0">Aucune candidature trouvee.</div>
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
    .filters {
      display: flex;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
    }
    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      background: #ffffff;
      color: #0a0e1a;
      cursor: pointer;
      transition: border-color 0.25s, box-shadow 0.25s;
      min-width: 170px;
    }
    .filter-select:focus {
      border-color: #d97706;
      box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
    }
    .search-wrapper {
      flex: 1;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      pointer-events: none;
    }
    .search {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      background: #ffffff;
      color: #0a0e1a;
      box-sizing: border-box;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .search:focus {
      border-color: #d97706;
      box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
    }
    .search::placeholder { color: #9ca3af; }
    .app-list {
      display: grid;
      gap: 1rem;
    }
    .app-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e8e4de;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .app-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08);
    }
    .app-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.6rem;
    }
    .app-top h3 {
      margin: 0 0 0.2rem;
      color: #0a0e1a;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
      font-size: 1.05rem;
    }
    .email {
      font-size: 0.82rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
    }
    .offer-line {
      font-size: 0.85rem;
      color: #0a0e1a;
      margin: 0.5rem 0;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .offer-line svg { color: #6b7280; }
    .cover {
      font-size: 0.85rem;
      color: #4b5563;
      line-height: 1.6;
      margin: 0.5rem 0;
      background: #faf6f1;
      padding: 0.85rem;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
    }
    .cv-link {
      font-size: 0.85rem;
      color: #4c3dce;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin: 0.3rem 0;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      transition: color 0.2s;
    }
    .cv-link:hover { color: #3d30a8; }
    .date {
      font-size: 0.78rem;
      color: #9ca3af;
      margin: 0.4rem 0;
      font-family: 'DM Sans', sans-serif;
    }
    .action-row {
      display: flex;
      gap: 0.6rem;
      align-items: center;
      margin-top: 1rem;
      flex-wrap: wrap;
      padding-top: 1rem;
      border-top: 1px solid #f3efe9;
    }
    .note-input {
      flex: 1;
      min-width: 160px;
      padding: 0.55rem 0.85rem;
      border: 2px solid #e8e4de;
      border-radius: 10px;
      font-size: 0.85rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      color: #0a0e1a;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .note-input:focus {
      border-color: #d97706;
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
    }
    .note-input::placeholder { color: #9ca3af; }
    .btn-review {
      padding: 0.5rem 1rem;
      background: rgba(76, 61, 206, 0.1);
      color: #4c3dce;
      border: none;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-review:hover { background: rgba(76, 61, 206, 0.18); transform: translateY(-1px); }
    .btn-accept {
      padding: 0.5rem 1rem;
      background: rgba(5, 150, 105, 0.1);
      color: #059669;
      border: none;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-accept:hover { background: rgba(5, 150, 105, 0.18); transform: translateY(-1px); }
    .btn-reject {
      padding: 0.5rem 1rem;
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
    .btn-reject:hover { background: rgba(220, 38, 38, 0.15); transform: translateY(-1px); }
    .note-display {
      font-size: 0.82rem;
      color: #0a0e1a;
      margin-top: 0.6rem;
      background: #faf6f1;
      padding: 0.6rem 0.85rem;
      border-radius: 10px;
      border-left: 3px solid #d97706;
      font-family: 'DM Sans', sans-serif;
      line-height: 1.5;
    }
    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
    }
    .status-pending { background: rgba(217, 119, 6, 0.1); color: #d97706; }
    .status-reviewing { background: rgba(76, 61, 206, 0.1); color: #4c3dce; }
    .status-accepted { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .status-rejected { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .status-withdrawn { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
    .empty {
      text-align: center;
      padding: 4rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
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
