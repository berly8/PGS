Projet : Plateforme de Gestion des Stages (PGS)
Objectif pédagogique
Permettre aux étudiants de développer une application Full Stack moderne avec :
• Backend : Spring Boot
• Frontend : Angular
• Base de données relationnelle MySQL
• Architecture en couches
• Déploiement cloud (optionnel)
1. Contexte
L’établissement souhaite mettre en place une application web permettant de gérer le processus des
stages des étudiants (recherche, candidature, validation et suivi).
La solution devra être développée avec :
• Backend : Spring Boot
• Frontend : Angular
• Base de données relationnelle (MySQL ou PostgreSQL)
2. Objectifs du projet
• Digitaliser la gestion des stages
• Centraliser les offres d’entreprises
• Simplifier le suivi administratif
• Sécuriser les accès par rôle
• Fournir des statistiques décisionnelles
3. Acteurs du système
Acteur Description
Administrateur Gère les utilisateurs et supervise la plateforme
Étudiant Consulte les offres et postule
Entreprise Publie des offres et consulte les candidatures
Encadrant Valide et suit les stages



# 🎓 PGS – Plateforme de Gestion des Stages

Application Full Stack pour gérer le processus de stages : publication d'offres, candidatures, validation et suivi.

## Stack technique

| Couche       | Technologie                        |
|--------------|------------------------------------|
| Backend      | Spring Boot 3.2 + Spring Security  |
| Frontend     | Angular 17 (Standalone Components) |
| Base de données | MySQL 8.0                       |
| Auth         | JWT (jjwt 0.11.5)                  |
| Container    | Docker + Docker Compose            |

---

## 👥 Acteurs & accès

| Rôle         | Email (démo)         | Mot de passe |
|--------------|----------------------|--------------|
| Administrateur | admin@pgs.com      | admin123     |
| Étudiant     | (s'inscrire)         | —            |
| Entreprise   | (s'inscrire)         | —            |
| Encadrant    | (s'inscrire)         | —            |

---

## 🚀 Démarrage rapide (Docker)

### Prérequis
- Docker & Docker Compose installés

### Lancer toute l'application
```bash
docker-compose up --build
```

- Frontend : http://localhost:4200
- Backend API : http://localhost:8080
- MySQL : localhost:3306

---

## 🛠 Démarrage en développement

### Backend (Spring Boot)
```bash
cd pgs-backend

# Avec une instance MySQL locale (modifier application.properties si besoin)
mvn spring-boot:run
```

### Frontend (Angular)
```bash
cd pgs-frontend
npm install
ng serve
# → http://localhost:4200
```

---

## 📁 Structure du projet

```
pgs/
├── docker-compose.yml
├── mysql/
│   └── init.sql
├── pgs-backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/pgs/
│       ├── config/           # SecurityConfig, DataInitializer
│       ├── controller/       # AuthController, OfferController, ...
│       ├── dto/              # Request/Response DTOs
│       ├── entity/           # User, Student, Company, Supervisor, ...
│       ├── exception/        # GlobalExceptionHandler
│       ├── repository/       # JPA Repositories
│       ├── security/         # JWT Provider & Filter
│       └── service/          # Business logic
└── pgs-frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/app/
        ├── core/
        │   ├── guards/       # AuthGuard
        │   ├── interceptors/ # JwtInterceptor
        │   ├── models/       # TypeScript interfaces
        │   └── services/     # HTTP services
        └── features/
            ├── auth/         # Login, Register
            ├── admin/        # Dashboard, User Management
            ├── student/      # Dashboard, Offers, Applications
            ├── company/      # Dashboard, Offers, Candidatures
            └── supervisor/   # Dashboard, Internships
```

---

## 🔌 API REST principale

| Méthode | Endpoint                          | Rôle requis         |
|---------|-----------------------------------|---------------------|
| POST    | /api/auth/login                   | Public              |
| POST    | /api/auth/register                | Public              |
| GET     | /api/offers                       | Public              |
| POST    | /api/offers                       | COMPANY             |
| POST    | /api/applications/apply/{offerId} | STUDENT             |
| PATCH   | /api/applications/{id}/status     | COMPANY / ADMIN     |
| POST    | /api/internships/create/{appId}   | ADMIN               |
| PUT     | /api/internships/{id}             | SUPERVISOR / ADMIN  |
| GET     | /api/admin/statistics             | ADMIN               |
| GET     | /api/admin/users                  | ADMIN               |

---

## ⚙️ Variables d'environnement

Modifier `pgs-backend/src/main/resources/application.properties` ou passer des variables Docker :

```env
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/pgs_db
SPRING_DATASOURCE_USERNAME=pgs_user
SPRING_DATASOURCE_PASSWORD=pgs_password
APP_JWT_SECRET=your_secret_key
APP_JWT_EXPIRATION=86400000
```
