import type { Size, Neck, Sleeves, Stitch, YarnWeight, Fit } from "@/types";

export const SIZE_OPTIONS: { value: Size; label: string }[] = [
	{ value: "s", label: "S" },
	{ value: "m", label: "M" },
	{ value: "l", label: "L" },
];

export const NECK_OPTIONS: { value: Neck; label: string }[] = [
	{ value: "redondo", label: "Redondo" },
	{ value: "pico", label: "En pico" },
	{ value: "alto", label: "Alto" },
];

export const SLEEVES_OPTIONS: { value: Sleeves; label: string }[] = [
	{ value: "anchas", label: "Anchas" },
	{ value: "ajustadas", label: "Ajustadas" },
	{ value: "rectas", label: "Rectas" },
];

export const STITCH_OPTIONS: { value: Stitch; label: string }[] = [
	{ value: "punto_bajo", label: "Punto bajo" },
	{ value: "punto_alto", label: "Punto alto" },
	{ value: "relieve", label: "Relieve" },
];

export const YARN_WEIGHT_OPTIONS: { value: YarnWeight; label: string }[] = [
	{ value: "fino", label: "Fino" },
	{ value: "medio", label: "Medio" },
	{ value: "grueso", label: "Grueso" },
];

export const FIT_OPTIONS: { value: Fit; label: string }[] = [
	{ value: "ajustado", label: "Ajustado" },
	{ value: "normal", label: "Normal" },
	{ value: "oversize", label: "Oversize" },
];

//Opciones de filtro para la página de patrones

export const FILTER_FIT_OPTIONS = [
	{ value: "todos", label: "Todos" },
	{ value: "ajustado", label: "Ajustado" },
	{ value: "normal", label: "Normal" },
	{ value: "oversize", label: "Oversize" },
] as const;

export const FILTER_STITCH_OPTIONS = [
	{ value: "todos", label: "Todos" },
	{ value: "punto_bajo", label: "Punto bajo" },
	{ value: "punto_alto", label: "Punto alto" },
	{ value: "relieve", label: "Relieve" },
] as const;

export const FILTER_SLEEVES_OPTIONS = [
	{ value: "todos", label: "Todas" },
	{ value: "anchas", label: "Anchas" },
	{ value: "ajustadas", label: "Ajustadas" },
	{ value: "rectas", label: "Rectas" },
] as const;

export const SORT_OPTIONS = [
	{ value: "recientes", label: "Más recientes" },
	{ value: "populares", label: "Más populares" },
] as const;

export const PATTERNS_PER_PAGE = 9;

// Tamaños de ganchillo recomendados según el grosor del hilo

export const FIT_PILL_STYLE: Record<string, { bg: string; color: string }> = {
	ajustado: { bg: "#FDECEA", color: "#E03020" },
	normal: { bg: "#FDF4F0", color: "#C8715A" },
	oversize: { bg: "#1A0A08", color: "#FFFFFF" },
};
