"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RegenerateModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (url: string) => void;
}

const RegenerateModal: React.FC<RegenerateModalProps> = ({ open, onClose, onConfirm }) => {
  const [url, setUrl] = useState("");
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="rounded-xl">
            <DialogHeader>
                <DialogTitle>Neue URL eingeben</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
                <Input
                    placeholder="https://www.example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            <DialogFooter>
                <Button variant="secondary" onClick={onClose}>
                    Abbrechen
                </Button>

                <Button 
                    onClick={() => {
                        onConfirm(url);
                        setUrl("");
                    }}
                >
                    Neu generieren
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default RegenerateModal