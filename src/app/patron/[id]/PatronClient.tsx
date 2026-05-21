"use client";

import { useState } from "react";
import Image from "next/image";
import { css } from "../../../../styled-system/css";
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
			const { jsPDF } = await import("jspdf");
			const doc = new jsPDF({ unit: "mm", format: "a4" });

			const materials = pattern.materials as Material[];
			const steps = pattern.steps as Step[];

			const margin = 20;
			const pageWidth = doc.internal.pageSize.getWidth();
			const maxWidth = pageWidth - margin * 2;
			let y = margin;

			function checkPage(needed = 10) {
				if (y + needed > doc.internal.pageSize.getHeight() - margin) {
					doc.addPage();
					y = margin;
				}
			}

			function addText(
				text: string,
				size: number,
				style: "normal" | "bold" = "normal",
				color: [number, number, number] = [26, 10, 8],
			) {
				doc.setFontSize(size);
				doc.setFont("helvetica", style);
				doc.setTextColor(...color);
				const lines = doc.splitTextToSize(text, maxWidth) as string[];
				checkPage(lines.length * (size * 0.4) + 4);
				doc.text(lines, margin, y);
				y += lines.length * (size * 0.4) + 4;
			}

			function addDivider() {
				checkPage(8);
				doc.setDrawColor(237, 229, 227);
				doc.setLineWidth(0.3);
				doc.line(margin, y, pageWidth - margin, y);
				y += 6;
			}

			y = margin;

			doc.setFontSize(13);
			doc.setFont("helvetica", "bold");
			doc.setTextColor(224, 48, 32);
			doc.text("Patternly", margin, y);

			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.setTextColor(170, 136, 128);
			doc.text(
				`Generado el ${new Date().toLocaleDateString("es-ES")}`,
				pageWidth - margin,
				y,
				{ align: "right" },
			);
			y += 5;

			doc.setDrawColor(237, 229, 227);
			doc.setLineWidth(0.4);
			doc.line(margin, y, pageWidth - margin, y);
			y += 10;

			doc.setFontSize(22);
			doc.setFont("helvetica", "bolditalic");
			doc.setTextColor(26, 10, 8);
			const titleLines = doc.splitTextToSize(
				pattern.title,
				maxWidth,
			) as string[];
			doc.text(titleLines, margin, y);
			y += titleLines.length * 9 + 2;

			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.setTextColor(102, 68, 56);
			doc.text(`por @${pattern.profiles.username}`, margin, y);
			y += 12;

			addDivider();

			addText("CARACTERÍSTICAS", 9, "bold", [170, 136, 128]);
			y += 2;

			const chars = [
				["Talla", pattern.size.toUpperCase()],
				["Cuello", pattern.neck],
				["Mangas", pattern.sleeves],
				["Tipo de punto", pattern.stitch.replace("_", " ")],
				["Grosor de hilo", pattern.yarn_weight],
				["Silueta", pattern.fit],
			];

			chars.forEach(([label, value]) => {
				checkPage(7);
				doc.setFontSize(10);
				doc.setFont("helvetica", "bold");
				doc.setTextColor(26, 10, 8);
				doc.text(`${label}:`, margin, y);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(102, 68, 56);
				doc.text(value, margin + 40, y);
				y += 6;
			});

			y += 4;
			addDivider();

			addText("MATERIALES", 9, "bold", [170, 136, 128]);
			y += 2;

			materials.forEach((mat) => {
				checkPage(7);
				doc.setFontSize(10);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(26, 10, 8);
				doc.text(`• ${mat.name}:`, margin, y);
				doc.setTextColor(102, 68, 56);
				doc.text(`${mat.quantity} ${mat.unit}`, margin + 45, y);
				y += 6;
			});

			y += 4;
			addDivider();

			addText("PASO A PASO", 9, "bold", [170, 136, 128]);
			y += 2;

			steps.forEach((step) => {
				checkPage(14);

				doc.setFontSize(11);
				doc.setFont("helvetica", "bold");
				doc.setTextColor(224, 48, 32);
				doc.text(`${step.order}.`, margin, y);

				doc.setFontSize(10);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(26, 10, 8);
				const stepLines = doc.splitTextToSize(
					step.description,
					maxWidth - 8,
				) as string[];
				doc.text(stepLines, margin + 8, y);
				y += stepLines.length * 5 + 6;
			});

			y += 4;
			addDivider();

			const totalPages = doc.getNumberOfPages();
			for (let i = 1; i <= totalPages; i++) {
				doc.setPage(i);
				const pageH = doc.internal.pageSize.getHeight();
				doc.setFillColor(250, 248, 248);
				doc.rect(0, pageH - 10, pageWidth, 10, "F");
				doc.setFontSize(8);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(170, 136, 128);
				doc.text(
					"Patternly © " + new Date().getFullYear(),
					margin,
					pageH - 3,
				);
				doc.text(
					`Página ${i} de ${totalPages}`,
					pageWidth - margin,
					pageH - 3,
					{ align: "right" },
				);
			}

			doc.save(`${pattern.title.replace(/\s+/g, "-")}.pdf`);
		} catch (e) {
			console.error(e);
			alert("Ha ocurrido un error al generar el PDF.");
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
						{[
							{
								label: "Talla",
								value: pattern.size.toUpperCase(),
							},
							{
								label: "Cuello",
								value:
									pattern.neck.charAt(0).toUpperCase() +
									pattern.neck.slice(1),
							},
							{
								label: "Mangas",
								value:
									pattern.sleeves.charAt(0).toUpperCase() +
									pattern.sleeves.slice(1),
							},
							{
								label: "Tipo de punto",
								value: pattern.stitch.replace("_", " "),
							},
							{
								label: "Grosor de hilo",
								value:
									pattern.yarn_weight
										.charAt(0)
										.toUpperCase() +
									pattern.yarn_weight.slice(1),
							},
							{
								label: "Silueta",
								value:
									pattern.fit.charAt(0).toUpperCase() +
									pattern.fit.slice(1),
							},
						].map(({ label, value }) => (
							<div key={label}>
								<p className={LABEL}>{label}</p>
								<p className={VALUE}>{value}</p>
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
