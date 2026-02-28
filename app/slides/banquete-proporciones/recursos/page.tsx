import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Recursos Multisensoriales — El Banquete de las Proporciones",
  description: "Polypad, Wayground, regletas Cuisenaire, infografías, videos y podcasts.",
};

export default function RecursosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        4. Conjunto de Recursos Multisensoriales
      </h1>

      <SlideSection title="Ecosistema tecnológico y físico">
        <p>
          La propuesta utiliza un conjunto de recursos de vanguardia para atender distintos canales
          sensoriales y estilos de aprendizaje.
        </p>
      </SlideSection>

      <SlideSection title="Recursos digitales">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Polypad (Mathigon):</strong> recurso digital principal para la manipulación de
            piezas de fracciones, círculos de factores primos y balanzas de álgebra.
          </li>
          <li>
            <strong>Wayground:</strong> plataforma de navegación para la hoja de ruta del
            estudiante y la gamificación.
          </li>
        </ul>
      </SlideSection>

      <SlideSection title="Recursos físicos y apoyos visuales">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Regletas de Cuisenaire y Geoplanos:</strong> material concreto para la
            experimentación táctil-kinestésica y validación de lo trabajado en pantalla.
          </li>
          <li>
            <strong>Infografías digitales y pictogramas:</strong> apoyos visuales de alta visibilidad
            para simplificar instrucciones complejas.
          </li>
          <li>
            <strong>Videos subtitulados y podcasts:</strong> acceso a la información por canales
            auditivos y visuales alternativos.
          </li>
        </ul>
      </SlideSection>
    </main>
  );
}
