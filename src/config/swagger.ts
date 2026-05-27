import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PointNear API',
      version: '1.0.0',
      description: 'API REST do marketplace local PointNear com autenticação, RBAC, negócios, avaliações, favoritos e administração.',
    },
    servers: [{ url: `http://localhost:${env.PORT}`, description: 'Local' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: { email: { type: 'string', example: 'admin@pointnear.local' }, password: { type: 'string', example: 'Admin123!' } },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['CUSTOMER', 'MERCHANT'] } },
        },
        Business: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            priceRange: { type: 'string', enum: ['$', '$$', '$$$'] },
            status: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/v1/health': { get: { tags: ['Health'], responses: { '200': { description: 'API operacional' } } } },
      '/api/v1/auth/register': { post: { tags: ['Auth'], requestBody: { required: true }, responses: { '201': { description: 'Usuário criado' } } } },
      '/api/v1/auth/login': { post: { tags: ['Auth'], requestBody: { required: true }, responses: { '200': { description: 'Login realizado' } } } },
      '/api/v1/auth/me': { get: { tags: ['Auth'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'Usuário autenticado' } } } },
      '/api/v1/categories': { get: { tags: ['Categories'], responses: { '200': { description: 'Lista categorias' } } } },
      '/api/v1/businesses': { get: { tags: ['Businesses'], parameters: [{ name: 'q', in: 'query' }, { name: 'local', in: 'query' }, { name: 'categoria', in: 'query' }, { name: 'featured', in: 'query' }], responses: { '200': { description: 'Lista negócios aprovados' } } }, post: { tags: ['Businesses'], responses: { '201': { description: 'Cria negócio pendente' } } } },
      '/api/v1/businesses/{id}': { get: { tags: ['Businesses'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Detalhe do negócio' }, '404': { description: 'Não encontrado' } } } },
      '/api/v1/merchant/dashboard': { get: { tags: ['Merchant'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'Dashboard comerciante' } } } },
      '/api/v1/admin/dashboard': { get: { tags: ['Admin'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'Dashboard administrativo' } } } },
    },
  },
  apis: [],
});
