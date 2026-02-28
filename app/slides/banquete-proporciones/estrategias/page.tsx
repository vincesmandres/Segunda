import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Estrategias Inclusivas — El Banquete de las Proporciones",
  description: "Gamificación con Wayground, aprendizaje cooperativo y uso de Polypad.",
};

export default function EstrategiasPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        3. Estrategias Inclusivas Seleccionadas
      </h1>

      <SlideSection title="Tres estrategias de metodologías activas integradas">
        <p>
          Se implementan de forma articulada para que la diversidad de talentos y estilos de
          aprendizaje encuentre múltiples puntos de apoyo.
        </p>
      </SlideSection>

      <SlideSection title="Estrategia 1: Gamificación y rutas autónomas (Wayground)">
        <p>
          Utilizamos Wayground para crear un &quot;mapa de aventura&quot; donde el estudiante no es
          un receptor pasivo, sino un explorador que elige retos según su nivel de preparación. Esto
          respeta el principio DUA de implicación y autonomía.
        </p>
      </SlideSection>

      <SlideSection title="Estrategia 2: Aprendizaje cooperativo y tutoría entre pares">
        <p>
          Se organizan grupos heterogéneos con roles asignados: el &quot;Arquitecto de
          Polypad&quot;, el &quot;Analista de Datos&quot;, el &quot;Comunicador&quot;. La
          diversidad de talentos contribuye al éxito del equipo y refuerza la inclusión social.
        </p>
      </SlideSection>

      <SlideSection title="Estrategia 3: Uso de TIC accesibles (Polypad)">
        <p>
          Polypad se utiliza como manipulativo digital que permite el error sin penalización. Es una
          herramienta que facilita la representación múltiple de un mismo concepto de forma
          dinámica (fracciones, círculos, balanzas), alineada con la etapa icónica de Bruner.
        </p>
      </SlideSection>
    </main>
  );
}
