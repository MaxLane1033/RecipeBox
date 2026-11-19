/** Registry lookups must not accept inherited names from URL parameters. */
export function hasOwnKey<T extends object>(record: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(record, key);
}
