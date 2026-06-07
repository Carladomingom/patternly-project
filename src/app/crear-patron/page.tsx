import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CrearPatronClient } from "./CrearPatronClient";

export default async function CrearPatronPage() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		redirect("/login?redirect=/crear-patron");
	}

	return <CrearPatronClient userId={user.id} />;
}
