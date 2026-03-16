import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Offer } from '../../../core/models/offer.model';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <div class="header-accent"></div>
        <h2>Tableau de bord Entreprise 🏢</h2>
        <p>Gérez vos offres et candidatures</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon-wrap">📋</div>
          <div class="stat-val">{{ offers.length }}</div>
          <div class="stat-lbl">Offres publiées</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap">📂</div>
          <div class="stat-val">{{ openOffers }}</div>
          <div class="stat-lbl">Offres ouvertes</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap">👥</div>
          <div class="stat-val">{{ totalApps }}</div>
          <div class="stat-lbl">Candidatures reçues</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap">⏳</div>
          <div class="stat-val">{{ pendingApps }}</div>
          <div class="stat-lbl">En attente</div>
        </div>
      </div>

      <div class="quick-links">
        <a routerLink="/company/offers" class="link-card">
          <div class="link-icon">📋</div>
          <div class="link-text">
            <strong>Gérer mes offres</strong>
            <p>Créer, modifier, fermer des offres</p>
          </div>
          <div class="link-arrow">→</div>
        </a>
        <a routerLink="/company/candidatures" class="link-card">
          <div class="link-icon">👥</div>
          <div class="link-text">
            <strong>Voir les candidatures</strong>
            <p>Accepter ou refuser des candidats</p>
          </div>
          <div class="link-arrow">→</div>
        </a>
      </div>

      <div class="section" *ngIf="offers.length > 0">
        <h3>Mes offres récentes</h3>
        <div class="offers-list">
          <div class="offer-row" *ngFor="let o of offers.slice(0,5)">
            <div class="offer-info">
              <strong>{{ o.title }}</strong>
              <span>{{ o.location }} | {{ o.durationWeeks }} semaines</span>
            </div>
            <div class="offer-meta">
              <span class="app-count">{{ o.applicationCount }} candidat(s)</span>
              <span class="status-badge" [class]="'status-' + o.status.toLowerCase()">{{ o.status }}</span>
            </div>
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
      max-width: 1000px;
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
      background: #d97706;
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
      grid-template-columns: repeat(4, 1fr);
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
    .stat-card:nth-child(4) { animation-delay: 0.2s; }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(10, 14, 26, 0.08);
      border-color: transparent;
    }
    .stat-icon-wrap {
      font-size: 1.25rem;
      width: 44px;
      height: 44px;
      background: rgba(217, 119, 6, 0.1);
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
    .quick-links {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .link-card {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: fadeInUp 0.5s ease-out 0.25s both;
    }
    .link-card:hover {
      transform: translateY(-3px);
      border-color: #d97706;
      box-shadow: 0 12px 32px rgba(217, 119, 6, 0.1);
    }
    .link-icon {
      font-size: 1.5rem;
      width: 48px;
      height: 48px;
      background: rgba(217, 119, 6, 0.08);
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
      color: #d97706;
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
      animation: fadeInUp 0.5s ease-out 0.3s both;
    }
    .section h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #0a0e1a;
      margin-bottom: 1rem;
    }
    .offers-list {
      background: #ffffff;
      border: 1px solid #e8e4de;
      border-radius: 16px;
      overflow: hidden;
    }
    .offer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.1rem 1.5rem;
      border-bottom: 1px solid #f3f0eb;
      transition: background 0.2s ease;
    }
    .offer-row:last-child { border-bottom: none; }
    .offer-row:hover { background: #faf6f1; }
    .offer-info strong {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #0a0e1a;
      font-size: 0.9rem;
    }
    .offer-info span {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: #6b7280;
    }
    .offer-meta {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .app-count {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      color: #6b7280;
      background: #faf6f1;
      padding: 0.25rem 0.7rem;
      border-radius: 8px;
    }
    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .status-open { background: #d1fae5; color: #047857; }
    .status-closed { background: #fee2e2; color: #b91c1c; }
    .status-expired { background: #f3f4f6; color: #6b7280; }
    @media (max-width: 700px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .quick-links { grid-template-columns: 1fr; }
      .page { padding: 1.5rem; }
    }
  `]
})
export class CompanyDashboardComponent implements OnInit {
  offers: Offer[] = [];
  totalApps = 0;
  pendingApps = 0;

  get openOffers(): number { return this.offers.filter(o => o.status === 'OPEN').length; }

  constructor(public auth: AuthService, private offerService: OfferService, private appService: ApplicationService) {}

  ngOnInit(): void {
    if (this.auth.currentUser?.id) {
      this.offerService.getOffersByCompany(this.auth.currentUser.id).subscribe({ next: o => this.offers = o, error: () => {} });
      this.appService.getCompanyApplications().subscribe({ next: apps => {
        this.totalApps = apps.length;
        this.pendingApps = apps.filter((a: any) => a.status === 'PENDING').length;
      }, error: () => {} });
    }
  }
}
