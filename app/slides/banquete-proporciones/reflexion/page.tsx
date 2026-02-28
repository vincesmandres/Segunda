import type { Metadata } from "next";
import { SlideSection } from "@/components/slides/SlideSection";

export const metadata: Metadata = {
  title: "Reflexión Final — El Banquete de las Proporciones",
  description: "Equidad, participación y referencias APA del informe técnico.",
};

export default function ReflexionPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-[var(--font-pixel)] text-[var(--black)] mb-8">
        8. Reflexión Final: Equidad y Participación
      </h1>

      <SlideSection title="Equidad frente a igualdad">
        <p>
          La propuesta promueve la equidad al entender que la igualdad no es justicia. Si
          entregamos la misma hoja de papel a todos, estamos excluyendo al estudiante que no puede
          escribir o al que no puede ver el texto. Al utilizar el ecosistema Polypad + Wayground,
          ofrecemos múltiples &quot;puertas de entrada&quot; al mismo conocimiento.
        </p>
      </SlideSection>

      <SlideSection title="Participación y agencia">
        <p>
          Esta actividad garantiza la participación porque el estudiante tiene agencia sobre su
          aprendizaje. El éxito de un estudiante con discalculia al lograr emparejar fracciones
          equivalentes de forma visual en Polypad tiene el mismo valor pedagógico que el cálculo
          simbólico de otro compañero. La tecnología y la metodología activa se unen para que la
          matemática deje de ser &quot;el filtro que expulsa estudiantes&quot; y se convierta en la
          herramienta que les permite entender y transformar su realidad.
        </p>
      </SlideSection>

      <SlideSection title="Referencias (APA 7)">
        <ul className="list-none pl-0 space-y-2 text-sm">
          <li>Bruner, J. (1997). <em>La educación, puerta de la cultura.</em> Editorial Visor.</li>
          <li>CAST. (2018). Universal Design for Learning Guidelines version 2.2. http://udlguidelines.cast.org</li>
          <li>Mathigon. (2024). Polypad: The world&apos;s most flexible digital manipulatives. https://mathigon.org/polypad</li>
          <li>Topping, K. J. (2005). Trends in peer learning. <em>Educational Psychology</em>, 25(6), 631–645.</li>
          <li>UNESCO. (2017). <em>Guía para asegurar la inclusión y la equidad en la educación.</em> UNESCO.</li>
        </ul>
      </SlideSection>
    </main>
  );
}
