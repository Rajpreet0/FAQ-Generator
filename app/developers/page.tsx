import DevDokumentationView from "@/modules/developers/ui/views/dev-dokumentation-view"

/**
 * Developer Documentation Page Component
 *
 * Public API documentation page for developers integrating with the FAQ Generator.
 * Provides comprehensive API reference with code examples.
 *
 * Route: /developers
 *
 * Features:
 * - API endpoint documentation
 * - Request/response examples in multiple languages (cURL, JavaScript, Python)
 * - Parameter descriptions and types
 * - Copy-to-clipboard functionality for code snippets
 *
 * @returns {JSX.Element} The developer documentation view component
 */
const DevDokumentation = () => {
  return <DevDokumentationView/>
}

export default DevDokumentation
