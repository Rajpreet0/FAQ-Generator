import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";


const SubscriptionCard = () => {
  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-500" />
          Abo & Nutzung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm opacity-70">
          Aktueller Plan: <span className="font-bold text-indigo-600 dark:text-indigo-400">Free</span>
        </p>
        <Button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white cursor-pointer">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  )
}

export default SubscriptionCard