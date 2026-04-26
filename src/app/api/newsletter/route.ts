import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		// Validación básica
		if (!email || typeof email !== "string") {
			return NextResponse.json(
				{ error: "El email es obligatorio." },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "El formato del email no es válido." },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		const { error } = await supabase
			.from("newsletter_subscribers")
			.insert({ email: email.toLowerCase().trim() });

		// Si el email ya existe (unique constraint) devolvemos ok igualmente
		// para no revelar si un email está suscrito o no
		if (error && error.code !== "23505") {
			console.error("Newsletter insert error:", error);
			return NextResponse.json(
				{ error: "Ha ocurrido un error. Inténtalo de nuevo." },
				{ status: 500 },
			);
		}

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "Ha ocurrido un error. Inténtalo de nuevo." },
			{ status: 500 },
		);
	}
}
