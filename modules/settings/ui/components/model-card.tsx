"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MonitorCog } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";

const ModelCard = () => {

    const { model, setModel } = useSettingsStore();

  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorCog className="w-5 h-5 text-indigo-500" />
          KI-Modell
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={model}
          onValueChange={setModel}
          defaultValue="gpt-4o-mini">
          <SelectTrigger>
            <SelectValue placeholder="Modell wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-5-mini">GPT-5-mini</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

export default ModelCard