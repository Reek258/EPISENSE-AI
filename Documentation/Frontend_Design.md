# 🎨 EPISENCE — Frontend Design & UI/UX Architecture

## 1. Overview & Design Philosophy

The EPISENCE frontend is built to emulate a **production-grade government epidemiological dashboard**. It eschews generic "hackathon" aesthetics (e.g., neon colors, glassmorphism, heavy gradients) in favor of an **institutional, high-density, and trustworthy interface**. 

The design is engineered for **District Health Officers** and **Municipal Authorities** who need to process dense data rapidly, make high-stakes decisions, and monitor live outbreaks.

### Key Tenets:
- **High Data Density:** Maximize the use of screen real estate for maps, tables, and charts.
- **Clear Information Hierarchy:** Use muted backgrounds (parchment/warm off-white) to let critical data and alerts pop.
- **Institutional Authority:** Subtle tri-band headers, monochrome line-art emblems, and professional typography (`Outfit` for headings, `Inter` for data/UI).
- **Real-Time Responsiveness:** UI must seamlessly update via WebSocket events without full-page reloads (toast notifications, heatmap repaints).

---

## 2. Design System Tokens (Tailwind v4)

The core color palette is defined in the `tailwind.config.ts` to ensure strict adherence to the government theme.

### Color Palette

| Category | Token | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `primary-900` | `#0A2647` | Sidebar, Header background (Prussian Blue) |
| **Brand Primary** | `primary-800` | `#143D65` | Sidebar hover, dropdowns |
| **Action/Identity** | `teal-600` | `#2C7873` | Primary buttons, active nav borders, links |
| **Action/Identity** | `teal-100` | `#E0F2F1` | Selected rows, subtle highlights |
| **Accent** | `gold-600` | `#C4975C` | Badges, warnings, secondary accents |
| **Surface** | `surface-50` | `#F7F5F0` | Main page background (Parchment) |
| **Surface** | `surface-100` | `#EDEAE3` | Borders, dividers, table headers |
| **Surface** | `surface-white` | `#FFFFFF` | Card backgrounds |
| **Text** | `text-900` | `#1A1A2E` | Primary headings and body text |
| **Text** | `text-600` | `#4A5568` | Secondary text, table headers (uppercase) |

### Risk Status Palette

