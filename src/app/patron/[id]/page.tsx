import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { css } from "../../../../styled-system/css";
import { PatronClient } from "./PatronClient";
import type { Pattern } from "@/types";

type Props = {
	params: Promise<{ id: string }>;
};

async function getPattern(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("patterns")
		.select("*, profiles(username)")
		.eq("id", id)
		.single();

	if (error || !data) return null;
	return data as Pattern & { profiles: { username: string } };
}

async function isFavorite(userId: string, patternId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("favorites")
		.select("id")
		.eq("user_id", userId)
		.eq("pattern_id", patternId)
		.single();
	return !!data;
}

export default async function PatronPage({ params }: Props) {
	const { id } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect(`/login?redirect=/patron/${id}`);
	}

	const [pattern, liked] = await Promise.all([
		getPattern(id),
		isFavorite(user.id, id),
	]);

	if (!pattern || (!pattern.is_public && pattern.user_id !== user.id)) {
		redirect("/comunidad");
	}

	return (
		<div
			className={css({
				minHeight: "calc(100vh - 58px)",
				backgroundColor: "#FFFFFF",
			})}
		>
			<div
				className={css({
					borderBottom: "1px solid #EDE5E3",
					padding: { base: "30px 24px 24px", md: "40px 40px 32px" },
				})}
			>
				<p
					className={css({
						fontSize: "12px",
						fontFamily: "dmSans",
						fontWeight: "500",
						letterSpacing: "0.1em",
						textTransform: "uppercase",
						color: "#E03020",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "10px",
						_before: {
							content: '""',
							display: "block",
							width: "20px",
							height: "1.5px",
							backgroundColor: "#E03020",
						},
					})}
				>
					@{pattern.profiles.username}
				</p>
				<h1
					className={css({
						fontFamily: "fraunces",
						fontWeight: "300",
						fontStyle: "italic",
						fontSize: { base: "28px", md: "42px" },
						color: "#1A0A08",
					})}
				>
					{pattern.title}
				</h1>
			</div>

			<PatronClient
				pattern={pattern}
				initialLiked={liked}
				isOwner={pattern.user_id === user.id}
			/>
		</div>
	);
}
