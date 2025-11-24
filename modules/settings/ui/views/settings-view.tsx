"use client";

import GradientHeading from "@/components/GradientHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Brain,
  Languages,
  TextQuote,
  MonitorCog,
  FileDown,
  User,
  MoonStar,
  LogOut,
  Settings2,
  Save, } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const SettingsView = () => {

  const { theme, setTheme } = useTheme();
  const {
    email,
    name,
    language,
    faqCount,
    tone,
    model,
    exportFormat,

    setEmail,
    setName,
    setLanguage,
    setFaqCount,
    setTone,
    setModel,
    setExportFormat
  } = useSettingsStore();

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const saveSettings = useSettingsStore((s) => s.saveSettings);

  useEffect(() => {
    if (!user) return;

    setName(user.user_metadata?.name ?? "");
    setEmail(user.email ?? "");

    // Load settings from database
    loadSettings();
  }, [setName, setEmail, user, loadSettings]);

  const handleSave = async () => {
    const success = await saveSettings();
    if (success) {
      toast.success("Änderungen wurden gespeichert");
    } else {
      toast.error("Fehler beim Speichern");
    }
  };
  
  return (
    <main
      className="min-h-screen px-6 py-12 flex flex-col items-center relative overflow-hidden
        bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800
        dark:bg-gradient-to-br dark:from-[#0d0d15] dark:via-[#0c0c13] dark:to-[#0d0d17] dark:text-slate-200
        transition-all"
    >
      <div className="absolute top-[-200px] right-[-120px] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-200px] left-[-120px] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[140px]"></div>
      
      <div className="w-full max-w-4xl space-y-10">
        <GradientHeading
          heading="🔧 Einstellungen"
        />

        {/* ------------ GENERAL SETTINGS ------------ */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Allgemeine Einstellungen</h2>
          <hr className="mb-6"/>

          <div className="grid gap-8">
            {/* ACCOUNT CARD */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Name</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dein Name" 
                    className="mt-1" />
                </div>

                <div>
                  <Label>E-Mail</Label>
                  <Input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="mt-1" />
                </div>

                <Button
                 onClick={async () => {
                    await logout();
                    router.push("/");
                 }}
                 variant="destructive" className="w-full flex gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* APPEARANCE */}
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

            {/* SUBSCRIPTION */}
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
          </div>
        </section>
        
        {/* ------------ AI SETTINGS ------------ */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Generierungs Einstellungen</h2>
          <hr className=" mb-6"/>

          <div className="grid gap-6">
            {/* LANGUAGE SETTINGS */}
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

            {/* FAQ COUNT */}
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

            {/* TONE */}
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


            {/* MODEL */}
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


            {/* EXPORT SETTINGS */}
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

            <Button
              onClick={handleSave}
              className="
                w-full mt-2 py-6 text-lg font-semibold rounded-2xl
                bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-indigo-400/40 hover:shadow-cyan-400/50
                flex items-center justify-center gap-2 mb-18 cursor-pointer
              ">
              <Save className="w-5 h-5" />
              Änderungen speichern
            </Button>
          </div>
        </section>
      </div> 
    </main>
  )
}

export default SettingsView
