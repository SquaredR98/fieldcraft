# FormEngine

A powerful, type-safe form engine for React with JSON schema-driven forms, multi-step flows, conditional logic, and full backend integration.

[![Tests](https://img.shields.io/badge/tests-414%20passing-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![NestJS](https://img.shields.io/badge/NestJS-10.4-red)]()

---

## 🚀 Quick Start

```bash
# Clone and install
pnpm install

# Start demo (Next.js + NestJS API)
cd apps/demo-simple && pnpm dev      # Frontend: http://localhost:3000
cd apps/api-nestjs && pnpm dev       # API: http://localhost:4000

# Or run everything with Turbo
pnpm dev
```

**See:** [guides/QUICK-START.md](guides/QUICK-START.md) for detailed setup

---

## 📦 Packages

### Core Packages
- **`@squaredr/formengine-core`** - Pure TypeScript form engine (212 tests ✅)
- **`@squaredr/formengine-react`** - React renderer with 35+ components (74 tests ✅)

### Storage Adapters
- **`@squaredr/formengine-supabase`** - Supabase integration (9 tests ✅)
- **`@squaredr/formengine-postgres`** - Postgres adapter (8 tests ✅)
- **`@squaredr/formengine-webhook`** - Webhook delivery (11 tests ✅)

### Coming Soon
- **`@squaredr/formengine-cloud`** - Managed backend adapter
- **`@squaredr/formengine-analytics`** - Form analytics & insights
- **`@squaredr/formengine-premium`** - Advanced field components

---

## 🏗️ Apps

### Production
- **`apps/api-nestjs`** - Production NestJS API with TypeORM
  - Multi-tenant architecture (API key-based)
  - AES-256-GCM encryption
  - Webhook delivery with retry
  - Swagger docs at `/api/docs`
  - [Setup Guide](apps/api-nestjs/SETUP.md)

### Demos
- **`apps/demo-simple`** - Next.js demo with full backend integration
  - Contact form example
  - Response management
  - CSV export
  - Draft persistence

---

## ✨ Features

### Form Engine
- ✅ JSON schema-driven forms
- ✅ 35+ field components (shadcn/ui)
- ✅ Multi-step forms with progress
- ✅ Conditional logic (show/hide fields)
- ✅ Real-time validation
- ✅ Draft auto-save
- ✅ Theme system (Tailwind CSS)
- ✅ Full TypeScript support

### Backend API
- ✅ Multi-tenant data isolation
- ✅ Response encryption at rest
- ✅ Schema versioning (semver)
- ✅ Webhook system with signing
- ✅ CSV export with decryption
- ✅ Draft expiration (7 days)
- ✅ OpenAPI/Swagger docs

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [QUICK-START.md](guides/QUICK-START.md) | Get started in 5 minutes |
| [NESTJS-API-REBUILD.md](guides/NESTJS-API-REBUILD.md) | Complete API architecture |
| [API-QUICK-START.md](guides/API-QUICK-START.md) | API usage examples |
| [M2-IMPLEMENTATION-GUIDE.md](guides/M2-IMPLEMENTATION-GUIDE.md) | Backend guide |
| [STATUS.md](STATUS.md) | Project status & progress |

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific package
cd packages/core && pnpm test
cd packages/react && pnpm test

# Coverage
pnpm test:cov
```

**Test Status:** 414/414 passing ✅
- Core: 212 tests
- React: 74 tests
- Adapters: 28 tests
- Reference API: 100 tests

---

## 🏛️ Architecture

```
questionnaire/
├── packages/
│   ├── core/              # Form engine (pure TS)
│   ├── react/             # React renderer + components
│   └── adapters/
│       ├── supabase/      # Supabase adapter
│       ├── postgres/      # Postgres adapter
│       └── webhook/       # Webhook adapter
├── apps/
│   ├── api-nestjs/        # Production API (NestJS + TypeORM)
│   └── demo-simple/       # Next.js demo app
├── tooling/
│   ├── tsconfig/          # Shared TypeScript configs
│   └── eslint-config/     # Shared ESLint rules
├── docs/                  # PRD & specifications
└── guides/                # Implementation guides
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.5** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Zod** - Schema validation

### Backend
- **NestJS 10.4** - API framework
- **TypeORM 0.3** - ORM
- **PostgreSQL 14+** - Database
- **Node.js 20+** - Runtime

### Build Tools
- **pnpm** - Package manager
- **Turborepo** - Monorepo orchestration
- **tsup** - TypeScript bundler
- **Vite** - Dev server
- **Vitest** - Test runner

---

## 🚦 Development

### Prerequisites
- Node.js 20+
- pnpm 9.12+
- PostgreSQL 14+

### Setup
```bash
# Install dependencies
pnpm install

# Setup NestJS API
cd apps/api-nestjs
pnpm setup  # Generates keys + .env.local
pnpm dev    # Auto-creates tables

# Setup demo
cd apps/demo-simple
cp .env.example .env.local
pnpm dev
```

### Build All Packages
```bash
pnpm build
```

### Run Tests
```bash
pnpm test
```

---

## 📊 Project Status

- ✅ **M1 (Core + React):** 100% Complete
- ✅ **M2 (Backend + Adapters):** 100% Complete
- 🔄 **M3 (Visual Testing):** 60% Complete
- ✅ **NestJS API:** 100% Complete

See [STATUS.md](STATUS.md) for detailed progress.

---

## 🎯 Roadmap

### Q1 2026
- [x] Core engine with validation
- [x] React renderer with 35+ components
- [x] Storage adapters (Supabase, Postgres, Webhook)
- [x] NestJS production API
- [ ] Dashboard UI (`apps/web`)
- [ ] API key management UI
- [ ] Analytics dashboard

### Q2 2026
- [ ] `@squaredr/formengine-cloud` adapter
- [ ] Stripe billing integration
- [ ] Premium field components
- [ ] Form builder UI
- [ ] E2E testing suite
- [ ] Production deployment

---

## 📝 License

MIT

---

## 🤝 Contributing

This is currently a private project. Contributions are welcome by invitation.

---

## 📧 Contact

For questions or support, please open an issue.

---

**Built with ❤️ using NestJS, React, and TypeScript**
