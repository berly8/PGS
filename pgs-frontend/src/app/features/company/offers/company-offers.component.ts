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
        <button (click)="openCreate()" class="btn-create">+ Nouvelle offre</button>
      </div>

      <div class="offers-grid" *ngIf="offers.length > 0">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="card-header">
            <h3>{{ offer.title }}</h3>
            <span class="status-badge" [class]="'status-' + offer.status.toLowerCase()">{{ offer.status }}</span>
          </div>
          <p class="desc">{{ offer.description | slice:0:120 }}...</p>
          <div class="meta">
            <span>📍 {{ offer.location }}</span>
            <span>⏱ {{ offer.durationWeeks }} sem.</span>
            <span *ngIf="offer.compensation">💶 {{ offer.compensation }}€</span>
          </div>
          <div class="card-footer">
            <span class="apps">👥 {{ offer.applicationCount }} candidature(s)</span>
            <div class="actions">
              <button (click)="openEdit(offer)" class="btn-edit">Modifier</button>
              <button (click)="deleteOffer(offer.id)" class="btn-delete">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" *ngIf="offers.length === 0">Aucune offre publiée. Créez votre première offre !</div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>{{ editingOffer ? 'Modifier l\'offre' : 'Nouvelle offre' }}</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Titre *</label>
            <input [(ngModel)]="form.title" placeholder="Ex: Stage Développeur Backend" />
          </div>
          <div class="form-group">
            <label>Domaine</label>
            <input [(ngModel)]="form.domain" placeholder="Informatique, Finance..." />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="form.description" rows="4" placeholder="Décrivez le poste..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Lieu</label>
            <input [(ngModel)]="form.location" placeholder="Paris, Lyon..." />
          </div>
          <div class="form-group">
            <label>Durée (semaines)</label>
            <input type="number" [(ngModel)]="form.durationWeeks" placeholder="12" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date de début</label>
            <input type="date" [(ngModel)]="form.startDate" />
          </div>
          <div class="form-group">
            <label>Date de fin</label>
            <input type="date" [(ngModel)]="form.endDate" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Rémunération (€/mois)</label>
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
          <label>Prérequis</label>
          <textarea [(ngModel)]="form.requirements" rows="2" placeholder="Compétences requises..."></textarea>
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
    .page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0; }
    .btn-create { padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #f59e0b, #f59e0b); color: white; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
    .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.2rem; }
    .offer-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; }
    .card-header h3 { margin: 0; color: #4f46e5; font-size: 1rem; }
    .status-badge { padding: 0.25rem 0.7rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .status-open { background: #d1fae5; color: #10b981; }
    .status-closed { background: #fee2e2; color: #dc2626; }
    .status-expired { background: #f3f4f6; color: #6b7280; }
    .desc { color: #6b7280; font-size: 0.85rem; margin: 0 0 0.8rem; line-height: 1.5; }
    .meta { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .meta span { font-size: 0.8rem; color: #6b7280; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .apps { font-size: 0.82rem; color: #9ca3af; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-edit { padding: 0.4rem 0.9rem; background: #dbeafe; color: #1d4ed8; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .btn-delete { padding: 0.4rem 0.9rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .empty { text-align: center; padding: 4rem; color: #9ca3af; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
    .modal { background: white; border-radius: 16px; padding: 2rem; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .modal h3 { color: #4f46e5; margin: 0 0 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.3rem; font-size: 0.85rem; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.65rem 0.9rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.9rem; outline: none; box-sizing: border-box; resize: vertical; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #f59e0b; }
    .modal-actions { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 0.5rem; }
    .btn-cancel { padding: 0.7rem 1.5rem; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; }
    .btn-save { padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #f59e0b, #f59e0b); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
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
