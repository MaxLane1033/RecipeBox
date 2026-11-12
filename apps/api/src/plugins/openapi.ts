import swagger from '@fastify/swagger';
import apiReference from '@scalar/fastify-api-reference';
import fp from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const openapiPlugin = fp<{ docs: boolean }>(
  async (app, options) => {
    await app.register(swagger, {
      openapi: {
        openapi: '3.1.0',
        info: { title: 'RecipeBox API', version: '0.1.0' },
        components: {
          securitySchemes: {
            sessionCookie: {
              type: 'apiKey',
              in: 'cookie',
              name: 'better-auth.session_token',
            },
          },
        },
      },
      transform: jsonSchemaTransform,
    });
    if (options.docs) {
      app.get('/openapi.json', { schema: { hide: true } }, async () => app.swagger());
      await app.register(apiReference, {
        routePrefix: '/docs',
        configuration: {
          url: '/openapi.json',
          title: 'RecipeBox API',
          showDeveloperTools: 'never',
        },
      });
    }
  },
  { name: 'openapi', dependencies: ['core', 'error-handler'] },
);

export default openapiPlugin;
