import Protected from "@/components/Protected"
import SettingsView from "@/modules/settings/ui/views/settings-view"

const Settings = () => {
  return (
    <Protected>
      <SettingsView/>
    </Protected>
  ) 
}

export default Settings
