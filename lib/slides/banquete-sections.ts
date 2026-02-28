export const BANQUETE_SECTIONS = [
  { id: "introduccion", title: "1. Introducción y Fundamentación", path: "/slides/banquete-proporciones/introduccion" },
  { id: "barreras", title: "2. Barreras de Aprendizaje", path: "/slides/banquete-proporciones/barreras" },
  { id: "estrategias", title: "3. Estrategias Inclusivas", path: "/slides/banquete-proporciones/estrategias" },
  { id: "recursos", title: "4. Recursos Multisensoriales", path: "/slides/banquete-proporciones/recursos" },
  { id: "actividad", title: "5. Actividad: Ciudad Proporción", path: "/slides/banquete-proporciones/actividad" },
  { id: "adaptaciones", title: "6. Adaptaciones por Diversidad", path: "/slides/banquete-proporciones/adaptaciones" },
  { id: "evaluacion", title: "7. Sistema de Evaluación", path: "/slides/banquete-proporciones/evaluacion" },
  { id: "reflexion", title: "8. Reflexión Final", path: "/slides/banquete-proporciones/reflexion" },
] as const;

export type BanqueteSectionId = (typeof BANQUETE_SECTIONS)[number]["id"];

export function getPrevNext(sectionId: BanqueteSectionId): { prev: (typeof BANQUETE_SECTIONS)[number] | null; next: (typeof BANQUETE_SECTIONS)[number] | null } {
  const i = BANQUETE_SECTIONS.findIndex((s) => s.id === sectionId);
  return {
    prev: i > 0 ? BANQUETE_SECTIONS[i - 1] ?? null : null,
    next: i >= 0 && i < BANQUETE_SECTIONS.length - 1 ? BANQUETE_SECTIONS[i + 1] ?? null : null,
  };
}
