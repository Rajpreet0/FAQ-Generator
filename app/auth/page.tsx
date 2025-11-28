import AuthView from "@/modules/auth/ui/views/auth-view"

/**
 * Authentication Page Component
 *
 * Public authentication page providing login and registration functionality.
 * Uses Supabase for user authentication and management.
 *
 * Route: /auth
 *
 * Features:
 * - Tabbed interface for login and registration
 * - Form validation with Zod schemas
 * - Email and password authentication
 * - Auto-redirect after successful authentication
 *
 * @returns {JSX.Element} The authentication view component
 */
const AuthPage = () => {
  return <AuthView/>
}

export default AuthPage