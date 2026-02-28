import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Sistema de Evaluación Inclusiva — El Banquete de las Proporciones",
  description: "Rúbrica con criterios de pertinencia, estrategia, recurso, adaptaciones y evaluación.",
};

export default function EvaluacionPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        7. Sistema de Evaluación Inclusiva
      </h1>

      <SlideSection title="Criterios y niveles de la rúbrica">
        <p className="mb-4">
          La evaluación valora tanto el ajuste al DUA como el uso de estrategias, recursos y
          adaptaciones, con una evaluación flexible y multimodal.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-[var(--black)] text-sm">
            <thead>
              <tr className="bg-[var(--black)] text-[var(--white)]">
                <th className="border border-[var(--black)] p-2 text-left">Criterio</th>
                <th className="border border-[var(--black)] p-2 text-left">Excelente (20 p)</th>
                <th className="border border-[var(--black)] p-2 text-left">Bueno (15 p)</th>
                <th className="border border-[var(--black)] p-2 text-left">Aceptable (10 p)</th>
                <th className="border border-[var(--black)] p-2 text-left">Insuficiente (5 p)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[var(--white)]">
                <td className="border border-[var(--black)] p-2 font-medium">Pertinencia (Inclusión)</td>
                <td className="border border-[var(--black)] p-2">Se ajusta 100% al DUA y objetivos.</td>
                <td className="border border-[var(--black)] p-2">Se ajusta con mínimas fallas.</td>
                <td className="border border-[var(--black)] p-2">Relación parcial; faltan adaptaciones.</td>
                <td className="border border-[var(--black)] p-2">Poco relacionada con la inclusión.</td>
              </tr>
              <tr className="bg-[var(--beige)]">
                <td className="border border-[var(--black)] p-2 font-medium">Estrategia metodológica</td>
                <td className="border border-[var(--black)] p-2">Uso brillante de Wayground y tutoría entre pares.</td>
                <td className="border border-[var(--black)] p-2">Estrategia clara pero ejecución lineal.</td>
                <td className="border border-[var(--black)] p-2">Estrategia poco desarrollada.</td>
                <td className="border border-[var(--black)] p-2">No identifica estrategia.</td>
              </tr>
              <tr className="bg-[var(--white)]">
                <td className="border border-[var(--black)] p-2 font-medium">Recurso didáctico</td>
                <td className="border border-[var(--black)] p-2">Polypad integrado de forma innovadora y multisensorial.</td>
                <td className="border border-[var(--black)] p-2">Recurso adecuado pero poco dinámico.</td>
                <td className="border border-[var(--black)] p-2">Uso limitado del recurso.</td>
                <td className="border border-[var(--black)] p-2">Sin recurso didáctico.</td>
              </tr>
              <tr className="bg-[var(--beige)]">
                <td className="border border-[var(--black)] p-2 font-medium">Adaptaciones</td>
                <td className="border border-[var(--black)] p-2">Atiende estilos, NEE y cultura con claridad.</td>
                <td className="border border-[var(--black)] p-2">Adaptaciones básicas sin detalle.</td>
                <td className="border border-[var(--black)] p-2">Adaptaciones superficiales.</td>
                <td className="border border-[var(--black)] p-2">No hay adaptaciones.</td>
              </tr>
              <tr className="bg-[var(--white)]">
                <td className="border border-[var(--black)] p-2 font-medium">Evaluación inclusiva</td>
                <td className="border border-[var(--black)] p-2">Rúbrica multimodal y flexible (audio/video/texto).</td>
                <td className="border border-[var(--black)] p-2">Instrumento adecuado pero rígido.</td>
                <td className="border border-[var(--black)] p-2">Evaluación tradicional genérica.</td>
                <td className="border border-[var(--black)] p-2">Evaluación inexistente.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SlideSection>
    </main>
  );
}
