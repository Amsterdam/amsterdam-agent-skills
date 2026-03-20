# Tech Stack Reference

Full approved technology stack for City of Amsterdam (Gemeente Amsterdam) projects. Source: developers.amsterdam.

## Table of Contents

- [Backend](#backend)
- [Frontend](#frontend)
- [Mobile](#mobile)
- [Databases](#databases)
- [API Technologies](#api-technologies)
- [Infrastructure](#infrastructure)
- [Build Tools](#build-tools)
- [Maps](#maps)
- [Shared Components](#shared-components)
- [Decision Trees](#decision-trees)
- [Deviation Process](#deviation-process)

## Backend

### Approved Languages & Frameworks

| Language | Framework | Use Case |
|----------|-----------|----------|
| Python | Django | Standard backend, admin-heavy apps, ORM-driven projects |
| Python | FastAPI | High-performance APIs, async workloads, microservices |
| Node.js (TypeScript) | NestJS | When team expertise is JS/TS-heavy |
| Node.js (TypeScript) | Express.js | Lightweight APIs, BFF (Backend-for-Frontend) |

### Backend Decision Tree

```
New backend project?
├── Team has Python expertise → Django (default) or FastAPI (async/perf)
├── Team has JS/TS expertise → NestJS (structured) or Express (lightweight)
└── Unsure → Default to Python + Django
```

### Constraints

- **No monolithic codebases** where backend renders frontend (requires Gilde approval)
- Existing apps: no mandatory migration unless justified by security risks, end-of-life, or strategic necessity

## Frontend

### Approved Stack

| Technology | Status | Notes |
|------------|--------|-------|
| TypeScript | **Required** | All new frontend apps must use TypeScript |
| React | Standard | With Amsterdam Design System |
| Next.js | Recommended | Full-stack React framework |
| React Router | Alternative | Client-side routing for SPAs |
| CSS Modules | Standard | For component styling |
| Vite | Recommended | Build tool |
| esbuild | Alternative | Build tool |

### Frontend Decision Tree

```
New frontend project?
├── Full application → Next.js + React + TypeScript
├── SPA (no SSR needed) → React Router + React + TypeScript
├── Component styling → CSS Modules (+ Amsterdam Design System tokens)
└── Build tool → Vite (default) or esbuild
```

### Key Rules

- **Always TypeScript** — JavaScript-only frontends are not permitted for new projects
- Use Amsterdam Design System components and tokens (see `amsterdam-design-system` skill)
- Follow amsterdam-stijl for text content (see `amsterdam-stijl` skill)

## Mobile

| Technology | Notes |
|------------|-------|
| React Native | Integrated as modules into the Amsterdam App platform |

## Databases

### Approved Databases

| Database | Use Case | Notes |
|----------|----------|-------|
| **PostgreSQL** | Default RDBMS | Strongly recommended for all new projects |
| PostgreSQL + PostGIS | Geospatial data | Extension for geographic queries, maps |
| Azure Cosmos DB | Document store | When NoSQL is justified |
| MongoDB | Document store | Alternative NoSQL option |
| Microsoft SQL Server | Legacy | For existing applications only |

### PostgreSQL Standards

- Use official Docker images (`postgres`, `postgis/postgis`) for local development
- Match versions with Azure PostgreSQL Flexible Server
- PostGIS for any geospatial data requirements
- No other RDBMS without justification and approval

## API Technologies

| Technology | Use Case |
|------------|----------|
| REST API | Standard API design (default) |
| GraphQL | Complex query requirements, multiple consumers |
| Apollo GraphQL | GraphQL implementation framework |

## Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization (dev, test, production) |
| Kubernetes | Container orchestration |
| Helm | Kubernetes package management |
| Azure Resource Manager | Infrastructure provisioning |
| Azure DevOps | CI/CD pipelines |
| GitHub | Source code hosting |
| Jira | Project management |

### Docker Standards

- Base images: well-maintained, specify exact version (never `latest`)
- Common approved: Alpine, NGINX, Node.js, PHP, Postgres, Python, Ubuntu
- Install only necessary packages
- Specify all dependency versions explicitly
- Dockerfiles in the app's GitHub repo
- Compiled images → Azure Container Registry (ACR)
- Docker Hub only for approved multi-team/municipality sharing
- Regular updates: monthly or quarterly minimum
- No separate images for different DTAP/OTAP environments
- No unofficial or uncertified images
- Test images for infrastructure compatibility before production

## Build Tools

| Tool | Ecosystem | Notes |
|------|-----------|-------|
| Vite | Frontend | Recommended default |
| esbuild | Frontend | Alternative, faster builds |

## Maps

- **Leaflet** is the preferred map library
- Maps portal: https://maps.developers.amsterdam/
- Use PostGIS for backend geospatial data

## Shared Components

| Component | Repository | Purpose |
|-----------|-----------|---------|
| Amsterdam Design System | github.com/Amsterdam/design-system | UI components, tokens, layout |
| BMI DMS Upload | github.com/Amsterdam/bmi-dms-upload | Document upload component |
| Wonen UI | github.com/Amsterdam/wonen-ui | Housing-specific UI components |

Check existing shared components before building custom solutions.

## Decision Trees

### "Should I use this technology?"

```
Is it on the approved list above?
├── Yes → Use it
├── No, but similar to approved tech → Submit deviation request
└── No, completely different → Strong justification needed + Gilde approval
```

### "Should I migrate an existing app?"

```
Is the current tech stack causing problems?
├── Security risk → Yes, migrate
├── End-of-life / no longer maintained → Yes, migrate
├── Strategic necessity → Yes, migrate
└── "It would be nicer" → No, keep current stack
```

## Deviation Process

When a project needs technology not on the approved list:

1. **Submit request** to the Engineering Enablement team
2. Engineering Enablement **consults guild experts** for the relevant domain
3. Guild provides recommendation (approve / reject / conditional)
4. If approved, deviation is documented with justification
5. Deviation may be added to approved list if broadly applicable

Deviations require justification covering:
- Why approved alternatives don't meet the need
- Team expertise with the proposed technology
- Maintenance and support plan
- Security and compliance implications

## Low-Code

| Platform | Use Case |
|----------|----------|
| Mendix | Citizen-facing simple applications |

Low-code platforms are appropriate for specific use cases but not for complex applications requiring custom logic or integrations.
