# 🦟 EPISENCE — Predictive Epidemiological Intelligence System

## Product Requirements Document (PRD) v3.0 — 24-Hour Hackathon, Full Feature

---

## 1. Problem Statement

Vector-borne diseases (Dengue, Malaria, Chikungunya, Zika) kill **700,000+ people annually**. Health systems are **reactive, not predictive**. EPISENCE unifies weather, stagnant water reports, and hospital data into a **single predictive dashboard** to forecast outbreak hotspots before they peak.

---

## 2. Target Users & Roles

| Persona | Role (Auth) | Access Level |
|---------|-------------|-------------|
| 🏥 **District Health Officer** | `health_officer` | Full dashboard, risk scores, alerts, analytics |
| 🏛️ **Municipal Authority** | `admin` | All above + zone management, bulk data upload |
| 👤 **Citizen** | `citizen` | Report water, view local risk, receive alerts |
| 👁️ **Guest** | unauthenticated | View public dashboard (read-only heatmap) |

---

## 3. Full Feature Set (24-Hour Build)

> [!IMPORTANT]
> **Zero compromises.** All 9 features ship in 24 hours. Sprints are 3 hours each.

| # | Feature | Sprint | Hours |
|---|---------|--------|-------|
| F1 | **Backend + DB + Auth + Seed Data** | 1 | 0–3 |
| F2 | **Frontend Shell + Govt Theme + Auth UI** | 2 | 3–6 |
| F3 | **Interactive Risk Heatmap** (React-Leaflet) | 3 | 6–9 |
| F4 | **Dashboard Stats + Weather + Alerts** | 4 | 9–12 |
| F5 | **Community Water Reporting + WebSocket Live Updates** | 5 | 12–15 |
| F6 | **Hospital Data + Trend Charts** | 6 | 15–18 |
| F7 | **Risk Score Engine + ML Prediction Model** | 7 | 18–21 |
| F8 | **PWA + Polish + Demo Prep** | 8 | 21–24 |

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Maps** | React-Leaflet + Leaflet.heat + OpenStreetMap |
| **Charts** | Recharts |
| **State/Auth** | Zustand (global state) + JWT tokens |
| **Real-time** | Native WebSocket (browser) ↔ FastAPI WebSocket |
| **PWA** | vite-plugin-pwa (Workbox under the hood) |
| **Backend** | Python + FastAPI |
| **Auth** | FastAPI + python-jose (JWT) + passlib (bcrypt) |
| **WebSocket** | FastAPI WebSocket endpoints |
| **Database** | Local JSON files (`backend/data/*.json`) |
| **ML** | scikit-learn + XGBoost (risk classification) + Prophet (time-series forecast) |
| **Weather API** | OpenWeatherMap (free tier) |

---

## 5. Government Platform Design Language

> [!IMPORTANT]
> This is NOT the typical "navy + saffron tricolor" every hackathon uses. This palette is modeled after **real operational health dashboards** — IDSP (Integrated Disease Surveillance Programme), NCDC, CDC, and UK NHS Digital. It should feel like a **deployed government system**, not a student project.

### 5.1 Color Palette — "Institutional Health Authority"

**Primary Surface Layer**
| Token | Hex | Usage | Reference |
|-------|-----|-------|-----------|
| `--primary-900` | `#0A2647` | Sidebar bg, header bg | Prussian Blue — darker & richer than generic navy |
| `--primary-800` | `#143D65` | Sidebar hover, dropdown bg | Slightly lifted for depth |
| `--primary-700` | `#1E5284` | Active nav items, section headers | Readable contrast on dark |

**Health Identity Layer** *(What makes this feel like a health platform)*
| Token | Hex | Usage | Reference |
|-------|-----|-------|-----------|
| `--teal-600` | `#2C7873` | Primary buttons, links, active states | Steel Teal — medical/health association |
| `--teal-500` | `#3A9B94` | Button hover, progress bars | Lifted teal for interaction |
| `--teal-100` | `#E0F2F1` | Teal tint backgrounds, selected rows | Subtle highlight |

