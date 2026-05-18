"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import {
	generateMaterials,
	generateSteps,
	getSvgKey,
} from "@/lib/pattern-generator";
import {
	SIZE_OPTIONS,
	NECK_OPTIONS,
	SLEEVES_OPTIONS,
	STITCH_OPTIONS,
	YARN_WEIGHT_OPTIONS,
	FIT_OPTIONS,
} from "@/lib/constants";
import type {
	PatternConfig,
	Size,
	Neck,
	Sleeves,
	Stitch,
	YarnWeight,
	Fit,
} from "@/types";

type Props = { userId: string };

const DEFAULT_CONFIG: PatternConfig = {
	title: "",
	size: "m",
	neck: "redondo",
	sleeves: "rectas",
	stitch: "punto_bajo",
	yarn_weight: "medio",
	fit: "normal",
	is_public: false,
};

const labelStyle = css({
	fontSize: "11px",
	fontFamily: "dmSans",
	fontWeight: "500",
	textTransform: "uppercase",
	letterSpacing: "0.07em",
	color: "#AA8880",
	marginBottom: "6px",
	display: "block",
});

const selectStyle = css({
	width: "100%",
	backgroundColor: "#FFFFFF",
	border: "1px solid #EDE5E3",
	borderRadius: "8px",
	padding: "8px 14px",
	fontSize: "13px",
	fontFamily: "dmSans",
	color: "#1A0A08",
	outline: "none",
	cursor: "pointer",
	appearance: "auto",
	_focus: { borderColor: "#E03020" },
});

const optionGroupStyle = css({
	display: "flex",
	flexDirection: "column",
});

