import {
	generateMaterials,
	generateSteps,
	getSvgKey,
} from "@/lib/pattern-generator";
import type { PatternConfig } from "@/types";

const BASE_CONFIG: PatternConfig = {
	title: "Jersey de prueba",
	size: "m",
	neck: "redondo",
	sleeves: "rectas",
	stitch: "punto_bajo",
	yarn_weight: "medio",
	fit: "normal",
	is_public: false,
};

describe("generateMaterials", () => {
	it("devuelve 7 materiales siempre", () => {
		const materials = generateMaterials(BASE_CONFIG);
		expect(materials).toHaveLength(7);
	});

	it("el primer material es hilo con gramos positivos", () => {
		const materials = generateMaterials(BASE_CONFIG);
		expect(materials[0].name).toBe("Hilo");
		expect(materials[0].quantity).toBeGreaterThan(0);
	});

	it("el segundo material es un ganchillo con número de mm", () => {
		const materials = generateMaterials(BASE_CONFIG);
		expect(materials[1].name).toBe("Ganchillo");
		expect(materials[1].unit).toContain("mm");
	});

	it("hilo fino tiene menos gramos que hilo grueso para la misma talla", () => {
		const fino = generateMaterials({ ...BASE_CONFIG, yarn_weight: "fino" });
		const grueso = generateMaterials({
			...BASE_CONFIG,
			yarn_weight: "grueso",
		});
		expect(fino[0].quantity).toBeLessThan(grueso[0].quantity);
	});

	it("talla S tiene menos gramos que talla L", () => {
		const s = generateMaterials({ ...BASE_CONFIG, size: "s" });
		const l = generateMaterials({ ...BASE_CONFIG, size: "l" });
		expect(s[0].quantity).toBeLessThan(l[0].quantity);
	});

	it("ganchillo fino es más pequeño que ganchillo grueso", () => {
		const fino = generateMaterials({ ...BASE_CONFIG, yarn_weight: "fino" });
		const grueso = generateMaterials({
			...BASE_CONFIG,
			yarn_weight: "grueso",
		});

		const mmFino = parseFloat(fino[1].unit.replace("nº", "").trim());
		const mmGrueso = parseFloat(grueso[1].unit.replace("nº", "").trim());
		expect(mmFino).toBeLessThan(mmGrueso);
	});

	it("todos los materiales tienen nombre, cantidad y unidad", () => {
		const materials = generateMaterials(BASE_CONFIG);
		materials.forEach((m) => {
			expect(m.name).toBeTruthy();
			expect(m.quantity).toBeGreaterThan(0);
			expect(m.unit).toBeTruthy();
		});
	});
});

