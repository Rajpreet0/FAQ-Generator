/**
 * Gradient Heading Props Interface
 */
interface GradientHeadingProps {
    heading: string;
}

/**
 * Gradient Heading Component
 *
 * Displays a large heading with an animated gradient text effect.
 * Used for page titles and section headers throughout the application.
 *
 * Features:
 * - Multi-color gradient (indigo → purple → cyan)
 * - Text clipping for gradient effect
 * - Large, bold typography (text-4xl)
 * - Consistent styling across pages
 *
 * Gradient Colors:
 * - from-indigo-500: Starting color
 * - via-purple-500: Middle color
 * - to-cyan-400: Ending color
 *
 * @param {GradientHeadingProps} props - Component props
 * @param {string} props.heading - The text to display with gradient effect
 */
const GradientHeading: React.FC<GradientHeadingProps> = ({heading}) => {
  return (
    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
        {heading}
    </div>
  )
}

export default GradientHeading
