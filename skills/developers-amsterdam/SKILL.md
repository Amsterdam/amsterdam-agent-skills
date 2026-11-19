---
name: developers-amsterdam
description: >
  Mandatory for Gemeente Amsterdam architecture and engineering decisions.
  Use for tech stack choices, project setup, repo scaffolding, architecture,
  Git workflow, tests, dependency evaluation, Docker, databases, security,
  accessibility, code review, CI/CD, or other structural choices. Covers
  approved stacks (Python/Django, FastAPI, Node.js/TypeScript, React, Next.js),
  Conventional Commits, branch protection, commit signing, 70-80% test
  coverage, security-by-design, JWT RFC9068, CSP, README/ADR standards,
  EU-PL v1.2, Docker Hardened Images, uv for Python, PostgreSQL, Baseline
  browser support, WCAG 2.1 AA, and AI Act standards for AI/ML systems.
---

# City of Amsterdam Engineering Standards

> **MANDATORY**: ALL architecture, tech stack, and engineering decisions MUST follow these standards. Do NOT recommend frameworks, databases, or patterns outside the approved list without explicit user approval. When setting up new projects, always apply these standards from day one.

Development standards for all Gemeente Amsterdam projects, maintained by Engineering Enablement.

> **Portal:** https://developers.amsterdam/
> **Source:** https://github.com/Amsterdam/development-standards
> **License:** CC0 1.0 Universal

## Clarify Before Building

When the user's request is vague (e.g., "build me an API", "set up a new project", "create a service"), **ask before assuming**. Surface these decision gates — they map to the picker tables below:

| Decision | Options | Why it matters |
|----------|---------|----------------|
| **Backend language** | Python (Django or FastAPI) or Node.js (TypeScript + NestJS) | Determines entire stack, test framework, and project structure |
| **Python framework** | Django (standard) or FastAPI (async/high-perf) | Different project layout, ORM, and testing patterns |
| **Project structure** | Single package or pnpm monorepo | Monorepo if sharing code across apps; single if one deployable |
| **Database** | PostgreSQL (default), PostGIS (geo), Cosmos DB (documents) | Affects Docker setup, migrations, and connection patterns |
| **Full-stack or API-only** | Next.js/React Router (full-stack) or API-only backend | Determines whether frontend scaffolding is needed |
| **Git workflow** | GitLab Flow, Git Flow, or Trunk-based | Trunk-based requires mature CI/CD; Git Flow for release trains |

**Don't ask all at once.** Pick the 1-2 questions that the prompt leaves genuinely ambiguous. If the user says "FastAPI service" → Python + FastAPI + API-only are all implied, just clarify structure and database if needed.

## Quick Decision Tables

### Language & Framework Picker

| Need | Choose | Notes |
|------|--------|-------|
| Backend API (standard) | Python + Django | Default choice for most projects |
| Backend API (high-perf / async) | Python + FastAPI | When async or performance is critical |
| Backend API (JS ecosystem) | Node.js + TypeScript + NestJS | When team expertise is JS-heavy |
| Frontend app | TypeScript + React | Always TypeScript for new projects |
| Full-stack app | Next.js or React Router | With Amsterdam Design System |
| Mobile | React Native | Integrated into Amsterdam App platform |
| Low-code | Mendix | For citizen-facing simple apps |
| Maps | Leaflet | See maps.developers.amsterdam |
| Python dependencies | uv | Standard for all Python projects (`pyproject.toml` + `uv.lock`) |
| Package manager (JS/TS) | pnpm | Recommended default; not an upstream standard |

### Database Picker

| Need | Choose |
|------|--------|
| Standard RDBMS | PostgreSQL |
| Geospatial data | PostgreSQL + PostGIS |
| Document store | Azure Cosmos DB or MongoDB |
| Legacy/migration | Microsoft SQL Server |

### Repo Requirements Checklist

