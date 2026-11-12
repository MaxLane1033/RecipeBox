export type DomainErrorCode =
  | 'not_found'
  | 'invalid_input'
  | 'conflict'
  | 'forbidden'
  | 'unauthorized'
  | 'internal';

export type DomainErrorMeta = {
  resource?: string;
  fields?: string[];
  id?: string;
  reason?: string;
};

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly meta?: DomainErrorMeta;

  constructor(code: DomainErrorCode, message: string, meta?: DomainErrorMeta) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.meta = meta;
  }
}