| Status | Text Color | Background (Tint) |
| :--- | :--- | :--- |
| **LOW** | `risk-low` (#2D8B4E) | `risk-low-bg` (#E8F5E9) |
| **MODERATE** | `risk-moderate` (#D4A017) | `risk-moderate-bg` (#FFF8E1) |
| **HIGH** | `risk-high` (#CC5500) | `risk-high-bg` (#FFF3E0) |
| **CRITICAL** | `risk-critical` (#B91C1C) | `risk-critical-bg` (#FDE8E8) |

### Typography

- **Headings & Titles:** `Outfit` (Clean, geometric, authoritative)
- **Data, Tables, UI Elements:** `Inter` (Highly legible at small sizes, excellent tabular numerals)

---

## 3. Global Layout Architecture

All authenticated screens (except full-screen maps/login) share the `PageLayout` component.

```text
┌───────────────────────────────────────────────────────────────┐
│ ▓▓▓ 3px Tri-Band (Saffron | White | Green) ▓▓▓              │
├───────────────────────────────────────────────────────────────┤
│ [Emblem] EPISENCE | Epidemic Intelligence   [🔔 3] [👤 Admin] │
├────────┬──────────────────────────────────────────────────────┤
│        │                                                      │
│ ⊞ Dash │  Header: Page Title & Breadcrumbs                    │
│ 📍 Zone│                                                      │
│ 📝 Rpt │  ┌────────────────────────────────────────────────┐  │
│ 🏥 Hosp│  │                                                │  │
│ 📊 Anal│  │                                                │  │
│ ⚠ Alrt │  │                MAIN CONTENT AREA               │  │
│        │  │                (Scrollable)                    │  │
│        │  │                Background: surface-50          │  │
│        │  └────────────────────────────────────────────────┘  │
├────────┴──────────────────────────────────────────────────────┤
│  EPISENCE v1.0 | National Centre for Disease Control | 2026   │
└───────────────────────────────────────────────────────────────┘
```

### Components of Layout:
1. **Top Indicator Strip:** 3px CSS gradient (orange, white, green) for subtle national branding.
2. **Main Header (bg: primary-900):** Contains the line-art emblem, platform name, notification bell (with unread badge), and user profile dropdown. Text is white.
3. **Sidebar (bg: primary-900):** Vertical navigation. Uses Lucide React icons. Active state is denoted by a background shift to `primary-800` and a `3px solid teal-600` left border.
4. **Content Area (bg: surface-50):** The parchment background reduces eye strain. All cards placed here use white backgrounds with subtle `surface-100` borders.

---

## 4. Screen-by-Screen Breakdown

### 4.1 Login & Registration (`/login`, `/register`)
- **Layout:** Centered card on a `primary-900` background.
- **Branding:** Large monochrome emblem and "Govt of India" style seals.
- **Forms:** Clean floating-label inputs or solid borders. Primary action button in `teal-600`.
- **Feedback:** Inline validation errors in `risk-critical`.

### 4.2 Main Dashboard (`/dashboard`)
*The command center. High density, immediate situational awareness.*

- **Top Row (Stat Cards):**
  - 4 white cards: Total Zones, Active Alerts, Avg Composite Risk, Total Hospital Cases (7d).
  - Include micro-trend indicators (e.g., "↑ 12% vs last week" in green/red).
- **Middle Section (Split Layout):**
  - **Left (65%): Risk Heatmap:** `React-Leaflet` map showing the region. Uses `leaflet.heat` to render risk density. Overlaid with clickable zone markers.
  - **Right (35%): Live Alert Ticker:** A vertically scrolling list of the most recent alerts fed by WebSocket. Alerts have a 4px left-border colored by severity.
- **Bottom Section:**
  - **Disease Trend Chart:** A `Recharts` line chart showing aggregate cases across all zones over the last 14 days, split by disease type.

### 4.3 Zone Detail View (`/zones/:id`)
*Deep dive into a specific locality.*

- **Header:** Zone Name, City, State, and a large "Current Risk Badge" (e.g., `CRITICAL`).
- **Section 1: Risk Breakdown:** A segmented progress bar or radar chart showing how Weather, Water, and Hospital scores contribute to the Composite Score.
- **Section 2: ML Forecast:** A specific `Recharts` area chart showing the Prophet model's 7-day and 14-day projection.
- **Section 3: Recent Activity Tabs:**
  - Tab 1: Hospital Cases (Zebra-striped table)
  - Tab 2: Weather History (Table or small line charts)
  - Tab 3: Active Water Reports (Map view or list)

### 4.4 Community Reporting (`/reports/new`)
*Citizen-facing interface for reporting stagnant water.*

- **Layout:** Mobile-optimized, single column.
- **Location:** "Use Current Location" button triggering browser Geolocation API. Shows a mini-map to let the user drag the pin for accuracy.
- **Severity Picker:** Visual cards for Low (Small puddle), Medium (Open drain), High (Large flooded area).
- **Photo Upload:** Standard file input styled as a drag-and-drop zone.
- **Action:** Submitting triggers a global WebSocket `new_report` event.

### 4.5 Hospital Data Management (`/hospital`)
*Data entry and tabular review for Health Officers.*

- **Top Action Bar:** "Log New Cases" primary button + Date range filters.
- **Main View (Data Table):**
  - Institutional "zebra-striped" table (`#FFFFFF` alternating with `#FAFAF7`).
  - Column headers in uppercase `text-600`, 13px Inter SemiBold.
  - Columns: Date, Zone, Hospital, Disease Type, Case Count, Severity Breakdown.
- **Add Modal:** A clean, constrained modal (`bg-white`) over a backdrop blur for rapid data entry.

### 4.6 Analytics & ML (`/analytics`)
*Insight generation.*

- **Feature Importance:** Bar chart showing which factors (weather vs water vs cases) are driving the current risk models.
- **Correlation Matrix:** A heatmap (grid) showing correlations (e.g., heavy rainfall correlation with dengue cases 14 days later).
- **Retrain Controls (Admin only):** A protected section to trigger XGBoost/Prophet retraining manually.

### 4.7 Alerts Feed (`/alerts`)
*Historical and active alert management.*

- **Filter Bar:** Filter by Status (Active/Resolved), Severity, and Zone.
- **Feed List:** Stacked white cards. Each card contains the timestamp, Zone name, triggering event (e.g., "Composite Risk crossed 75"), and a "Mark Resolved" button for authorized roles.

---

## 5. UI Component Library Specifications

### 5.1 Risk Badges (`<RiskBadge />`)
Pill-shaped indicators used everywhere a risk level is displayed.
- **CSS:** `px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider`
- **Dynamic classes:** Applied based on the risk level (refer to Section 2).

### 5.2 Data Tables (`<GovTable />`)
- **Container:** `border border-surface-100 rounded-lg overflow-hidden bg-white shadow-sm`
- **Header:** `bg-surface-50 text-text-600 text-xs font-semibold uppercase tracking-wider py-3 px-4 text-left border-b border-surface-100`
- **Row Hover:** `hover:bg-teal-100/50 transition-colors`

### 5.3 Notifications & Toasts (`<LiveToast />`)
Fired by the WebSocket manager.
- **Position:** Bottom-right of the screen.
- **Animation:** Slide up and fade in.
- **Styling:** White card, shadow-lg, with a 4px left border matching the event severity (e.g., Red for new Critical alert, Blue for new report).

### 5.4 Form Inputs (`<GovInput />`)
- **Styling:** `border border-surface-100 bg-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-text-900 placeholder-text-400`

---

## 6. State Management (Zustand)

The frontend relies on 3 specific Zustand slices to avoid prop-drilling and manage real-time updates.

1. **`useAuthStore`**
   - Holds: `user` (profile dict), `token` (JWT), `isAuthenticated`.
   - Actions: `login()`, `logout()`, `hydrate()`.
2. **`useDashboardStore`**
   - Holds: `zones` (array), `activeAlerts` (array), `summaryStats` (object).
   - Actions: `fetchZones()`, `addAlert(alert)`, `updateZoneRisk(zoneId, newRisk)`.
3. **`useWSStore`**
   - Holds: `isConnected` (boolean), `lastMessage` (object).
   - Actions: `connect()`, `disconnect()`, `dispatchAction()`.

---

## 7. PWA Behavior (Progressive Web App)

- **Manifest:** Configured to feel native. Sets `display: standalone` to hide browser chrome.
- **Theme Color:** `#0A2647` (matches the Header/Sidebar).
- **Service Worker Strategy:** 
  - Static assets (JS, CSS, images, Leaflet tiles): **Cache-First**.
  - API GET requests (`/api/v1/zones`, `/api/v1/dashboard/summary`): **Network-First** with cache fallback.
  - Offline State: If the network drops, a global banner appears: *"Offline Mode: Showing cached data from [Time]"*.

---

## 8. Development Implementation Steps (Sprints 2 & 3)

1. **Setup:** Initialize Vite + React + TS. Install Tailwind v4, React Router DOM, Zustand, Axios, Lucide React.
2. **Config:** Setup `tailwind.config.ts` with the exact Govt Palette tokens. Add `Outfit` and `Inter` to `index.html` via Google Fonts.
3. **Shell:** Build `PageLayout`, `Header`, and `Sidebar`. Ensure routing works between empty pages.
4. **Auth Flow:** Build `Login` and `ProtectedRoute` wrapper. Tie to Zustand `useAuthStore`.
5. **Dashboard Frame:** Implement the grid layout for the Dashboard. Add empty `StatCards` and the map container.
6. **Map Integration:** Integrate `react-leaflet`. Plot dummy zones. Add `leaflet.heat` layer.
7. **WebSocket:** Build the `useWebSocket` hook to connect to the backend and listen to `new_report` events to trigger map repaints.