| Requirement | Mandatory |
|-------------|-----------|
| Hosted in City of Amsterdam GitHub org | Yes |
| Public repository | Yes (except IaC = private) |
| CODEOWNERS file with team name | Yes |
| README with template sections | Yes |
| EU-PL v1.2 license | Yes |
| Branch protection on `develop` and `main` | Yes |
| Commit signing (GPG or SSH) | Yes |
| CI/CD pipeline | Yes |
| ADRs for architecture decisions | Yes |
| Changelog | Yes |

### Test Framework Picker

| Context | Framework | Coverage Target |
|---------|-----------|----------------|
| Frontend unit/integration | Jest or Vitest + React Testing Library | 70% |
| Frontend snapshots | Jest or Vitest + react-test-renderer | — |
| Frontend E2E/regression | Playwright or Cypress | — |
| Frontend API mocking | MSW or Mirage JS | — |
| Backend (Django) | Django test framework | 80% |
| Backend (FastAPI) | pytest | 80% |

## Git Workflow

### Branch Model

- **`main`** — stable, production-ready code
- **`develop`** — integration branch, set as default branch
- Recommended: GitLab Flow, Git Flow, or Trunk-based (latter requires CI/CD)

### Branch Naming

Pattern: `<type>/<ticket>-<description>`

| Prefix | Use for |
|--------|---------|
| `feature/` | New functionality |
| `chore/` | Maintenance, refactoring |
| `bugfix/` | Bug fixes |
| `hotfix/` | Production emergency fixes |
| `docs/` | Documentation changes |

Examples:
- `feature/PROJ-123-add-user-auth`
- `bugfix/PROJ-456-fix-login-redirect`
- `hotfix/fix-critical-payment-error`

### Commit Format

Use Conventional Commits. Title = what changed, description = why.

```
feat(auth): add SSO integration for employees

Implements SAML-based SSO to replace legacy password login.
Reduces onboarding friction and improves security posture.

Refs: PROJ-789
```

Rules:
- Atomic commits (one logical change per commit)
- Jupyter notebooks are for exploration only. Refactor to modular, tested `.py` before production or code review; strip all outputs from any committed `.ipynb`
- Sign commits with GPG or SSH keys (SSH recommended)
- Never commit: secrets, credentials, PII, generated files, `node_modules`, local configs

### Branch Protection (Required)

- PR reviews required before merging to `develop` and `main`
- Minimum one approval
- Cannot be disabled for convenience

> Full branch strategy, signing setup, and PR workflow: read `references/git-workflow.md`

## Security Rules (Summary)

| # | Rule |
|---|------|
| 1 | Proactive security integration in requirements/design/architecture |
| 2 | Principle of Least Privilege |
| 3 | Defense in Depth (multiple security layers) |
| 4 | Fail-Safe defaults (secure state during failures) |
| 5 | Minimize Attack Surface |
| 6 | Do Not Trust Services (validate/sanitize all external data) |
| 7 | Open Design (security not dependent on secrecy) |
| 8 | Security by Default |
| 9 | Separation of Duties |
| 10 | Keep Security Simple |

Required practices:
- Branch protection rules enabled
- Public source code (except IaC)
- Test code before deployment
- Evaluate third-party dependencies
- City-standard authentication and monitoring/logging
- JWT validation per RFC9068 (validate typ, issuer, audience, signature, expiration)
- HTTPS for all data in transit
- CSP headers and SRI for fetched resources

> Full security checklist with code examples: read `references/security-checklist.md`

## Dependency Evaluation

| Criterion | Check |
|-----------|-------|
| Documentation | Quality, learning curve, examples |
| License | Compatible? (MIT, Apache 2.0, BSD, EUPL = safe) |
| Performance | Bundle size impact (especially frontend) |
| Security | Known vulnerabilities, patch response time |
| Maturity | Project age, roadmap, release cadence |
| Maintenance | Active maintainers, commit frequency |
| Adoption | Download trends (npm trends, PePy, Packagist) |

**Reject** packages scoring poorly on most criteria. Mixed results = consult team.

### Python: uv

`uv` is the standard dependency manager for all Python projects. New projects: `uv init`. Existing projects on pip / pip-tools / Poetry / setuptools: convert to `pyproject.toml` + `uv.lock`. In GitHub Actions use `astral-sh/setup-uv`; configure Dependabot with `package-ecosystem: "uv"`.

