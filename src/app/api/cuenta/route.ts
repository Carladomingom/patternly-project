import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function DELETE() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const adminSupabase = createAdminClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);

	const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

	if (error) {
		return NextResponse.json(
			{ error: "Error al eliminar la cuenta" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ ok: true });
}
