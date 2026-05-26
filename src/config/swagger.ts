import swaggerJSDoc from 'swagger-jsdoc';
import { environment } from './environment';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'PointNear API', version: '1.0.0', description: 'API para descoberta e gestão de estabelecimentos locais.' },
    servers: [{ url: `${environment.API_BASE_URL}/api`, description: 'Servidor local' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    paths: {
      '/health': { get: { summary: 'Verifica disponibilidade da API', responses: { 200: { description: 'API online' } } } },
      '/auth/register': { post: { summary: 'Cadastra usuário proprietário', responses: { 201: { description: 'Usuário cadastrado' } } } },
      '/auth/login': { post: { summary: 'Autentica usuário', responses: { 200: { description: 'Token JWT retornado' } } } },
      '/categories': { get: { summary: 'Lista categorias' }, post: { summary: 'Cria categoria', security: [{ bearerAuth: [] }] } },
      '/establishments': { get: { summary: 'Lista estabelecimentos com filtros' }, post: { summary: 'Cria estabelecimento', security: [{ bearerAuth: [] }] } },
      '/establishments/{id}': { get: { summary: 'Detalha estabelecimento' }, put: { summary: 'Atualiza estabelecimento', security: [{ bearerAuth: [] }] }, delete: { summary: 'Remove estabelecimento', security: [{ bearerAuth: [] }] } },
    },
  },
  apis: ['./src/routes/*.ts'],
});
