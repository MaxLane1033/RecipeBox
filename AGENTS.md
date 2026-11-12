# RecipeBox agent instructions

- Keep the scaffold small: business schemas, services, and repositories belong in API feature modules.
- Do not manually edit `apps/mobile/src/api/generated/`. Change API schemas or Orval configuration, then run `pnpm generate:api`.
- Do not manually edit `packages/db/src/schema/auth.ts`. Run `pnpm auth:generate` after changing auth configuration.
- Do not start development servers or browser checks unless requested.
- Do not create or change tests unless requested.
- Do not stage or commit files unless requested.
- Keep utilities separate from service files. Extract shared packages only when another consumer needs them.
- Never import server auth, database code, or secrets into mobile.
