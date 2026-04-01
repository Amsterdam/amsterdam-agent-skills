# Git Workflow Reference

Complete Git workflow standards for City of Amsterdam projects. Source: developers.amsterdam.

## Table of Contents

- [Repository Setup](#repository-setup)
- [Branch Strategy](#branch-strategy)
- [Branch Naming](#branch-naming)
- [Commit Standards](#commit-standards)
- [Commit Signing](#commit-signing)
- [Branch Protection](#branch-protection)
- [Pull Request Workflow](#pull-request-workflow)
- [Prohibited Content](#prohibited-content)

## Repository Setup

### Requirements for All Repos

1. Hosted in the **City of Amsterdam GitHub organization**
2. Repository visibility: **public** (exception: infrastructure-as-code must be private)
3. Include a `CODEOWNERS` file with team name
4. Contact `github@amsterdam.nl` with: GitHub usernames, full names, team, and PO approval

### CODEOWNERS Example

```
# Default owners for everything in the repo
* @Amsterdam/team-name

# Frontend specialists
/src/frontend/ @Amsterdam/team-name-frontend

# Infrastructure (if applicable)
/infrastructure/ @Amsterdam/team-name-infra
```

## Branch Strategy

### Branch Model

| Branch | Purpose | Merges to |
|--------|---------|-----------|
| `main` | Stable, production-ready code | — |
| `develop` | Integration branch for features/fixes | `main` (via release) |
| `feature/*` | New functionality | `develop` |
| `bugfix/*` | Bug fixes | `develop` |
| `hotfix/*` | Production emergency fixes | `main` + `develop` |
| `docs/*` | Documentation changes | `develop` |
| `chore/*` | Maintenance, refactoring | `develop` |

### Recommended Workflows

| Workflow | Best for | Notes |
|----------|----------|-------|
| GitLab Flow | Most teams | Environment branches, simple |
| Git Flow | Larger teams, versioned releases | More structured, release branches |
| Trunk-based | Teams with strong CI/CD | Requires automated testing pipeline |

**Requirement:** Document your team's chosen workflow in the repo README or contributing guide.

### `develop` as Default Branch

Set `develop` as the default branch in GitHub settings so that:
- New PRs target `develop` by default
- Clone/fork starts from `develop`
- `main` only receives reviewed, tested code

## Branch Naming

### Convention

```
<type>/<ticket-number>-<short-description>
```

### Types

| Prefix | Use for | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/PROJ-123-add-user-auth` |
| `chore/` | Maintenance, refactoring | `chore/PROJ-200-upgrade-django-5` |
| `bugfix/` | Bug fixes | `bugfix/PROJ-456-fix-login-redirect` |
| `hotfix/` | Production emergency | `hotfix/fix-critical-payment-error` |
| `docs/` | Documentation | `docs/PROJ-789-update-api-docs` |

### Rules

- Include ticket number referencing product backlog item (when applicable)
- Use kebab-case for the description
- Keep descriptions short but meaningful
- Branch name should indicate the purpose of the change

## Commit Standards

### Format: Conventional Commits

```
<type>(<scope>): <title>

<description - why this change was made>

Refs: <ticket-number>
```

### Types

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no new feature or fix |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Other maintenance tasks |

### Example Commits

```
feat(auth): add SSO integration for employees

Implements SAML-based SSO to replace legacy password login.
Reduces onboarding friction and improves security posture.

Refs: PROJ-789
```

```
fix(maps): correct coordinate projection for RD/New

PostGIS was returning WGS84 coordinates but the frontend
expected Rijksdriehoekscoordinaten (EPSG:28992).

Refs: PROJ-456
```

```
chore(deps): upgrade Django from 4.2 to 5.1

Security patches and Python 3.12 compatibility.
Breaking change: middleware stack order updated.

Refs: PROJ-200
```

### Commit Rules

- **Atomic commits**: one logical change per commit
- Title = what changed, description = why
- Use commitizen tools for consistency (recommended)
- Never commit generated files or dependencies without justification
- Never commit local configuration files (`.env`, IDE settings)

## Commit Signing

### Why

All commits must be signed to verify author identity. Required for branch protection.

### SSH Signing (Recommended)

SSH signing is simpler than GPG and uses keys you likely already have.

```bash
# Configure Git to use SSH signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

### GPG Signing (Alternative)

```bash
# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Configure Git with your GPG key
git config --global user.signingkey <YOUR_KEY_ID>
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

### Verify Signing Works

```bash
# Make a test commit
git commit --allow-empty -m "test: verify commit signing"

# Check the signature
git log --show-signature -1
```

### Upload Public Key to GitHub

1. Go to GitHub Settings > SSH and GPG keys
2. Add your public key (SSH or GPG)
3. For SSH: also add as a "Signing Key" (separate from Authentication Key)

## Branch Protection

### Required Settings (Both `develop` and `main`)

| Setting | Value |
|---------|-------|
| Require pull request reviews | Yes |
| Required number of approvals | 1 (minimum) |
| Dismiss stale reviews on new pushes | Recommended |
| Require signed commits | Recommended |
| Require status checks to pass | Recommended |
| Require branches to be up to date | Recommended |

### Rules

- Branch protection **cannot be disabled** for convenience
- All changes must go through pull requests
- Direct pushes to `develop` and `main` are blocked

## Pull Request Workflow

### Creating a PR

1. Create branch from `develop` following naming convention
2. Make atomic commits with Conventional Commit messages
3. Push branch and create PR targeting `develop`
4. Fill in PR description:
   - **What** changed
   - **Why** (link to ticket/issue)
   - **What to review** (critical areas)
   - **Estimated review time**

### PR Review Checklist

- [ ] Code follows project conventions
- [ ] Tests added/updated for changes
- [ ] No secrets, credentials, or PII committed
- [ ] Documentation updated if needed
- [ ] Accessibility requirements met
- [ ] Security considerations addressed

### Code Review Guidelines (Draft Standard)

- Reviews required before merging to `main`
- Provide context: what changed, what's critical, estimated review time
- Timely reviews expected (don't let PRs sit)
- Review for: correctness, security, readability, test coverage

### Merging

- Squash merge for feature branches (keeps `develop` history clean)
- Merge commit for release merges to `main` (preserves history)
- Delete branch after merge

## Prohibited Content

**Never commit any of the following:**

| Category | Examples |
|----------|---------|
| Secrets | API keys, passwords, tokens, connection strings |
| Credentials | Usernames, service accounts |
| PII | Personal data, email addresses, phone numbers |
| Non-anonymized data | Real user data, test data with real info |
| Generated files | Build artifacts, compiled code (unless justified) |
| Dependencies | `node_modules/`, `.venv/`, vendor directories |
| Local config | `.env`, IDE settings, OS files (`.DS_Store`) |

> "Assume the data is publicly known as soon as you've published it. Bots are scanning repositories continuously."

Use `.gitignore` to prevent accidental commits:

```gitignore
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/
.venv/
vendor/

# Build
dist/
build/
*.pyc
__pycache__/

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db
```
