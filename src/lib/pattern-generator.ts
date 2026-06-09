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
	punto_bajo: "punto bajo",
	punto_alto: "punto alto",
	relieve: "punto relieve",
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
	const halfPts = chestPts / 2;

	const bodyRows = rows(meas.body, rowH);
	const yoke = Math.round(bodyRows * 0.2);
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

	const sizeLabel = config.size.toUpperCase();
	const steps: Step[] = [];
	let order = 1;

	steps.push({
		order: order++,
		description:
			`antes de empezar haz una muestra de 10x10 cm con ${stitch} ` +
			`y el ganchillo de ${HOOK[config.yarn_weight]}, tienes que tener ${tension} puntos y ${Math.round(10 / rowH)} vueltas ` +
			`en esos 10cm. si tienes mas puntos coge un ganchillo mas grande ` +
			`y si tienes menos uno mas pequeño. es importante hacerlo sino ` +
			`luego no te van a salir las medidas bien`,
	});

	steps.push({
		order: order++,
		description:
			`empezamos por la parte de atras. haz una cadena de ${halfPts + 1} puntos, ` +
			`que son ${halfPts} puntos normales mas 1 punto de vuelta. ` +
			`la cadena tiene que medir mas o menos ${Math.round((meas.chest * (1 + ease)) / 2)} cm, ` +
			`que es la mitad del pecho para la talla ${sizeLabel}. ` +
			`antes de seguir estirala y midela para asegurarte`,
	});

	steps.push({
		order: order++,
		description:
			`teje el cuerpo en ${stitch} yendo y viniendo, vuelta a vuelta. ` +
			`tienes que hacer ${torsoRows} vueltas en total, que son unos ${Math.round(torsoRows * rowH)} cm. ` +
			`cada vuelta tiene que tener ${halfPts} puntos, ve contando de vez en cuando para no perderte. ` +
			`${
				config.fit === "oversize"
					? `como es oversize, en la vuelta 3 y luego cada 6 vueltas aumenta 1 punto a cada lado, esto le da ese aire suelto`
					: config.fit === "ajustado"
						? `como es ajustado no hagas ningun aumento ni disminucion, mantén los ${halfPts} puntos en todas las vueltas`
						: `teje recto sin cambiar el numero de puntos en ninguna vuelta`
			}`,
	});

	steps.push({
		order: order++,
		description:
			`cuando termines las ${torsoRows} vueltas hay que hacer las sisas para las mangas. ` +
			`al principio de la siguiente vuelta une con punto deslizado los primeros ${sisaPts} puntos ` +
			`y al final deja sin tejer los ultimos ${sisaPts} puntos tambien. ` +
			`te quedan ${halfPts - armholePts} puntos para seguir. ` +
			`haz otras ${yoke} vueltas mas, que son unos ${Math.round(yoke * rowH)} cm, y cierra todos los puntos. ` +
			`la parte de atras ya esta lista!`,
	});

	steps.push({
		order: order++,
		description:
			`la parte de delante se hace igual que la de atras hasta llegar a las sisas, ` +
			`misma cadena de ${halfPts} puntos, mismas ${torsoRows} vueltas y mismas sisas de ${sisaPts} puntos a cada lado. ` +
			`${
				config.neck === "pico"
					? `para el cuello en pico, cuando llegues a la vuelta ${torsoRows + Math.round(yoke * 0.4)} del canesu ` +
						`divide el trabajo en dos mitades de ${Math.round((halfPts - armholePts) / 2)} puntos cada una ` +
						`y en cada mitad quita 1 punto en el centro cada vuelta hasta llegar al hombro`
					: config.neck === "redondo"
						? `para el cuello redondo, en la vuelta ${torsoRows + Math.round(yoke * 0.5)} del canesu ` +
							`cierra los ${neckP} puntos del centro y luego trabaja cada hombro por separado ` +
							`durante ${Math.round(yoke * 0.5)} vueltas mas y cierralos`
						: `el canesu delantero se hace igual que el de atras, el cuello alto lo añadimos luego al unir las piezas`
			}`,
	});

	steps.push({
		order: order++,
		description:
			`pon la parte de delante y la de atras juntas con el lado bueno hacia adentro ` +
			`y une los hombros con punto deslizado o con costura si quieres que quede mas limpio. ` +
			`cada hombro tiene ${Math.round((halfPts - armholePts - neckP) / 2)} puntos. ` +
			`cuando esten unidos esconde bien los hilos por el reves con la aguja de lana, ` +
			`minimo 5 cm en zigzag para que no se suelten`,
	});

	if (config.neck === "redondo" || config.neck === "alto") {
		steps.push({
			order: order++,
			description:
				`para el cuello, con el jersey ya unido por los hombros, ` +
				`recoge los puntos alrededor del escote, tienen que salirte unos ${neckP} puntos. ` +
				`${
					config.neck === "alto"
						? `como es cuello alto teje en redondo con ${stitch} durante ${neckRows} vueltas que son unos 8 cm, ` +
							`cierra con punto deslizado y deja un cabo de unos 20 cm para rematar`
						: `para el cuello redondo solo necesitas 2 vueltas de punto bajo alrededor del escote para rematarlo, ` +
							`cierra con punto deslizado y esconde el hilo`
				}`,
		});
	}

	steps.push({
		order: order++,
		description:
			`las mangas se hacen igual las dos, hazlas seguidas para que no te queden diferentes. ` +
			`recoge ${sleeveCirc} puntos alrededor de la sisa con el lado bueno hacia fuera y pon un marcador al inicio. ` +
			`teje en redondo con ${stitch}. ` +
			`${
				config.sleeves === "ajustadas" && sleeveDecTotal > 0
					? `para que queden ajustadas cada ${sleeveDecEvery} vueltas quita 1 punto a cada lado, ` +
						`repite esto ${sleeveDecTotal} veces en total y al final tendras ${cuffPts} puntos. ` +
						`en total son ${sleeveBodyRows} vueltas hasta el puno, unos ${Math.round(sleeveBodyRows * rowH)} cm`
					: config.sleeves === "anchas"
						? `como son anchas teje recto sin quitar ni añadir puntos durante ${sleeveBodyRows} vueltas, unos ${Math.round(sleeveBodyRows * rowH)} cm`
						: `teje recto durante ${sleeveBodyRows} vueltas, unos ${Math.round(sleeveBodyRows * rowH)} cm`
			}`,
	});

	steps.push({
		order: order++,
		description:
			`para el puno haz ${wristRows} vueltas de punto bajo, son unos ${Math.round(wristRows * 0.5)} cm. ` +
			`cierra con punto deslizado y deja unos 15 cm de hilo para esconder. ` +
			`repite lo mismo con la otra manga`,
	});

	steps.push({
		order: order++,
		description:
			`une los costados del jersey cosiendo la parte de delante con la de atras ` +
			`desde abajo hasta la sisa. despues recoge los ${chestPts} puntos de la cadena base ` +
			`a lo largo de todo el bajo del jersey y haz 3 vueltas de punto bajo para el ribete. ` +
			`cierra con punto deslizado, esto hace que el bajo no se enrolle`,
	});

	steps.push({
		order: order++,
		description:
			`esconde todos los hilos que queden sueltos por el reves pasandolos en zigzag con la aguja de lana. ` +
			`para terminar moja el jersey con agua fria, escurrelo sin estrujarlo ` +
			`y estiralo sobre una superficie plana hasta que mida ${Math.round(meas.chest * (1 + ease))} cm de contorno ` +
			`y ${meas.body} cm de largo. dejalo secar del todo antes de usarlo. ` +
			`ya tienes tu jersey talla ${sizeLabel} listo!`,
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
		{ name: "Marcadores de puntos", quantity: 6, unit: "unidades" },
		{
			name: "Alfileres de bloqueo",
			quantity: 20,
			unit: "unidades (para el acabado)",
		},
		{ name: "Tijeras", quantity: 1, unit: "unidad" },
		{ name: "Cinta métrica", quantity: 1, unit: "unidad" },
	];
}

export function getSvgKey(
	config: Pick<PatternConfig, "neck" | "sleeves" | "fit">,
): string {
	return `${config.neck}_${config.sleeves}_${config.fit}`;
}
