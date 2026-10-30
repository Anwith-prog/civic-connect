# 🏛️ CivicConnect - Smart Community Complaint Management System

**CivicConnect** is a full-stack, responsive web application engineered to transform urban grievance redressal. It empowers citizens to report public infrastructure issues (damaged roads, garbage, broken streetlights, water leakage, drainage) while providing city administrators and field staff with real-time GIS complaint management, automated SLA tracking, community voting, and volunteer reward incentives.

---

## 🌟 Key Features

### 👤 1. Multi-Role User Workflows
- **Citizen Portal**: Report issues with GPS pin-drop, upvote existing complaints ("I also face this issue"), track progress via real-time timeline stages, rate resolutions, and earn Civic Points & Badges.
- **Field Staff / Worker Portal**: Geo-fenced task assignment, status transition updates, and mandatory before/after photo verification uploads.
- **Volunteer Connect**: Join neighborhood sanitation and green drives, claim volunteer certificates, and rank on ward leaderboards.
- **Guest Explorer**: Browse the public GIS Smart City Map and municipal SLA performance metrics without authentication.

### 🛡️ 2. Security & Compliance
- **Helmet.js Integration**: HTTP security headers (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
- **Express Rate Limiting**: Anti-brute-force protection on authentication (`/api/auth/*`) and general REST endpoints (`/api/*`).
- **Input Sanitization**: Recursive XSS sanitization across all request bodies, parameters, and search queries.
- **Role-Based Access Control (RBAC)**: Enforced session tokens with device fingerprinting and session management.

### ♿ 3. Accessibility (WCAG 2.1 AA Compliant)
- **Keyboard Navigation**: Full keyboard tab order with visible focus indicators.
- **Screen Reader Support**: Skip-to-content links, ARIA landmarks (`<nav>`, `<main>`, `<header role="banner">`), `aria-expanded`, and `aria-label` attributes on interactive elements.
- **Multi-Language Support**: Complete translations for English (`en`), Kannada (`kn`), and Hindi (`hi`).
- **High Contrast & Font Scaling**: Light/Dark mode toggles and an accessibility large-text mode.

### 🧪 4. Test Suite & Quality Assurance
- **Vitest & React Testing Library**: Comprehensive unit and integration test coverage across React components, helper utility functions, custom hooks, and Express backend REST API logic.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Leaflet Maps, Canvas Confetti
- **Backend**: Express.js, Node.js, tsx
- **Security & Caching**: Helmet, Express Rate Limit, CORS, ETag Caching
- **Testing**: Vitest, React Testing Library, JSDOM

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Anwith-prog/civic-connect.git
   cd civic-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server (Runs React + Express API on port 3000):
   ```bash
   npm run dev
   ```

4. Run test suite:
   ```bash
   npm test
   ```

5. Verify TypeScript type checking:
   ```bash
   npm run lint
   ```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/complaints` | Retrieve complaints with category, ward, and search filters |
| `POST` | `/api/complaints` | Submit a new complaint ticket |
| `POST` | `/api/complaints/:id/vote` | Upvote an existing complaint ticket |
| `PATCH` | `/api/complaints/:id/status` | Update complaint stage & assign field worker |
| `POST` | `/api/auth/login` | Authenticate user credentials & issue session token |
| `GET` | `/api/stats` | Retrieve municipal SLA metrics & categories breakdown |

---

## 📄 License
Licensed under the Apache-2.0 License.
