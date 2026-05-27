# PointNear Backend

API REST do PointNear construída com Node.js, Express, TypeScript, PostgreSQL, Prisma e Swagger.

## Recursos

- Autenticação com JWT e refresh token
- RBAC com perfis `CUSTOMER`, `MERCHANT` e `ADMIN`
- CRUD e busca de negócios locais
- Categorias, avaliações, comentários, favoritos e auditoria
- Dashboard de comerciante e administrativo
- Seeds Prisma com os dados mockados do frontend
- Swagger em `/api/docs`
- Docker e Docker Compose

## Setup local

```bash
npm install
copy .env.example .env
npx prisma generate
```

Suba o PostgreSQL:

```bash
docker compose up -d postgres
```

Crie as tabelas e popule dados iniciais:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

Inicie a API:

```bash
npm run dev
```

- API: `http://localhost:3333/api/v1`
- Swagger: `http://localhost:3333/api/docs`

## Credenciais demo

- Admin: `admin@pointnear.local` / `Admin123!`
- Comerciante: `merchant@pointnear.local` / `Merchant123!`
- Cliente: `cliente@pointnear.local` / `Cliente123!`

## Scripts

- `npm run dev` — inicia a API em modo desenvolvimento
- `npm run build` — compila TypeScript
- `npm run start` — executa build compilado
- `npm run lint` — valida código com ESLint
- `npm run format` — formata código
- `npm run prisma:migrate` — executa migrations em dev
- `npm run prisma:seed` — popula dados iniciais

## Variáveis de ambiente

Veja `.env.example`.
