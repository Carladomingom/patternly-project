import type { PatternConfig, Material, Step } from "@/types";

const TENSION: Record<string, number> = {
	fino: 22,
	medio: 18,
	grueso: 14,
};

const HOOK: Record<string, string> = {
	fino: "3 mm",
	medio: "4.5 mm",
	grueso: "6 mm",
};

const YARN_GRAMS: Record<string, Record<string, number>> = {
	fino: { s: 420, m: 520, l: 640 },
	medio: { s: 520, m: 660, l: 800 },
	grueso: { s: 680, m: 840, l: 980 },
};

const MEASUREMENTS: Record<
	string,
	{ chest: number; body: number; sleeve: number; sleeveCirc: number }
> = {
	s: { chest: 90, body: 54, sleeve: 46, sleeveCirc: 34 },
	m: { chest: 100, body: 58, sleeve: 48, sleeveCirc: 36 },
	l: { chest: 110, body: 62, sleeve: 50, sleeveCirc: 38 },
};

const FIT_EASE: Record<string, number> = {
	ajustado: 0,
	normal: 0.08,
	oversize: 0.18,
};

const SLEEVE_FACTOR: Record<string, number> = {
	anchas: 1.4,
	rectas: 1.0,
	ajustadas: 0.75,
};

const STITCH_NAME: Record<string, string> = {
	punto_bajo: "punto bajo (pb)",
	punto_alto: "punto alto (pa)",
	relieve: "punto relieve (pr)",
};

const STITCH_ROW_HEIGHT: Record<string, number> = {
	punto_bajo: 0.5,
	punto_alto: 0.9,
	relieve: 0.6,
};

function pts(cm: number, tension: number): number {
	return Math.round((cm / 10) * tension);
}

function rows(cm: number, rowHeight: number): number {
	return Math.round(cm / rowHeight);
}

function even(n: number): number {
	return n % 2 === 0 ? n : n + 1;
}

