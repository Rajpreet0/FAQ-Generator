
"use client";

import GradientHeading from "@/components/GradientHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  Save,
  KeyRound,
  Copy,
  Eye,
  EyeOff,
  AlertCircle, } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AccountCard from "../components/account-card";
import ApperanceCard from "../components/apperance-card";
import SubscriptionCard from "../components/subscription-card";
import LanguageCard from "../components/language-card";
import FaqCountCard from "../components/faqCount-card";
import ToneCard from "../components/tone-card";
import ModelCard from "../components/model-card";
import ExportCard from "../components/export-card";

/**
 * Settings View Component
 *
 * Comprehensive settings page for user account and FAQ generation preferences.
 * Organizes settings into general and generation-specific sections.
 *
 * General Settings:
 * - Account: Name and email management
 * - Appearance: Dark mode toggle
 * - Subscription: Current plan display and upgrade option
 *
 * Generation Settings:
 * - Language: FAQ output language selection (German, English, French, Spanish)
 * - FAQ Count: Number of FAQs to generate (3-12)
 * - Tone: Writing style (Professional, Friendly, Humorous, Simple)
 * - Model: OpenAI model selection (GPT-4o-mini, GPT-4o, GPT-5-mini)
 * - Export Format: Preferred export format (JSON, HTML, PDF)
 *
 * Features:
 * - Loads settings from database on mount
 * - Saves settings to backend API
 * - Syncs with Zustand store for immediate UI updates
 * - Toast notifications for save success/failure
 * - Logout functionality
 */
const SettingsView = () => {

  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const {
    apiKey,
    apiKeyExpiresAt,

    setEmail,
    setName,
    generateApiKey
  } = useSettingsStore();

  const user = useAuthStore((s) => s.user);
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

  const handleAPIKeyGeneration = async () => {
    setIsGeneratingKey(true);
    try {
      const result = await generateApiKey();
      if (result.success && result.apiKey) {
        await navigator.clipboard.writeText(result.apiKey);
        toast.success("API Key erfolgreich generiert und in die Zwischenablage kopiert!");
        setShowKey(true);
      } else {
        toast.error(result.error || "Fehler beim Generieren des API Keys");
      }
    } catch (error) {
      toast.error("Fehler beim Generieren des API Keys");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleCopyKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      toast.success("API Key in die Zwischenablage kopiert!");
    }
  };

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isKeyExpired = () => {
    if (!apiKeyExpiresAt) return false;
    return new Date() > new Date(apiKeyExpiresAt);
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
            <AccountCard/>

            {/* APPEARANCE */}
            <ApperanceCard/>

            {/* SUBSCRIPTION */}
            <SubscriptionCard/>
          </div>
        </section>
        
        {/* ------------ AI SETTINGS ------------ */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Generierungs Einstellungen</h2>
          <hr className=" mb-6"/>

          <div className="grid gap-6">
            {/* LANGUAGE SETTINGS */}
            <LanguageCard/>

            {/* FAQ COUNT */}
            <FaqCountCard/>

            {/* TONE */}
            <ToneCard/>

            {/* MODEL */}
            <ModelCard/>


            {/* EXPORT SETTINGS */}
            <ExportCard/>
          </div>
        </section>

        {/* ------------ PUBLIC API GENERATION ------------ */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Entwicklungs Einstellungen</h2>
          <hr className=" mb-6"/>

          <div className="grid gap-6">
            
            <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-500" />
                  API Key für Public API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm opacity-70">
                  Generiere einen API Key für die Verwendung der öffentlichen API. Der Key ist 30 Tage gültig und hat ein Limit von 15 Anfragen pro Stunde.
                </p>

                {apiKey && (
                  <>
                    {isKeyExpired() && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Dieser API Key ist abgelaufen. Bitte generiere einen neuen Key.</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Aktueller API Key</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={showKey ? apiKey : "••••••••••••••••••••••••••••••••••••••••"}
                          disabled
                          className="font-mono text-sm"
                        />
                        <Button
                          onClick={() => setShowKey(!showKey)}
                          variant="outline"
                          size="icon"
                          className="cursor-pointer">
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={handleCopyKey}
                          variant="outline"
                          size="icon"
                          className="cursor-pointer">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70">Gültig bis:</span>
                      <span className={`font-medium ${isKeyExpired() ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                        {formatExpiryDate(apiKeyExpiresAt)}
                      </span>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleAPIKeyGeneration}
                  disabled={isGeneratingKey}
                  className="w-full cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-white shadow-indigo-400/40 hover:shadow-cyan-400/50 disabled:opacity-50">
                  <KeyRound className="w-4 h-4 mr-2" />
                  {apiKey ? "Neuen Key generieren (ersetzt den alten)" : "API Key generieren"}
                </Button>

                {apiKey && (
                  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs opacity-70 mb-2">Beispiel Verwendung:</p>
                    <code className="text-xs block overflow-x-auto">
                      curl -X POST https://your-domain.com/api/public/generate \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer {apiKey}" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                      &nbsp;&nbsp;-d '&#123;"url": "https://example.com"&#125;'
                    </code>
                  </div>
                )}

                {apiKey && (
                  <div className="mt-2 text-center">
                    <Link href="/developers" className="text-indigo-600 text-xs hover:underline">
                      API Dokumentation
                    </Link>
                  </div>
                )}
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
