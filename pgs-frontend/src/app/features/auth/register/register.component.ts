import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="auth-panel">
        <div class="panel-content">
          <div class="brand">
            <div class="brand-mark">P</div>
            <span class="brand-name">PGS</span>
          </div>
          <h2>Rejoignez la plateforme</h2>
          <p>Créez votre compte et accédez à votre espace personnalisé selon votre rôle.</p>
          <div class="roles-list">
            <div class="role-item student">Étudiant — Postulez aux offres</div>
            <div class="role-item company">Entreprise — Publiez des offres</div>
            <div class="role-item supervisor">Encadrant — Suivez les stages</div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="form-wrap">
          <h1>Créer un compte</h1>
          <p class="form-sub">Remplissez les informations ci-dessous</p>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="field">
                <label>Prénom</label>
                <input formControlName="firstName" placeholder="Jean" />
              </div>
              <div class="field">
                <label>Nom</label>
                <input formControlName="lastName" placeholder="Dupont" />
              </div>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="vous@exemple.fr" />
            </div>
            <div class="field">
              <label>Mot de passe</label>
              <input type="password" formControlName="password" placeholder="••••••••" />
            </div>
            <div class="field">
              <label>Rôle</label>
              <select formControlName="role" (change)="onRoleChange()">
                <option value="">Sélectionnez votre rôle</option>
                <option value="STUDENT">Étudiant</option>
                <option value="COMPANY">Entreprise</option>
                <option value="SUPERVISOR">Encadrant</option>
              </select>
            </div>

            <div class="field" *ngIf="selectedRole === 'COMPANY'">
              <label>Nom de l'entreprise</label>
              <input formControlName="companyName" placeholder="Acme Corp" />
            </div>
            <div *ngIf="selectedRole === 'STUDENT'" class="row">
              <div class="field">
                <label>N° étudiant</label>
                <input formControlName="studentNumber" placeholder="ET-2024-001" />
              </div>
              <div class="field">
                <label>Filière</label>
                <input formControlName="program" placeholder="Génie Informatique" />
              </div>
            </div>
            <div class="field" *ngIf="selectedRole === 'SUPERVISOR'">
              <label>Département</label>
              <input formControlName="department" placeholder="Informatique" />
            </div>

            <div class="global-err" *ngIf="errorMessage">{{ errorMessage }}</div>
            <button type="submit" class="submit-btn" [disabled]="loading">
              <span *ngIf="!loading">Créer mon compte →</span>
              <span *ngIf="loading">Inscription...</span>
            </button>
          </form>

          <p class="switch-link">Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-shell { display: flex; min-height: 100vh; }
    .auth-panel {
      width: 42%; background: #0f172a; display: flex;
      align-items: center; justify-content: center; padding: 3rem;
    }
    .panel-content { max-width: 340px; }
    .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 3rem; }
    .brand-mark {
      width: 40px; height: 40px; background: #4f46e5; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.2rem; color: white;
    }
    .brand-name { color: white; font-size: 1.3rem; font-weight: 700; }
    .panel-content h2 { color: white; font-size: 1.6rem; font-weight: 700; line-height: 1.3; margin-bottom: 1rem; }
    .panel-content p { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .roles-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .role-item {
      padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 500;
    }
    .role-item.student { background: rgba(16,185,129,0.15); color: #6ee7b7; }
    .role-item.company { background: rgba(245,158,11,0.15); color: #fcd34d; }
    .role-item.supervisor { background: rgba(139,92,246,0.15); color: #c4b5fd; }

    .auth-form-panel {
      flex: 1; display: flex; align-items: center;
      justify-content: center; padding: 2rem; background: #f8fafc; overflow-y: auto;
    }
    .form-wrap { width: 100%; max-width: 420px; padding: 1rem 0; }
    h1 { font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .form-sub { color: #64748b; font-size: 0.9rem; margin: 0 0 1.5rem; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
    input, select {
      width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid #e2e8f0;
      border-radius: 8px; font-size: 0.9rem; outline: none; background: white;
      color: #0f172a; transition: border-color 0.2s; box-sizing: border-box;
    }
    input:focus, select:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    .global-err {
      background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
      border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.85rem; margin-bottom: 1rem;
    }
    .submit-btn {
      width: 100%; padding: 0.85rem; background: #4f46e5; color: white;
      border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600;
      cursor: pointer; transition: background 0.2s; margin-top: 0.3rem;
    }
    .submit-btn:hover:not(:disabled) { background: #3730a3; }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .switch-link { text-align: center; margin-top: 1.2rem; color: #64748b; font-size: 0.88rem; }
    .switch-link a { color: #4f46e5; font-weight: 600; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  selectedRole = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      companyName: [''],
      studentNumber: [''],
      program: [''],
      department: ['']
    });
  }

  onRoleChange(): void {
    this.selectedRole = this.registerForm.get('role')?.value || '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.authService.redirectByRole(),
      error: err => {
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription";
        this.loading = false;
      }
    });
  }
}
