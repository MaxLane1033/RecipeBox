import { join } from 'node:path';
import autoload from '@fastify/autoload';
import type { Auth } from '@recipebox/auth/server';
import Fastify, { type FastifyServerOptions } from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { schemaErrorFormatter } from './utils/schemaErrorFormatter.ts';

type AppOptions = {
  auth: Auth;
  docs?: boolean;
  corsOrigins?: string[];
  logger?: FastifyServerOptions['logger'];
};

export async function buildApp(options: AppOptions) {
  const app = Fastify({
    logger: options.logger ?? false,
    schemaErrorFormatter,
  }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(autoload, {
    dir: join(import.meta.dirname, 'plugins'),
    dirNameRoutePrefix: false,
    options: {
      auth: options.auth,
      corsOrigins: options.corsOrigins ?? [],
      docs: options.docs ?? true,
    },
  });
  const modulesDir = join(import.meta.dirname, 'modules');
  await app.register(autoload, {
    dir: modulesDir,
    // Prefix only the top-level feature folder, including controllers in nested folders.
    dirNameRoutePrefix: (parent, name) => (parent === modulesDir && name !== 'health' ? '/api' : ''),
    matchFilter: (path) => /\.controller\.(?:[cm]?js|ts)$/.test(path),
  });
  return app;
}
