import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Material, Step } from "@/types";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const { data: pattern, error } = await supabase
		.from("patterns")
		.select("*, profiles(username)")
		.eq("id", params.id)
		.single();

	if (error || !pattern) {
		return NextResponse.json(
			{ error: "Patrón no encontrado" },
			{ status: 404 },
		);
	}

	if (!pattern.is_public && pattern.user_id !== user.id) {
		return NextResponse.json({ error: "No autorizado" }, { status: 403 });
	}

	const materials = pattern.materials as Material[];
	const steps = pattern.steps as Step[];

	const lines: string[] = [
		`PATTERNLY — Patrón de crochet`,
		``,
		`Título: ${pattern.title}`,
		`Autora: @${(pattern.profiles as { username: string }).username}`,
		``,
		`─────────────────────────────────────`,
		`CARACTERÍSTICAS`,
		`─────────────────────────────────────`,
		`Talla:          ${pattern.size.toUpperCase()}`,
		`Cuello:         ${pattern.neck}`,
		`Mangas:         ${pattern.sleeves}`,
		`Tipo de punto:  ${pattern.stitch.replace("_", " ")}`,
		`Grosor de hilo: ${pattern.yarn_weight}`,
		`Silueta:        ${pattern.fit}`,
		``,
		`─────────────────────────────────────`,
		`MATERIALES`,
		`─────────────────────────────────────`,
		...materials.map((m) => `• ${m.name}: ${m.quantity} ${m.unit}`),
		``,
		`─────────────────────────────────────`,
		`PASO A PASO`,
		`─────────────────────────────────────`,
		...steps.map((s) => `${s.order}. ${s.description}\n`),
		``,
		`─────────────────────────────────────`,
		`Generado con Patternly © ${new Date().getFullYear()}`,
	];

	const content = lines.join("\n");
	const buffer = Buffer.from(content, "utf-8");

	return new NextResponse(buffer, {
		status: 200,
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="${pattern.title.replace(/\s+/g, "-")}.txt"`,
		},
	});
}
