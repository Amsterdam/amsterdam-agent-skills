# Security Checklist Reference

Security-by-design rules and practices for City of Amsterdam projects. Source: developers.amsterdam.

## Table of Contents

- [10 Rules of Security by Design](#10-rules-of-security-by-design)
- [Required Practices](#required-practices)
- [JWT / Access Token Validation (RFC9068)](#jwt--access-token-validation-rfc9068)
- [Frontend Security](#frontend-security)
- [Docker Security](#docker-security)
- [Common Vulnerabilities to Avoid](#common-vulnerabilities-to-avoid)

## 10 Rules of Security by Design

### 1. Proactive Security Integration

Integrate security into requirements, design, and architecture phases — not as an afterthought.

```
# Bad: security bolted on after development
def create_user(request):
    user = User.objects.create(**request.data)  # No validation
    return Response(user.to_dict())

# Good: security considered from the start
def create_user(request):
    serializer = UserCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)  # Input validation
    user = serializer.save()
    audit_log.info("User created", user_id=user.id, by=request.user.id)  # Audit trail
    return Response(UserResponseSerializer(user).data)  # Controlled output
```

### 2. Principle of Least Privilege

Grant minimum permissions needed. Users, services, and processes should only access what they require.

```yaml
# Kubernetes: don't run as root
securityContext:
  runAsNonRoot: true
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
```

### 3. Defense in Depth

Apply multiple security layers. Don't rely on a single control.

- Network layer: firewalls, network policies
- Application layer: input validation, authentication
- Data layer: encryption at rest, access controls
- Monitoring layer: logging, alerting

### 4. Fail-Safe Defaults

Systems should default to a secure state when failures occur.

```python
# Bad: fail open
def check_permission(user, resource):
    try:
        return permission_service.check(user, resource)
    except ServiceError:
        return True  # Fail open — dangerous

# Good: fail closed
def check_permission(user, resource):
    try:
        return permission_service.check(user, resource)
    except ServiceError:
        logger.error("Permission service unavailable")
        return False  # Fail closed — secure default
```

### 5. Minimize Attack Surface

Remove unnecessary features, endpoints, services, and ports.

- Disable debug mode in production
- Remove unused API endpoints
- Close unnecessary ports
- Don't install unnecessary packages in Docker images

### 6. Do Not Trust Services

Validate and sanitize all data from external sources — including internal services.

```python
# Always validate data from other services
def process_external_data(data: dict):
    schema = ExternalDataSchema()
    validated = schema.load(data)  # Validate structure and types
    sanitized_name = bleach.clean(validated["name"])  # Sanitize strings
    return sanitized_name
```

### 7. Open Design

Security should not depend on secrecy of the implementation. Public source code (except IaC) is the standard.

### 8. Security by Default

Applications should be secure out of the box without requiring users to configure security.

```python
# Django settings — secure defaults
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
```

### 9. Separation of Duties

No single user or service should have all privileges. Split responsibilities.

- Separate deploy permissions from code write permissions
- Different service accounts for different services
- Code review required (no self-merge)

### 10. Keep Security Simple

Complex security is fragile security. Prefer simple, well-understood mechanisms.

## Required Practices

| Practice | Details |
|----------|---------|
| Branch protection | Enabled on `develop` and `main` |
| Public source code | All repos public (except IaC) |
| Git workflow | Follow Amsterdam Git standards |
| Testing | Test code before deployment |
| Dependency evaluation | Evaluate third-party packages against criteria |
| Authentication | Implement city-standard authentication |
| Monitoring & logging | Implement city-standard monitoring |
| Secrets management | Use Azure Key Vault, GitHub Secrets, or ADO Secrets |

## JWT / Access Token Validation (RFC9068)

All API services receiving access tokens must validate per RFC9068.

### Required Validations

| Check | Expected Value | Action on Failure |
|-------|---------------|-------------------|
| Token type (`typ`) | `at+jwt` | Reject |
| Issuer (`iss`) | Known issuer URL | Reject |
| Audience (`aud`) | This service's identifier | Reject |
| Signature | Valid against issuer's public key | Reject |
| Expiration (`exp`) | Not expired | Reject |
| Algorithm (`alg`) | NOT `none` | Reject |

On any validation failure: return **HTTP 401** with `"invalid_token"` error.

### Implementation Example (Python)

```python
import jwt
from jwt import PyJWKClient

ISSUER = "https://login.microsoftonline.com/{tenant}/v2.0"
AUDIENCE = "api://your-api-identifier"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"

jwks_client = PyJWKClient(JWKS_URL)


def validate_access_token(token: str) -> dict:
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and validate
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],  # Never allow "none"
            audience=AUDIENCE,
            issuer=ISSUER,
            options={
                "require": ["exp", "iss", "aud", "sub"],
                "verify_exp": True,
                "verify_iss": True,
                "verify_aud": True,
            },
        )

        # Verify token type
        header = jwt.get_unverified_header(token)
        if header.get("typ") != "at+jwt":
            raise jwt.InvalidTokenError("Invalid token type")

        return payload

    except jwt.ExpiredSignatureError:
        raise AuthenticationError("Token expired", status=401)
    except jwt.InvalidTokenError as e:
        raise AuthenticationError(f"Invalid token: {e}", status=401)
```

### Required Test Cases

| Test Case | Expected Result |
|-----------|----------------|
| No token provided | 401 Unauthorized |
| Invalid `typ` (not `at+jwt`) | 401 `invalid_token` |
| Invalid audience | 401 `invalid_token` |
| Expired token | 401 `invalid_token` |
| Invalid algorithm (`none`) | 401 `invalid_token` |
| Invalid signature | 401 `invalid_token` |
| Invalid issuer | 401 `invalid_token` |
| Valid token | 200 OK |

## Frontend Security

### HTTPS

All data in transit must use HTTPS. No exceptions.

### Content Security Policy (CSP)

Set CSP headers to prevent XSS and data injection attacks.

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.amsterdam.nl;
  frame-ancestors 'none';
```

### Subresource Integrity (SRI)

Use SRI hashes for externally fetched resources to prevent tampering.

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8w"
  crossorigin="anonymous"
></script>
```

### Security Monitoring

| Tool | Purpose |
|------|---------|
| Azure Monitor | Runtime security monitoring |
| GitHub Dependabot | Dependency vulnerability alerts |
| NPM audit | Node.js dependency scanning |
| Snyk | Comprehensive vulnerability scanning |

## Docker Security

### Secrets Handling

Never hard-code sensitive data in Docker images or Dockerfiles.

| Method | Use Case |
|--------|----------|
| Environment variables | Runtime configuration |
| Docker Secrets | Docker Swarm deployments |
| GitHub Secrets | CI/CD pipelines |
| Azure Key Vault | Production secrets management |
| ADO Secrets | Azure DevOps pipelines |

### Image Security

- Use Docker Hardened Images (`dhi.io/<image>`); fall back to official images only when no hardened image exists
- Multi-stage: build in the `-dev` variant, run in the minimal runtime variant (non-root user 65532, no shell, no package manager)
- Copy dependencies only from hardened images (e.g. `dhi.io/uv`), never install them in the runtime stage
- Specify exact version tags (never `latest`)
- Scan the final image with Trivy
- Runtime images can't bind ports below 1024: listen on 8000/8080

```dockerfile
# Good: hardened, multi-stage, uv-managed, non-root runtime
FROM dhi.io/python:3.15-dev AS builder
COPY --from=dhi.io/uv:0.13 /usr/local/bin/uv /usr/local/bin/
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY . .
RUN uv sync --frozen --no-dev --no-editable

FROM dhi.io/python:3.15
WORKDIR /app
# Venv + app code; files stay root-owned, so the nonroot user can read but not modify them
COPY --from=builder /app /app
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

Check current tags on the DHI catalog and keep build and runtime Python versions identical. Debug with `docker debug <container>` (there is no shell in the runtime image).

## Common Vulnerabilities to Avoid

| Vulnerability | Prevention |
|---------------|-----------|
| SQL Injection | Use ORM (Django ORM, SQLAlchemy), parameterized queries |
| XSS | Sanitize output, use CSP headers, React auto-escapes JSX |
| CSRF | Enable Django CSRF middleware, use CSRF tokens |
| Secrets in code | Use Key Vault / env vars, scan with git-secrets |
| Insecure dependencies | Dependabot, npm audit, Snyk, regular updates |
| Insufficient logging | Implement structured logging, audit trails |
| Broken auth | Validate tokens per RFC9068, city-standard auth |
| Excessive data exposure | Return only required fields, use serializers |