export function generateSteps(config: PatternConfig): Step[] {
	const tension = TENSION[config.yarn_weight];
	const rowH = STITCH_ROW_HEIGHT[config.stitch];
	const ease = FIT_EASE[config.fit];
	const meas = MEASUREMENTS[config.size];
	const stitch = STITCH_NAME[config.stitch];
	const slFactor = SLEEVE_FACTOR[config.sleeves];

	const chestPts = even(pts(meas.chest * (1 + ease), tension));
	const halfPts = chestPts / 2; // puntos para pieza delantera o trasera

	const bodyRows = rows(meas.body, rowH);
	const yoke = Math.round(bodyRows * 0.2); // canesú ~20% del largo
	const torsoRows = bodyRows - yoke;

	const neckPts: Record<string, number> = {
		redondo: even(pts(38, tension)),
		pico: even(pts(42, tension)),
		alto: even(pts(36, tension)),
	};
	const neckP = neckPts[config.neck];
	const neckRows = config.neck === "alto" ? rows(8, rowH) : rows(2, rowH);

	const armholePts = even(pts(20, tension));
	const sisaPts = Math.round(armholePts / 2);

	const sleeveCirc = even(pts(meas.sleeveCirc * slFactor, tension));
	const cuffPts =
		config.sleeves === "ajustadas" ? even(pts(22, tension)) : sleeveCirc;
	const sleeveRows = rows(meas.sleeve, rowH);
	const wristRows = rows(4, rowH);
	const sleeveBodyRows = sleeveRows - wristRows;

	const sleeveDecTotal = Math.max(0, Math.round((sleeveCirc - cuffPts) / 2));
	const sleeveDecEvery =
		config.sleeves === "ajustadas" && sleeveDecTotal > 0
			? Math.floor(sleeveBodyRows / sleeveDecTotal)
			: 0;

	const steps: Step[] = [];
	let order = 1;

	steps.push({
		order: order++,
		description:
			`MUESTRA DE TENSIÓN: Antes de empezar teje un cuadrado de muestra de 10x10 cm ` +
			`con ${stitch} y el ganchillo de ${HOOK[config.yarn_weight]}. ` +
			`Deberías obtener ${tension} puntos y ${Math.round(10 / rowH)} vueltas en 10 cm. ` +
			`Si tienes más puntos, sube el número del ganchillo. Si tienes menos, bájalo. ` +
			`Ajusta hasta conseguir la tensión correcta antes de empezar el jersey.`,
	});

	steps.push({
		order: order++,
		description:
			`PIEZA TRASERA — CADENA BASE: ` +
			`Haz una cadena de ${halfPts + 1} puntos (${halfPts} puntos de base + 1 punto de vuelta). ` +
			`Esta cadena corresponde a la mitad del contorno del pecho (${Math.round((meas.chest * (1 + ease)) / 2)} cm). ` +
			`Comprueba que la cadena no esté torcida antes de continuar.`,
	});

	steps.push({
		order: order++,
		description:
			`PIEZA TRASERA — CUERPO: ` +
			`Trabaja en ${stitch} ida y vuelta durante ${torsoRows} vueltas (${Math.round(torsoRows * rowH)} cm). ` +
			`Cada vuelta tendrá ${halfPts} puntos. ` +
			`${
				config.fit === "oversize"
					? `En la vuelta 3 y cada 6 vueltas después, aumenta 1 punto a cada lado (total ${Math.round(torsoRows / 6)} aumentos por lado) para dar más amplitud al cuerpo.`
					: config.fit === "ajustado"
						? `Mantén los ${halfPts} puntos constantes en todas las vueltas sin aumentos ni disminuciones.`
						: `Mantén los ${halfPts} puntos constantes en todas las vueltas.`
			} ` +
			`Usa marcadores de puntos al principio y al final de cada vuelta para no perder la cuenta.`,
	});

	steps.push({
		order: order++,
		description:
			`PIEZA TRASERA — SISA: ` +
			`Una vez alcanzadas ${torsoRows} vueltas, forma la sisa cerrando ${sisaPts} puntos a cada lado. ` +
			`Vuelta ${torsoRows + 1}: une con punto deslizado los primeros ${sisaPts} puntos, ` +
			`trabaja en ${stitch} hasta dejar los últimos ${sisaPts} puntos sin tejer. ` +
			`Te quedan ${halfPts - armholePts} puntos activos. ` +
			`Continúa durante ${yoke} vueltas más (${Math.round(yoke * rowH)} cm) para el canesú trasero. ` +
			`Cierra todos los puntos con punto deslizado y remata.`,
	});

	steps.push({
		order: order++,
		description:
			`PIEZA DELANTERA: ` +
			`Repite los pasos 2, 3 y 4 exactamente igual para la pieza delantera ` +
			`(${halfPts} puntos de base, ${torsoRows} vueltas de cuerpo, sisa de ${sisaPts} puntos a cada lado). ` +
			`${
				config.neck === "pico"
					? `Al llegar a la vuelta ${torsoRows + Math.round(yoke * 0.4)} ` +
						`del canesú, divide el trabajo en dos mitades iguales de ${Math.round((halfPts - armholePts) / 2)} puntos. ` +
						`En cada mitad disminuye 1 punto en el centro cada vuelta hasta el hombro para formar el cuello en pico.`
					: config.neck === "redondo"
						? `Al llegar a la vuelta ${torsoRows + Math.round(yoke * 0.5)} ` +
							`del canesú, cierra los ${neckP} puntos centrales para el escote redondo. ` +
							`Trabaja cada hombro por separado durante ${Math.round(yoke * 0.5)} vueltas más y cierra.`
						: `Trabaja el canesú completo igual que la parte trasera. ` +
							`El cuello alto se añadirá al unir las piezas.`
			}`,
	});

	steps.push({
		order: order++,
		description:
			`UNIÓN DE HOMBROS: ` +
			`Coloca la pieza delantera y trasera con el derecho hacia adentro. ` +
			`Une los hombros con punto deslizado o costura invisible. ` +
			`Cada hombro tiene ${Math.round((halfPts - armholePts - neckP) / 2)} puntos. ` +
			`Tira los hilos sobrantes hacia adentro con la aguja lanera.`,
	});

	if (config.neck === "redondo" || config.neck === "alto") {
		steps.push({
			order: order++,
			description:
				`CUELLO: ` +
				`Con el jersey unido en los hombros, recoge los puntos alrededor del escote. ` +
				`Deberías tener aproximadamente ${neckP} puntos. ` +
				`${
					config.neck === "alto"
						? `Teje en redondo en ${stitch} durante ${neckRows} vueltas (8 cm) para el cuello alto. ` +
							`Cierra con punto deslizado y remata dejando 20 cm de hilo.`
						: `Teje 2 vueltas en punto bajo para el ribete del cuello redondo. ` +
							`Cierra con punto deslizado y remata.`
				}`,
		});
	}

	steps.push({
		order: order++,
		description:
			`MANGA (repite para las dos): ` +
			`Recoge ${sleeveCirc} puntos alrededor de la sisa con el derecho hacia fuera. ` +
			`Coloca un marcador al inicio de la vuelta. ` +
			`Teje en redondo en ${stitch}. ` +
			`${
				config.sleeves === "ajustadas" && sleeveDecTotal > 0
					? `Para hacer la manga ajustada, disminuye 1 punto a cada lado cada ${sleeveDecEvery} vueltas. ` +
						`Repite estas disminuciones ${sleeveDecTotal} veces hasta tener ${cuffPts} puntos (${sleeveBodyRows} vueltas en total, ${Math.round(sleeveBodyRows * rowH)} cm).`
					: config.sleeves === "anchas"
						? `Mantén los ${sleeveCirc} puntos constantes durante ${sleeveBodyRows} vueltas (${Math.round(sleeveBodyRows * rowH)} cm) para la manga ancha.`
						: `Mantén los ${sleeveCirc} puntos constantes durante ${sleeveBodyRows} vueltas (${Math.round(sleeveBodyRows * rowH)} cm).`
			}`,
	});

	steps.push({
		order: order++,
		description:
			`PUÑO DE MANGA: ` +
			`Con ${cuffPts} puntos activos al final de la manga, ` +
			`teje ${wristRows} vueltas en punto bajo para el puño (${Math.round(wristRows * 0.5)} cm). ` +
			`Cierra todos los puntos con punto deslizado y remata dejando 15 cm de hilo. ` +
			`Repite con la otra manga.`,
	});

	steps.push({
		order: order++,
		description:
			`RIBETE INFERIOR DEL CUERPO: ` +
			`Una las costados del jersey (delantera + trasera) con punto deslizado o costura invisible, ` +
			`dejando abierta la sisa donde ya están unidas las mangas. ` +
			`Recoge los ${chestPts} puntos de la cadena base a lo largo del bajo del jersey. ` +
			`Teje 3 vueltas en punto bajo para el ribete inferior. ` +
			`Cierra con punto deslizado.`,
	});

	steps.push({
		order: order++,
		description:
			`ACABADO FINAL: ` +
			`Esconde todos los hilos sueltos por el revés con la aguja lanera haciendo un recorrido en zigzag ` +
			`de al menos 5 cm para que no se suelten al lavar. ` +
			`Moja el jersey con agua fría, escúrrelo sin retorcer y estíralo sobre una superficie plana ` +
			`hasta las medidas deseadas (pecho: ${Math.round(meas.chest * (1 + ease))} cm, largo: ${meas.body} cm). ` +
			`Sujeta con alfileres de bloqueo si tienes y deja secar completamente. ` +
			`¡Tu jersey de ${config.size.toUpperCase()} está listo!`,
	});

	return steps;
}

export function generateMaterials(config: PatternConfig): Material[] {
	const grams = YARN_GRAMS[config.yarn_weight]?.[config.size] ?? 600;

	return [
		{
			name: "Hilo",
			quantity: grams,
			unit: `g (grosor ${config.yarn_weight})`,
		},
		{
			name: "Ganchillo",
			quantity: 1,
			unit: `nº ${HOOK[config.yarn_weight]}`,
		},
		{
			name: "Aguja lanera",
			quantity: 1,
			unit: "unidad (para rematar hilos)",
		},
		{
			name: "Marcadores de puntos",
			quantity: 6,
			unit: "unidades",
		},
		{
			name: "Alfileres de bloqueo",
			quantity: 20,
			unit: "unidades (para el acabado)",
		},
		{
			name: "Tijeras",
			quantity: 1,
			unit: "unidad",
		},
		{
			name: "Cinta métrica",
			quantity: 1,
			unit: "unidad",
		},
	];
}

export function getSvgKey(
	config: Pick<PatternConfig, "neck" | "sleeves" | "fit">,
): string {
	return `${config.neck}_${config.sleeves}_${config.fit}`;
}
