# 🏗️ Benderwire Group — Architektur

> **Version:** 0.1.0
> **Status:** Draft

---

## 1. Modul-Architektur

### Prinzip: Standalone → Core-Ready → Core-Integrated

Jedes Modul durchläuft drei Stufen:

1. **Standalone** — Modul funktioniert eigenständig (eigene Auth, eigene DB, eigenes Hosting)
2. **Core-Ready** — Modul hat definierte Interfaces für Integration (Auth-Adapter, API-Contract, Shared Types)
3. **Core-Integrated** — Modul läuft über B/WIRE Hub (zentrales Auth, zentrale DB, Gateway)

### Aktueller Stand
- B/CONTENT: Stufe 1 (Standalone) mit Vorbereitung auf Stufe 2

---

## 2. Integration Contracts (für Core-Readiness)

### 2.1 Auth Interface
```typescript
// Jedes Modul implementiert dieses Interface
interface AuthProvider {
  getCurrentUser(): Promise<User | null>;
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
}

// Standalone: Eigene Implementierung (z.B. simple session)
// Core-Integrated: B/WIRE liefert die Implementierung
```

### 2.2 API Contract
```typescript
// Jedes Modul definiert seine API-Routen als typed Contract
// Ermöglicht spätere Gateway-Integration
interface ModuleManifest {
  id: string;           // z.B. "b-content"
  version: string;
  apiPrefix: string;    // z.B. "/api/content"
  routes: RouteDefinition[];
  permissions: Permission[];
}
```

### 2.3 User Model
```typescript
// Shared User-Typ über alle Module
interface BenderwireUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  modules: string[];   // Zugriffsrechte auf Module
}
```

---

## 3. Daten-Architektur

### B/CONTENT (Standalone)
```
┌──────────────────────────────────────┐
│          B/CONTENT App               │
│  ┌──────────┐  ┌──────────────────┐  │
│  │ Frontend  │  │ API (Workers)    │  │
│  │ (React)   │→ │ ┌──────────────┐│  │
│  │           │  │ │ Auth Adapter  ││  │
│  │           │  │ │ Template Eng. ││  │
│  │           │  │ │ AI Gateway    ││  │
│  │           │  │ │ Asset Manager ││  │
│  └──────────┘  │ └──────────────┘│  │
│                │       ↓          │  │
│                │  ┌──────────┐    │  │
│                │  │ DB (D1)  │    │  │
│                │  └──────────┘    │  │
│                └──────────────────┘  │
└──────────────────────────────────────┘
```

### Spätere B/WIRE Integration
```
┌──────────────────────────────────────────┐
│              B/WIRE Hub                   │
│  ┌──────────────────────────────────┐    │
│  │         Gateway / Auth            │    │
│  └───────┬──────────┬───────────────┘    │
│          ↓          ↓                     │
│   ┌──────────┐ ┌──────────┐              │
│   │B/CONTENT │ │ B/???    │  ...         │
│   │(Module)  │ │(Module)  │              │
│   └──────────┘ └──────────┘              │
│          ↓          ↓                     │
│   ┌──────────────────────────────────┐   │
│   │          Shared DB                │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## 4. Deployment-Architektur

```
GitHub Repo
    │
    ├── push to feature/* ──→ (nichts, nur PR)
    ├── merge to preview ───→ Cloudflare Preview Deploy
    └── merge to main ──────→ Cloudflare Production Deploy
```

### URLs (geplant)
- **Production:** `content.benderwire.com` (oder subdomain)
- **Preview:** `preview.b-content.pages.dev`
- **Local Dev:** `localhost:5173`
