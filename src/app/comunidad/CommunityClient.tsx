"use client";

import { css } from "../../../styled-system/css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { PatternCard } from "@/app/components/ui/PatternCard";
import type { Pattern } from "@/types";

type Filters = {
	search: string;
	fit: string;
	stitch: string;
	sleeves: string;
	sort: string;
};

type Props = {
	patterns: (Pattern & { profiles: { username: string } })[];
	total: number;
	totalPages: number;
	currentPage: number;
	favorites: string[];
	isAuthenticated: boolean;
	currentFilters: Filters;
};

const FIT_OPTIONS = [
	{ value: "todos", label: "Silueta" },
	{ value: "ajustado", label: "Ajustado" },
	{ value: "normal", label: "Normal" },
	{ value: "oversize", label: "Oversize" },
];

const STITCH_OPTIONS = [
	{ value: "todos", label: "Tipo de punto" },
	{ value: "punto_bajo", label: "Punto bajo" },
	{ value: "punto_alto", label: "Punto alto" },
	{ value: "relieve", label: "Relieve" },
];

const SLEEVES_OPTIONS = [
	{ value: "todos", label: "Tipo de manga" },
	{ value: "anchas", label: "Anchas" },
	{ value: "ajustadas", label: "Ajustadas" },
	{ value: "rectas", label: "Rectas" },
];

const SORT_OPTIONS = [
	{ value: "recientes", label: "Más recientes" },
	{ value: "populares", label: "Más populares" },
];

const selectStyle = css({
	backgroundColor: "#FFFFFF",
	border: "1px solid #EDE5E3",
	borderRadius: "8px",
	paddingTop: "8px",
	paddingBottom: "8px",
	paddingLeft: "12px",
	paddingRight: "32px", // más espacio para la flecha
	fontSize: "13px",
	fontFamily: "dmSans",
	outline: "none",
	cursor: "pointer",
	appearance: "auto",
	_focus: { borderColor: "#E03020" },
});

