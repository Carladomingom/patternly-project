// src/lib/pattern-generator.ts
// Genera los materiales y pasos del patrón según la configuración elegida

import type { PatternConfig, Material, Step } from "@/types"

// ── Hook size map ─────────────────────────────────────────────
const HOOK_SIZE: Record<string, string> = {
  fino:  "ganchillo nº 2.5 – 3.5 mm",
  medio: "ganchillo nº 4 – 5 mm",
  grueso:"ganchillo nº 5.5 – 7 mm",
}

// ── Yarn quantity by size and weight ─────────────────────────
const YARN_GRAMS: Record<string, Record<string, number>> = {
  fino:  { s: 400, m: 500, l: 600 },
  medio: { s: 500, m: 650, l: 800 },
  grueso:{ s: 650, m: 800, l: 950 },
}

// ── Stitch name map ───────────────────────────────────────────
const STITCH_NAME: Record<string, string> = {
  punto_bajo: "punto bajo",
  punto_alto: "punto alto",
  relieve:    "punto relieve",
}

// ── Sleeve description ────────────────────────────────────────
const SLEEVE_DESC: Record<string, string> = {
  anchas:    "manga ancha",
  ajustadas: "manga ajustada",
  rectas:    "manga recta",
}

// ── Neck description ──────────────────────────────────────────
const NECK_DESC: Record<string, string> = {
  redondo: "cuello redondo",
  pico:    "cuello en pico",
  alto:    "cuello alto",
}

// ── Fit description ───────────────────────────────────────────
const FIT_DESC: Record<string, string> = {
  ajustado: "ajustado al cuerpo",
  normal:   "corte normal",
  oversize: "corte oversize",
}

// ─────────────────────────────────────────────────────────────

export function generateMaterials(config: PatternConfig): Material[] {
  const grams = YARN_GRAMS[config.yarn_weight]?.[config.size] ?? 500

  return [
    {
      name:     "Hilo",
      quantity: grams,
      unit:     "g",
    },
    {
      name:     "Ganchillo",
      quantity: 1,
      unit:     HOOK_SIZE[config.yarn_weight],
    },
    {
      name:     "Aguja lanera",
      quantity: 1,
      unit:     "unidad",
    },
    {
      name:     "Marcadores de puntos",
      quantity: 4,
      unit:     "unidades",
    },
    {
      name:     "Tijeras",
      quantity: 1,
      unit:     "unidad",
    },
  ]
}

export function generateSteps(config: PatternConfig): Step[] {
  const stitch  = STITCH_NAME[config.stitch]
  const sleeves = SLEEVE_DESC[config.sleeves]
  const neck    = NECK_DESC[config.neck]
  const fit     = FIT_DESC[config.fit]
  const sizeUpper = config.size.toUpperCase()

  return [
    {
      order: 1,
      description:
        `Haz una cadena base de ${sizeUpper === "S" ? 80 : sizeUpper === "M" ? 90 : 100} cadenas. ` +
        `Este patrón está pensado para una talla ${sizeUpper} con ${fit}.`,
    },
    {
      order: 2,
      description:
        `Trabaja el cuerpo del jersey en ${stitch}. ` +
        `Comienza por la parte trasera y sube hasta el hombro marcando los lados con marcadores de puntos.`,
    },
    {
      order: 3,
      description:
        `Al llegar a los hombros (aproximadamente ${sizeUpper === "S" ? 40 : sizeUpper === "M" ? 45 : 50} vueltas), ` +
        `separa los puntos del canesú y empieza con la parte delantera.`,
    },
    {
      order: 4,
      description:
        `Trabaja la parte delantera igual que la trasera. ` +
        `Al llegar al escote, forma el ${neck}: ` +
        `${config.neck === "pico"
          ? "disminuye un punto cada vuelta en el centro hasta terminar."
          : config.neck === "alto"
          ? "continúa tejiendo el cuello recto durante 10 vueltas más."
          : "cierra los puntos centrales y remata los hombros."}`,
    },
    {
      order: 5,
      description:
        `Une hombros con costura o punto deslizado. ` +
        `Recoge los puntos de sisa para las mangas.`,
    },
    {
      order: 6,
      description:
        `Teje las mangas en redondo con ${stitch} (${sleeves}). ` +
        `${config.sleeves === "ajustadas"
          ? "Disminuye un punto a cada lado cada 4 vueltas."
          : config.sleeves === "anchas"
          ? "Mantén el número de puntos constante durante toda la manga."
          : "Teje recto sin aumentos ni disminuciones."}`,
    },
    {
      order: 7,
      description:
        `Termina el puño con 5 vueltas de punto bajo y remata dejando unos 15 cm de hilo. ` +
        `Repite con la otra manga.`,
    },
    {
      order: 8,
      description:
        `Teje el ribete del bajo del jersey con 3 vueltas de punto bajo. ` +
        `Remata todos los hilos con la aguja lanera por el revés.`,
    },
    {
      order: 9,
      description:
        `Bloquea el jersey húmedo con alfileres sobre una superficie plana. ` +
        `Deja secar completamente antes de usar. ¡Listo!`,
    },
  ]
}

// ── SVG key generator ─────────────────────────────────────────
// Devuelve el nombre del archivo SVG según la configuración
// Formato: "{size}_{neck}_{sleeves}_{fit}"
// Ejemplo: "m_redondo_anchas_normal"

export function getSvgKey(config: Pick<PatternConfig, "size" | "neck" | "sleeves" | "fit">): string {
  return `${config.size}_${config.neck}_${config.sleeves}_${config.fit}`
}
