"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Sparkles } from "lucide-react";

const HomeView = () => {

    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    
    const handleGenerate = async () => {
      setLoading(true);
      try {
        const extractRes = await fetch("/api/extract", {
          method: "POST",
          body: JSON.stringify({ url }),
        });

        const { content } = await extractRes.json();
        setResult(content);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center items-center w-full gap-4 ">
        <Input 
          type="text"
          className="max-w-lg"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={handleGenerate}
        >
          {loading ? (
            <Spinner/>
          ) : (
            <>
             <Sparkles /> Generieren
            </>
          )}
        </Button>
      </div>
      <div>
          {result}
      </div>
    </div> 
  )
}

export default HomeView