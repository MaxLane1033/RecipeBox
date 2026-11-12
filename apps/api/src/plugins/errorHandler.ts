import { type OutgoingHttpHeaders, STATUS_CODES } from 'node:http';
import type { FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { DomainError, type DomainErrorCode } from '../errors/common.error.ts';
import type { ErrorResponse } from '../schemas/error.schema.ts';

const domainErrorStatus: Record<DomainErrorCode, number> = {
  not_found: 404,
  invalid_input: 400,
  conflict: 409,
  forbidden: 403,
  unauthorized: 401,
  internal: 500,
};

export const errorHandlerPlugin = fp(
  async (app) => {
    app.setErrorHandler<FastifyError & { headers?: OutgoingHttpHeaders }>((error, request, reply) => {
      const candidate = error instanceof DomainError ? domainErrorStatus[error.code] : error.statusCode;
      const statusCode =
        typeof candidate === 'number' && Number.isInteger(candidate) && candidate >= 400 && candidate < 600
          ? candidate
          : 500;
      if (statusCode >= 500)
        request.log.error({ err: error, requestId: request.id }, 'Unhandled request error');
      if (error.headers) reply.headers(error.headers);

      const response: ErrorResponse = {
        statusCode,
        error: STATUS_CODES[statusCode] ?? 'Error',
        message: statusCode >= 500 ? 'Something went wrong' : error.message,
        requestId: request.id,
      };
      return reply.code(statusCode).send(response);
    });
    app.setNotFoundHandler(() => {
      throw app.httpErrors.notFound('Route not found');
    });
  },
  { name: 'error-handler', dependencies: ['core'] },
);

export default errorHandlerPlugin;
