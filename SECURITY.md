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

FieldCraft is maintained by one person in their spare time, so I can't offer a
guaranteed response window. I read security reports as a priority over other
issues and will acknowledge yours as soon as I reasonably can. If a report is
serious and I can't get to it quickly, I'd rather tell you that than leave you
waiting.

If you don't hear back within a couple of weeks, please follow up — it means
the mail was missed, not ignored.

## Scope

This policy covers:

- `@squaredr/fieldcraft-core`
- `@squaredr/fieldcraft-react`
- `@squaredr/fieldcraft-adapters`
- `@squaredr/fieldcraft-templates`

## Security Considerations

FieldCraft is a client-side form engine. Key security notes:

- **No server-side data processing**: FieldCraft runs entirely in the browser. Form data is handled by your application's submit adapters.
- **XSS prevention**: User-provided values are rendered through React's built-in escaping. The one exception is `RichTextField`, which renders author-supplied HTML via `dangerouslySetInnerHTML` after sanitising it with [DOMPurify](https://github.com/cure53/DOMPurify) against an allow-list of tags and attributes. If you render rich text from untrusted authors, treat that sanitiser as your boundary and review its configuration in `RichTextField.tsx`.
- **Schema validation**: The `validateSchema()` function should be used to validate schemas from untrusted sources before passing them to `createEngine()`.
- **HTTP Adapter**: When using `createHttpAdapter()`, always use HTTPS endpoints and validate CORS configuration on your server.

## Best Practices

- Always validate and sanitize form submissions on your server
- Use HTTPS for all HTTP adapter endpoints
- Validate schemas from untrusted sources with `validateSchema()`
- Keep FieldCraft packages updated to the latest versions
