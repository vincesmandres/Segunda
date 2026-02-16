"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui";

export function ExportReputation() {
  return (
    <Button
      variant="secondary"
      className="w-full sm:w-auto"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.alert(
            "Próximamente: exportar reputación en PDF o JSON para uso con terceros."
          );
        }
      }}
    >
      <Download className="h-4 w-4" />
      Exportar reputación
    </Button>
  );
}
