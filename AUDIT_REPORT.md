# AquaNova: Deep Audit & Production-Readiness Plan

This audit identifies critical issues, functional overlaps, and security vulnerabilities that must be addressed before the project is considered "Production-Ready."

## 🚨 Critical Security Vulnerabilities

> [!CAUTION]
> **Unauthenticated Alert Routes**: The `/api/alerts` endpoint (both POST and GET) currently lacks authentication middleware. This allows anyone to spoof distress signals or track the location of active vessels.
> 
> **Secret Leakage**: Sensitive credentials (Supabase Keys, Email Passwords) are currently stored in `.env` files. Ensure these are never committed to version control and are managed via secure environment variables in your deployment platform (e.g., Vercel, Netlify, Render).

## 🧩 Architectural Findings

### 1. Functional Overlaps (Redundancies)
The project contains several disparate implementations of the same core features:

| Feature Category | Components | Recommendation |
| :--- | :--- | :--- |
| **Tactical Dashboard** | `Dashboard`, `SentinelHUD`, `NeptuneCore` | Consolidate into a single "Command Center" with toggleable visual modes. |
| **Emergency/SOS** | `AlertButton`, `SOSButton`, `OfflineSOS` | Unified into a single `SOSService` that supports both Voice and Manual triggers. |
| **Map Interfaces** | `GlobalView`, `Prediction`, `RouteOptimization` | Use a shared Map component instance with different data overlays. |

### 2. Functional Completeness
*   **Prediction Engine**: ✅ Fully functional using Haversine math and offline caching.
*   **Routing**: ✅ Solid logic, but relies on a static price object in `RouteOptimization.jsx` rather than the `MarketPrices.jsx` component.
*   **i18n**: ⚠️ Many "Premium" UI strings (e.g., "Tactical Command Protocol") in `SentinelHUD` and `NeptuneCore` are hardcoded in English.

## 🛠️ Proposed Rectification Steps

### Phase 1: Security & Environment [CRITICAL]
- [ ] **Protect Alert Routes**: Add `protect` middleware to `server/routes/alert.js`.
- [ ] **Centralize API URL**: Replace all hardcoded `http://localhost:5000` instances with `import.meta.env.VITE_API_URL`.
- [ ] **Environment Setup**: Create `template.env` to guide secure setup without leaking secrets.

### Phase 2: Feature Consolidation
- [ ] **Unified HUD**: Create a toggle in `App.jsx` or specialized navigation to choose between "Standard", "Sentinel", and "Neptune" UI views while sharing the same underlying data state.
- [ ] **SOS Integration**: Link `SOSButton.jsx` (voice) to the `server/routes/alert.js` backend so triggers actually record in the database.

### Phase 3: Deployment Readiness
- [ ] **i18n Completion**: Move remaining hardcoded strings in `NeptuneCore` and `Sentinel` to `locales`.
- [ ] **Build Optimization**: Address large chunks (>500kB) identified in Vite build logs using dynamic imports.

## 🚀 Verification Plan
- **Security Check**: Attempt to POST to `/api/alerts` without a JWT token (should fail).
- **Environment Check**: Run a production build and verify all API calls point to the production server.
- **Conflict Check**: Verify only one primary Dashboard route is used as the default entry point.