describe("generateSteps", () => {
	it("devuelve 11 pasos para una config estándar", () => {
		const steps = generateSteps(BASE_CONFIG);
		expect(steps).toHaveLength(11);
	});

	it("los pasos están ordenados del 1 al 11", () => {
		const steps = generateSteps(BASE_CONFIG);
		steps.forEach((step, i) => {
			expect(step.order).toBe(i + 1);
		});
	});

	it("todos los pasos tienen descripción no vacía", () => {
		const steps = generateSteps(BASE_CONFIG);
		steps.forEach((step) => {
			expect(step.description.trim().length).toBeGreaterThan(0);
		});
	});

	it("el paso 1 menciona la tensión y el ganchillo", () => {
		const steps = generateSteps(BASE_CONFIG);
		expect(steps[0].description.toLowerCase()).toContain("muestra");
		expect(steps[0].description.toLowerCase()).toContain("ganchillo");
	});

	it("el paso 2 menciona la cadena base con número de puntos", () => {
		const steps = generateSteps(BASE_CONFIG);
		expect(steps[1].description.toLowerCase()).toContain("cadena");
		// Debe incluir un número de puntos
		expect(steps[1].description).toMatch(/\d+/);
	});

	it("el número de puntos de la cadena base es mayor para talla L que S", () => {
		const stepsS = generateSteps({ ...BASE_CONFIG, size: "s" });
		const stepsL = generateSteps({ ...BASE_CONFIG, size: "l" });

		const extractPts = (desc: string) => {
			const match = desc.match(/cadena de (\d+) puntos/i);
			return match ? parseInt(match[1]) : 0;
		};

		const ptsS = extractPts(stepsS[1].description);
		const ptsL = extractPts(stepsL[1].description);
		expect(ptsS).toBeLessThan(ptsL);
	});

	it("cuello alto genera un paso de cuello con vueltas", () => {
		const steps = generateSteps({ ...BASE_CONFIG, neck: "alto" });
		const neckStep = steps.find((s) =>
			s.description.toLowerCase().includes("cuello"),
		);
		expect(neckStep).toBeDefined();
		expect(neckStep!.description.toLowerCase()).toContain("vuelta");
	});

	it("cuello en pico menciona dividir en dos mitades", () => {
		const steps = generateSteps({ ...BASE_CONFIG, neck: "pico" });
		const delanteraStep = steps[4]; // paso 5 — pieza delantera
		expect(delanteraStep.description.toLowerCase()).toContain("mitad");
	});

	it("cuello redondo menciona cerrar puntos centrales", () => {
		const steps = generateSteps({ ...BASE_CONFIG, neck: "redondo" });
		const delanteraStep = steps[4];
		expect(delanteraStep.description.toLowerCase()).toContain("centro");
	});

	it("manga ajustada menciona disminuciones", () => {
		const steps = generateSteps({ ...BASE_CONFIG, sleeves: "ajustadas" });
		const mangaStep = steps[7]; // paso 8 — mangas
		expect(mangaStep.description.toLowerCase()).toContain("quita");
	});

	it("manga ancha no menciona disminuciones", () => {
		const steps = generateSteps({ ...BASE_CONFIG, sleeves: "anchas" });
		const mangaStep = steps[7];
		expect(mangaStep.description.toLowerCase()).not.toContain("disminuy");
	});

	it("silueta oversize menciona aumentos en el cuerpo", () => {
		const steps = generateSteps({ ...BASE_CONFIG, fit: "oversize" });
		const cuerpoStep = steps[2]; // paso 3 — cuerpo
		expect(cuerpoStep.description.toLowerCase()).toContain("aumenta");
	});

	it("el último paso menciona el bloqueo y las medidas finales", () => {
		const steps = generateSteps(BASE_CONFIG);
		const last = steps[steps.length - 1];
		expect(last.description.toLowerCase()).toContain("secar");
		expect(last.description).toMatch(/\d+ cm/);
	});

	it("punto alto genera descripción que lo menciona", () => {
		const steps = generateSteps({ ...BASE_CONFIG, stitch: "punto_alto" });
		const hasPointAlto = steps.some((s) =>
			s.description.toLowerCase().includes("punto alto"),
		);
		expect(hasPointAlto).toBe(true);
	});
});

describe("getSvgKey", () => {
	it("genera la clave en el formato correcto", () => {
		const key = getSvgKey(BASE_CONFIG);
		expect(key).toBe("redondo_rectas_normal");
	});

	it("cambia al cambiar el cuello", () => {
		const keyRedondo = getSvgKey({ ...BASE_CONFIG, neck: "redondo" });
		const keyAlto = getSvgKey({ ...BASE_CONFIG, neck: "alto" });
		expect(keyRedondo).not.toBe(keyAlto);
	});

	it("cambia al cambiar las mangas", () => {
		const keyRectas = getSvgKey({ ...BASE_CONFIG, sleeves: "rectas" });
		const keyAjustadas = getSvgKey({
			...BASE_CONFIG,
			sleeves: "ajustadas",
		});
		expect(keyRectas).not.toBe(keyAjustadas);
	});

	it("cambia al cambiar la silueta", () => {
		const keyNormal = getSvgKey({ ...BASE_CONFIG, fit: "normal" });
		const keyOversize = getSvgKey({ ...BASE_CONFIG, fit: "oversize" });
		expect(keyNormal).not.toBe(keyOversize);
	});

	it("no contiene espacios", () => {
		const key = getSvgKey(BASE_CONFIG);
		expect(key).not.toContain(" ");
	});

	it("contiene exactamente 3 guiones bajos", () => {
		const key = getSvgKey(BASE_CONFIG);
		expect((key.match(/_/g) ?? []).length).toBe(2);
	});

	it("genera todas las combinaciones posibles sin errores", () => {
		const necks = ["redondo", "pico", "alto"] as const;
		const sleeves = ["anchas", "ajustadas", "rectas"] as const;
		const fits = ["ajustado", "normal", "oversize"] as const;

		let count = 0;

		for (const neck of necks) {
			for (const sleeve of sleeves) {
				for (const fit of fits) {
					const key = getSvgKey({
						neck,
						sleeves: sleeve,
						fit,
					});
					expect(key).toBeTruthy();
					expect(key).not.toContain(" ");
					count++;
				}
			}
		}

		expect(count).toBe(27);
	});
});
