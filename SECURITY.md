# FLEETWATCH — Security Policy

> Security posture and vulnerability disclosure for the Fleet Intelligence platform.

---

## Reporting a Vulnerability

We take the security of FLEETWATCH seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to **security@fleetwatch.dev** with the following details:

- Type of issue (e.g., XSS, SQL injection, privilege escalation)
- Full paths of source file(s) related to the manifestation of the issue
- Step-by-step reproduction instructions
- Proof-of-concept or exploit code (if available)
- Impact assessment

You should receive a response within 48 hours. If you do not receive a response, please follow up to ensure the message was received.

## Disclosure Timeline

| Phase | Timeline |
|---|---|
| Acknowledgment | Within 48 hours |
| Triage & Assessment | Within 5 business days |
| Fix Development | Based on severity |
| Patch Release | Coordinated disclosure |
| Public Disclosure | 30 days after patch |

---

## Security Measures

### Application Security

#### Content Security Policy
Strict CSP headers are applied to all routes, blocking inline scripts, eval, and external resources. Only trusted CDNs for fonts and analytics are whitelisted.

#### XSS Prevention
- React's built-in JSX escaping prevents DOM-based XSS
- CSP blocks inline script execution
- All user-generated content is sanitized before rendering
- Zod validation on all API inputs prevents injection attacks

#### CSRF Protection
- SameSite cookies (Lax/Strict)
- CSRF tokens on all mutation endpoints
- CORS restricted to known origins

#### Authentication & Authorization
- JWT-based session management with secure, HTTP-only cookies
- Token rotation on privilege escalation
- Role-based access control (RBAC) at the API route level
- Rate limiting on authentication endpoints

### Infrastructure Security

#### Transport Security
- TLS 1.3 required for all connections
- HSTS with 2-year max-age and preload
- Certificate pinning via HSTS

#### API Security
- All external API keys are server-side proxied — never exposed to the client
- Request signing for webhook endpoints
- Per-endpoint rate limiting with Redis-backed token bucket

#### Data Security
- Encryption at rest (AES-256) for sensitive data
- Telemetry data retention policies with automated purging
- PII minimization — only essential driver data collected

### Operational Security

#### Dependency Scanning
- Automated Dependabot alerts on the GitHub repository
- `npm audit` run in CI pipeline
- Weekly dependency review with CVE tracking

#### CI/CD Security
- All PRs require passing security scans before merge
- No secrets in build artifacts
- Signed commits using GPG keys

---

## Supported Versions

| Version | Supported |
|---|---|
| 1.x | ✅ Active |
| < 1.0 | ❌ No longer supported |

---

## Security Checklist for Contributors

- [ ] No secrets committed to the repository
- [ ] All API inputs validated with Zod schemas
- [ ] No `dangerouslySetInnerHTML` usage without sanitization
- [ ] Console.log / debug endpoints removed
- [ ] Auth checks present on protected routes
- [ ] Rate limiting considered for new endpoints
- [ ] CORS policy explicitly defined for new API routes

---

## Bug Bounty

At this time, FLEETWATCH does not operate a paid bug bounty program. However, we publicly acknowledge all valid security researchers who report vulnerabilities (with their consent) in our release notes and on our Security Acknowledgments page.

---

## Contact

- **Security team** — security@fleetwatch.dev
- **PGP key** — Available at https://fleetwatch.dev/.well-known/pgp-key.asc
- **Bug tracking** — Security issues are tracked privately in our internal issue tracker
