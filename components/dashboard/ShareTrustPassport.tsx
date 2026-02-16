"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui";

export function ShareTrustPassport() {
  return (
    <Button
      variant="primary"
      className="w-full sm:w-auto"
      onClick={() => {
        // MVP: solo feedback visual; luego integrar con share API o link
        if (typeof window !== "undefined") {
          window.alert(
            "Próximamente: compartir Trust Passport por enlace o exportar PDF."
          );
        }
      }}
    >
      <Share2 className="h-4 w-4" />
      Compartir Trust Passport
    </Button>
  );
}
