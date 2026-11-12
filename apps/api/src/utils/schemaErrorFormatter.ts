import type { FastifySchemaValidationError } from 'fastify';

export function schemaErrorFormatter(errors: FastifySchemaValidationError[]) {
  const firstError = errors[0];
  if (!firstError) return new Error('Validation failed');

  const path = firstError.instancePath.replace(/^\//, '');
  const message = firstError.message ?? 'Invalid value';
  return new Error(path ? `${path}: ${message}` : message);
}
