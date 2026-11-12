import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { ErrorSchema } from '../../schemas/error.schema.ts';
import { ProfileSchema } from './profile.schema.ts';
import { profileService } from './profile.service.ts';

export const profileController: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/profile',
    {
      preHandler: app.authenticate,
      schema: {
        operationId: 'getProfile',
        tags: ['Profile'],
        security: [{ sessionCookie: [] }],
        response: { 200: ProfileSchema, 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
      },
    },
    async (request, reply) => {
      if (!request.session) return reply.unauthorized('Sign in to continue');
      return profileService.getProfile(request.session.user.id);
    },
  );
};

export default profileController;
