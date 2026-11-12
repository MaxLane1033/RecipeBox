import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export const corePlugin = fp<{ corsOrigins: string[] }>(
  async (app: FastifyInstance, options) => {
    await app.register(sensible);
    await app.register(cors, {
      origin: options.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    await app.register(helmet, { contentSecurityPolicy: false });
  },
  { name: 'core' },
);

export default corePlugin;
