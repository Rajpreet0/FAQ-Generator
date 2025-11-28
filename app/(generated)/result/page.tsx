import ResultsView from "@/modules/result/ui/views/results-view";

/**
 * Result Page Component
 *
 * This page displays the generated FAQ results to the user.
 * It serves as the route entry point for the /result path and delegates
 * rendering to the ResultsView component.
 *
 * @returns {JSX.Element} The results view component
 */
const Result = () => {
  return <ResultsView />;
};

export default Result;
