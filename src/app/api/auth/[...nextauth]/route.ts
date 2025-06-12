import { handlers } from "../../../../../auth"

/**
 * NextAuth v5 Route Handler
 *
 * This simply exports the handlers from auth.ts
 * All configuration is done in the root auth.ts file
 */
export const { GET, POST } = handlers