export function CrearPatronClient({ userId }: Props) {
	const [config, setConfig] = useState<PatternConfig>(DEFAULT_CONFIG);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const supabase = createClient();
	const svgKey = getSvgKey(config);

	function update<K extends keyof PatternConfig>(
		key: K,
		value: PatternConfig[K],
	) {
		setConfig((prev) => ({ ...prev, [key]: value }));
	}

	async function handleSave() {
		if (!config.title.trim()) {
			setError("El título es obligatorio.");
			return;
		}
		setSaving(true);
		setError("");

		const { data, error: err } = await supabase
			.from("patterns")
			.insert({
				user_id: userId,
				title: config.title.trim(),
				size: config.size,
				neck: config.neck,
				sleeves: config.sleeves,
				stitch: config.stitch,
				yarn_weight: config.yarn_weight,
				fit: config.fit,
				is_public: config.is_public,
				svg_key: svgKey,
				materials: generateMaterials(config),
				steps: generateSteps(config),
			})
			.select("id")
			.single();

		setSaving(false);
		if (err || !data) {
			setError("Ha ocurrido un error al guardar. Inténtalo de nuevo.");
			return;
		}
		router.push(`/patron/${data.id}`);
	}

	return (
		<div
			className={css({
				minHeight: "calc(100vh - 58px)",
				backgroundColor: "#FFFFFF",
				padding: { base: "24px", md: "40px" },
			})}
		>
			<div
				className={css({
					maxWidth: "900px",
					margin: "0 auto",
					marginBottom: "24px",
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
					Crear patrón
				</p>
				<h1
					className={css({
						fontFamily: "fraunces",
						fontWeight: "300",
						fontSize: { base: "26px", md: "34px" },
						color: "#1A0A08",
					})}
				>
					Diseña tu jersey
				</h1>
			</div>

			<div
				className={css({
					maxWidth: "900px",
					margin: "0 auto",
					border: "1.5px solid #E03020",
					borderRadius: "16px",
					overflow: "hidden",
					backgroundColor: "#FFFFFF",
				})}
			>
				<div
					className={css({
						display: "grid",
						gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
					})}
				>
					<div
						className={css({
							borderRight: { lg: "1px solid #EDE5E3" },
							borderBottom: {
								base: "1px solid #EDE5E3",
								lg: "none",
							},
							padding: { base: "28px 24px", md: "36px 36px" },
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#FFFFFF",
							position: { lg: "sticky" },
							top: { lg: "58px" },
							height: { lg: "580px" },
						})}
					>
						<p
							className={css({
								fontSize: "11px",
								fontFamily: "dmSans",
								fontWeight: "500",
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								color: "#AA8880",
								alignSelf: "flex-start",
								marginBottom: "16px",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								_before: {
									content: '""',
									display: "inline-block",
									width: "6px",
									height: "6px",
									borderRadius: "50%",
									backgroundColor: "#E03020",
									animation:
										"pulse 1.4s ease-in-out infinite",
								},
							})}
						>
							Visualización en vivo
						</p>

						<div
							className={css({
								width: "100%",
								flex: "1",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								position: "relative",
							})}
						>
							<Image
								key={svgKey}
								src={`/svgs/${svgKey}.svg`}
								alt={`Preview jersey ${svgKey}`}
								width={260}
								height={260}
								className={css({ objectFit: "contain" })}
								onError={(e) => {
									(
										e.target as HTMLImageElement
									).style.opacity = "0.12";
								}}
							/>

							<p
								className={css({
									position: "absolute",
									bottom: "0",
									right: "0",
									fontSize: "10px",
									fontFamily: "dmSans",
									color: "#AA8880",
									fontStyle: "italic",
								})}
							>
								{svgKey}.svg
							</p>
						</div>
					</div>

					<div
						className={css({
							padding: { base: "28px 24px", md: "28px 32px" },
							display: "flex",
							flexDirection: "column",
							gap: "3",
						})}
					>
						<div className={optionGroupStyle}>
							<label className={labelStyle} htmlFor="titulo">
								Título del patrón
							</label>
							<input
								id="titulo"
								type="text"
								placeholder="Ej: Jersey boho de verano"
								value={config.title}
								onChange={(e) =>
									update("title", e.target.value)
								}
								className={css({
									width: "100%",
									backgroundColor: "#FFFFFF",
									border: "1px solid #EDE5E3",
									borderRadius: "8px",
									padding: "8px 14px",
									fontSize: "13px",
									fontFamily: "dmSans",
									color: "#1A0A08",
									outline: "none",
									_placeholder: { color: "#AA8880" },
									_focus: { borderColor: "#E03020" },
								})}
							/>
						</div>

						<div
							className={css({
								height: "1px",
								backgroundColor: "#EDE5E3",
							})}
						/>

						<div className={optionGroupStyle}>
							<label className={labelStyle}>Talla</label>
							<div className={css({ display: "flex", gap: "2" })}>
								{SIZE_OPTIONS.map((opt) => (
									<button
										key={opt.value}
										onClick={() =>
											update("size", opt.value as Size)
										}
										className={css({
											flex: "1",
											padding: "8px",
											borderRadius: "8px",
											fontSize: "13px",
											fontFamily: "dmSans",
											fontWeight: "500",
											border: "1px solid",
											cursor: "pointer",
											transition: "all 0.15s",
											backgroundColor:
												config.size === opt.value
													? "#E03020"
													: "#FFFFFF",
											borderColor:
												config.size === opt.value
													? "#E03020"
													: "#EDE5E3",
											color:
												config.size === opt.value
													? "#FFFFFF"
													: "#664438",
											_hover: {
												borderColor: "#E03020",
												color:
													config.size === opt.value
														? "#FFFFFF"
														: "#E03020",
											},
										})}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>

						<div className={optionGroupStyle}>
							<label className={labelStyle} htmlFor="cuello">
								Cuello
							</label>
							<select
								id="cuello"
								value={config.neck}
								onChange={(e) =>
									update("neck", e.target.value as Neck)
								}
								className={selectStyle}
							>
								{NECK_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
						</div>

						<div className={optionGroupStyle}>
							<label className={labelStyle} htmlFor="mangas">
								Mangas
							</label>
							<select
								id="mangas"
								value={config.sleeves}
								onChange={(e) =>
									update("sleeves", e.target.value as Sleeves)
								}
								className={selectStyle}
							>
								{SLEEVES_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
						</div>

						<div className={optionGroupStyle}>
							<label className={labelStyle} htmlFor="punto">
								Tipo de punto
							</label>
							<select
								id="punto"
								value={config.stitch}
								onChange={(e) =>
									update("stitch", e.target.value as Stitch)
								}
								className={selectStyle}
							>
								{STITCH_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
						</div>

						<div className={optionGroupStyle}>
							<label className={labelStyle} htmlFor="hilo">
								Grosor de hilo
							</label>
							<select
								id="hilo"
								value={config.yarn_weight}
								onChange={(e) =>
									update(
										"yarn_weight",
										e.target.value as YarnWeight,
									)
								}
								className={selectStyle}
							>
								{YARN_WEIGHT_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
						</div>

						<div className={optionGroupStyle}>
							<label className={labelStyle}>Silueta</label>
							<div className={css({ display: "flex", gap: "2" })}>
								{FIT_OPTIONS.map((opt) => (
									<button
										key={opt.value}
										onClick={() =>
											update("fit", opt.value as Fit)
										}
										className={css({
											flex: "1",
											padding: "8px 4px",
											borderRadius: "8px",
											fontSize: "12px",
											fontFamily: "dmSans",
											fontWeight: "500",
											border: "1px solid",
											cursor: "pointer",
											transition: "all 0.15s",
											backgroundColor:
												config.fit === opt.value
													? "#E03020"
													: "#FFFFFF",
											borderColor:
												config.fit === opt.value
													? "#E03020"
													: "#EDE5E3",
											color:
												config.fit === opt.value
													? "#FFFFFF"
													: "#664438",
											_hover: {
												borderColor: "#E03020",
												color:
													config.fit === opt.value
														? "#FFFFFF"
														: "#E03020",
											},
										})}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>

						<div
							className={css({
								height: "1px",
								backgroundColor: "#EDE5E3",
							})}
						/>

						<div className={optionGroupStyle}>
							<label className={labelStyle}>Visibilidad</label>
							<div className={css({ display: "flex", gap: "2" })}>
								{[
									{ value: false, label: "Privado" },
									{ value: true, label: "Público" },
								].map((opt) => (
									<button
										key={String(opt.value)}
										onClick={() =>
											update("is_public", opt.value)
										}
										className={css({
											flex: "1",
											padding: "8px",
											borderRadius: "8px",
											fontSize: "13px",
											fontFamily: "dmSans",
											fontWeight: "500",
											border: "1px solid",
											cursor: "pointer",
											transition: "all 0.15s",
											backgroundColor:
												config.is_public === opt.value
													? "#E03020"
													: "#FFFFFF",
											borderColor:
												config.is_public === opt.value
													? "#E03020"
													: "#EDE5E3",
											color:
												config.is_public === opt.value
													? "#FFFFFF"
													: "#664438",
											_hover: {
												borderColor: "#E03020",
												color:
													config.is_public ===
													opt.value
														? "#FFFFFF"
														: "#E03020",
											},
										})}
									>
										{opt.label}
									</button>
								))}
							</div>
							<p
								className={css({
									fontSize: "11px",
									fontFamily: "dmSans",
									fontWeight: "300",
									color: "#AA8880",
									marginTop: "4px",
								})}
							>
								{config.is_public
									? "Tu patrón será visible en la comunidad."
									: "Solo tú podrás ver este patrón."}
							</p>
						</div>

						{error && (
							<div
								className={css({
									backgroundColor: "#F8BDBE",
									borderRadius: "8px",
									padding: "10px 14px",
									fontSize: "13px",
									fontFamily: "dmSans",
									color: "#1A0A08",
								})}
							>
								{error}
							</div>
						)}

						<button
							onClick={handleSave}
							disabled={saving}
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
							{saving ? "Guardando patrón..." : "Guardar patrón"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
