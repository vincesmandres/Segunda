import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Actividad Ciudad Proporción — El Banquete de las Proporciones",
  description: "Diseño DUA: fases de inicio, desarrollo y cierre de la actividad inclusiva.",
};

export default function ActividadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        5. Diseño de la Actividad Inclusiva: &quot;Ciudad Proporción&quot; (DUA)
      </h1>

      <SlideSection title="Objetivo">
        <p>
          Modelar una ciudad sostenible donde los estudiantes apliquen conceptos de fracciones y
          razones para la distribución de recursos, utilizando herramientas digitales (Polypad,
          Wayground) y físicas (regletas).
        </p>
      </SlideSection>

      <SlideSection title="A. Inicio: Activación y motivación (Principio de implicación)">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>El reto:</strong> Se presenta en Wayground un mensaje desde un futuro
            distópico: &quot;La ciudad ha perdido su equilibrio. Deben reconstruirla usando
            proporciones exactas para que sea habitable&quot;.
          </li>
          <li>
            <strong>Elección de ruta:</strong> Los estudiantes eligen si empezar con un video
            (auditivo/visual), una infografía (visual) o experimentando con piezas físicas
            (kinestésico).
          </li>
          <li>
            <strong>Conexión:</strong> Se vincula el tema con situaciones reales (repartición de
            alimentos, uso del tiempo libre).
          </li>
        </ul>
      </SlideSection>

      <SlideSection title="B. Desarrollo: Construcción y modelado (Representación y acción)">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Laboratorio Polypad:</strong> En grupos, consignas como &quot;El 2/5 de la
            ciudad debe ser área verde&quot;; uso de Fraction Tiles y Circles para quienes requieran
            división automática (NEE).
          </li>
          <li>
            <strong>Experimentación física:</strong> Regletas de Cuisenaire en el escritorio para
            validar lo que se ve en pantalla (retroalimentación táctil).
          </li>
          <li>
            <strong>Tutoría en acción:</strong> El docente como facilitador; estudiantes
            &quot;expertos&quot; ayudan a sus pares.
          </li>
        </ul>
      </SlideSection>

      <SlideSection title="C. Cierre: Comunicación y metacognición (Acción y expresión)">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Galería Wayground:</strong> Cada grupo exporta su diseño de Polypad y lo sube
            a la plataforma.
          </li>
          <li>
            <strong>Expresión multimodal:</strong> Explican el proyecto como prefieran: audio,
            informe técnico corto o póster digital con pictogramas.
          </li>
          <li>
            <strong>Autoevaluación:</strong> Breve encuesta sobre qué herramienta les ayudó más a
            entender el concepto de fracción.
          </li>
        </ul>
      </SlideSection>
    </main>
  );
}
