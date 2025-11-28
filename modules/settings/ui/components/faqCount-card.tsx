"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Brain } from "lucide-react";


const FaqCountCard = () => {

    const { faqCount, setFaqCount } = useSettingsStore();

  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          Anzahl der FAQ-Elemente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Slider 
           value={[faqCount]}
           min={3} 
           max={12} 
           step={1}
           onValueChange={(v) => setFaqCount(v[0])}/>
        <div className="w-full flex justify-between items-center">
          <p className="text-xs opacity-60 mt-2">
            Wähle zwischen 3 und 12 FAQs 
          </p>
          <p className="text-sm opacity-60 mt-2">
            {faqCount} / 12
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default FaqCountCard