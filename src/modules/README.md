# Feature modules

Create one folder per business feature. A typical module contains:

```text
feature/
├── repositories/
│   ├── feature.repository.ts
│   ├── in-memory-feature.repository.ts
│   └── prisma-feature.repository.ts
├── feature.controller.ts
├── feature.routes.ts
├── feature.service.ts
├── feature.types.ts
└── feature.validation.ts
```

Keep HTTP handling in controllers, business rules in services, and persistence in repositories.
