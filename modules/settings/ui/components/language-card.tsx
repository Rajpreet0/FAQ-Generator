"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Languages } from "lucide-react";


const LanguageCard = () => {

    const { language, setLanguage } = useSettingsStore();

  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-indigo-500" />
          Sprache
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={language}
          onValueChange={setLanguage}
          defaultValue="de">
          <SelectTrigger>
            <SelectValue placeholder="Wähle die Sprache" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="en">Englisch</SelectItem>
            <SelectItem value="fr">Französisch</SelectItem>
            <SelectItem value="es">Spanisch</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

export default LanguageCard