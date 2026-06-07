import { createClient } from "@/lib/supabase/server";
import { CommunityClient } from "./CommunityClient";
import { css } from "../../../styled-system/css";
import type { Pattern } from "@/types";
import { PATTERNS_PER_PAGE } from "@/lib/constants";

type SearchParams = {
	search?: string;
	fit?: string;
	stitch?: string;
	sleeves?: string;
	sort?: string;
	page?: string;
};

async function getPatterns(params: SearchParams) {
	const supabase = await createClient();

	let query = supabase
		.from("patterns")
		.select("*, profiles(username)", { count: "exact" })
		.eq("is_public", true);

	if (params.search) {
		query = query.ilike("title", `%${params.search}%`);
	}
	if (params.fit && params.fit !== "todos") {
		query = query.eq("fit", params.fit);
	}
	if (params.stitch && params.stitch !== "todos") {
		query = query.eq("stitch", params.stitch);
	}
	if (params.sleeves && params.sleeves !== "todos") {
		query = query.eq("sleeves", params.sleeves);
	}

	if (params.sort === "populares") {
		query = query.order("likes_count", { ascending: false });
	} else {
		query = query.order("created_at", { ascending: false });
	}

	const page = parseInt(params.page ?? "1");
	const from = (page - 1) * PATTERNS_PER_PAGE;
	const to = from + PATTERNS_PER_PAGE - 1;

	query = query.range(from, to);

	const { data, count, error } = await query;

	if (error || !data) return { patterns: [], total: 0 };

	return {
		patterns: data as (Pattern & { profiles: { username: string } })[],
		total: count ?? 0,
	};
}

async function getUserFavorites(userId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("favorites")
		.select("pattern_id")
		.eq("user_id", userId);
	return (data ?? []).map((f) => f.pattern_id as string);
}

export default async function ComunidadPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [{ patterns, total }, favorites] = await Promise.all([
		getPatterns(searchParams),
		user ? getUserFavorites(user.id) : Promise.resolve([]),
	]);

	const totalPages = Math.ceil(total / PATTERNS_PER_PAGE);
	const currentPage = parseInt(searchParams.page ?? "1");

	return (
		<div
			className={css({
				minHeight: "calc(100vh - 58px)",
			})}
		>
			<div
				className={css({
					backgroundColor: "#FFFFFF",
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
					Comunidad
				</p>
				<h1
					className={css({
						fontFamily: "fraunces",
						fontWeight: "300",
						fontSize: { base: "28px", md: "42px" },
						color: "#1A0A08",
						marginBottom: "6px",
					})}
				>
					Patrones de la comunidad
				</h1>
				<h2
					className={css({
						fontFamily: "dmSans",
						fontWeight: "300",
						fontSize: { base: "14px", md: "16px" },
						color: "#664438",
					})}
				>
					Explora, inspírate y comparte tus propios patrones
				</h2>
			</div>

			<CommunityClient
				patterns={patterns}
				total={total}
				totalPages={totalPages}
				currentPage={currentPage}
				favorites={favorites}
				isAuthenticated={!!user}
				currentFilters={{
					search: searchParams.search ?? "",
					fit: searchParams.fit ?? "todos",
					stitch: searchParams.stitch ?? "todos",
					sleeves: searchParams.sleeves ?? "todos",
					sort: searchParams.sort ?? "recientes",
				}}
			/>
		</div>
	);
}
