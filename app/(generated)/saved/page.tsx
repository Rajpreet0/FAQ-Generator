import Protected from "@/components/Protected"
import SavedView from "@/modules/saved/ui/views/saved-view"

/**
 * Saved FAQs Page Component
 *
 * Protected route for viewing and managing saved FAQ sets.
 * Requires user authentication to access.
 *
 * Route: /saved
 *
 * Features:
 * - Lists all saved FAQ sets for the current user
 * - Delete functionality with confirmation
 * - View FAQ details and source URLs
 * - SEO score display
 * - Protected wrapper redirects unauthenticated users
 *
 * @returns {JSX.Element} The saved FAQs view wrapped in Protected component
 */
const Saved = () => {
  return (
    <Protected>
      <SavedView/>
    </Protected>
  )
}

export default Saved
