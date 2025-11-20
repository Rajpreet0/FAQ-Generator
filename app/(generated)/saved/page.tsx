import Protected from "@/components/Protected"
import SavedView from "@/modules/saved/ui/views/saved-view"

const Saved = () => {
  return (
    <Protected>
      <SavedView/>
    </Protected>
  )
}

export default Saved
