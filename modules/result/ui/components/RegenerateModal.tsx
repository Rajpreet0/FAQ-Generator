"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

/**
 * Regenerate Modal Props Interface
 *
 * Defines the props for the RegenerateModal component.
 */
interface RegenerateModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (url: string) => void;
}

/**
 * Regenerate Modal Component
 *
 * Modal dialog for regenerating FAQs with a new URL.
 * Allows users to input a different website URL to generate fresh FAQs.
 *
 * Features:
 * - Controlled dialog visibility
 * - URL input field with placeholder
 * - Cancel and confirm actions
 * - Clears input after confirmation
 * - Responsive design
 *
 * Usage:
 * - Opens when user clicks "Regenerate" button
 * - User enters new URL
 * - Confirms to trigger new FAQ generation
 * - Previous FAQs are cleared before new generation
 *
 * @param {RegenerateModalProps} props - Component props
 * @param {boolean} props.open - Controls modal visibility
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onConfirm - Callback when user confirms with new URL
 */
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