# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x   | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

If you discover a security vulnerability in FieldCraft, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email **security@squaredr.tech** with:

1. A description of the vulnerability
2. Steps to reproduce the issue
3. The potential impact
4. Any suggested fixes (optional)

## Response Timeline

- **Acknowledgement**: Within 48 hours of receiving your report
- **Initial assessment**: Within 5 business days
- **Fix and disclosure**: We aim to release a patch within 14 days for critical issues

## Scope

This policy covers:

- `@squaredr/fieldcraft-core`
- `@squaredr/fieldcraft-react`
- `@squaredr/fieldcraft-adapters`
- `@squaredr/fieldcraft-templates-free`

## Security Considerations

FieldCraft is a client-side form engine. Key security notes:

- **No server-side data processing**: FieldCraft runs entirely in the browser. Form data is handled by your application's submit adapters.
- **XSS prevention**: All user-provided content is rendered through React's built-in escaping. Custom `dangerouslySetInnerHTML` is never used in field components.
- **Schema validation**: The `validateSchema()` function should be used to validate schemas from untrusted sources before passing them to `createEngine()`.
- **HTTP Adapter**: When using `createHttpAdapter()`, always use HTTPS endpoints and validate CORS configuration on your server.

## Best Practices

- Always validate and sanitize form submissions on your server
- Use HTTPS for all HTTP adapter endpoints
- Validate schemas from untrusted sources with `validateSchema()`
- Keep FieldCraft packages updated to the latest versions
