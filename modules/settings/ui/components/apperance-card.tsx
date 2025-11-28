"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MoonStar } from "lucide-react";
import { useTheme } from "next-themes";

const ApperanceCard = () => {
    const { theme, setTheme } = useTheme();

  return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MoonStar className="w-5 h-5 text-indigo-500" />
          Erscheinungsbild
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Label className="font-normal opacity-80">Dark Mode aktivieren</Label>
        <Switch 
          checked={theme==="dark"}
          onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
          className="cursor-pointer"
        />
      </CardContent>
    </Card>
  )
}

export default ApperanceCard