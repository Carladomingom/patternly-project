"use client";

import { useState } from "react";
import Image from "next/image";
import { css } from "../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import type { Pattern, Material, Step } from "@/types";

type Props = {
	pattern: Pattern & { profiles: { username: string } };
	initialLiked: boolean;
	isOwner: boolean;
};

const LABEL = css({
	fontSize: "10px",
	fontFamily: "dmSans",
	fontWeight: "500",
	textTransform: "uppercase",
	letterSpacing: "0.07em",
	color: "#AA8880",
	marginBottom: "4px",
});

const VALUE = css({
	fontSize: "14px",
	fontFamily: "dmSans",
	fontWeight: "500",
	color: "#1A0A08",
});

export function PatronClient({ pattern, initialLiked, isOwner }: Props) {
	const [liked, setLiked] = useState(initialLiked);
	const [count, setCount] = useState(pattern.likes_count);
	const [downloading, setDownloading] = useState(false);
	const supabase = createClient();

	async function handleLike() {
		const { data, error } = await supabase.rpc("toggle_favorite", {
			p_pattern_id: pattern.id,
		});
		if (!error) {
			const nowLiked = data as boolean;
			setLiked(nowLiked);
			setCount((c) => (nowLiked ? c + 1 : Math.max(c - 1, 0)));
		}
	}

	async function handleDownload() {
		setDownloading(true);
		try {
			const res = await fetch(`/api/patron/${pattern.id}/pdf`);
			if (!res.ok) throw new Error();
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${pattern.title.replace(/\s+/g, "-")}.pdf`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			alert("Ha ocurrido un error al descargar el patrón.");
		} finally {
			setDownloading(false);
		}
	}

	const materials = pattern.materials as Material[];
	const steps = pattern.steps as Step[];

	return (
		<div
			className={css({
				display: "grid",
				gridTemplateColumns: { base: "1fr", lg: "1fr 380px" },
				gap: "0",
				maxWidth: "1200px",
				margin: "0 auto",
				padding: { base: "24px", md: "40px" },
			})}
		>
			<div
				className={css({
					paddingRight: { lg: "48px" },
					borderRight: { lg: "1px solid #EDE5E3" },
					display: "flex",
					flexDirection: "column",
					gap: "40px",
				})}
			>
				<div>
					<h2
						className={css({
							fontFamily: "fraunces",
							fontWeight: "300",
							fontSize: "22px",
							color: "#1A0A08",
							marginBottom: "20px",
						})}
					>
						Características
					</h2>
					<div
						className={css({
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "4",
						})}
					>
						<div>
							<p className={LABEL}>Talla</p>
							<p className={VALUE}>
								{pattern.size.toUpperCase()}
							</p>
						</div>
						<div>
							<p className={LABEL}>Cuello</p>
							<p className={VALUE}>
								{pattern.neck.charAt(0).toUpperCase() +
									pattern.neck.slice(1)}
							</p>
						</div>
						<div>
							<p className={LABEL}>Mangas</p>
							<p className={VALUE}>
								{pattern.sleeves.charAt(0).toUpperCase() +
									pattern.sleeves.slice(1)}
							</p>
						</div>
						<div>
							<p className={LABEL}>Tipo de punto</p>
							<p className={VALUE}>
								{pattern.stitch.replace("_", " ")}
							</p>
						</div>
						<div>
							<p className={LABEL}>Grosor de hilo</p>
							<p className={VALUE}>
								{pattern.yarn_weight.charAt(0).toUpperCase() +
									pattern.yarn_weight.slice(1)}
							</p>
						</div>
						<div>
							<p className={LABEL}>Silueta</p>
							<p className={VALUE}>
								{pattern.fit.charAt(0).toUpperCase() +
									pattern.fit.slice(1)}
							</p>
						</div>
					</div>
				</div>

				<div
					className={css({
						height: "1px",
						backgroundColor: "#EDE5E3",
					})}
				/>

				<div>
					<h2
						className={css({
							fontFamily: "fraunces",
							fontWeight: "300",
							fontSize: "22px",
							color: "#1A0A08",
							marginBottom: "20px",
						})}
					>
						Materiales
					</h2>
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "0",
							border: "1px solid #EDE5E3",
							borderRadius: "10px",
							overflow: "hidden",
						})}
					>
						{materials.map((mat, i) => (
							<div
								key={i}
								className={css({
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "12px 16px",
									backgroundColor:
										i % 2 === 0 ? "#FFFFFF" : "#FAF8F8",
								})}
							>
								<span
									className={css({
										fontSize: "14px",
										fontFamily: "dmSans",
										fontWeight: "400",
										color: "#1A0A08",
									})}
								>
									{mat.name}
								</span>
								<span
									className={css({
										fontSize: "13px",
										fontFamily: "dmSans",
										fontWeight: "500",
										color: "#664438",
									})}
								>
									{mat.quantity} {mat.unit}
								</span>
							</div>
						))}
					</div>
				</div>

				<div
					className={css({
						height: "1px",
						backgroundColor: "#EDE5E3",
					})}
				/>

				<div>
					<h2
						className={css({
							fontFamily: "fraunces",
							fontWeight: "300",
							fontSize: "22px",
							color: "#1A0A08",
							marginBottom: "20px",
						})}
					>
						Paso a paso
					</h2>
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "4",
						})}
					>
						{steps.map((step) => (
							<div
								key={step.order}
								className={css({
									display: "flex",
									gap: "16px",
									alignItems: "flex-start",
								})}
							>
								<span
									className={css({
										fontFamily: "fraunces",
										fontWeight: "300",
										fontStyle: "italic",
										fontSize: "20px",
										color: "#E03020",
										minWidth: "28px",
										lineHeight: "1.4",
									})}
								>
									{step.order}
								</span>
								<p
									className={css({
										fontSize: "14px",
										fontFamily: "dmSans",
										fontWeight: "300",
										color: "#1A0A08",
										lineHeight: "1.7",
										paddingTop: "2px",
									})}
								>
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div
				className={css({
					paddingLeft: { lg: "40px" },
					paddingTop: { base: "40px", lg: "0" },
					display: "flex",
					flexDirection: "column",
					gap: "24px",
					alignItems: "center",
				})}
			>
				<div
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "16px",
						width: "100%",
						height: "280px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					})}
				>
					<Image
						src={`/svgs/${pattern.svg_key}.svg`}
						alt={pattern.title}
						width={200}
						height={200}
						className={css({ objectFit: "contain" })}
					/>
				</div>

				<div
					className={css({
						width: "100%",
						border: "1px solid #EDE5E3",
						borderRadius: "10px",
						overflow: "hidden",
					})}
				>
					{[
						{ label: "Talla", value: pattern.size.toUpperCase() },
						{
							label: "Punto",
							value: pattern.stitch.replace("_", " "),
						},
						{
							label: "Silueta",
							value:
								pattern.fit.charAt(0).toUpperCase() +
								pattern.fit.slice(1),
						},
						{
							label: "Hilo",
							value:
								pattern.yarn_weight.charAt(0).toUpperCase() +
								pattern.yarn_weight.slice(1),
						},
					].map(({ label, value }, i) => (
						<div
							key={label}
							className={css({
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "10px 16px",
								backgroundColor:
									i % 2 === 0 ? "#FFFFFF" : "#FAF8F8",
							})}
						>
							<span
								className={css({
									fontSize: "12px",
									fontFamily: "dmSans",
									color: "#AA8880",
									textTransform: "uppercase",
									letterSpacing: "0.06em",
								})}
							>
								{label}
							</span>
							<span
								className={css({
									fontSize: "13px",
									fontFamily: "dmSans",
									fontWeight: "500",
									color: "#1A0A08",
								})}
							>
								{value}
							</span>
						</div>
					))}
				</div>

				<div
					className={css({
						width: "100%",
						display: "flex",
						flexDirection: "column",
						gap: "2",
					})}
				>
					<button
						onClick={handleDownload}
						disabled={downloading}
						className={css({
							width: "100%",
							backgroundColor: "#E03020",
							color: "#FFFFFF",
							padding: "12px 20px",
							borderRadius: "8px",
							fontSize: "14px",
							fontFamily: "dmSans",
							fontWeight: "500",
							border: "none",
							cursor: "pointer",
							transition: "background 0.15s",
							_hover: { backgroundColor: "#C02010" },
							_disabled: {
								opacity: "0.6",
								cursor: "not-allowed",
							},
						})}
					>
						{downloading
							? "Generando PDF..."
							: "Descargar patrón en PDF"}
					</button>

					<button
						onClick={handleLike}
						className={css({
							width: "100%",
							backgroundColor: liked ? "#FDECEA" : "#FFFFFF",
							color: liked ? "#E03020" : "#664438",
							padding: "12px 20px",
							borderRadius: "8px",
							fontSize: "14px",
							fontFamily: "dmSans",
							fontWeight: "500",
							border: "1px solid",
							borderColor: liked ? "#E03020" : "#EDE5E3",
							cursor: "pointer",
							transition: "all 0.15s",
							_hover: {
								borderColor: "#E03020",
								color: "#E03020",
							},
						})}
					>
						{liked
							? "♥ Guardado en favoritos"
							: "♡ Añadir a favoritos"}
					</button>

					<p
						className={css({
							fontSize: "12px",
							fontFamily: "dmSans",
							color: "#AA8880",
							textAlign: "center",
							marginTop: "4px",
						})}
					>
						{count} {count === 1 ? "persona ha" : "personas han"}{" "}
						guardado este patrón
					</p>
				</div>
			</div>
		</div>
	);
}
