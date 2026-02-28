import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Adaptaciones por Diversidad — El Banquete de las Proporciones",
  description: "Adaptaciones según estilos de aprendizaje, NEE, sensorial y diversidad cultural.",
};

export default function AdaptacionesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        6. Adaptaciones Específicas según la Diversidad
      </h1>

      <SlideSection title="Tabla de adaptaciones">
        <p className="mb-4">
          Cada perfil de estudiante tiene una adaptación concreta de estrategia o recurso para
          garantizar el acceso al aprendizaje.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-[var(--black)] text-sm">
            <thead>
              <tr className="bg-[var(--black)] text-[var(--white)]">
                <th className="border border-[var(--black)] p-2 text-left">Perfil de estudiante</th>
                <th className="border border-[var(--black)] p-2 text-left">Adaptación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[var(--white)]">
                <td className="border border-[var(--black)] p-2 font-medium">Estilos visuales</td>
                <td className="border border-[var(--black)] p-2">
                  Uso de códigos de colores en Polypad (cada fracción con color estándar
                  internacional).
                </td>
              </tr>
              <tr className="bg-[var(--beige)]">
                <td className="border border-[var(--black)] p-2 font-medium">Estilos kinestésicos</td>
                <td className="border border-[var(--black)] p-2">
                  Uso obligatorio de Regletas de Cuisenaire y Geoplanos físicos en la fase de
                  desarrollo.
                </td>
              </tr>
              <tr className="bg-[var(--white)]">
                <td className="border border-[var(--black)] p-2 font-medium">
                  NEE (Discapacidad intelectual leve)
                </td>
                <td className="border border-[var(--black)] p-2">
                  Reducción de la complejidad de los denominadores (mitades, cuartos y octavos
                  únicamente).
                </td>
              </tr>
              <tr className="bg-[var(--beige)]">
                <td className="border border-[var(--black)] p-2 font-medium">
                  Discapacidad sensorial (baja visión)
                </td>
                <td className="border border-[var(--black)] p-2">
                  Uso de la función de zoom de Polypad y herramientas de alto contraste en el
                  dispositivo.
                </td>
              </tr>
              <tr className="bg-[var(--white)]">
                <td className="border border-[var(--black)] p-2 font-medium">Diversidad cultural</td>
                <td className="border border-[var(--black)] p-2">
                  Inclusión de contextos de reparto de tierras o mercados locales propios de su
                  región en los problemas planteados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SlideSection>
    </main>
  );
}
