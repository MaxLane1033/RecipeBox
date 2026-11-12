import { expo } from '@better-auth/expo';
import type { BetterAuthOptions } from 'better-auth';

// Shared by the runtime and schema-generation CLI so auth tables stay aligned.
export const authOptions = {
  appName: 'RecipeBox',
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  plugins: [expo()],
} satisfies BetterAuthOptions;
