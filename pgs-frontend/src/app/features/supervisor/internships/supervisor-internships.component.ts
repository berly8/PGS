import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { InternshipService } from '../../../core/services/internship.service';
import { Internship } from '../../../core/models/internship.model';

@Component({
  selector: 'app-supervisor-internships',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Mes stages supervises</h2>
        <p>{{ internships.length }} stage(s)</p>
      </div>

      <div class="intern-list">
        <div class="intern-card" *ngFor="let i of internships" [class.card-expanded]="editing === i.id">
          <div class="card-header">
            <div>
              <h3>{{ i.studentName }}</h3>
              <span class="sub">{{ i.studentEmail }}</span>
            </div>
            <span class="status-badge" [class]="'status-' + i.status.toLowerCase()">{{ statusLabel(i.status) }}</span>
          </div>

          <div class="info-row">
            <span class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
              {{ i.offerTitle }}
            </span>
            <span class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>
              {{ i.companyName }}
            </span>
            <span class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {{ i.startDate | date:'dd/MM/yyyy' }} &rarr; {{ i.endDate | date:'dd/MM/yyyy' }}
            </span>
            <span class="info-item grade-item" *ngIf="i.grade">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Note : {{ i.grade }}/20
            </span>
          </div>

          <button (click)="toggleEdit(i)" class="btn-edit">
            <svg *ngIf="editing !== i.id" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            <svg *ngIf="editing === i.id" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            {{ editing === i.id ? 'Fermer' : 'Evaluer / Rapport' }}
          </button>

          <div class="edit-form" *ngIf="editing === i.id">
            <div class="form-row">
              <div class="form-group">
                <label>Objectifs</label>
                <textarea [(ngModel)]="forms[i.id].objectives" rows="3" placeholder="Objectifs du stage..."></textarea>
              </div>
              <div class="form-group">
                <label>Realisations</label>
                <textarea [(ngModel)]="forms[i.id].achievements" rows="3" placeholder="Ce que l'etudiant a accompli..."></textarea>
              </div>
            </div>
            <div class="form-group">
              <label>Rapport de l'encadrant</label>
              <textarea [(ngModel)]="forms[i.id].supervisorReport" rows="4" placeholder="Votre evaluation detaillee..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Note /20</label>
                <input type="number" min="0" max="20" step="0.5" [(ngModel)]="forms[i.id].grade" placeholder="14.5" />
              </div>
              <div class="form-group">
                <label>Statut</label>
                <select [(ngModel)]="forms[i.id].status">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button (click)="save(i)" class="btn-save" [disabled]="saving">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="empty" *ngIf="internships.length === 0">Aucun stage assigne pour l'instant.</div>
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
    .intern-list {
      display: grid;
      gap: 1rem;
    }
    .intern-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e8e4de;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .intern-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08);
    }
    .intern-card.card-expanded {
      border-color: rgba(76, 61, 206, 0.3);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.8rem;
    }
    .card-header h3 {
      margin: 0 0 0.2rem;
      color: #0a0e1a;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .sub {
      font-size: 0.82rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
    }
    .info-row {
      display: flex;
      gap: 1.2rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .info-item {
      font-size: 0.82rem;
      color: #4b5563;
      font-family: 'DM Sans', sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .info-item svg { color: #9ca3af; }
    .grade-item {
      font-weight: 600;
      color: #4c3dce;
    }
    .grade-item svg { color: #4c3dce; }
    .btn-edit {
      padding: 0.5rem 1.2rem;
      background: rgba(76, 61, 206, 0.08);
      color: #4c3dce;
      border: none;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      margin-bottom: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }
    .btn-edit:hover {
      background: rgba(76, 61, 206, 0.15);
      transform: translateY(-1px);
    }
    .edit-form {
      margin-top: 1.2rem;
      border-top: 2px solid #f3efe9;
      padding-top: 1.5rem;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-weight: 600;
      color: #0a0e1a;
      margin-bottom: 0.35rem;
      font-size: 0.85rem;
      font-family: 'DM Sans', sans-serif;
    }
    .form-group textarea, .form-group input, .form-group select {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 2px solid #e8e4de;
      border-radius: 10px;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      color: #0a0e1a;
      background: #ffffff;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .form-group textarea:focus, .form-group input:focus, .form-group select:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 4px rgba(76, 61, 206, 0.1);
    }
    .form-group textarea::placeholder, .form-group input::placeholder { color: #9ca3af; }
    .form-actions {
      text-align: right;
      padding-top: 0.3rem;
    }
    .btn-save {
      padding: 0.7rem 1.6rem;
      background: #4c3dce;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-save:hover:not(:disabled) {
      background: #3d30a8;
      transform: translateY(-1px);
    }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
    }
    .status-active { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .status-completed { background: rgba(76, 61, 206, 0.1); color: #4c3dce; }
    .status-suspended { background: rgba(217, 119, 6, 0.1); color: #d97706; }
    .status-cancelled { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .empty {
      text-align: center;
      padding: 4rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
  `]
})
export class SupervisorInternshipsComponent implements OnInit {
  internships: Internship[] = [];
  editing: number | null = null;
  forms: Record<number, any> = {};
  saving = false;

  constructor(private internshipService: InternshipService) {}

  ngOnInit(): void {
    this.internshipService.getMyInternships().subscribe({
      next: i => {
        this.internships = i;
        i.forEach((item: any) => this.forms[item.id] = {
          objectives: item.objectives || '',
          achievements: item.achievements || '',
          supervisorReport: item.supervisorReport || '',
          grade: item.grade || null,
          status: item.status
        });
      },
      error: () => {}
    });
  }

  toggleEdit(i: Internship): void {
    this.editing = this.editing === i.id ? null : i.id;
  }

  save(i: Internship): void {
    this.saving = true;
    this.internshipService.updateInternship(i.id, this.forms[i.id]).subscribe({
      next: updated => {
        const idx = this.internships.findIndex(x => x.id === updated.id);
        if (idx > -1) this.internships[idx] = updated;
        this.saving = false;
        this.editing = null;
      },
      error: () => { this.saving = false; }
    });
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'Actif', COMPLETED: 'Terminé', SUSPENDED: 'Suspendu', CANCELLED: 'Annulé'
    };
    return map[s] || s;
  }
}
