import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { css } from "../../../styled-system/css";
import { MiCuentaClient } from "./MiCuentaClient";
import type { Pattern } from "@/types";

async function getUserPatterns(userId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("patterns")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });
	return (data ?? []) as Pattern[];
}

async function getFavoritePatterns(userId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("favorites")
		.select("patterns(*, profiles(username))")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });
	return (data ?? [])
		.map((f) => f.patterns)
		.filter(Boolean) as unknown as (Pattern & {
		profiles: { username: string };
	})[];
}

export default async function MiCuentaPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect("/login?redirect=/mi-cuenta");

	const { data: profile } = await supabase
		.from("profiles")
		.select("username, age, bio, avatar_url")
		.eq("id", user.id)
		.single();

	const [myPatterns, favoritePatterns] = await Promise.all([
		getUserPatterns(user.id),
		getFavoritePatterns(user.id),
	]);

	return (
		<div
			className={css({
				minHeight: "calc(100vh - 58px)",
				backgroundColor: "#FFFFFF",
			})}
		>
			{/* Header */}
			<div
				className={css({
					borderBottom: "1px solid #EDE5E3",
					padding: { base: "30px 24px 24px", md: "40px 40px 32px" },
					display: "flex",
					alignItems: "center",
					gap: "20px",
				})}
			>
				{/* Avatar */}
				{profile?.avatar_url && (
					<div
						className={css({
							width: "60px",
							height: "60px",
							borderRadius: "50%",
							overflow: "hidden",
							border: "1px solid #EDE5E3",
							flexShrink: "0",
						})}
					>
						<Image
							src={profile.avatar_url}
							alt="Avatar"
							width={60}
							height={60}
							className={css({
								objectFit: "cover",
								width: "100%",
								height: "100%",
							})}
						/>
					</div>
				)}
				<div>
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
							marginBottom: "6px",
							_before: {
								content: '""',
								display: "block",
								width: "20px",
								height: "1.5px",
								backgroundColor: "#E03020",
							},
						})}
					>
						Mi cuenta
					</p>
					<h1
						className={css({
							fontFamily: "fraunces",
							fontWeight: "300",
							fontSize: { base: "26px", md: "36px" },
							color: "#1A0A08",
							marginBottom: "4px",
						})}
					>
						Hola, {profile?.username ?? "tejedora"}
					</h1>
					<p
						className={css({
							fontSize: "13px",
							fontFamily: "dmSans",
							fontWeight: "300",
							color: "#AA8880",
						})}
					>
						{user.email}
						{profile?.bio && (
							<span
								className={css({
									marginLeft: "10px",
									color: "#664438",
								})}
							>
								· {profile.bio}
							</span>
						)}
					</p>
				</div>
			</div>

			<MiCuentaClient
				myPatterns={myPatterns}
				favoritePatterns={favoritePatterns}
				username={profile?.username ?? ""}
				email={user.email ?? ""}
				age={profile?.age ?? null}
				bio={profile?.bio ?? null}
				avatarUrl={profile?.avatar_url ?? null}
			/>
		</div>
	);
}
