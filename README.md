# PointNear Backend

API REST profissional para o PointNear, uma plataforma de descoberta e gestão de estabelecimentos locais.

## Stack

- Node.js + Express.js
- TypeScript
- TypeORM + PostgreSQL
- Zod para validação
- JWT para autenticação
- Swagger/OpenAPI
- CORS, dotenv, ESLint e Prettier

## Estrutura

```text
src/
  config/          Configurações de ambiente e Swagger
  controllers/     Entrada HTTP e orquestração de responses
  database/        DataSource TypeORM e seed inicial
  entities/        Entidades persistidas no PostgreSQL
  middlewares/     Autenticação, validação e tratamento de erros
  repositories/    Acesso a dados
  routes/          Rotas Express
  schemas/         Schemas Zod
  services/        Regras de negócio
  utils/           Helpers compartilhados
```

## Configuração

```bash
npm install
cp .env.example .env
npm run dev
```

Crie um banco PostgreSQL com o nome configurado em `DATABASE_NAME`. Para desenvolvimento, `DATABASE_SYNCHRONIZE=true` cria as tabelas automaticamente.

## Scripts

- `npm run dev` — inicia em modo desenvolvimento
- `npm run build` — compila TypeScript
- `npm start` — executa build em produção
- `npm run lint` — valida padrões de código
- `npm run format` — formata arquivos TypeScript
- `npm run seed` — cria categorias e usuário admin inicial

## Endpoints principais

Base local: `http://localhost:3333/api`

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /categories`
- `POST /categories` com Bearer Token
- `PUT /categories/:id` com Bearer Token
- `DELETE /categories/:id` com Bearer Token
- `GET /establishments?search=&categoryId=&page=1&limit=12`
- `GET /establishments/:id`
- `POST /establishments` com Bearer Token
- `PUT /establishments/:id` com Bearer Token
- `DELETE /establishments/:id` com Bearer Token
- `POST /establishments/images/upload` com Bearer Token e multipart `image`

## Swagger

A documentação interativa fica disponível em:

```text
http://localhost:3333/docs
```

## Exemplo de login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pointnear.local","password":"PointNear@123"}'
```

## Próximos passos sugeridos

- Criar migrations versionadas para produção.
- Adicionar testes automatizados de services e controllers.
- Implementar upload real em storage externo.
- Incluir geocoding e busca por distância.
- Evoluir RBAC para permissões por equipe e estabelecimento.
