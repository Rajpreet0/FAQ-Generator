
interface GradientHeadingProps {
    heading: string;
}

const GradientHeading: React.FC<GradientHeadingProps> = ({heading}) => {
  return (
    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
        {heading}
    </div>
  )
}

export default GradientHeading
