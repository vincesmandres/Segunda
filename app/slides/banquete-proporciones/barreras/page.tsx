import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Barreras de Aprendizaje — El Banquete de las Proporciones",
  description: "Barreras cognitivas, sensoriales y socio-lingüísticas en el aula inclusiva.",
};

export default function BarrerasPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        2. Análisis de Barreras de Aprendizaje
      </h1>

      <SlideSection title="Objetivo del análisis">
        <p>
          Para garantizar un aula inclusiva, hemos detectado y categorizado tres barreras
          fundamentales que este proyecto busca derribar. Identificarlas permite diseñar estrategias
          y recursos que las compensen desde el origen.
        </p>
      </SlideSection>

      <SlideSection title="Barreras cognitivas (funciones ejecutivas y discalculia)">
        <p>
          Muchos estudiantes presentan dificultades para retener información abstracta en la memoria
          de trabajo. La imposibilidad de visualizar una fracción como &quot;parte de un
          todo&quot; genera un bloqueo que impide avanzar hacia la proporcionalidad. Por eso el
          proyecto prioriza manipulativos digitales y físicos que dan una representación concreta.
        </p>
      </SlideSection>

      <SlideSection title="Barreras sensoriales (percepción visual y auditiva)">
        <p>
          El uso exclusivo de la pizarra o el libro de texto excluye a estudiantes con baja visión o
          dificultades de procesamiento auditivo. La información debe ser multimodal para ser
          accesible: visual, auditiva y táctil-kinestésica.
        </p>
      </SlideSection>

      <SlideSection title="Barreras socio-lingüísticas y culturales">
        <p>
          En aulas diversas, el lenguaje técnico de la matemática puede ser una barrera para
          estudiantes con diferentes lenguas maternas o contextos socioculturales donde los
          ejemplos estándar no tienen relevancia ni significado. La propuesta incluye contextos
          cercanos (reparto de alimentos, tierras, mercados locales) y múltiples formas de
          expresión.
        </p>
      </SlideSection>
    </main>
  );
}
