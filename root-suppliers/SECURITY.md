# Security Policy

## Reporting a Vulnerability

Please report any security vulnerabilities to the development team. We take all security reports seriously.

## Security Measures

This project implements several security best practices to ensure the safety of user data and the integrity of the application.

### 1. Authentication & Authorization
- **JWT-based Authentication**: We use JSON Web Tokens (JWT) for stateless authentication.
- **Strict Role-Based Access Control (RBAC)**: APIs are protected with `verifyAuth` and `verifyAdmin` middleware to ensure only authorized users can access sensitive endpoints.
- **Secure Secrets**: The application strictly requires `NEXTAUTH_SECRET` to be defined in the environment. It will fail to start if this key is missing, preventing insecure default fallbacks.

### 2. Network Security
- **Global Security Headers**: We enforce the following headers on all responses via Middleware:
  - `Strict-Transport-Security`: HSTS is enabled for 2 years to enforce HTTPS.
  - `X-Frame-Options`: set to `DENY` to prevent clickjacking.
  - `X-Content-Type-Options`: set to `nosniff` to prevent MIME-type sniffing.
  - `Referrer-Policy`: set to `strict-origin-when-cross-origin`.
  - `Permissions-Policy`: Restricts access to sensitive browser features (camera, mic, etc.).

### 3. API Security
- **Rate Limiting**: Login endpoints (`/api/auth/login`) are rate-limited to prevent brute-force attacks (Default: 10 attempts per minute per IP).
- **CSRF Token Generation**: Middleware generates and sets a `csrf-token` cookie for mutation protection.
- **Input Validation**: All API inputs are validated using `Zod` schemas to prevent malformed data and injection attacks.
- **HTML Sanitization**: User-generated content (like product descriptions) is sanitized using `isomorphic-dompurify` to prevent Cross-Site Scripting (XSS).

### 4. Observability & Quality
- **Structured Logging**: We use `Pino` for high-performance JSON logging. This ensures that errors are logged with full context in production environments, making it easier to monitor and debug without leaking sensitive stack traces to the client.
- **Environment Validation**: Critical configuration is validated at startup using Zod, ensuring the application cannot run with invalid or missing secrets.

### 5. Database Security
- **NoSQL Injection Protection**: We use Mongoose's ODM features which separate data from commands.
- **Password Hashing**: Passwords are hashed using `bcryptjs` with a salt factor of 12.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| v0.1.x  | :white_check_mark: |
