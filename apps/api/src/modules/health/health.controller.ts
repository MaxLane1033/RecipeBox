import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const healthController: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        operationId: 'getHealth',
        tags: ['Health'],
        response: { 200: z.object({ status: z.literal('ok') }) },
      },
    },
    async () => ({ status: 'ok' as const }),
  );
};

export default healthController;
