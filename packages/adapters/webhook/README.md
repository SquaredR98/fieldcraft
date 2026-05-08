# @squaredr/fieldcraft-webhook

Webhook delivery adapter for [FieldCraft](https://squaredr.tech/products/fieldcraft). POST form responses to any endpoint with HMAC-SHA256 signing and configurable retry with exponential backoff.

## Install

```bash
npm install @squaredr/fieldcraft-webhook
```

**Peer dependency:** Requires `@squaredr/fieldcraft-core` v1.0.0+.

## Quick Start

```typescript
import { createWebhookAdapter } from '@squaredr/fieldcraft-webhook'

const adapter = createWebhookAdapter({
  url: 'https://api.example.com/form-submissions',
  secret: process.env.WEBHOOK_SECRET,
})
```

Pass the adapter to your form engine's `onSubmit`:

```tsx
<FormEngineRenderer
  schema={schema}
  onSubmit={(response) => adapter.submit(response)}
/>
```

## HMAC-SHA256 Signing

Every request includes an `X-FormEngine-Signature` header with a SHA256 HMAC of the payload body. Verify it on your server:

```typescript
import { signPayload } from '@squaredr/fieldcraft-webhook'

// On your server:
const expected = signPayload(requestBody, secret)
const received = req.headers['x-formengine-signature'].replace('sha256=', '')

if (expected !== received) {
  return res.status(401).json({ error: 'Invalid signature' })
}
```

## Retries

The adapter retries failed requests with configurable backoff:

```typescript
const adapter = createWebhookAdapter({
  url: 'https://api.example.com/submissions',
  secret: process.env.WEBHOOK_SECRET,
  retries: 5,              // max retry attempts (default: 3)
  retryDelayMs: 2000,      // base delay in ms (default: 1000)
  retryBackoff: 'exponential', // 'linear' or 'exponential' (default: 'exponential')
  timeoutMs: 15000,        // request timeout (default: 30000)
  onRetry: (attempt, delay) => {
    console.log(`Retry ${attempt}, waiting ${delay}ms`)
  },
})
```

## Payload Transform

Customize the request body shape before sending:

```typescript
const adapter = createWebhookAdapter({
  url: 'https://api.example.com/submissions',
  secret: process.env.WEBHOOK_SECRET,
  transform: (response) => ({
    form_id: response.schemaId,
    answers: response.values,
    submitted: response.submittedAt,
  }),
})
```

## Custom Headers

```typescript
const adapter = createWebhookAdapter({
  url: 'https://api.example.com/submissions',
  secret: process.env.WEBHOOK_SECRET,
  headers: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
    'X-Custom-Header': 'value',
  },
})
```

## Configuration

| Option | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Webhook endpoint URL |
| `secret` | `string` | Yes | HMAC-SHA256 signing secret |
| `retries` | `number` | No | Max retry attempts (default: 3) |
| `retryDelayMs` | `number` | No | Base delay in ms (default: 1000) |
| `retryBackoff` | `'linear' \| 'exponential'` | No | Backoff strategy (default: `'exponential'`) |
| `timeoutMs` | `number` | No | Request timeout in ms (default: 30000) |
| `headers` | `Record<string, string>` | No | Custom HTTP headers |
| `transform` | `(response) => any` | No | Payload transform function |
| `onSuccess` | `(response, status) => void` | No | Callback after successful delivery |
| `onError` | `(error, attempt) => void` | No | Callback on delivery failure |
| `onRetry` | `(attempt, delay) => void` | No | Callback before each retry |

## Request Headers

Every webhook request includes:

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `X-FormEngine-Signature` | `sha256={hmac}` |
| `X-FormEngine-Event` | `submit` |
| `X-FormEngine-Timestamp` | ISO 8601 timestamp |

## License

MIT
