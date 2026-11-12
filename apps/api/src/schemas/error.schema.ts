import { z } from 'zod';

export const ErrorSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  requestId: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;
