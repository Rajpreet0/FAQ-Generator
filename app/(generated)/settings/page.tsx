import Protected from "@/components/Protected"
import SettingsView from "@/modules/settings/ui/views/settings-view"

/**
 * Settings Page Component
 *
 * Protected route for managing user account and FAQ generation preferences.
 * Requires user authentication to access.
 *
 * Route: /settings
 *
 * Settings Categories:
 * - Account: Name, email, logout
 * - Appearance: Dark/light theme
 * - Subscription: Current plan and upgrades
 * - Generation: Language, count, tone, model, export format
 *
 * Features:
 * - Loads settings from database on mount
 * - Saves changes to backend API
 * - Real-time UI updates via Zustand store
 * - Protected wrapper redirects unauthenticated users
 *
 * @returns {JSX.Element} The settings view wrapped in Protected component
 */
const Settings = () => {
  return (
    <Protected>
      <SettingsView/>
    </Protected>
  )
}

export default Settings