Additional frontend requirements:
- Regular updates and patches
- Annual reviews for quality, reliability, and necessity
- Security scanning: GitHub Dependabot, NPM audit, Snyk

## Accessibility

**Mandatory: WCAG 2.1 AA compliance** per the Digital Government Act.

Applies to all government websites, apps, intranets, extranets, cloud apps, and mobile apps.

Key requirements:
- Support 200% zoom
- Descriptive link text
- Screen reader compatible
- Logical page/focus order, visible focus rings
- Multimedia captions
- CSS spacing per WCAG 1.4.12
- Right-to-left language support

Testing tools: WebAIM WAVE, W3C Markup Validation, Google Lighthouse, VoiceOver, JAWS, TalkBack.

## Browser Support

Frontend and shared UI code uses **[Baseline Widely Available](https://web.dev/baseline)** features only (in all major browsers for 30+ months). No browser-version matrix to maintain; Browserslist is optional.

Enforce it in CI and locally:

| Code | Lint plugin |
|------|-------------|
| JS / TS | `eslint-plugin-baseline-js` → `"baseline-js/use-baseline": ["error", { available: "widely" }]` |
| CSS | `stylelint-plugin-use-baseline` |

Need a newer feature? Use progressive enhancement or a fallback, state the reason in the PR, and raise it in the frontend guild.

## Database Standards

- **PostgreSQL** is the default RDBMS for all new projects
- **PostGIS** extension for geospatial data
- Use official Docker images (`postgres`, `postgis/postgis`) for local development
- Match versions with Azure PostgreSQL Flexible Server

## Docker Standards

- **Use Docker Hardened Images (DHI)** (`dhi.io/<image>`) in a multi-stage build: build in the `-dev` variant, copy artifacts into the minimal runtime variant (non-root, no shell, no package manager)
- Pull extra dependencies only from other hardened images (e.g. `dhi.io/uv`), not from the distro package manager in the runtime stage
- Verify the final image with [Trivy](https://trivy.dev/)
- Use Docker for containerization in dev, test, and production
- Base images: well-maintained, specify exact version (never `latest` tag)
- Where no hardened image exists, use official images (Alpine, NGINX, Node.js, PHP, Postgres, Python, Ubuntu)
- Install only necessary packages
- Specify all dependency versions explicitly
- Dockerfiles live in the app's GitHub repo
- Compiled images in Azure Container Registry (ACR)
- Regular updates (monthly or quarterly minimum)
- No separate images for different DTAP/OTAP environments
- No unofficial or uncertified Docker images
- Use environment variables for sensitive data (never hard-coded)

## Package Manager & Project Structure

- **pnpm** is the recommended package manager for new Node.js/TypeScript projects. This is a convention of this skill, not a developers.amsterdam standard; follow the repo's existing package manager when there is one
- Use `corepack enable` to pin the pnpm version via `packageManager` field in `package.json`

### When to Monorepo

| Signal | Structure |
|--------|-----------|
| Single deployable app, no shared libs | Single package |
| Multiple apps sharing code (e.g., frontend + API + shared types) | pnpm monorepo |
| Shared design tokens, UI lib, or config across teams | pnpm monorepo |
| Independent microservices with no shared code | Separate repos |

### Monorepo Setup

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

Standard directory structure:
```
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Backend service
├── packages/
│   ├── shared/           # Shared types, utils
│   └── config/           # Shared ESLint, TSConfig
├── pnpm-workspace.yaml
├── package.json          # Root with "packageManager" field
└── pnpm-lock.yaml
```

### Cross-package references

```json
// apps/web/package.json
{
  "dependencies": {
    "@project/shared": "workspace:*"
  }
}
```

Run commands across packages: `pnpm -r build`, `pnpm --filter web dev`.

## AI Systems (AI Act)

Any project that trains, fine-tunes, or deploys an AI model (including LLM apps and RAG) must meet the seven developers.amsterdam AI standards on top of the general ones:

| Standard | Core requirement |
|----------|------------------|
| Data governance & quality | Version datasets (e.g. DVC), separate train/validation/test, version the RAG chunking + embedding model + index |
| Model architecture & robustness | Disaggregated metrics on a hold-out set; for LLMs measure faithfulness, answer relevance, context precision (Ragas, TruLens); confidence thresholds with human fallback |
| Fairness & bias | Fix protected attributes, metrics and thresholds **before** testing; for LLMs run [GRIP on LLMs](https://github.com/Amsterdam/grip-on-llms) |
| Human oversight | Document intended use and prohibited uses; pick HitL / HotL / HiC; override controls and logged overrides |
| Transparency | Tell users they're dealing with AI; label AI-generated content; plain-language explanation and limitations |
| AI cybersecurity | Pydantic-validated inputs, prompt-injection / jailbreak / system-prompt-leak guardrails, rate limits, verified model weights |
| Post-market monitoring | Drift, confidence and fairness monitoring with alerts; retraining SLAs; feed overrides back into retraining |

> Full checklists per standard: read `references/ai-standards.md`

## Documentation Requirements

Mandatory for all new repos (since May 2024):

1. Application overview (purpose)
2. **License: EU-PL v1.2**
3. README (using standard template)
4. Architecture Decision Records (ADRs)
5. Changelog with review date
6. Data processing information
7. API documentation (endpoints, params, auth, request/response)
8. Feature list with purposes

> README template and ADR template: read `references/project-setup-checklist.md`

## Do / Don't

| Do | Don't |
|----|-------|
| Use TypeScript for all new frontend | Use JavaScript without types |
| PostgreSQL as default database | Choose databases without justification |
| Sign commits with GPG or SSH | Push unsigned commits |
| Require PR reviews before merge | Merge without review |
| Use EU-PL v1.2 license | Use other licenses without approval |
| WCAG 2.1 AA compliance | Ship inaccessible features |
| Public repos (except IaC) | Private repos without justification |
| Evaluate dependencies against criteria | Add packages without evaluation |
| Docker with pinned version tags | Use `latest` tag or uncertified images |
| Security-by-design from day one | Bolt on security as afterthought |
| Conventional Commits format | Commit messages without context |
| 70% frontend / 80% backend coverage | Skip tests for production code |
| Store secrets in Key Vault / env vars | Hard-code secrets or commit credentials |
| Document with README, ADRs, changelog | Leave repos undocumented |
| Use uv for Python dependencies | Add new `requirements.txt` / Poetry setups |
| Docker Hardened Images, multi-stage, Trivy-scanned | Install packages in the runtime image |
| Baseline Widely Available web features, lint-enforced | Ship newer features without a fallback |
| Disclose AI use and label AI-generated content | Present AI output as human-authored fact |
| Refactor notebooks into tested modules for production | Put `.ipynb` with outputs into review |

## Shared Components

| Component | Repository |
|-----------|-----------|
| Amsterdam Design System | github.com/Amsterdam/design-system |
| BMI DMS Upload | github.com/Amsterdam/bmi-dms-upload |
| Wonen UI | github.com/Amsterdam/wonen-ui |
| Maps | maps.developers.amsterdam |

## Cross-Skill Boundaries

| Concern | This skill | Other skill |
|---------|-----------|-------------|
| Which framework/language to use | developers-amsterdam | — |
| How to build UI components | — | amsterdam-design-system |
| Text content and tone of voice | — | amsterdam-stijl |

## Reference Files

| File | Read when... |
|------|-------------|
| `references/tech-stack.md` | Choosing languages, frameworks, or shared components; justifying deviations |
| `references/git-workflow.md` | Setting up branches, commit signing, PR workflow, or reviewing Git practices |
| `references/testing-standards.md` | Setting up test infrastructure, choosing frameworks, defining coverage targets |
| `references/security-checklist.md` | Implementing auth, JWT validation, CSP, Docker security, or reviewing security |
| `references/project-setup-checklist.md` | Creating a new repository, writing README/ADRs, setting up licensing |
| `references/ai-standards.md` | Building, evaluating, or deploying an AI/ML model, LLM app, or RAG system |
