import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Introducción y Fundamentación — El Banquete de las Proporciones",
  description: "Fundamentación teórica: UNESCO, DUA, Bruner, Tutoría entre Pares. Justificación del nivel EGB.",
};

export default function IntroduccionPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        1. Introducción y Fundamentación Teórica
      </h1>

      <SlideSection title="Enseñanza de la matemática en el siglo XXI">
        <p>
          La enseñanza de la matemática enfrenta el desafío de la diversidad como una oportunidad de
          diseño, no como un obstáculo. Según la UNESCO (2017), la inclusión educativa requiere que
          el docente garantice la presencia, la participación y los logros de todos los estudiantes.
        </p>
      </SlideSection>

      <SlideSection title="Fundamentos teóricos">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Diseño Universal para el Aprendizaje (DUA):</strong> flexibilizar el currículo
            desde su origen para que todos puedan acceder al mismo conocimiento por distintas vías.
          </li>
          <li>
            <strong>Bruner (1997) — Aprendizaje por descubrimiento:</strong> el estudiante transita
            por etapas enactiva (manipulación física), icónica (representación visual en Polypad) y
            simbólica (notación matemática).
          </li>
          <li>
            <strong>Tutoría entre Pares (Topping, 2005):</strong> refuerza la dimensión social del
            aprendizaje y la inclusión dentro del aula.
          </li>
        </ul>
      </SlideSection>

      <SlideSection title="Justificación del nivel educativo (EGB Media/Superior)">
        <p>
          Se ha seleccionado la Educación General Básica porque es el periodo crítico donde se
          configuran las bases del pensamiento formal. El fracaso escolar en matemáticas en
          Bachillerato suele tener su origen en una comprensión deficiente de las fracciones en
          Básica. El uso de Polypad y Wayground en esta etapa actúa como un nivelador de
          oportunidades.
        </p>
      </SlideSection>
    </main>
  );
}
