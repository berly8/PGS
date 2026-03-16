import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <h2>Gérez vos stages en toute simplicité</h2>
          <p>Une plateforme unifiée pour étudiants, entreprises et encadrants.</p>
          <div class="features">
            <div class="feature"><span class="feat-dot"></span>Offres centralisées</div>
            <div class="feature"><span class="feat-dot"></span>Suivi en temps réel</div>
            <div class="feature"><span class="feat-dot"></span>Accès sécurisé par rôle</div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="form-wrap">
          <h1>Connexion</h1>
          <p class="form-sub">Accédez à votre espace</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label>Adresse email</label>
              <input type="email" formControlName="email" placeholder="vous@exemple.fr"
                     [class.invalid]="isInvalid('email')" />
              <span class="err" *ngIf="isInvalid('email')">Email invalide</span>
            </div>
            <div class="field">
              <label>Mot de passe</label>
              <input type="password" formControlName="password" placeholder="••••••••"
                     [class.invalid]="isInvalid('password')" />
              <span class="err" *ngIf="isInvalid('password')">Mot de passe requis</span>
            </div>
            <div class="global-err" *ngIf="errorMessage">{{ errorMessage }}</div>
            <button type="submit" class="submit-btn" [disabled]="loading">
              <span *ngIf="!loading">Se connecter →</span>
              <span *ngIf="loading">Connexion en cours...</span>
            </button>
          </form>

          <p class="switch-link">Pas encore de compte ? <a routerLink="/auth/register">Créer un compte</a></p>

          <div class="demo-hint">
            <span>Démo admin :</span> admin&#64;pgs.com / admin123
          </div>
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
    .panel-content p { color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
    .features { display: flex; flex-direction: column; gap: 0.6rem; }
    .feature { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 0.9rem; }
    .feat-dot { width: 8px; height: 8px; background: #4f46e5; border-radius: 50%; flex-shrink: 0; }
    .auth-form-panel {
      flex: 1; display: flex; align-items: center;
      justify-content: center; padding: 2rem; background: #f8fafc;
    }
    .form-wrap { width: 100%; max-width: 400px; }
    h1 { font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .form-sub { color: #64748b; font-size: 0.9rem; margin: 0 0 2rem; }
    .field { margin-bottom: 1.2rem; }
    label { display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
    input {
      width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0;
      border-radius: 8px; font-size: 0.95rem; outline: none;
      background: white; color: #0f172a; transition: border-color 0.2s;
      box-sizing: border-box;
    }
    input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    input.invalid { border-color: #ef4444; }
    .err { color: #ef4444; font-size: 0.78rem; margin-top: 4px; display: block; }
    .global-err {
      background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
      border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.85rem; margin-bottom: 1rem;
    }
    .submit-btn {
      width: 100%; padding: 0.85rem; background: #4f46e5; color: white;
      border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600;
      cursor: pointer; transition: background 0.2s;
    }
    .submit-btn:hover:not(:disabled) { background: #3730a3; }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .switch-link { text-align: center; margin-top: 1.5rem; color: #64748b; font-size: 0.88rem; }
    .switch-link a { color: #4f46e5; font-weight: 600; }
    .switch-link a:hover { text-decoration: underline; }
    .demo-hint {
      margin-top: 1.5rem; padding: 0.75rem 1rem; background: #f1f5f9;
      border-radius: 8px; font-size: 0.8rem; color: #64748b; text-align: center;
      border: 1px dashed #e2e8f0;
    }
    .demo-hint span { font-weight: 600; color: #0f172a; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  private readonly roleRoutes: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    STUDENT: '/student/dashboard',
    COMPANY: '/company/dashboard',
    SUPERVISOR: '/supervisor/dashboard'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // If already logged in, go to dashboard (only once, no loop)
    if (this.authService.isLoggedIn() && this.authService.role) {
      const route = this.roleRoutes[this.authService.role];
      if (route) {
        this.router.navigateByUrl(route, { replaceUrl: true });
      }
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        const route = this.roleRoutes[res.role] || '/auth/login';
        this.router.navigateByUrl(route, { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'Le serveur met trop de temps à répondre. Vérifiez que le backend est lancé.';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 8080.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (err.status >= 500) {
          this.errorMessage = 'Erreur serveur. Consultez les logs du backend.';
        } else {
          this.errorMessage = err.error?.message || 'Une erreur est survenue.';
        }
        console.error('Login error:', err);
      }
    });
  }
}
