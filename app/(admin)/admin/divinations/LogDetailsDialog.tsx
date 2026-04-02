"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, Terminal, Code } from "lucide-react";

export default function LogDetailsButton({ record }: { record: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-500 hover:text-blue-400 text-[10px] font-bold flex items-center gap-1 transition-colors uppercase tracking-tight"
      >
        Log Details
        <ExternalLink className="w-3 h-3" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col bg-slate-950 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-200">
              <Terminal className="w-5 h-5 text-blue-500" />
              Raw Divination Log
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-mono text-[10px]">
              ID: {record.id} | Created: {new Date(record.createdAt).toISOString()}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <Code className="w-3 h-3" />
                  User Context (Metadata)
                </div>
                <pre className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-[11px] font-mono text-blue-400 overflow-x-auto">
                  {JSON.stringify(record.userContext || {}, null, 2)}
                </pre>
             </div>

             <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <Code className="w-3 h-3" />
                  Full Record Payload
                </div>
                <pre className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto">
                  {JSON.stringify({
                    theme: record.theme,
                    spreadType: record.spreadType,
                    question: record.question,
                    cards: record.cards,
                    aiReading: record.aiReading ? record.aiReading.substring(0, 100) + '...' : null
                  }, null, 2)}
                </pre>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
