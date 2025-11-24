"use client";

import GradientHeading from "@/components/GradientHeading";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqSet {
  id: string;
  title: string;
  sourceUrl: string | null;
  seoScore: number | null;
  createdAt: string;
  faqs: FaqItem[];
}

const SavedView = () => {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [faqSets, setFaqSets] = useState<FaqSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadSavedFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadSavedFaqs() {
    try {
      const response = await fetch('/api/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqSets(data);
      }
    } catch (error) {
      console.error("Error loading saved FAQs:", error);
      toast.error("Fehler beim Laden der gespeicherten FAQs");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Möchtest du diese FAQs wirklich löschen?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/faqs?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("FAQs erfolgreich gelöscht");
        setFaqSets(faqSets.filter(set => set.id !== id));
      } else {
        toast.error("Fehler beim Löschen");
      }
    } catch (error) {
      console.error("Error deleting FAQ set:", error);
      toast.error("Fehler beim Löschen");
    } finally {
      setDeletingId(null);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen px-6 py-12 flex flex-col items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Nicht angemeldet</CardTitle>
            <CardDescription>Bitte melde dich an, um deine gespeicherten FAQs zu sehen.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/auth')} className="w-full cursor-pointer">
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-6 py-12 flex flex-col items-center relative overflow-hidden
        bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800
        dark:bg-gradient-to-br dark:from-[#0d0d15] dark:via-[#0c0c13] dark:to-[#0d0d17] dark:text-slate-200
        transition-all"
    >
      <div className="absolute top-[-200px] right-[-120px] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-200px] left-[-120px] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[140px]"></div>

      <div className="w-full max-w-7xl space-y-10">
        <GradientHeading heading="💾 Gespeicherte FAQs" />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : faqSets.length === 0 ? (
          <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Noch keine FAQs gespeichert. Generiere FAQs und klicke auf "Speichern", um sie hier zu sehen.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqSets.map((faqSet) => (
              <Card
                key={faqSet.id}
                className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl hover:shadow-2xl transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{faqSet.title}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        {faqSet.sourceUrl && (
                          <a
                            href={faqSet.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Quelle
                          </a>
                        )}
                        {faqSet.seoScore && (
                          <span className="text-sm">
                            • SEO: <span className="font-semibold text-green-600 dark:text-green-400">{faqSet.seoScore}/100</span>
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faqSet.id)}
                      disabled={deletingId === faqSet.id}
                      className="cursor-pointer"
                    >
                      {deletingId === faqSet.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {faqSet.faqs.length} FAQ{faqSet.faqs.length !== 1 && 's'}
                    </p>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {faqSet.faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <h4 className="font-semibold text-sm mb-1">{faq.question}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                      Gespeichert am {new Date(faqSet.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedView;