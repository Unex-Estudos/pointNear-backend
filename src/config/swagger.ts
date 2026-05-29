import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const errorResponse = { $ref: '#/components/schemas/ErrorResponse' };
const validationErrorResponse = { $ref: '#/components/schemas/ValidationErrorResponse' };
const bearerAuth = [{ bearerAuth: [] }];
const idParam = (name = 'id', description = 'Identificador UUID do recurso.') => ({ name, in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description });
const jsonBody = (schema: object, description: string) => ({ required: true, description, content: { 'application/json': { schema } } });
const dataResponse = (description: string, schema: object) => ({ description, content: { 'application/json': { schema: { type: 'object', properties: { data: schema } } } } });

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PointNear API',
      version: '1.0.0',
      description: 'API REST do marketplace local PointNear com autenticação JWT, controle de acesso por perfil, cadastro de negócios, avaliações, favoritos e painel administrativo.',
    },
    servers: [{ url: '/', description: 'Servidor atual' }],
    tags: [
      { name: 'Health', description: 'Monitoramento básico da API e do banco de dados.' },
      { name: 'Auth', description: 'Cadastro, login, renovação de token, logout e sessão do usuário.' },
      { name: 'Users', description: 'Perfil do usuário autenticado.' },
      { name: 'Favorites', description: 'Gerenciamento dos negócios favoritos do usuário autenticado.' },
      { name: 'Categories', description: 'Consulta pública das categorias de negócios.' },
      { name: 'Businesses', description: 'Consulta pública e solicitação de cadastro de negócios.' },
      { name: 'Reviews', description: 'CRUD de avaliações vinculadas a um negócio.' },
      { name: 'Merchant', description: 'Operações do comerciante sobre seus próprios negócios.' },
      { name: 'Admin - Dashboard', description: 'Indicadores gerais do painel administrativo.' },
      { name: 'Admin - Users', description: 'CRUD administrativo de usuários.' },
      { name: 'Admin - Businesses', description: 'Moderação administrativa de negócios.' },
      { name: 'Admin - Categories', description: 'CRUD administrativo de categorias.' },
      { name: 'Admin - Reviews', description: 'Moderação administrativa de avaliações.' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token JWT informado no formato: Bearer <token>.' },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: { error: { type: 'object', properties: { message: { type: 'string', example: 'Recurso não encontrado.' }, details: { nullable: true } } } },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: { error: { type: 'object', properties: { message: { type: 'string', example: 'Dados inválidos.' }, details: { type: 'array', items: { type: 'object' } } } } },
        },
        PaginationMeta: {
          type: 'object',
          properties: { page: { type: 'integer', example: 1 }, limit: { type: 'integer', example: 12 }, total: { type: 'integer', example: 42 }, totalPages: { type: 'integer', example: 4 } },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@email.com' },
            role: { type: 'string', enum: ['CUSTOMER', 'MERCHANT', 'ADMIN'] },
            phone: { type: 'string', nullable: true, example: '(11) 99999-9999' },
            avatarUrl: { type: 'string', nullable: true, example: 'https://example.com/avatar.png' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: { name: { type: 'string', example: 'Maria Silva' }, email: { type: 'string', format: 'email', example: 'maria@email.com' }, password: { type: 'string', minLength: 8, example: 'Senha123!' }, role: { type: 'string', enum: ['CUSTOMER', 'MERCHANT'], example: 'CUSTOMER' } },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: { email: { type: 'string', format: 'email', example: 'admin@pointnear.local' }, password: { type: 'string', example: 'Admin123!' } },
        },
        RefreshRequest: { type: 'object', properties: { refreshToken: { type: 'string', description: 'Token de renovação quando não enviado por cookie.' } } },
        AuthResponse: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' }, accessToken: { type: 'string' }, refreshToken: { type: 'string' } } },
        UpdateMeRequest: { type: 'object', properties: { name: { type: 'string' }, phone: { type: 'string', nullable: true }, avatarUrl: { type: 'string', nullable: true } } },
        CreateAdminUserRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 }, role: { type: 'string', enum: ['CUSTOMER', 'MERCHANT', 'ADMIN'], default: 'CUSTOMER' }, phone: { type: 'string', nullable: true }, avatarUrl: { type: 'string', nullable: true } },
        },
        UpdateAdminUserRequest: { type: 'object', properties: { name: { type: 'string' }, role: { type: 'string', enum: ['CUSTOMER', 'MERCHANT', 'ADMIN'] }, phone: { type: 'string', nullable: true }, avatarUrl: { type: 'string', nullable: true } } },
        Category: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, label: { type: 'string', example: 'Restaurantes' }, slug: { type: 'string', example: 'restaurantes' }, iconName: { type: 'string', example: 'utensils' }, color: { type: 'string', example: '#f97316' }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } },
        CreateCategoryRequest: { type: 'object', required: ['label', 'iconName', 'color'], properties: { label: { type: 'string' }, slug: { type: 'string' }, iconName: { type: 'string' }, color: { type: 'string' } } },
        UpdateCategoryRequest: { type: 'object', properties: { label: { type: 'string' }, slug: { type: 'string' }, iconName: { type: 'string' }, color: { type: 'string' } } },
        BusinessHour: { type: 'object', properties: { open: { type: 'string', example: '09:00' }, close: { type: 'string', example: '18:00' }, closed: { type: 'boolean', example: false } } },
        BusinessService: { type: 'object', properties: { name: { type: 'string', example: 'Corte masculino' }, price: { type: 'number', example: 35 }, description: { type: 'string', nullable: true } } },
        BusinessPayload: {
          type: 'object',
          required: ['name', 'description', 'category', 'address'],
          properties: {
            name: { type: 'string', example: 'Café Central' },
            description: { type: 'string', example: 'Cafeteria artesanal no centro da cidade.' },
            category: { type: 'string', description: 'Slug ou identificador da categoria.', example: 'cafeterias' },
            subcategories: { type: 'array', items: { type: 'string' }, example: ['café', 'doces'] },
            address: { type: 'object', required: ['street', 'number', 'neighborhood', 'city', 'state', 'zip'], properties: { street: { type: 'string' }, number: { type: 'string' }, neighborhood: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' }, zip: { type: 'string' }, lat: { type: 'number', nullable: true }, lng: { type: 'number', nullable: true } } },
            contact: { type: 'object', properties: { phone: { type: 'string', nullable: true }, whatsapp: { type: 'string', nullable: true }, instagram: { type: 'string', nullable: true }, email: { type: 'string', format: 'email', nullable: true } } },
            hours: { type: 'object', additionalProperties: { $ref: '#/components/schemas/BusinessHour' } },
            photos: { type: 'array', items: { type: 'string', format: 'uri' } },
            services: { type: 'array', items: { $ref: '#/components/schemas/BusinessService' } },
            priceRange: { type: 'string', enum: ['$', '$$', '$$$'], default: '$$' },
          },
        },
        Business: {
          allOf: [{ $ref: '#/components/schemas/BusinessPayload' }, { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, slug: { type: 'string' }, status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'] }, featured: { type: 'boolean' }, rating: { type: 'number', example: 4.7 }, reviewCount: { type: 'integer', example: 18 }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } }],
        },
        Review: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, rating: { type: 'integer', minimum: 1, maximum: 5 }, comment: { type: 'string' }, authorName: { type: 'string', nullable: true }, user: { $ref: '#/components/schemas/User' }, business: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } },
        CreateReviewRequest: { type: 'object', required: ['rating', 'comment'], properties: { authorName: { type: 'string' }, rating: { type: 'integer', minimum: 1, maximum: 5 }, comment: { type: 'string', minLength: 3 } } },
        UpdateReviewRequest: { type: 'object', properties: { rating: { type: 'integer', minimum: 1, maximum: 5 }, comment: { type: 'string', minLength: 3 } } },
        BusinessStatusRequest: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'] } } },
        BusinessFeaturedRequest: { type: 'object', required: ['featured'], properties: { featured: { type: 'boolean' } } },
      },
    },
    paths: {
      '/api/v1/health': { get: { tags: ['Health'], summary: 'Verificar saúde da API', description: 'Confirma se a API está respondendo e se a conexão com o banco de dados está operacional.', responses: { '200': dataResponse('API e banco operacionais.', { type: 'object', properties: { status: { type: 'string' }, database: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' } } }), '500': { description: 'Falha interna.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/auth/register': { post: { tags: ['Auth'], summary: 'Cadastrar usuário', description: 'Cria uma nova conta de cliente ou comerciante e retorna os dados de autenticação.', requestBody: jsonBody({ $ref: '#/components/schemas/RegisterRequest' }, 'Dados do novo usuário.'), responses: { '201': dataResponse('Usuário cadastrado.', { $ref: '#/components/schemas/AuthResponse' }), '400': { description: 'Dados inválidos.', content: { 'application/json': { schema: validationErrorResponse } } }, '409': { description: 'E-mail já cadastrado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/auth/login': { post: { tags: ['Auth'], summary: 'Entrar no sistema', description: 'Autentica o usuário por e-mail e senha e retorna tokens de acesso.', requestBody: jsonBody({ $ref: '#/components/schemas/LoginRequest' }, 'Credenciais do usuário.'), responses: { '200': dataResponse('Login realizado.', { $ref: '#/components/schemas/AuthResponse' }), '401': { description: 'Credenciais inválidas.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/auth/refresh': { post: { tags: ['Auth'], summary: 'Renovar token', description: 'Gera um novo access token usando refresh token válido.', requestBody: jsonBody({ $ref: '#/components/schemas/RefreshRequest' }, 'Refresh token opcional quando não enviado por cookie.'), responses: { '200': dataResponse('Token renovado.', { type: 'object', properties: { accessToken: { type: 'string' } } }), '401': { description: 'Refresh token inválido ou expirado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/auth/logout': { post: { tags: ['Auth'], summary: 'Sair do sistema', description: 'Revoga a sessão atual do usuário.', security: bearerAuth, responses: { '200': dataResponse('Logout realizado.', { type: 'object', properties: { message: { type: 'string' } } }), '401': { description: 'Token ausente ou inválido.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/auth/me': { get: { tags: ['Auth'], summary: 'Obter sessão atual', description: 'Retorna os dados do usuário autenticado pelo token JWT.', security: bearerAuth, responses: { '200': dataResponse('Usuário autenticado.', { $ref: '#/components/schemas/User' }), '401': { description: 'Token ausente ou inválido.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/users/me': { get: { tags: ['Users'], summary: 'Consultar meu perfil', security: bearerAuth, responses: { '200': dataResponse('Perfil retornado.', { $ref: '#/components/schemas/User' }), '401': { description: 'Não autenticado.', content: { 'application/json': { schema: errorResponse } } } } }, patch: { tags: ['Users'], summary: 'Atualizar meu perfil', description: 'Atualiza dados básicos do usuário autenticado.', security: bearerAuth, requestBody: jsonBody({ $ref: '#/components/schemas/UpdateMeRequest' }, 'Campos do perfil a atualizar.'), responses: { '200': dataResponse('Perfil atualizado.', { $ref: '#/components/schemas/User' }), '400': { description: 'Dados inválidos.', content: { 'application/json': { schema: validationErrorResponse } } } } } },
      '/api/v1/users/me/favorites': { get: { tags: ['Favorites'], summary: 'Listar meus favoritos', security: bearerAuth, responses: { '200': dataResponse('Favoritos retornados.', { type: 'array', items: { $ref: '#/components/schemas/Business' } }), '401': { description: 'Não autenticado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/users/me/favorites/{businessId}': { post: { tags: ['Favorites'], summary: 'Adicionar negócio aos favoritos', security: bearerAuth, parameters: [idParam('businessId', 'ID do negócio a favoritar.')], responses: { '201': dataResponse('Favorito criado.', { type: 'object' }), '404': { description: 'Negócio não encontrado.', content: { 'application/json': { schema: errorResponse } } } } }, delete: { tags: ['Favorites'], summary: 'Remover negócio dos favoritos', security: bearerAuth, parameters: [idParam('businessId', 'ID do negócio a remover dos favoritos.')], responses: { '204': { description: 'Favorito removido.' }, '404': { description: 'Favorito ou negócio não encontrado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/categories': { get: { tags: ['Categories'], summary: 'Listar categorias públicas', description: 'Retorna categorias disponíveis para navegação e cadastro de negócios.', responses: { '200': dataResponse('Categorias retornadas.', { type: 'array', items: { $ref: '#/components/schemas/Category' } }) } } },
      '/api/v1/businesses': { get: { tags: ['Businesses'], summary: 'Listar negócios aprovados', description: 'Lista negócios públicos com filtros de busca, localização, categoria, destaque, avaliação e paginação.', parameters: [{ name: 'q', in: 'query', schema: { type: 'string' }, description: 'Texto de busca.' }, { name: 'local', in: 'query', schema: { type: 'string' }, description: 'Cidade, bairro ou região.' }, { name: 'categoria', in: 'query', schema: { type: 'string' }, description: 'Categoria ou lista de categorias.' }, { name: 'openNow', in: 'query', schema: { type: 'boolean' }, description: 'Filtra negócios abertos agora.' }, { name: 'minRating', in: 'query', schema: { type: 'number' }, description: 'Avaliação mínima.' }, { name: 'sort', in: 'query', schema: { type: 'string', enum: ['featured', 'relevance', 'rating', 'reviews', 'newest'] }, description: 'Ordenação dos resultados.' }, { name: 'featured', in: 'query', schema: { type: 'boolean' }, description: 'Filtra negócios destacados.' }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { '200': dataResponse('Negócios retornados.', { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/Business' } }, meta: { $ref: '#/components/schemas/PaginationMeta' } } }) } }, post: { tags: ['Businesses'], summary: 'Solicitar cadastro de negócio', description: 'Cria um negócio pendente para posterior moderação. Pode ser usado como sugestão pública ou por usuário autenticado.', requestBody: jsonBody({ $ref: '#/components/schemas/BusinessPayload' }, 'Dados completos do negócio.'), responses: { '201': dataResponse('Negócio criado com status pendente.', { $ref: '#/components/schemas/Business' }), '400': { description: 'Dados inválidos.', content: { 'application/json': { schema: validationErrorResponse } } } } } },
      '/api/v1/businesses/{id}': { get: { tags: ['Businesses'], summary: 'Detalhar negócio', parameters: [idParam('id', 'ID do negócio.')], responses: { '200': dataResponse('Negócio encontrado.', { $ref: '#/components/schemas/Business' }), '404': { description: 'Negócio não encontrado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/businesses/{businessId}/reviews': { get: { tags: ['Reviews'], summary: 'Listar avaliações do negócio', parameters: [idParam('businessId', 'ID do negócio.')], responses: { '200': dataResponse('Avaliações retornadas.', { type: 'array', items: { $ref: '#/components/schemas/Review' } }) } }, post: { tags: ['Reviews'], summary: 'Criar avaliação', description: 'Cria uma avaliação vinculada a um negócio. Usuários autenticados ficam associados à avaliação.', security: bearerAuth, parameters: [idParam('businessId', 'ID do negócio avaliado.')], requestBody: jsonBody({ $ref: '#/components/schemas/CreateReviewRequest' }, 'Dados da avaliação.'), responses: { '201': dataResponse('Avaliação criada.', { $ref: '#/components/schemas/Review' }), '400': { description: 'Dados inválidos.', content: { 'application/json': { schema: validationErrorResponse } } }, '429': { description: 'Limite de criação de avaliações atingido.' } } } },
      '/api/v1/businesses/{businessId}/reviews/{reviewId}': { patch: { tags: ['Reviews'], summary: 'Atualizar avaliação', security: bearerAuth, parameters: [idParam('businessId', 'ID do negócio.'), idParam('reviewId', 'ID da avaliação.')], requestBody: jsonBody({ $ref: '#/components/schemas/UpdateReviewRequest' }, 'Campos da avaliação a atualizar.'), responses: { '200': dataResponse('Avaliação atualizada.', { $ref: '#/components/schemas/Review' }), '403': { description: 'Usuário sem permissão para alterar esta avaliação.', content: { 'application/json': { schema: errorResponse } } }, '404': { description: 'Avaliação não encontrada.', content: { 'application/json': { schema: errorResponse } } } } }, delete: { tags: ['Reviews'], summary: 'Excluir avaliação', security: bearerAuth, parameters: [idParam('businessId', 'ID do negócio.'), idParam('reviewId', 'ID da avaliação.')], responses: { '204': { description: 'Avaliação excluída.' }, '403': { description: 'Usuário sem permissão para excluir esta avaliação.', content: { 'application/json': { schema: errorResponse } } }, '404': { description: 'Avaliação não encontrada.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/merchant/dashboard': { get: { tags: ['Merchant'], summary: 'Dashboard do comerciante', security: bearerAuth, responses: { '200': dataResponse('Indicadores do comerciante.', { type: 'object' }), '403': { description: 'Requer perfil MERCHANT.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/merchant/businesses': { get: { tags: ['Merchant'], summary: 'Listar meus negócios', security: bearerAuth, responses: { '200': dataResponse('Negócios do comerciante.', { type: 'array', items: { $ref: '#/components/schemas/Business' } }) } }, post: { tags: ['Merchant'], summary: 'Criar meu negócio', security: bearerAuth, requestBody: jsonBody({ $ref: '#/components/schemas/BusinessPayload' }, 'Dados do negócio do comerciante.'), responses: { '201': dataResponse('Negócio criado.', { $ref: '#/components/schemas/Business' }) } } },
      '/api/v1/merchant/businesses/{id}': { patch: { tags: ['Merchant'], summary: 'Atualizar meu negócio', security: bearerAuth, parameters: [idParam('id', 'ID do negócio.')], requestBody: jsonBody({ $ref: '#/components/schemas/BusinessPayload' }, 'Campos do negócio a atualizar.'), responses: { '200': dataResponse('Negócio atualizado.', { $ref: '#/components/schemas/Business' }), '403': { description: 'Negócio não pertence ao comerciante.', content: { 'application/json': { schema: errorResponse } } } } }, delete: { tags: ['Merchant'], summary: 'Excluir meu negócio', security: bearerAuth, parameters: [idParam('id', 'ID do negócio.')], responses: { '204': { description: 'Negócio excluído.' }, '403': { description: 'Negócio não pertence ao comerciante.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/admin/dashboard': { get: { tags: ['Admin - Dashboard'], summary: 'Dashboard administrativo', security: bearerAuth, responses: { '200': dataResponse('Indicadores administrativos.', { type: 'object' }), '403': { description: 'Requer perfil ADMIN.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/admin/users': { get: { tags: ['Admin - Users'], summary: 'Listar usuários', description: 'Retorna todos os usuários cadastrados sem expor hashes de senha.', security: bearerAuth, responses: { '200': dataResponse('Usuários retornados.', { type: 'array', items: { $ref: '#/components/schemas/User' } }) } }, post: { tags: ['Admin - Users'], summary: 'Criar usuário', description: 'Cria um usuário de qualquer perfil a partir do painel administrativo.', security: bearerAuth, requestBody: jsonBody({ $ref: '#/components/schemas/CreateAdminUserRequest' }, 'Dados do usuário a criar.'), responses: { '201': dataResponse('Usuário criado.', { $ref: '#/components/schemas/User' }), '409': { description: 'E-mail já cadastrado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/admin/users/{id}': { get: { tags: ['Admin - Users'], summary: 'Buscar usuário por ID', security: bearerAuth, parameters: [idParam('id', 'ID do usuário.')], responses: { '200': dataResponse('Usuário encontrado.', { $ref: '#/components/schemas/User' }), '404': { description: 'Usuário não encontrado.', content: { 'application/json': { schema: errorResponse } } } } }, patch: { tags: ['Admin - Users'], summary: 'Atualizar usuário', description: 'Atualiza dados administrativos do usuário. O admin não pode remover o próprio acesso administrativo.', security: bearerAuth, parameters: [idParam('id', 'ID do usuário.')], requestBody: jsonBody({ $ref: '#/components/schemas/UpdateAdminUserRequest' }, 'Campos do usuário a atualizar.'), responses: { '200': dataResponse('Usuário atualizado.', { $ref: '#/components/schemas/User' }), '400': { description: 'Dados inválidos ou alteração bloqueada.', content: { 'application/json': { schema: errorResponse } } }, '404': { description: 'Usuário não encontrado.', content: { 'application/json': { schema: errorResponse } } } } }, delete: { tags: ['Admin - Users'], summary: 'Excluir usuário', description: 'Remove um usuário. O admin autenticado não pode excluir a si próprio.', security: bearerAuth, parameters: [idParam('id', 'ID do usuário.')], responses: { '204': { description: 'Usuário excluído.' }, '400': { description: 'Autoexclusão bloqueada.', content: { 'application/json': { schema: errorResponse } } }, '404': { description: 'Usuário não encontrado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/admin/businesses': { get: { tags: ['Admin - Businesses'], summary: 'Listar negócios para moderação', security: bearerAuth, parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'] }, description: 'Filtra por status.' }], responses: { '200': dataResponse('Negócios retornados.', { type: 'array', items: { $ref: '#/components/schemas/Business' } }) } } },
      '/api/v1/admin/businesses/{id}/status': { patch: { tags: ['Admin - Businesses'], summary: 'Alterar status do negócio', security: bearerAuth, parameters: [idParam('id', 'ID do negócio.')], requestBody: jsonBody({ $ref: '#/components/schemas/BusinessStatusRequest' }, 'Novo status do negócio.'), responses: { '200': dataResponse('Status atualizado.', { $ref: '#/components/schemas/Business' }) } } },
      '/api/v1/admin/businesses/{id}/featured': { patch: { tags: ['Admin - Businesses'], summary: 'Alterar destaque do negócio', security: bearerAuth, parameters: [idParam('id', 'ID do negócio.')], requestBody: jsonBody({ $ref: '#/components/schemas/BusinessFeaturedRequest' }, 'Define se o negócio será destacado.'), responses: { '200': dataResponse('Destaque atualizado.', { $ref: '#/components/schemas/Business' }) } } },
      '/api/v1/admin/businesses/{id}': { delete: { tags: ['Admin - Businesses'], summary: 'Excluir negócio', security: bearerAuth, parameters: [idParam('id', 'ID do negócio.')], responses: { '204': { description: 'Negócio excluído.' }, '404': { description: 'Negócio não encontrado.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/admin/categories': { get: { tags: ['Admin - Categories'], summary: 'Listar categorias', security: bearerAuth, responses: { '200': dataResponse('Categorias retornadas.', { type: 'array', items: { $ref: '#/components/schemas/Category' } }) } }, post: { tags: ['Admin - Categories'], summary: 'Criar categoria', security: bearerAuth, requestBody: jsonBody({ $ref: '#/components/schemas/CreateCategoryRequest' }, 'Dados da categoria.'), responses: { '201': dataResponse('Categoria criada.', { $ref: '#/components/schemas/Category' }) } } },
      '/api/v1/admin/categories/{id}': { patch: { tags: ['Admin - Categories'], summary: 'Atualizar categoria', security: bearerAuth, parameters: [idParam('id', 'ID da categoria.')], requestBody: jsonBody({ $ref: '#/components/schemas/UpdateCategoryRequest' }, 'Campos da categoria a atualizar.'), responses: { '200': dataResponse('Categoria atualizada.', { $ref: '#/components/schemas/Category' }) } }, delete: { tags: ['Admin - Categories'], summary: 'Excluir categoria', security: bearerAuth, parameters: [idParam('id', 'ID da categoria.')], responses: { '204': { description: 'Categoria excluída.' }, '404': { description: 'Categoria não encontrada.', content: { 'application/json': { schema: errorResponse } } } } } },
      '/api/v1/admin/reviews': { get: { tags: ['Admin - Reviews'], summary: 'Listar avaliações para moderação', security: bearerAuth, responses: { '200': dataResponse('Avaliações retornadas.', { type: 'array', items: { $ref: '#/components/schemas/Review' } }) } } },
      '/api/v1/admin/reviews/{id}': { delete: { tags: ['Admin - Reviews'], summary: 'Excluir avaliação', security: bearerAuth, parameters: [idParam('id', 'ID da avaliação.')], responses: { '204': { description: 'Avaliação excluída.' }, '404': { description: 'Avaliação não encontrada.', content: { 'application/json': { schema: errorResponse } } } } } },
    },
  },
  apis: [],
});
