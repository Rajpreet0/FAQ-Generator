"use cilent"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TextQuote } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useSettingsStore } from "@/store/useSettingsStore";


const ToneCard = () => {

    const { tone, setTone } = useSettingsStore();

  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TextQuote className="w-5 h-5 text-indigo-500" />
          Schreibstil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={tone}
          onValueChange={setTone}
          defaultValue="professional">
          <SelectTrigger>
            <SelectValue placeholder="Ton auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professionell</SelectItem>
            <SelectItem value="friendly">Freundlich</SelectItem>
            <SelectItem value="funny">Humorvoll</SelectItem>
            <SelectItem value="simple">Einfach</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

export default ToneCard