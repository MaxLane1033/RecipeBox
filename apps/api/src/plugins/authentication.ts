import type { Auth, Session } from '@recipebox/auth/server';
import { fromNodeHeaders } from 'better-auth/node';
import type { preHandlerHookHandler } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    session: Session | null;
  }
  interface FastifyInstance {
    authenticate: preHandlerHookHandler;
  }
}

export const authenticationPlugin = fp<{ auth: Auth }>(
  async (app, { auth }) => {
    app.decorateRequest('session', null);
    app.decorate('authenticate', async (request, reply) => {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });
      if (!session) return reply.unauthorized('Sign in to continue');
      request.session = session;
    });

    app.route({
      method: ['GET', 'POST'],
      url: '/api/auth/*',
      schema: { hide: true },
      async handler(request, reply) {
        const headers = fromNodeHeaders(request.headers);
        // Fastify already parsed JSON. Let Request set the length for the serialized body.
        headers.delete('content-length');
        const response = await auth.handler(
          new Request(new URL(request.url, auth.options.baseURL), {
            method: request.method,
            headers,
            ...(request.body !== undefined ? { body: JSON.stringify(request.body) } : {}),
          }),
        );
        reply.code(response.status);
        response.headers.forEach((value, name) => {
          if (name !== 'set-cookie') reply.header(name, value);
        });
        // Preserve individual cookies; combining Set-Cookie headers breaks session persistence.
        const cookies = response.headers.getSetCookie();
        if (cookies.length) reply.header('set-cookie', cookies);
        return reply.send(response.body ? await response.text() : null);
      },
    });
  },
  { name: 'authentication', dependencies: ['core', 'openapi'] },
);

export default authenticationPlugin;
