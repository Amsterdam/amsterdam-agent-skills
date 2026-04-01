# Project Setup Checklist Reference

Complete checklist for setting up a new City of Amsterdam project repository. Source: developers.amsterdam.

## Table of Contents

- [New Repository Checklist](#new-repository-checklist)
- [GitHub Organization Access](#github-organization-access)
- [README Template](#readme-template)
- [ADR Template](#adr-template)
- [Licensing](#licensing)
- [CODEOWNERS Setup](#codeowners-setup)
- [Documentation Requirements](#documentation-requirements)
- [Branch Protection Setup](#branch-protection-setup)
- [CI/CD Pipeline Setup](#cicd-pipeline-setup)
- [Contribution Process](#contribution-process)

## New Repository Checklist

Complete these steps when creating a new repository:

| Step | Action | Details |
|------|--------|---------|
| 1 | Request GitHub org access | Email github@amsterdam.nl |
| 2 | Create repo in Amsterdam org | Public (private only for IaC) |
| 3 | Set `develop` as default branch | GitHub repo settings |
| 4 | Add `CODEOWNERS` | Team name as owner |
| 5 | Add `LICENSE` | EU-PL v1.2 |
| 6 | Add `README.md` | Use template below |
| 7 | Add `.gitignore` | Language-appropriate |
| 8 | Enable branch protection | On `develop` and `main` |
| 9 | Configure commit signing | SSH or GPG |
| 10 | Set up CI/CD pipeline | Azure DevOps |
| 11 | Create initial ADR | ADR-001: project architecture |
| 12 | Add changelog | `CHANGELOG.md` |
| 13 | Document chosen Git workflow | In README or CONTRIBUTING.md |
| 14 | Configure Dependabot | For dependency updates |
| 15 | Set up monitoring | Application Insights / Azure Monitor |

## GitHub Organization Access

To get access to the City of Amsterdam GitHub organization:

1. Email **github@amsterdam.nl** with:
   - GitHub usernames of team members
   - Full names
   - Team name
   - PO (Product Owner) approval
2. Wait for organization admin to add team members
3. Create team in GitHub organization if it doesn't exist

## README Template

Every repository must have a README following this structure:

```markdown
# [Project Name]

[One-paragraph description: what this project does, who it's for, and why it exists.]

## Status

| Aspect | Details |
|--------|---------|
| Status | [Active / Maintenance / Archived] |
| Team | [Team name] |
| Contact | [Email or Slack channel] |

## Getting Started

### Prerequisites

- [List required tools, versions, accounts]

### Installation

```bash
# Clone the repository
git clone git@github.com:Amsterdam/[repo-name].git
cd [repo-name]

# Install dependencies
[package manager install command]

# Set up environment
cp .env.example .env
# Edit .env with your local settings
```

### Running Locally

```bash
[command to start the application]
```

### Running Tests

```bash
[command to run tests]
[command to run tests with coverage]
```

## Architecture

[Brief description of the architecture, or link to ADRs.]

See `docs/adr/` for Architecture Decision Records.

## API Documentation

[Link to API docs, or brief endpoint overview.]

## Deployment

[How and where the application is deployed. Link to pipeline.]

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Our Git workflow: [GitLab Flow / Git Flow / Trunk-based]

## License

This project is licensed under the [EUPL v1.2](LICENSE).

## Links

- [Production URL](https://...)
- [Staging URL](https://...)
- [CI/CD Pipeline](https://...)
- [Design (Figma)](https://...)
- [Backlog (Jira)](https://...)
```

## ADR Template

Architecture Decision Records document significant technical decisions. Store in `docs/adr/`.

### File Naming

```
docs/adr/
├── 0001-use-django-as-backend-framework.md
├── 0002-choose-postgresql-for-database.md
├── 0003-implement-jwt-authentication.md
└── README.md  (index of all ADRs)
```

### ADR Template

```markdown
# [ADR-NNNN] [Title]

**Date:** YYYY-MM-DD
**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-NNNN]
**Deciders:** [Names or team]

## Context

[What is the issue? Why do we need to make a decision?]

## Decision

[What is the decision and why was it chosen?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Observation]

## Alternatives Considered

### [Alternative 1]
- Pros: ...
- Cons: ...
- Why rejected: ...

### [Alternative 2]
- Pros: ...
- Cons: ...
- Why rejected: ...
```

## Licensing

### EU-PL v1.2 (Required)

All City of Amsterdam projects must use the **European Union Public Licence v1.2**.

Create a `LICENSE` file in the repository root:

```
EUROPEAN UNION PUBLIC LICENCE v. 1.2
EUPL (c) the European Union 2007, 2016

Full license text: https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
```

### Compatible Licenses for Dependencies

| License | Compatible | Notes |
|---------|-----------|-------|
| MIT | Yes | Permissive, widely used |
| Apache 2.0 | Yes | Patent grant included |
| BSD (2/3-clause) | Yes | Permissive |
| EUPL | Yes | Same license family |
| GPL v2/v3 | Conditional | Check EUPL compatibility matrix |
| AGPL | Conditional | Consult legal team |
| Proprietary | No | Requires separate approval |

## CODEOWNERS Setup

Create a `CODEOWNERS` file in the repository root:

```
# Default owners for everything
* @Amsterdam/team-name

# Optionally, specify owners for specific paths
/src/frontend/    @Amsterdam/team-name-frontend
/src/backend/     @Amsterdam/team-name-backend
/infrastructure/  @Amsterdam/team-name-platform
/docs/            @Amsterdam/team-name
```

Rules:
- Use GitHub team names (not individual usernames)
- Teams must exist in the Amsterdam GitHub organization
- CODEOWNERS enables automatic review assignment

## Documentation Requirements

Mandatory for all new repos since May 2024:

| Document | Purpose | Location |
|----------|---------|----------|
| Application overview | What the project does and why | README.md |
| License | Legal framework | LICENSE |
| README | Getting started, team, architecture | README.md |
| ADRs | Architecture decisions | docs/adr/ |
| Changelog | Version history, review dates | CHANGELOG.md |
| Data processing | What data is processed, how | docs/ or README |
| API documentation | Endpoints, params, auth, examples | docs/ or auto-generated |
| Feature list | Features and their purposes | README or docs/ |

### Continuous Maintenance

- Documentation is **not a one-time task**
- Regular review and updates required
- Keep changelog current with each release
- Update ADRs when decisions change (mark old ones as Deprecated/Superseded)

## Branch Protection Setup

### GitHub Settings Path

Repository > Settings > Branches > Add branch protection rule

### Configuration for `develop`

| Setting | Value |
|---------|-------|
| Branch name pattern | `develop` |
| Require pull request reviews | Yes |
| Required approving reviews | 1 |
| Dismiss stale reviews | Yes |
| Require status checks | Yes (add CI pipeline) |
| Require signed commits | Recommended |
| Include administrators | Recommended |

### Configuration for `main`

Same as `develop`, plus:

| Setting | Value |
|---------|-------|
| Require branches to be up to date | Yes |
| Restrict who can push | Release managers only |

## CI/CD Pipeline Setup

### Minimum Pipeline Requirements

| Stage | Actions |
|-------|---------|
| Lint | Code style, formatting checks |
| Test | Unit + integration tests with coverage |
| Security | Dependency scanning (npm audit, safety) |
| Build | Docker image build |
| Deploy (staging) | Automatic on `develop` merge |
| Deploy (production) | On `main` merge (with approval) |

## Contribution Process

### Standards Contribution

Standards are proposed via PR to the `Amsterdam/development-standards` repo:

1. Fork the repository
2. Create a branch with your proposed standard
3. Submit a PR with the standard document
4. Engineering Enablement reviews the proposal
5. Relevant Guild discusses and provides feedback
6. If approved, standard is published

### Standard Document Format

Required sections:
- Title
- Review date
- What / When / Whom / How
- Considerations

Optional:
- Pitfalls
- Further reading
- Acknowledgments

### Review Cycle

All published standards are reviewed every **9 months** to ensure they remain current and relevant.
