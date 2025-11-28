import HomeView from "@/modules/home/ui/views/home-view";

/**
 * Home Page Component
 *
 * Landing page entry point for the FAQ Generator application.
 * Displays the marketing page with hero section, benefits, and CTA.
 *
 * Route: /
 *
 * Features:
 * - Public access (no authentication required)
 * - URL input for immediate FAQ generation
 * - Benefits and how-it-works sections
 * - Link to developer documentation
 *
 * @returns {JSX.Element} The home view component
 */
export default function Home() {
  return <HomeView />;
}
