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
        <h2>Mes stages supervisés</h2>
        <p>{{ internships.length }} stage(s)</p>
      </div>

      <div class="intern-list">
        <div class="intern-card" *ngFor="let i of internships">
          <div class="card-header">
            <div>
              <h3>{{ i.studentName }}</h3>
              <span class="sub">{{ i.studentEmail }}</span>
            </div>
            <span class="status-badge" [class]="'status-' + i.status.toLowerCase()">{{ statusLabel(i.status) }}</span>
          </div>

          <div class="info-row">
            <span>📋 {{ i.offerTitle }}</span>
            <span>🏢 {{ i.companyName }}</span>
            <span>📅 {{ i.startDate | date:'dd/MM/yyyy' }} → {{ i.endDate | date:'dd/MM/yyyy' }}</span>
            <span *ngIf="i.grade">⭐ Note : {{ i.grade }}/20</span>
          </div>

          <button (click)="toggleEdit(i)" class="btn-edit">
            {{ editing === i.id ? '▲ Fermer' : '✏️ Évaluer / Rapport' }}
          </button>

          <div class="edit-form" *ngIf="editing === i.id">
            <div class="form-row">
              <div class="form-group">
                <label>Objectifs</label>
                <textarea [(ngModel)]="forms[i.id].objectives" rows="3" placeholder="Objectifs du stage..."></textarea>
              </div>
              <div class="form-group">
                <label>Réalisations</label>
                <textarea [(ngModel)]="forms[i.id].achievements" rows="3" placeholder="Ce que l'étudiant a accompli..."></textarea>
              </div>
            </div>
            <div class="form-group">
              <label>Rapport de l'encadrant</label>
              <textarea [(ngModel)]="forms[i.id].supervisorReport" rows="4" placeholder="Votre évaluation détaillée..."></textarea>
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

      <div class="empty" *ngIf="internships.length === 0">Aucun stage assigné pour l'instant.</div>
    </div>
  </div></div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .intern-list { display: grid; gap: 1.2rem; }
    .intern-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; }
    .card-header h3 { margin: 0 0 0.2rem; color: #4f46e5; }
    .sub { font-size: 0.82rem; color: #6b7280; }
    .info-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .info-row span { font-size: 0.82rem; color: #4b5563; }
    .btn-edit { padding: 0.45rem 1.1rem; background: #ede9fe; color: #8b5cf6; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; margin-bottom: 0.5rem; }
    .edit-form { margin-top: 1.2rem; border-top: 2px solid #f1f5f9; padding-top: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.3rem; font-size: 0.85rem; }
    .form-group textarea, .form-group input, .form-group select { width: 100%; padding: 0.65rem 0.9rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.9rem; outline: none; box-sizing: border-box; resize: vertical; }
    .form-group textarea:focus, .form-group input:focus, .form-group select:focus { border-color: #8b5cf6; }
    .form-actions { text-align: right; }
    .btn-save { padding: 0.65rem 1.5rem; background: #8b5cf6; color: white; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .status-active { background: #d1fae5; color: #10b981; }
    .status-completed { background: #dbeafe; color: #2563eb; }
    .status-suspended { background: #fef3c7; color: #f59e0b; }
    .status-cancelled { background: #fee2e2; color: #dc2626; }
    .empty { text-align: center; padding: 4rem; color: #9ca3af; }
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
