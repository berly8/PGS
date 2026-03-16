import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { OfferService } from '../../../core/services/offer.service';
import { AuthService } from '../../../core/services/auth.service';
import { Offer } from '../../../core/models/offer.model';

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Mes offres de stage</h2>
        <button (click)="openCreate()" class="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nouvelle offre
        </button>
      </div>

      <div class="offers-grid" *ngIf="offers.length > 0">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="card-header">
            <h3>{{ offer.title }}</h3>
            <span class="status-badge" [class]="'status-' + offer.status.toLowerCase()">{{ offer.status }}</span>
          </div>
          <p class="desc">{{ offer.description | slice:0:120 }}...</p>
          <div class="meta">
            <span class="meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> {{ offer.location }}</span>
            <span class="meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {{ offer.durationWeeks }} sem.</span>
            <span class="meta-item" *ngIf="offer.compensation">{{ offer.compensation }}&#8364;</span>
          </div>
          <div class="card-footer">
            <span class="apps">{{ offer.applicationCount }} candidature(s)</span>
            <div class="actions">
              <button (click)="openEdit(offer)" class="btn-edit">Modifier</button>
              <button (click)="deleteOffer(offer.id)" class="btn-delete">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" *ngIf="offers.length === 0">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
        </div>
        <p>Aucune offre publiee. Creez votre premiere offre !</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editingOffer ? 'Modifier l\'offre' : 'Nouvelle offre' }}</h3>
          <button class="modal-close" (click)="closeModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Titre *</label>
            <input [(ngModel)]="form.title" placeholder="Ex: Stage Developpeur Backend" />
          </div>
          <div class="form-group">
            <label>Domaine</label>
            <input [(ngModel)]="form.domain" placeholder="Informatique, Finance..." />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="form.description" rows="4" placeholder="Decrivez le poste..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Lieu</label>
            <input [(ngModel)]="form.location" placeholder="Paris, Lyon..." />
          </div>
          <div class="form-group">
            <label>Duree (semaines)</label>
            <input type="number" [(ngModel)]="form.durationWeeks" placeholder="12" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date de debut</label>
            <input type="date" [(ngModel)]="form.startDate" />
          </div>
          <div class="form-group">
            <label>Date de fin</label>
            <input type="date" [(ngModel)]="form.endDate" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Remuneration (&#8364;/mois)</label>
            <input type="number" [(ngModel)]="form.compensation" placeholder="600" />
          </div>
          <div class="form-group" *ngIf="editingOffer">
            <label>Statut</label>
            <select [(ngModel)]="form.status">
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Prerequis</label>
          <textarea [(ngModel)]="form.requirements" rows="2" placeholder="Competences requises..."></textarea>
        </div>
        <div class="modal-actions">
          <button (click)="closeModal()" class="btn-cancel">Annuler</button>
          <button (click)="saveOffer()" class="btn-save" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page {
      padding: 2.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .page-header h2 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #0a0e1a;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .btn-create {
      padding: 0.7rem 1.4rem;
      background: #d97706;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-create:hover {
      background: #b45309;
      transform: translateY(-1px);
    }
    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.2rem;
    }
    .offer-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e8e4de;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .offer-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.08);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.8rem;
      gap: 0.8rem;
    }
    .card-header h3 {
      margin: 0;
      color: #0a0e1a;
      font-size: 1.05rem;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
    }
    .status-badge {
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      white-space: nowrap;
    }
    .status-open { background: rgba(5, 150, 105, 0.1); color: #059669; }
    .status-closed { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .status-expired { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
    .desc {
      color: #6b7280;
      font-size: 0.85rem;
      margin: 0 0 0.8rem;
      line-height: 1.6;
      font-family: 'DM Sans', sans-serif;
    }
    .meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .meta-item {
      font-size: 0.8rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    .meta-item svg { color: #9ca3af; }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f3efe9;
    }
    .apps {
      font-size: 0.82rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-edit {
      padding: 0.4rem 0.9rem;
      background: rgba(76, 61, 206, 0.1);
      color: #4c3dce;
      border: none;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-edit:hover {
      background: rgba(76, 61, 206, 0.18);
      transform: translateY(-1px);
    }
    .btn-delete {
      padding: 0.4rem 0.9rem;
      background: rgba(220, 38, 38, 0.08);
      color: #dc2626;
      border: none;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-delete:hover {
      background: rgba(220, 38, 38, 0.15);
      transform: translateY(-1px);
    }
    .empty {
      text-align: center;
      padding: 4rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
    .empty-icon {
      margin-bottom: 1rem;
      color: #d5d0c8;
    }
    .empty p { margin: 0; }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 14, 26, 0.4);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .modal {
      background: #ffffff;
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      animation: slideUp 0.3s ease;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .modal-header h3 {
      color: #0a0e1a;
      margin: 0;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
    }
    .modal-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.3rem;
      border-radius: 8px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }
    .modal-close:hover { background: #f3efe9; color: #0a0e1a; }
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
    .form-group input, .form-group textarea, .form-group select {
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
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      border-color: #d97706;
      box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
    }
    .form-group input::placeholder, .form-group textarea::placeholder { color: #9ca3af; }
    .modal-actions {
      display: flex;
      gap: 0.8rem;
      justify-content: flex-end;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
    }
    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background: #faf6f1;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      color: #0a0e1a;
      transition: background 0.2s;
    }
    .btn-cancel:hover { background: #f3efe9; }
    .btn-save {
      padding: 0.75rem 1.5rem;
      background: #d97706;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-save:hover:not(:disabled) {
      background: #b45309;
      transform: translateY(-1px);
    }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class CompanyOffersComponent implements OnInit {
  offers: Offer[] = [];
  showModal = false;
  editingOffer: Offer | null = null;
  saving = false;
  form: any = {};

  constructor(private offerService: OfferService, public auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.currentUser?.id) {
      this.offerService.getOffersByCompany(this.auth.currentUser.id).subscribe({ next: o => this.offers = o, error: () => {} });
    }
  }

  openCreate(): void { this.editingOffer = null; this.form = {}; this.showModal = true; }

  openEdit(offer: Offer): void {
    this.editingOffer = offer;
    this.form = { ...offer };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  saveOffer(): void {
    this.saving = true;
    const op = this.editingOffer
      ? this.offerService.updateOffer(this.editingOffer.id, this.form)
      : this.offerService.createOffer(this.form);

    op.subscribe({
      next: saved => {
        if (this.editingOffer) {
          const idx = this.offers.findIndex(o => o.id === saved.id);
          if (idx > -1) this.offers[idx] = saved;
        } else {
          this.offers.unshift(saved);
        }
        this.saving = false;
        this.closeModal();
      },
      error: () => { this.saving = false; }
    });
  }

  deleteOffer(id: number): void {
    if (!confirm('Supprimer cette offre ?')) return;
    this.offerService.deleteOffer(id).subscribe(() => {
      this.offers = this.offers.filter(o => o.id !== id);
    });
  }
}
