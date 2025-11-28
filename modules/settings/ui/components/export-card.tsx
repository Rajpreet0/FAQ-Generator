"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/useSettingsStore";


const ExportCard = () => {

    const { exportFormat, setExportFormat } = useSettingsStore();

  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="w-5 h-5 text-indigo-500" />
          Exportformat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup  
          value={exportFormat}
          onValueChange={setExportFormat}
          defaultValue="json" 
          className="space-y-2">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json">JSON</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="html" id="html" />
            <Label htmlFor="html">HTML</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="pdf" id="pdf" />
            <Label htmlFor="pdf">PDF</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export default ExportCard