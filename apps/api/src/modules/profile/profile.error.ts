import { DomainError } from '../../errors/common.error.ts';

export const profileErrors = {
  notFound: (userId?: string) =>
    new DomainError('not_found', 'User not found', { resource: 'user', id: userId }),
};