**Accent Layer** *(Institutional, NOT flashy)*
| Token | Hex | Usage | Reference |
|-------|-----|-------|-----------|
| `--gold-600` | `#C4975C` | Badges, warning accents, important labels | Burnished Gold — like brass nameplates in govt offices |
| `--gold-500` | `#D4A86A` | Hover states on gold elements | Warm but muted |
| `--gold-100` | `#FDF6EC` | Gold tint backgrounds | Subtle warmth |

**Surface & Content Layer**
| Token | Hex | Usage | Reference |
|-------|-----|-------|-----------|
| `--surface-50` | `#F7F5F0` | Page background | Parchment — warm off-white, feels like govt stationery |
| `--surface-100` | `#EDEAE3` | Card borders, dividers | Warm gray |
| `--surface-white` | `#FFFFFF` | Card backgrounds, modals | Clean white cards on parchment |
| `--text-900` | `#1A1A2E` | Primary text | Near-black with slight warmth |
| `--text-600` | `#4A5568` | Secondary text, labels | Readable gray |
| `--text-400` | `#94A3B8` | Placeholder text, disabled | Muted |

**Risk Status Colors** *(Desaturated — institutional, not neon)*
| Token | Hex | Usage | Visual |
|-------|-----|-------|--------|
| `--risk-low` | `#2D8B4E` | Low risk zones, success | Forest Green — not lime |
| `--risk-low-bg` | `#E8F5E9` | Low risk badge background | Muted green tint |
| `--risk-moderate` | `#D4A017` | Moderate risk zones | Dark Gold — not bright yellow |
| `--risk-moderate-bg` | `#FFF8E1` | Moderate badge background | Warm cream |
| `--risk-high` | `#CC5500` | High risk zones | Burnt Orange — not neon orange |
| `--risk-high-bg` | `#FFF3E0` | High badge background | Peach tint |
| `--risk-critical` | `#B91C1C` | Critical zones, outbreak | Deep Red — not bright red |
| `--risk-critical-bg` | `#FDE8E8` | Critical badge background | Rose tint |

### 5.2 Header Design — Tri-Band Strip
```
┌─────────────────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← 3px tri-band (saffron|white|green)
├─────────────────────────────────────────────────────────────┤
│  [Emblem]  EPISENCE                                   [👤] │ ← Prussian Blue bg (#0A2647)
│            Epidemic Intelligence & Surveillance Engine       │
│            National Centre for Disease Control               │ ← Subtitle in --text-400
└─────────────────────────────────────────────────────────────┘
```
- Tri-band is **3px tall**, subtle — same technique as india.gov.in
- Emblem is a **monochrome line-art** Ashoka Chakra (not full color)
- Title uses `Outfit` semibold, subtitle in `Inter` regular

### 5.3 Typography
| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Page titles | Outfit | 600 (SemiBold) | 24px | `--text-900` |
| Section headers | Outfit | 500 (Medium) | 18px | `--text-900` |
| Body text | Inter | 400 (Regular) | 14px | `--text-900` |
| Labels / captions | Inter | 500 (Medium) | 12px | `--text-600` |
| Data values (stats) | Inter | 700 (Bold) | 32px | `--primary-900` |
| Table headers | Inter | 600 (SemiBold) | 13px | `--text-600` uppercase |

### 5.4 Component Design Rules

**Cards**
- White background on parchment page (`#FFFFFF` on `#F7F5F0`)
- `1px solid #EDEAE3` border (warm gray, not cold)
- `border-radius: 8px` — rounded but not bubbly
- `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` — barely there shadow
- NO gradient backgrounds, NO glassmorphism

**Data Tables**
- Header row: `--surface-50` bg with `--text-600` uppercase text
- Zebra rows: alternating `#FFFFFF` and `#FAFAF7`
- Row hover: `--teal-100` (`#E0F2F1`)
- Cell padding: 12px 16px
- Borders: `1px solid #EDEAE3`

