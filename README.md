# RecipeBox

A small TypeScript workspace with a Fastify API, an Expo / React Native app, Better Auth, and PostgreSQL / Drizzle. The starter includes working signup, login, session restoration, an authenticated profile request, and sign-out. Add recipe features inside API modules and mobile screens as the product takes shape.

## Prerequisites

- Node.js **24.12 or newer within Node 24** (`nvm install && nvm use` if you use nvm).
- **pnpm 10.27.0**, matching `packageManager` (`npm install --global pnpm@10.27.0` if needed).
- Docker Desktop, or Docker Engine with Compose v2. Start Docker before running database commands.
- A compatible Expo Go app on a device, or an iOS Simulator / Android Emulator. Xcode is required for the iOS Simulator; Android Studio provides the Android Emulator. See [Expo environment setup](https://docs.expo.dev/get-started/set-up-your-environment/).

## Quickstart

Run these commands from the repository root:

```sh
pnpm install
pnpm env:setup
pnpm db:up
pnpm db:migrate
```

`pnpm env:setup` creates `.env` and `apps/mobile/.env` from their examples and generates a random auth secret. It preserves existing files. No email provider, GitHub account, or remote repository is needed to run locally.

`pnpm db:up` starts only the `recipebox` PostgreSQL container and waits for it to become healthy. It uses port **5433** on your computer to avoid an existing PostgreSQL on 5432. Its data persists in a Docker volume. The initial migration creates the auth tables; no seed step is needed.

Start the backend in one terminal:

```sh
pnpm dev:api
```

Once the API is running, generate the mobile client and start Expo in another terminal:

```sh
pnpm generate:api
pnpm dev:mobile
```

In Expo's terminal, press `i` for the iOS Simulator, `a` for the Android Emulator, `w` for the browser, or scan the QR code with Expo Go. Launch your emulator first if needed. This starter supports iOS, Android, and browser development. To open the browser directly, run `pnpm dev:web`. If your Expo Go version does not support the pinned Expo SDK, use a compatible client or a development build following Expo's setup guide.

You can also use `pnpm dev` to run API and Expo together; separate terminals make interactive Expo shortcuts easier to use. `pnpm dev:ios` and `pnpm dev:android` open the corresponding target directly.

### Set the correct mobile API address

Edit **`apps/mobile/.env`** before launching mobile:

| Target                             | `EXPO_PUBLIC_API_URL`               |
| ---------------------------------- | ----------------------------------- |
| Browser at `http://localhost:8081` | `http://localhost:3000`             |
| iOS Simulator on this Mac          | `http://localhost:3000`             |
| Android Emulator                   | `http://10.0.2.2:3000`              |
| Physical iOS / Android device      | `http://YOUR_COMPUTERS_LAN_IP:3000` |

For a physical device, connect it and your computer to the same network and allow connections to port 3000 through your firewall. The API binds to `0.0.0.0` for device access. On macOS, `ipconfig getifaddr en0` often shows your Wi-Fi LAN address; use the address for your active interface. `localhost` on a phone means the phone itself.

For browser login, use `localhost` for both the app and API; mixing `localhost` and `127.0.0.1` can prevent session cookies from being sent. The default API `CORS_ORIGINS` allows port 8081; if Expo uses another port, add that exact browser origin to the root `.env` and restart the API. Browser sessions use HTTP cookies; native sessions use SecureStore.

For native email/password login, changing `EXPO_PUBLIC_API_URL` is enough for local device access; `BETTER_AUTH_URL` can stay at localhost. Set `BETTER_AUTH_URL` to the externally reachable backend origin before adding redirect-based auth or deploying. Server secrets belong only in the root `.env`; `EXPO_PUBLIC_*` values are visible in the mobile bundle.

Restart Expo after environment changes. To explicitly clear Metro's cache run `pnpm --filter @recipebox/mobile start --clear`.

### Confirm the initial integration

1. Open the mobile app and choose **Create an account**.
2. Enter your name, email, and a password of at least 8 characters. Email verification is disabled initially.
3. The app signs you in and requests `/api/profile` through the generated Orval client. The returned name and email appear under **Your account**.
4. Reload the app. Better Auth restores the session using SecureStore on native or cookies in the browser.
5. Sign out, then sign back in. The protected home screen is available only with a session, and account query data is cleared when the user changes or signs out.

Useful local URLs:

- Health: <http://localhost:3000/health>
- API reference: <http://localhost:3000/docs>
- OpenAPI JSON: <http://localhost:3000/openapi.json>
- Better Auth routes: `http://localhost:3000/api/auth/*` (consumed by Better Auth's own client)

The API uses Fastify’s Pino logger, with readable `pino-pretty` output in development and structured JSON otherwise.

`/health` checks the API process, not database readiness. Docker Compose has a separate PostgreSQL health check. API docs are disabled when `NODE_ENV=production`.

## Workspace layout

```text
apps/api/        Fastify plugins, routes, services, repositories, Zod schemas
apps/mobile/     Expo Router screens, React Native UI, auth client, generated API
packages/auth/   Server auth factory and shared CLI/runtime auth options
packages/db/     Shared Drizzle client, auth schema, migrations
scripts/         Environment setup and live API client generation/checks
```

Plugins in `apps/api/src/plugins/` are loaded automatically with `@fastify/autoload`. Export each plugin as default and use `fastify-plugin` names/dependencies to express ordering. Core runs before the error handler, then OpenAPI and authentication; controllers load afterward.

Feature modules are discovered through `*.controller.ts` default exports. Autoload adds `/api` for each top-level feature folder, so declare paths such as `/profile` in controllers. The `health` folder has no prefix. Nested feature folders keep the same `/api` prefix. Services, repositories, and schemas are not autoloaded. Adding a controller does not require an import in `app.ts`; the build discovers plugin/controller entries automatically and preserves their directories in `dist/`.

The profile module demonstrates `controller → service → repository` against the existing auth user table. Controllers import an exported service object, services import an exported repository object, and repositories import the shared `db` from `@recipebox/db`. Feature services and repositories do not need factories or registration in `server.ts`/`app.ts`. The shared pool opens connections only when queried. Add feature modules alongside it. Keep reusable mobile components in `apps/mobile/src/components`. There is no shared domain, contract, or UI package until another consumer needs one.

`@recipebox/auth/server` and `@recipebox/db` are server-only. Mobile initializes its own Better Auth React client with the Expo plugin. Native requests attach the stored session cookie through `src/lib/http.ts`; the API validates the session before returning profile data. There is no separate JWT or token-refresh implementation.

## API errors

Feature services throw `DomainError` through a local `*.error.ts` object, following the profile module's `profileErrors.notFound(userId)` example. Repositories handle persistence; controllers call services without repeating business-error checks. Keep this code inside the API rather than adding a shared domain package.

The autoloaded error-handler plugin maps `not_found`, `invalid_input`, `conflict`, `forbidden`, `unauthorized`, and `internal` to HTTP 404, 400, 409, 403, 401, and 500. Application API errors use the shared `ErrorSchema` in `src/schemas/error.schema.ts`: `{ statusCode, error, message, requestId }`. Use that schema for the error statuses declared by each endpoint. Fastify HTTP errors, request-validation errors, and unknown routes use the same response shape. Validation messages identify the first invalid field.

Unexpected failures are logged with their request ID and return a generic message; domain metadata stays server-side. Better Auth's own `/api/auth/*` responses retain Better Auth's native contract for its client.

## Commands

`pnpm dev:web` starts Expo for browser development. `pnpm build:web` exports the browser bundle to `apps/mobile/dist/web`; CI checks this alongside iOS and Android exports.

| Command                             | Purpose                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm env:setup`                    | Create missing local environment files and a random auth secret               |
| `pnpm dev:api`                      | Start the API in watch mode                                                   |
| `pnpm dev:mobile`                   | Start Expo                                                                    |
| `pnpm dev`                          | Start API and Expo together                                                   |
| `pnpm dev:ios` / `pnpm dev:android` | Start Expo and open a simulator/emulator                                      |
| `pnpm db:up`                        | Start PostgreSQL and wait for readiness                                       |
| `pnpm db:down`                      | Stop database containers; keep the data volume                                |
| `pnpm db:logs`                      | Follow PostgreSQL logs                                                        |
| `pnpm auth:generate`                | Regenerate the Better Auth Drizzle schema                                     |
| `pnpm db:generate`                  | Generate a migration from schema changes                                      |
| `pnpm db:migrate`                   | Apply unapplied migrations                                                    |
| `pnpm db:push`                      | Apply schema directly for local experimentation                               |
| `pnpm db:studio`                    | Open Drizzle Studio                                                           |
| `pnpm generate:api`                 | Generate mobile functions, hooks, types, and Zod schemas from the running API |
| `pnpm check:generated`              | Compare generated mobile output with the running API                          |
| `pnpm typecheck`                    | Check all workspace TypeScript                                                |
| `pnpm lint` / `pnpm lint:fix`       | Check / fix source with Biome                                                 |
| `pnpm format` / `pnpm format:check` | Format / check formatting                                                     |
| `pnpm lint:mobile`                  | Check dependency versions against the Expo SDK                                |
| `pnpm build:api`                    | Typecheck and build the backend                                               |
| `pnpm start:api`                    | Run the compiled backend                                                      |
| `pnpm check`                        | Run lint, types, and API build checks                                         |

`pnpm db:down` preserves data. To deliberately erase this project's local database, use `docker compose down --volumes`, then `pnpm db:up && pnpm db:migrate`.

### Change auth or database tables

For auth changes, edit `packages/auth/src/options.ts` (shared by runtime and CLI), then run:

```sh
pnpm auth:generate
pnpm db:generate
pnpm db:migrate
```

Do not manually edit `packages/db/src/schema/auth.ts`. Add application tables in separate files under `packages/db/src/schema/`, export them from its `index.ts`, and run `db:generate` / `db:migrate`. Use migrations as the normal workflow; `db:push` is an alternative for local experiments, not a prerequisite for migrations.

Email/password auth currently has no verification, password reset, social login, organizations, roles, or email service. Add those when the product needs them.

### Change an API endpoint

1. Edit the feature's Zod schemas and controller in `apps/api/src/modules/`.
2. Give each route a stable `operationId` and explicit response schemas.
3. With the API running, run `pnpm generate:api`.
4. Use the generated hook/function and review the generated changes.

Orval reads the running API's `/openapi.json` endpoint directly. No OpenAPI snapshot is written to disk. View the live schema at <http://localhost:3000/openapi.json> or browse <http://localhost:3000/docs>. Keep `apps/mobile/src/api/generated/` in Git and never hand-edit it. Orval emits the Fetch/TanStack Query client and a separate Zod output. Standard OpenAPI constraints carry through; arbitrary Zod refinements do not.

Generation defaults to `http://localhost:3000/openapi.json`. For another API address, run `API_SCHEMA_URL=http://localhost:3001/openapi.json pnpm generate:api`. The generator checks that the endpoint is reachable before cleaning existing generated files. `pnpm check:generated` is an optional consistency check that also requires the API to be running; it is separate from `pnpm check` and CI.

## CI and releases

GitHub workflows activate after you add a remote and push this repository to GitHub.

After creating an empty GitHub repository, review and commit locally, add its URL as `origin`, and push `main`. CI runs `pnpm check` and exports the native and web bundles without a database or environment secrets. It runs on pull requests, pushes to `main`, and manual dispatch.

Release Please runs after successful CI for pushes to `main`. It uses Conventional Commits (`feat:`, `fix:`, `feat!:`) to open/update a release PR. Merging that PR updates the changelog and workspace/app versions and creates a GitHub release/tag. It does not deploy the API or publish a mobile binary.

In GitHub **Settings → Actions → General → Workflow permissions**, allow GitHub Actions to create and approve pull requests. The workflow requests the write permissions needed for releases.

The default `GITHUB_TOKEN` works for release automation, but GitHub does not trigger new CI workflows for PRs created by that token. If release PRs must receive automatic required CI checks, configure an appropriately scoped GitHub App/PAT token as the **`RELEASE_PLEASE_TOKEN`** Actions secret. The workflow uses it when present. Otherwise, manually dispatch CI on the release branch before merging when checks are required. See the [Release Please action documentation](https://github.com/googleapis/release-please-action).

The initial workspace version is `0.1.0`, with one release version for the repository. The app identifiers `com.recipebox.app` are placeholders; choose identifiers you own before a store build.

## Troubleshooting

- **Docker cannot connect:** start Docker Desktop and retry `pnpm db:up`.
- **Port 5433 is occupied:** change the Compose host port and the port in `DATABASE_URL` together.
- **Mobile cannot reach the API:** verify the device-specific API address above; an Expo tunnel does not automatically tunnel your API.
- **Missing auth tables:** run `pnpm db:migrate` against the same database URL used by the API.
- **Invalid auth secret:** run `pnpm env:setup` for a fresh checkout. If `.env` already exists with a placeholder, replace the secret using the command in `.env.example`.
- **Native dependency mismatch:** run `pnpm lint:mobile`; let Expo choose compatible versions via `pnpm --filter @recipebox/mobile exec expo install <package>`.

The stock Expo starter images under `apps/mobile/assets/` retain their upstream MIT license in that directory.