export function CommunityClient({
	patterns,
	total,
	totalPages,
	currentPage,
	favorites,
	isAuthenticated,
	currentFilters,
}: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const updateParams = useCallback(
		(updates: Partial<Filters & { page: string }>) => {
			const params = new URLSearchParams(searchParams.toString());

			Object.entries(updates).forEach(([key, value]) => {
				if (!value || value === "todos" || value === "") {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			});

			if (!("page" in updates)) {
				params.delete("page");
			}

			startTransition(() => {
				router.push(`${pathname}?${params.toString()}`);
			});
		},
		[searchParams, pathname, router],
	);

	return (
		<div>
			<div
				className={css({
					backgroundColor: "#FFFFFF",
					borderBottom: "1px solid #EDE5E3",
					padding: { base: "16px 24px", md: "20px 40px" },
					display: "flex",
					flexDirection: { base: "column", md: "row" },
					alignItems: { base: "flex-start", md: "center" },
					gap: "3",
					flexWrap: "wrap",
				})}
			>
				<div
					className={css({
						position: "relative",
						flex: "1",
						minWidth: "200px",
						maxWidth: { md: "320px" },
					})}
				>
					<span
						className={css({
							position: "absolute",
							left: "12px",
							top: "50%",
							transform: "translateY(-50%)",
							fontSize: "14px",
							pointerEvents: "none",
							color: "#AA8880",
						})}
					>
						🔍
					</span>
					<input
						type="text"
						placeholder="Buscar patrones..."
						defaultValue={currentFilters.search}
						onChange={(e) =>
							updateParams({ search: e.target.value })
						}
						className={css({
							width: "100%",
							paddingTop: "9px",
							paddingBottom: "9px",
							paddingLeft: "36px",
							paddingRight: "12px",
							backgroundColor: "#FFFFFF",
							border: "1px solid #EDE5E3",
							borderRadius: "8px",
							fontSize: "13px",
							fontFamily: "dmSans",
							color: "#1A0A08",
							outline: "none",
							_placeholder: { color: "#AA8880" },
							_focus: { borderColor: "#E03020" },
						})}
					/>
				</div>

				<select
					value={currentFilters.fit}
					onChange={(e) => updateParams({ fit: e.target.value })}
					style={{
						color:
							currentFilters.fit === "todos"
								? "#E03020"
								: "#664438",
					}}
					className={selectStyle}
				>
					{FIT_OPTIONS.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>

				<select
					value={currentFilters.stitch}
					onChange={(e) => updateParams({ stitch: e.target.value })}
					style={{
						color:
							currentFilters.stitch === "todos"
								? "#E03020"
								: "#664438",
					}}
					className={selectStyle}
				>
					{STITCH_OPTIONS.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>

				<select
					value={currentFilters.sleeves}
					onChange={(e) => updateParams({ sleeves: e.target.value })}
					style={{
						color:
							currentFilters.sleeves === "todos"
								? "#E03020"
								: "#664438",
					}}
					className={selectStyle}
				>
					{SLEEVES_OPTIONS.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>

				<select
					value={currentFilters.sort}
					onChange={(e) => updateParams({ sort: e.target.value })}
					style={{ color: "#664438" }}
					className={css({
						backgroundColor: "#FFFFFF",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						paddingTop: "8px",
						paddingBottom: "8px",
						paddingLeft: "12px",
						paddingRight: "32px",
						fontSize: "13px",
						fontFamily: "dmSans",
						color: "#664438",
						outline: "none",
						cursor: "pointer",
						marginLeft: { md: "auto" },
						_focus: { borderColor: "#E03020" },
					})}
				>
					{SORT_OPTIONS.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
			</div>

			<div
				className={css({
					padding: { base: "12px 24px 0", md: "16px 40px 0" },
				})}
			>
				<p
					className={css({
						fontSize: "13px",
						fontFamily: "dmSans",
						color: "#AA8880",
					})}
				>
					{isPending
						? "Buscando..."
						: `${total} ${total === 1 ? "patrón encontrado" : "patrones encontrados"}`}
				</p>
			</div>

			<div
				className={css({
					padding: { base: "16px 24px", md: "20px 40px" },
				})}
			>
				{patterns.length > 0 ? (
					<div
						className={css({
							display: "grid",
							gridTemplateColumns: {
								base: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							},
							gap: "4",
						})}
					>
						{patterns.map((pattern) => (
							<PatternCard
								key={pattern.id}
								pattern={pattern}
								initialLiked={favorites.includes(pattern.id)}
								isAuthenticated={isAuthenticated}
							/>
						))}
					</div>
				) : (
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							padding: "60px 20px",
							gap: "3",
						})}
					>
						<p
							className={css({
								fontFamily: "fraunces",
								fontWeight: "300",
								fontStyle: "italic",
								fontSize: "20px",
								color: "#1A0A08",
							})}
						>
							No hay patrones que coincidan
						</p>
						<p
							className={css({
								fontSize: "14px",
								fontFamily: "dmSans",
								color: "#AA8880",
							})}
						>
							Prueba con otros filtros o términos de búsqueda
						</p>
					</div>
				)}

				{totalPages > 1 && (
					<div
						className={css({
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "2",
							paddingTop: "32px",
						})}
					>
						<button
							onClick={() =>
								updateParams({ page: String(currentPage - 1) })
							}
							disabled={currentPage === 1}
							className={css({
								padding: "8px 14px",
								borderRadius: "8px",
								fontSize: "13px",
								fontFamily: "dmSans",
								border: "1px solid #EDE5E3",
								backgroundColor: "#FFFFFF",
								color: "#664438",
								cursor: "pointer",
								_disabled: {
									opacity: "0.4",
									cursor: "not-allowed",
								},
								_hover: {
									borderColor: "#E03020",
									color: "#E03020",
								},
							})}
						>
							← Anterior
						</button>

						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1,
						).map((p) => (
							<button
								key={p}
								onClick={() =>
									updateParams({ page: String(p) })
								}
								className={css({
									width: "36px",
									height: "36px",
									borderRadius: "8px",
									fontSize: "13px",
									fontFamily: "dmSans",
									fontWeight: "500",
									border: "1px solid",
									cursor: "pointer",
									transition: "all 0.15s",
									backgroundColor:
										currentPage === p
											? "#E03020"
											: "#FFFFFF",
									borderColor:
										currentPage === p
											? "#E03020"
											: "#EDE5E3",
									color:
										currentPage === p
											? "#FFFFFF"
											: "#664438",
									_hover: {
										borderColor: "#E03020",
										color:
											currentPage === p
												? "#FFFFFF"
												: "#E03020",
									},
								})}
							>
								{p}
							</button>
						))}

						<button
							onClick={() =>
								updateParams({ page: String(currentPage + 1) })
							}
							disabled={currentPage === totalPages}
							className={css({
								padding: "8px 14px",
								borderRadius: "8px",
								fontSize: "13px",
								fontFamily: "dmSans",
								border: "1px solid #EDE5E3",
								backgroundColor: "#FFFFFF",
								color: "#664438",
								cursor: "pointer",
								_disabled: {
									opacity: "0.4",
									cursor: "not-allowed",
								},
								_hover: {
									borderColor: "#E03020",
									color: "#E03020",
								},
							})}
						>
							Siguiente →
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