**Buttons**
- Primary: `--teal-600` bg, white text, hover `--teal-500`
- Secondary: `--surface-white` bg, `--teal-600` text, `1px solid --teal-600`
- Danger: `--risk-critical` bg, white text
- Border-radius: 6px
- Font: Inter Medium 14px

**Sidebar Navigation**
- Background: `--primary-900` (#0A2647)
- Items: Lucide icon (20px) + label (Inter 14px) in `rgba(255,255,255,0.65)`
- Hover: bg `--primary-800`, text `#FFFFFF`
- Active: `3px left border in --teal-500` + bg `--primary-800` + text `#FFFFFF`
- NOT saffron border — teal is our identity color

**Risk Badges**
- Pill shape (rounded-full), font: Inter SemiBold 11px uppercase
- Background: use the `-bg` variant, text: use the main color
- Example: `<span class="bg-risk-low-bg text-risk-low">LOW</span>`

**Alerts/Notifications**
- Left border accent (4px) matching severity color
- Icon (Lucide) + message on white card
- Critical alerts: subtle `--risk-critical-bg` background

### 5.5 Design DO's and DON'Ts

| ✅ DO | ❌ DON'T |
|-------|---------|
| Use warm neutrals (parchment, cream) | Use cold grays (#F3F4F6 etc.) |
| Desaturated, institutional risk colors | Bright neon status colors |
| Monochrome emblem / line-art | Full-color flashy logos |
| 3px tri-band (subtle) | Giant tricolor banners |
| Teal as identity/action color | Random blue (#3B82F6) buttons |
| Data-dense layouts with tables | Big empty hero sections |
| Uppercase small labels (12px) | Large decorative text |
| Subtle 1px borders | Heavy drop shadows |
| Zebra-striped data tables | Fancy animated cards |
| Professional iconography (Lucide) | Emoji or cartoon icons |

### 5.6 Layout Reference
```
┌───────────────────────────────────────────────────────────────┐
│ ▓▓▓ TRI-BAND (3px: saffron | white | green) ▓▓▓             │
├───────────────────────────────────────────────────────────────┤
│  [◎] EPISENCE | Epidemic Intelligence    [🔔 3] [👤 Dr.Roy] │  ← #0A2647 bg
├────────┬──────────────────────────────────────────────────────┤
│        │  ▸ Summary Cards (white on parchment)               │
│ SIDE   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ BAR    │  │ 15   │ │ 4    │ │ 62.3 │ │ 847  │              │
│        │  │Zones │ │Alert │ │ Risk │ │Cases │              │
│ #0A2647│  └──────┘ └──────┘ └──────┘ └──────┘              │
│        │                                                     │
│ ● Map  │  ┌─────────────────────────────────────────────┐   │
│ ● Data │  │                                             │   │
│ ● Rpt  │  │         LEAFLET HEATMAP (60vh)              │   │
│ ● Trnd │  │         on #F7F5F0 page bg                  │   │
│ ● Alrt │  │                                             │   │
│        │  └─────────────────────────────────────────────┘   │
│ ────── │                                                     │
│ © NCDC │  ┌──────────────────┐ ┌────────────────────────┐   │
│        │  │ ⚠ Active Alerts  │ │ 📈 Disease Trend       │   │
│        │  │ (teal left-border)│ │ (Recharts, teal line)  │   │
│        │  └──────────────────┘ └────────────────────────┘   │
├────────┴──────────────────────────────────────────────────────┤
│  EPISENCE v1.0 | National Centre for Disease Control | 2026  │ ← #0A2647 bg
└───────────────────────────────────────────────────────────────┘
```

---

## 6. Data Model (7 Entities)

### 6.1 `users` *(NEW)*
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique, login identifier |
| hashed_password | String | bcrypt hashed |
| full_name | String | Display name |
| role | Enum | `admin` / `health_officer` / `citizen` |
| is_active | Boolean | Account active? |
| created_at | DateTime | Registration time |

### 6.2 `zones`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Zone/locality name |
| latitude | Float | Center latitude |
| longitude | Float | Center longitude |
| radius_km | Float | Zone radius |
| city | String | Parent city |
| state | String | Parent state |

### 6.3 `weather_data`
| Field | Type |
|-------|------|
| id, zone_id (FK), date, temperature_avg, humidity_avg, rainfall_mm, wind_speed, fetched_at |

### 6.4 `water_reports`
| Field | Type |
|-------|------|
| id, zone_id (FK), user_id (FK), latitude, longitude, description, photo_url, severity (enum), status (enum), reported_at, reporter_name |

### 6.5 `hospital_cases`
| Field | Type |
|-------|------|
| id, zone_id (FK), date, disease_type (enum), case_count, hospital_name, severity_breakdown (JSON) |

### 6.6 `risk_scores`
| Field | Type |
|-------|------|
| id, zone_id (FK), date, weather_score, water_score, hospital_score, composite_score, risk_level (enum), factors (JSON), ml_prediction (JSON) *(NEW — stores ML forecast)* |

### 6.7 `alerts`
| Field | Type |
|-------|------|
| id, zone_id (FK), risk_score_id (FK), alert_type (enum), message, is_active, created_at, resolved_at |

---

## 7. Authentication System

### Flow
```
Register → POST /api/v1/auth/register → returns JWT
Login    → POST /api/v1/auth/login    → returns JWT (access + refresh)
Protected routes → Authorization: Bearer <token>
```

### Auth Rules
| Endpoint Pattern | citizen | health_officer | admin | guest |
|-----------------|---------|---------------|-------|-------|
| `GET /dashboard/*` | ✅ | ✅ | ✅ | ✅ (read-only) |
| `POST /reports` | ✅ | ✅ | ✅ | ❌ |
| `GET /risk/*` | ❌ | ✅ | ✅ | ❌ |
| `POST /risk/compute` | ❌ | ✅ | ✅ | ❌ |
| `POST /hospital/cases` | ❌ | ✅ | ✅ | ❌ |
| `POST /zones` | ❌ | ❌ | ✅ | ❌ |

### Frontend Auth
- Zustand store for auth state (`user`, `token`, `isAuthenticated`)
- Protected route wrapper component
- Login/Register pages with form validation
- JWT stored in localStorage, attached via Axios interceptor

---

## 8. Real-Time WebSocket System

### WebSocket Endpoint
```
ws://localhost:8000/api/v1/ws/{client_id}
```

### Event Types Broadcast

| Event | Trigger | Payload |
|-------|---------|---------|
| `new_report` | Citizen submits water report | `{type, report_id, zone_id, severity, lat, lng}` |
| `alert_created` | Risk score crosses threshold | `{type, alert_id, zone_id, risk_level, message}` |
| `risk_updated` | Risk recomputation completes | `{type, zone_id, new_score, risk_level}` |
| `alert_resolved` | Alert marked resolved | `{type, alert_id, zone_id}` |

### Implementation
- **Backend:** FastAPI `WebSocket` endpoint with connection manager (broadcast to all clients)
- **Frontend:** Custom `useWebSocket` hook with auto-reconnect, dispatches events to Zustand store
- **UI updates:** Heatmap re-renders, alert ticker updates, toast notifications — all without page refresh

---

## 9. ML Prediction Model

### 9.1 Classification Model — Current Risk (XGBoost)
```
Input features (per zone, per day):
  - temperature_avg, humidity_avg, rainfall_mm, wind_speed    (weather)
  - active_water_reports_14d, avg_severity                    (water)
  - case_count_7d, case_trend_slope, disease_diversity        (hospital)

Output: risk_level ∈ {low, moderate, high, critical}
```
- Trained on synthetic 90-day data across 15 zones
- Replaces pure rule-based scoring as primary classifier
- Rule-based engine serves as fallback + explainability layer

### 9.2 Forecasting Model — Future Risk (Prophet)
```
Input: daily composite_score time series per zone (90 days)
Output: predicted composite_score for next 7–14 days

Stored in risk_scores.ml_prediction as:
  {"forecast_7d": 72.4, "forecast_14d": 65.1, "confidence": 0.82}
```

### 9.3 ML Pipeline
```
seed data → feature engineering → train XGBoost classifier
                                → train Prophet per-zone forecasters
                                → serialize models to /ml/trained_models/
                                → load at API startup
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/predictions/{zone_id}` | 7/14-day forecast for zone |
| POST | `/api/v1/ml/retrain` | Trigger model retraining (admin only) |

---

## 10. PWA Configuration

### What PWA Gives Us
- ✅ **Installable** on mobile home screen (Add to Home Screen prompt)
- ✅ **Offline cached** — dashboard shell loads without network
- ✅ **Push-ready** — service worker registered for future push notifications
- ✅ **App-like** — fullscreen, splash screen, themed status bar

### Implementation
- `vite-plugin-pwa` in `vite.config.ts`
- `manifest.json` with govt branding (name, colors, icons)
- Service Worker: cache-first for static assets, network-first for API calls
- Offline fallback page when API is unreachable

### Manifest Snippet
```json
{
  "name": "EPISENCE — National Disease Surveillance",
  "short_name": "EPISENCE",
  "theme_color": "#1B2A4A",
  "background_color": "#1B2A4A",
  "display": "standalone",
  "scope": "/",
  "start_url": "/"
}
```

---

## 11. API Endpoints (Complete)

### Auth
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| GET | `/api/v1/auth/me` | Bearer |

### Dashboard
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/dashboard/summary` | Public |
| GET | `/api/v1/dashboard/heatmap` | Public |

### Zones
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/zones` | Public |
| GET | `/api/v1/zones/{id}` | Public |
| POST | `/api/v1/zones` | Admin |

### Weather
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/weather/{zone_id}` | Authenticated |
| POST | `/api/v1/weather/fetch` | Officer+ |

### Reports
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/reports` | Authenticated |
| POST | `/api/v1/reports` | Citizen+ |
| PATCH | `/api/v1/reports/{id}` | Officer+ |

### Hospital
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/hospital/cases` | Officer+ |
| POST | `/api/v1/hospital/cases` | Officer+ |
| GET | `/api/v1/hospital/trends/{zone_id}` | Officer+ |

### Risk & Alerts
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/risk/{zone_id}` | Officer+ |
| POST | `/api/v1/risk/compute` | Officer+ |
| GET | `/api/v1/alerts` | Authenticated |
| GET | `/api/v1/alerts/history` | Officer+ |

### Analytics & ML
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/analytics/correlation` | Officer+ |
| GET | `/api/v1/analytics/predictions/{zone_id}` | Officer+ |
| POST | `/api/v1/ml/retrain` | Admin |

### WebSocket
| Endpoint | Auth |
|----------|------|
| `ws:///api/v1/ws/{client_id}` | Token as query param |

---

## 12. Frontend Component Tree

```
src/
├── pages/
│   ├── DashboardPage.tsx        # Heatmap + stats + alerts + trends
│   ├── ZoneDetailPage.tsx       # Risk breakdown + weather + cases + forecast
│   ├── ReportPage.tsx           # GPS form + severity picker
│   ├── AnalyticsPage.tsx        # Correlation + ML prediction charts
│   ├── HospitalPage.tsx         # Case data table + trend charts
│   ├── AlertsPage.tsx           # Alert feed + filters
│   ├── LoginPage.tsx            # Login form
│   └── RegisterPage.tsx         # Registration form
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Govt header + user menu + notifications bell
│   │   ├── Sidebar.tsx          # Nav with Lucide icons + role-based items
│   │   ├── Footer.tsx           # Govt footer
│   │   └── PageLayout.tsx       # Sidebar + content + WebSocket provider
│   ├── auth/
│   │   ├── ProtectedRoute.tsx   # Redirect if unauthenticated
│   │   ├── RoleGate.tsx         # Hide components by role
│   │   └── AuthProvider.tsx     # Zustand auth context
│   ├── dashboard/
│   │   ├── StatCard.tsx         # Icon + number + label + trend arrow
│   │   ├── RiskHeatmap.tsx      # React-Leaflet + leaflet.heat
│   │   ├── AlertTicker.tsx      # Live scrolling alerts (WebSocket-fed)
│   │   ├── TrendChart.tsx       # Recharts line chart
│   │   └── PredictionChart.tsx  # ML forecast visualization
│   ├── common/
│   │   ├── RiskBadge.tsx        # Color-coded risk pill
│   │   ├── DataTable.tsx        # Govt-style zebra table
│   │   ├── LoadingSpinner.tsx   # Skeleton loader
│   │   ├── EmptyState.tsx       # No-data placeholder
│   │   └── Toast.tsx            # WebSocket notification toasts
│   └── reports/
│       ├── ReportForm.tsx       # Water report submission form
│       └── ReportMarkers.tsx    # Map markers for reports
├── hooks/
│   ├── useWebSocket.ts          # WS connection + auto-reconnect + event dispatch
│   ├── useAuth.ts               # Login/register/logout actions
│   ├── useZones.ts              # Zone data fetching
│   └── useRiskScores.ts         # Risk score fetching
├── store/
│   └── index.ts                 # Zustand stores (auth, dashboard, websocket)
├── api/
│   └── client.ts                # Axios instance + JWT interceptor
└── types/
    └── index.ts                 # All TypeScript interfaces
```

---

## 13. Folder Structure (Full Project)

```
EPISENCE/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app + CORS + WebSocket + startup events
│   │   ├── config.py            # Env vars, secrets
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── zone.py
│   │   │   ├── weather.py
│   │   │   ├── water_report.py
│   │   │   ├── hospital_case.py
│   │   │   ├── risk_score.py
│   │   │   └── alert.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── zone.py
│   │   │   ├── weather.py
│   │   │   ├── water_report.py
│   │   │   ├── hospital_case.py
│   │   │   ├── risk_score.py
│   │   │   └── alert.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── zones.py
│   │   │   ├── weather.py
│   │   │   ├── reports.py
│   │   │   ├── hospital.py
│   │   │   ├── risk.py
│   │   │   ├── alerts.py
│   │   │   ├── analytics.py
│   │   │   └── websocket.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── weather_service.py
│   │   │   ├── risk_engine.py
│   │   │   ├── alert_service.py
│   │   │   ├── analytics_service.py
│   │   │   └── ws_manager.py     # WebSocket connection manager
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── feature_engineering.py
│   │   │   ├── train_classifier.py    # XGBoost training
│   │   │   ├── train_forecaster.py    # Prophet training
│   │   │   ├── predictor.py           # Inference pipeline
│   │   │   └── trained_models/        # Serialized .joblib / .json
│   │   └── seed/
│   │       ├── __init__.py
│   │       ├── seed_all.py            # Master seed runner
│   │       ├── seed_users.py
│   │       ├── seed_zones.py
│   │       ├── seed_weather.py
│   │       ├── seed_hospital.py
│   │       └── seed_reports.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── public/
│   │   ├── emblem.svg
│   │   ├── favicon.ico
│   │   └── icons/               # PWA icons (192x192, 512x512)
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── sw.ts                # Service worker (via vite-plugin-pwa)
│       ├── api/
│       ├── types/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── store/
├── data/
│   └── zones.json
├── PRD.md
├── README.md
└── .gitignore
```

---

## 14. Risk Score Engine + ML Integration

### Rule-Based Engine (Fallback + Explainability)
```
composite_score = 0.30 × weather + 0.25 × water + 0.45 × hospital
Thresholds: LOW (0–25) | MODERATE (26–50) | HIGH (51–75) | CRITICAL (76–100)
```

### ML-Enhanced Flow
```
1. Feature engineering → extract 9 features per zone per day
2. XGBoost classifier → predicts risk_level (replaces threshold-based)
3. Prophet forecaster → predicts composite_score 7 & 14 days ahead
4. Results stored in risk_scores.ml_prediction JSON field
5. Rule-based engine always runs as fallback + provides "factors" explanation
```

---

## 15. 24-Hour Sprint Plan

### Sprint 1 (Hours 0–3): Backend + DB + Auth + Seed
- [ ] FastAPI scaffolding, JSON database setup
- [ ] JWT auth system (register, login, me, role guards)
- [ ] Seed: 15 zones, 3 demo users (admin, officer, citizen), 90-day data
- [ ] Core endpoints: `/auth/*`, `/zones`, `/dashboard/summary`
- **✅ Checkpoint:** Login → get JWT → access protected endpoints

### Sprint 2 (Hours 3–6): Frontend Shell + Auth UI
- [ ] Vite + React + TS + Tailwind + Lucide scaffolding
- [ ] Govt-themed layout: Header, Sidebar, Footer
- [ ] Login & Register pages with validation
- [ ] Zustand auth store + Axios JWT interceptor + ProtectedRoute
- **✅ Checkpoint:** Register → Login → see Dashboard shell

### Sprint 3 (Hours 6–9): Heatmap + WebSocket Foundation
- [ ] React-Leaflet heatmap with zone markers (color by risk)
- [ ] FastAPI WebSocket endpoint + connection manager
- [ ] Frontend `useWebSocket` hook with auto-reconnect
- [ ] Zone click → popup with risk summary
- **✅ Checkpoint:** Interactive India map + WebSocket connected

### Sprint 4 (Hours 9–12): Dashboard Stats + Weather + Alerts
- [ ] StatCard components (Zones, Alerts, Risk, Cases)
- [ ] Weather data display per zone
- [ ] Alert ticker fed by WebSocket events
- [ ] Toast notifications for live events
- **✅ Checkpoint:** Full command-center dashboard

### Sprint 5 (Hours 12–15): Community Reporting + Live Updates
- [ ] Report form with GPS auto-detect + Leaflet marker placement
- [ ] POST /reports → broadcast `new_report` via WebSocket
- [ ] Report markers appear on map in real-time (no refresh)
- [ ] Severity picker (Low/Medium/High) with color coding
- **✅ Checkpoint:** Submit report → all clients see it instantly

### Sprint 6 (Hours 15–18): Hospital Data + Trend Charts
- [ ] Hospital case endpoints + seed data
- [ ] Recharts trend charts (cases over time, by disease type)
- [ ] Zone detail page: risk breakdown + weather + cases + reports
- [ ] Hospital data table (govt-style zebra)
- **✅ Checkpoint:** Rich zone detail page with charts

### Sprint 7 (Hours 18–21): Risk Engine + ML Models
- [ ] Rule-based risk scoring engine
- [ ] XGBoost classifier training on seed data
- [ ] Prophet forecaster per-zone training
- [ ] `/risk/compute` triggers scoring → broadcasts `risk_updated` via WS
- [ ] Prediction chart on analytics page
- **✅ Checkpoint:** ML-powered predictions visible on dashboard

### Sprint 8 (Hours 21–24): PWA + Polish + Demo
- [ ] vite-plugin-pwa setup (manifest, service worker, icons)
- [ ] Offline fallback page
- [ ] Loading skeletons, error boundaries, empty states
- [ ] Responsive design pass
- [ ] Pulsing animation for critical zones
- [ ] README + demo script
- **✅ Checkpoint:** Installable PWA, production-ready, judge-ready 🏆

---

## 16. Success Criteria

| What Judges See | How We Deliver |
|----------------|---------------|
| **Wow factor** | Govt-themed dashboard, live heatmap, real-time WebSocket updates |
| **Technical depth** | JWT auth, XGBoost + Prophet ML, WebSocket, PWA, 7-entity DB |
| **Innovation** | Predictive risk scoring fusing 3 data sources + ML forecasting |
| **Working demo** | Seed data makes it feel live; every click produces real results |
| **Completeness** | Auth, CRUD, real-time, ML, offline-capable — full production features |

---

> [!NOTE]
> **Ready to build.** Approve this PRD and we start Sprint 1.

*Version: 3.0 — Full Feature, 24-Hour Edition*
*Updated: May 8, 2026*
