"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { css } from "../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import type { Pattern, Material, Step } from "@/types";

type Tab = "mis-patrones" | "favoritos" | "ajustes";

type Props = {
	myPatterns: Pattern[];
	favoritePatterns: (Pattern & { profiles: { username: string } })[];
	username: string;
	email: string;
	age: number | null;
	bio: string | null;
	avatarUrl: string | null;
};

export function MiCuentaClient({
	myPatterns,
	favoritePatterns,
	username,
	email,
	age,
	bio,
	avatarUrl,
}: Props) {
	const [tab, setTab] = useState<Tab>("mis-patrones");
	const [patterns, setPatterns] = useState(myPatterns);
	const [favorites, setFavorites] = useState(favoritePatterns);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);

	const [newUsername, setNewUsername] = useState(username);
	const [newAge, setNewAge] = useState<string>(age?.toString() ?? "");
	const [newBio, setNewBio] = useState(bio ?? "");
	const [currentAvatar, setCurrentAvatar] = useState<string | null>(
		avatarUrl,
	);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const [newEmail, setNewEmail] = useState(email);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [savingProfile, setSavingProfile] = useState(false);
	const [savingEmail, setSavingEmail] = useState(false);
	const [savingPassword, setSavingPassword] = useState(false);
	const [deletingAccount, setDeletingAccount] = useState(false);

	const [msgProfile, setMsgProfile] = useState<{
		text: string;
		ok: boolean;
	} | null>(null);
	const [msgEmail, setMsgEmail] = useState<{
		text: string;
		ok: boolean;
	} | null>(null);
	const [msgPassword, setMsgPassword] = useState<{
		text: string;
		ok: boolean;
	} | null>(null);

	const supabase = createClient();

	async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			alert("La imagen no puede superar los 2 MB.");
			return;
		}

		setUploadingAvatar(true);
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			setUploadingAvatar(false);
			return;
		}

		const ext = file.name.split(".").pop();
		const filePath = `avatars/${user.id}.${ext}`;

		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, { upsert: true });

		if (uploadError) {
			alert("Error al subir la imagen.");
			setUploadingAvatar(false);
			return;
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from("avatars").getPublicUrl(filePath);

		await supabase
			.from("profiles")
			.update({ avatar_url: publicUrl })
			.eq("id", user.id);

		setCurrentAvatar(publicUrl);
		setUploadingAvatar(false);
	}

	async function handleSaveProfile() {
		setSavingProfile(true);
		setMsgProfile(null);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			setSavingProfile(false);
			return;
		}

		if (newUsername.trim() !== username) {
			const { data: existing } = await supabase
				.from("profiles")
				.select("id")
				.eq("username", newUsername.trim())
				.single();
			if (existing) {
				setMsgProfile({
					text: "Nombre de usuario no disponible.",
					ok: false,
				});
				setSavingProfile(false);
				return;
			}
		}

		const { error } = await supabase
			.from("profiles")
			.update({
				username: newUsername.trim(),
				age: newAge ? parseInt(newAge) : null,
				bio: newBio.trim() || null,
			})
			.eq("id", user.id);

		setSavingProfile(false);
		setMsgProfile(
			error
				? { text: "Error al guardar el perfil.", ok: false }
				: { text: "Perfil actualizado correctamente.", ok: true },
		);
	}

	async function handleSaveEmail() {
		if (!newEmail.trim()) return;
		setSavingEmail(true);
		setMsgEmail(null);
		const { error } = await supabase.auth.updateUser({ email: newEmail });
		setSavingEmail(false);
		setMsgEmail(
			error
				? { text: "Error al actualizar el correo.", ok: false }
				: {
						text: "Te hemos enviado un correo de confirmación a la nueva dirección.",
						ok: true,
					},
		);
	}

	async function handleSavePassword() {
		if (newPassword !== confirmPassword) {
			setMsgPassword({
				text: "Las contraseñas no coinciden.",
				ok: false,
			});
			return;
		}
		if (newPassword.length < 6) {
			setMsgPassword({
				text: "La contraseña debe tener al menos 6 caracteres.",
				ok: false,
			});
			return;
		}
		setSavingPassword(true);
		setMsgPassword(null);
		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});
		setSavingPassword(false);
		setMsgPassword(
			error
				? { text: "Error al cambiar la contraseña.", ok: false }
				: { text: "Contraseña actualizada correctamente.", ok: true },
		);
		if (!error) {
			setNewPassword("");
			setConfirmPassword("");
		}
	}

	async function handleDeleteAccount() {
		if (
			!confirm(
				"¿Segura que quieres eliminar tu cuenta? Esta acción es permanente.",
			)
		)
			return;
		if (
			!confirm(
				"Última confirmación: se eliminarán todos tus datos. ¿Continuar?",
			)
		)
			return;
		setDeletingAccount(true);
		await fetch("/api/cuenta/eliminar", { method: "DELETE" });
		await supabase.auth.signOut();
		window.location.href = "/";
	}

	async function handleDelete(id: string) {
		if (!confirm("¿Segura que quieres eliminar este patrón?")) return;
		setDeletingId(id);
		const { error } = await supabase.from("patterns").delete().eq("id", id);
		setDeletingId(null);
		if (!error) setPatterns((prev) => prev.filter((p) => p.id !== id));
	}

	async function handleShare(id: string) {
		await navigator.clipboard.writeText(
			`${window.location.origin}/patron/${id}`,
		);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	}

	async function handleDownload(pattern: Pattern) {
		setDownloadingId(pattern.id);
		try {
			const { jsPDF } = await import("jspdf");
			const doc = new jsPDF({ unit: "mm", format: "a4" });
			const margin = 20;
			const pageWidth = doc.internal.pageSize.getWidth();
			const maxWidth = pageWidth - margin * 2;
			let y = margin;

			function checkPage(n = 10) {
				if (y + n > doc.internal.pageSize.getHeight() - margin) {
					doc.addPage();
					y = margin;
				}
			}
			function divider() {
				checkPage(8);
				doc.setDrawColor(237, 229, 227);
				doc.setLineWidth(0.3);
				doc.line(margin, y, pageWidth - margin, y);
				y += 6;
			}

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
			doc.text(`por @${username}`, margin, y);
			y += 12;
			divider();

			doc.setFontSize(9);
			doc.setFont("helvetica", "bold");
			doc.setTextColor(170, 136, 128);
			doc.text("CARACTERÍSTICAS", margin, y);
			y += 6;
			[
				["Talla", pattern.size.toUpperCase()],
				["Cuello", pattern.neck],
				["Mangas", pattern.sleeves],
				["Punto", pattern.stitch.replace("_", " ")],
				["Hilo", pattern.yarn_weight],
				["Silueta", pattern.fit],
			].forEach(([l, v]) => {
				checkPage(7);
				doc.setFontSize(10);
				doc.setFont("helvetica", "bold");
				doc.setTextColor(26, 10, 8);
				doc.text(`${l}:`, margin, y);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(102, 68, 56);
				doc.text(v, margin + 35, y);
				y += 6;
			});
			y += 4;
			divider();

			doc.setFontSize(9);
			doc.setFont("helvetica", "bold");
			doc.setTextColor(170, 136, 128);
			doc.text("MATERIALES", margin, y);
			y += 6;
			(pattern.materials as Material[]).forEach((m) => {
				checkPage(7);
				doc.setFontSize(10);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(26, 10, 8);
				doc.text(`• ${m.name}: ${m.quantity} ${m.unit}`, margin, y);
				y += 6;
			});
			y += 4;
			divider();

			doc.setFontSize(9);
			doc.setFont("helvetica", "bold");
			doc.setTextColor(170, 136, 128);
			doc.text("PASO A PASO", margin, y);
			y += 6;
			(pattern.steps as Step[]).forEach((s) => {
				checkPage(14);
				doc.setFontSize(11);
				doc.setFont("helvetica", "bold");
				doc.setTextColor(224, 48, 32);
				doc.text(`${s.order}.`, margin, y);
				doc.setFontSize(10);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(26, 10, 8);
				const lines = doc.splitTextToSize(
					s.description,
					maxWidth - 8,
				) as string[];
				doc.text(lines, margin + 8, y);
				y += lines.length * 5 + 6;
			});

			const total = doc.getNumberOfPages();
			for (let i = 1; i <= total; i++) {
				doc.setPage(i);
				const ph = doc.internal.pageSize.getHeight();
				doc.setFillColor(250, 248, 248);
				doc.rect(0, ph - 10, pageWidth, 10, "F");
				doc.setFontSize(8);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(170, 136, 128);
				doc.text(
					`Patternly © ${new Date().getFullYear()}`,
					margin,
					ph - 3,
				);
				doc.text(
					`Página ${i} de ${total}`,
					pageWidth - margin,
					ph - 3,
					{ align: "right" },
				);
			}
			doc.save(`${pattern.title.replace(/\s+/g, "-")}.pdf`);
		} catch {
			alert("Error al generar el PDF.");
		} finally {
			setDownloadingId(null);
		}
	}

	async function handleRemoveFavorite(patternId: string) {
		const { error } = await supabase.rpc("toggle_favorite", {
			p_pattern_id: patternId,
		});
		if (!error)
			setFavorites((prev) => prev.filter((p) => p.id !== patternId));
	}

	const navItem = (active: boolean) =>
		css({
			display: "flex",
			alignItems: "center",
			gap: "10px",
			padding: "10px 14px",
			borderRadius: "8px",
			fontSize: "14px",
			fontFamily: "dmSans",
			fontWeight: active ? "500" : "400",
			color: active ? "#E03020" : "#664438",
			backgroundColor: active ? "#FDECEA" : "transparent",
			border: "none",
			cursor: "pointer",
			width: "100%",
			textAlign: "left",
			transition: "all 0.15s",
			_hover: { backgroundColor: "#FAF8F8", color: "#1A0A08" },
		});

	const inputStyle = css({
		width: "100%",
		backgroundColor: "#FFFFFF",
		border: "1px solid #EDE5E3",
		borderRadius: "8px",
		padding: "10px 14px",
		fontSize: "14px",
		fontFamily: "dmSans",
		color: "#1A0A08",
		outline: "none",
		_placeholder: { color: "#AA8880" },
		_focus: { borderColor: "#E03020" },
	});

	const saveBtn = css({
		backgroundColor: "#E03020",
		color: "#FFFFFF",
		padding: "9px 20px",
		borderRadius: "8px",
		fontSize: "13px",
		fontFamily: "dmSans",
		fontWeight: "500",
		border: "none",
		cursor: "pointer",
		transition: "background 0.15s",
		_hover: { backgroundColor: "#C02010" },
		_disabled: { opacity: "0.6", cursor: "not-allowed" },
	});

	const actionBtn = css({
		padding: "6px 12px",
		borderRadius: "6px",
		fontSize: "12px",
		fontFamily: "dmSans",
		fontWeight: "400",
		cursor: "pointer",
		transition: "all 0.15s",
		border: "1px solid #EDE5E3",
		backgroundColor: "#FFFFFF",
		color: "#664438",
		_hover: { borderColor: "#E03020", color: "#E03020" },
		_disabled: { opacity: "0.5", cursor: "not-allowed" },
	});

	const sectionCard = css({
		backgroundColor: "#FFFFFF",
		border: "1px solid #EDE5E3",
		borderRadius: "12px",
		padding: "24px",
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	});

	const sectionTitle = css({
		fontFamily: "fraunces",
		fontWeight: "300",
		fontSize: "18px",
		color: "#1A0A08",
		marginBottom: "4px",
	});

	const msgStyle = (ok: boolean) =>
		css({
			fontSize: "12px",
			fontFamily: "dmSans",
			color: ok ? "#2D7A3A" : "#E03020",
			marginTop: "4px",
		});

	const patternRow = (
		pattern: Pattern,
		showAuthor = false,
		authorName = "",
	) => (
		<div
			key={pattern.id}
			className={css({
				backgroundColor: "#FFFFFF",
				border: "1px solid #EDE5E3",
				borderRadius: "12px",
				padding: "16px 20px",
				display: "flex",
				alignItems: "center",
				gap: "16px",
				flexDirection: { base: "column", md: "row" },
			})}
		>
			<div
				className={css({
					width: "56px",
					height: "56px",
					backgroundColor: "#FAF8F8",
					borderRadius: "8px",
					border: "1px solid #EDE5E3",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: "0",
				})}
			>
				<Image
					src={`/svgs/${pattern.svg_key}.svg`}
					alt={pattern.title}
					width={40}
					height={40}
					className={css({ objectFit: "contain" })}
					onError={(e) => {
						(e.target as HTMLImageElement).style.opacity = "0.2";
					}}
				/>
			</div>
			<div className={css({ flex: "1", minWidth: "0" })}>
				<p
					className={css({
						fontFamily: "fraunces",
						fontWeight: "300",
						fontStyle: "italic",
						fontSize: "16px",
						color: "#1A0A08",
						marginBottom: "4px",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					})}
				>
					{pattern.title}
				</p>
				<div
					className={css({
						display: "flex",
						gap: "8px",
						flexWrap: "wrap",
						alignItems: "center",
					})}
				>
					<span
						className={css({
							fontSize: "11px",
							fontFamily: "dmSans",
							color: "#AA8880",
						})}
					>
						{showAuthor ? `@${authorName} · ` : ""}
						{pattern.size.toUpperCase()} ·{" "}
						{pattern.stitch.replace("_", " ")} · {pattern.fit}
					</span>
					{!showAuthor && (
						<span
							className={css({
								fontSize: "11px",
								fontFamily: "dmSans",
								fontWeight: "500",
								padding: "1px 8px",
								borderRadius: "100px",
								backgroundColor: pattern.is_public
									? "#FDECEA"
									: "#FAF8F8",
								color: pattern.is_public
									? "#E03020"
									: "#AA8880",
							})}
						>
							{pattern.is_public ? "Público" : "Privado"}
						</span>
					)}
				</div>
			</div>
			<div
				className={css({
					display: "flex",
					gap: "2",
					flexWrap: "wrap",
					justifyContent: { base: "flex-start", md: "flex-end" },
				})}
			>
				<Link href={`/patron/${pattern.id}`} className={actionBtn}>
					Ver
				</Link>
				{!showAuthor && (
					<>
						<Link
							href={`/crear-patron?edit=${pattern.id}`}
							className={actionBtn}
						>
							Editar
						</Link>
						<button
							onClick={() => handleShare(pattern.id)}
							className={actionBtn}
						>
							{copiedId === pattern.id
								? "✓ Copiado"
								: "Compartir"}
						</button>
						<button
							onClick={() => handleDownload(pattern)}
							disabled={downloadingId === pattern.id}
							className={actionBtn}
						>
							{downloadingId === pattern.id ? "..." : "PDF"}
						</button>
						<button
							onClick={() => handleDelete(pattern.id)}
							disabled={deletingId === pattern.id}
							className={css({
								padding: "6px 12px",
								borderRadius: "6px",
								fontSize: "12px",
								fontFamily: "dmSans",
								border: "1px solid #EDE5E3",
								backgroundColor: "#FFFFFF",
								color: "#AA8880",
								cursor: "pointer",
								transition: "all 0.15s",
								_hover: {
									borderColor: "#E03020",
									color: "#E03020",
									backgroundColor: "#FDECEA",
								},
								_disabled: {
									opacity: "0.5",
									cursor: "not-allowed",
								},
							})}
						>
							{deletingId === pattern.id ? "..." : "Eliminar"}
						</button>
					</>
				)}
				{showAuthor && (
					<button
						onClick={() => handleRemoveFavorite(pattern.id)}
						className={css({
							padding: "6px 12px",
							borderRadius: "6px",
							fontSize: "12px",
							fontFamily: "dmSans",
							border: "1px solid #EDE5E3",
							backgroundColor: "#FFFFFF",
							color: "#AA8880",
							cursor: "pointer",
							transition: "all 0.15s",
							_hover: {
								borderColor: "#E03020",
								color: "#E03020",
								backgroundColor: "#FDECEA",
							},
						})}
					>
						Quitar
					</button>
				)}
			</div>
		</div>
	);

	return (
		<div
			className={css({
				maxWidth: "960px",
				margin: "0 auto",
				padding: { base: "24px", md: "40px" },
				display: "grid",
				gridTemplateColumns: { base: "1fr", md: "200px 1fr" },
				gap: "6",
				alignItems: "start",
			})}
		>
			<aside
				className={css({
					backgroundColor: "#FAF8F8",
					border: "1px solid #EDE5E3",
					borderRadius: "12px",
					padding: "12px",
					display: "flex",
					flexDirection: { base: "row", md: "column" },
					gap: "2",
					overflowX: { base: "auto", md: "visible" },
				})}
			>
				<button
					onClick={() => setTab("mis-patrones")}
					className={navItem(tab === "mis-patrones")}
				>
					<span>Mis patrones</span>
					<span
						className={css({
							marginLeft: "auto",
							fontSize: "11px",
							backgroundColor:
								tab === "mis-patrones" ? "#FFFFFF" : "#EDE5E3",
							color:
								tab === "mis-patrones" ? "#E03020" : "#AA8880",
							padding: "1px 7px",
							borderRadius: "100px",
						})}
					>
						{patterns.length}
					</span>
				</button>
				<button
					onClick={() => setTab("favoritos")}
					className={navItem(tab === "favoritos")}
				>
					<span>Favoritos</span>
					<span
						className={css({
							marginLeft: "auto",
							fontSize: "11px",
							backgroundColor:
								tab === "favoritos" ? "#FFFFFF" : "#EDE5E3",
							color: tab === "favoritos" ? "#E03020" : "#AA8880",
							padding: "1px 7px",
							borderRadius: "100px",
						})}
					>
						{favorites.length}
					</span>
				</button>
				<button
					onClick={() => setTab("ajustes")}
					className={navItem(tab === "ajustes")}
				>
					<span>Ajustes</span>
				</button>
			</aside>

			<main
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: "4",
				})}
			>
				{tab === "mis-patrones" && (
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "3",
						})}
					>
						{patterns.length === 0 ? (
							<div
								className={css({
									textAlign: "center",
									padding: "60px 20px",
								})}
							>
								<p
									className={css({
										fontFamily: "fraunces",
										fontWeight: "300",
										fontStyle: "italic",
										fontSize: "20px",
										color: "#1A0A08",
										marginBottom: "16px",
									})}
								>
									Aún no has creado ningún patrón
								</p>
								<Link
									href="/crear-patron"
									className={css({
										backgroundColor: "#E03020",
										color: "#FFFFFF",
										padding: "10px 24px",
										borderRadius: "8px",
										fontSize: "13px",
										fontFamily: "dmSans",
										fontWeight: "500",
										textDecoration: "none",
									})}
								>
									Crear mi primer patrón
								</Link>
							</div>
						) : (
							<>
								{patterns.map((p) => patternRow(p))}
								<div
									className={css({
										display: "flex",
										justifyContent: "center",
										marginTop: "8px",
									})}
								>
									<Link
										href="/crear-patron"
										className={css({
											backgroundColor: "#E03020",
											color: "#FFFFFF",
											padding: "10px 28px",
											borderRadius: "8px",
											fontSize: "13px",
											fontFamily: "dmSans",
											fontWeight: "500",
											textDecoration: "none",
										})}
									>
										Crear nuevo patrón
									</Link>
								</div>
							</>
						)}
					</div>
				)}

				{tab === "favoritos" && (
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "3",
						})}
					>
						{favorites.length === 0 ? (
							<div
								className={css({
									textAlign: "center",
									padding: "60px 20px",
								})}
							>
								<p
									className={css({
										fontFamily: "fraunces",
										fontWeight: "300",
										fontStyle: "italic",
										fontSize: "20px",
										color: "#1A0A08",
										marginBottom: "16px",
									})}
								>
									Aún no tienes favoritos
								</p>
								<Link
									href="/comunidad"
									className={css({
										color: "#E03020",
										fontSize: "13px",
										fontFamily: "dmSans",
										fontWeight: "500",
										textDecoration: "none",
									})}
								>
									Explorar comunidad →
								</Link>
							</div>
						) : (
							favorites.map((p) =>
								patternRow(p, true, p.profiles.username),
							)
						)}
					</div>
				)}

				{tab === "ajustes" && (
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "4",
						})}
					>
						<div className={sectionCard}>
							<h2 className={sectionTitle}>Perfil</h2>

							<div
								className={css({
									display: "flex",
									alignItems: "center",
									gap: "16px",
								})}
							>
								<div
									className={css({
										width: "72px",
										height: "72px",
										borderRadius: "50%",
										backgroundColor: "#FAF8F8",
										border: "1px solid #EDE5E3",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
										flexShrink: "0",
										cursor: "pointer",
										position: "relative",
									})}
									onClick={() =>
										avatarInputRef.current?.click()
									}
								>
									{currentAvatar ? (
										<Image
											src={currentAvatar}
											alt="Avatar"
											width={72}
											height={72}
											className={css({
												objectFit: "cover",
												width: "100%",
												height: "100%",
											})}
										/>
									) : (
										<span
											className={css({
												fontSize: "28px",
												color: "#AA8880",
											})}
										>
											👤
										</span>
									)}
									{uploadingAvatar && (
										<div
											className={css({
												position: "absolute",
												inset: "0",
												backgroundColor:
													"rgba(255,255,255,0.7)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "10px",
												fontFamily: "dmSans",
												color: "#664438",
											})}
										>
											...
										</div>
									)}
								</div>
								<div>
									<button
										onClick={() =>
											avatarInputRef.current?.click()
										}
										className={css({
											fontSize: "13px",
											fontFamily: "dmSans",
											color: "#E03020",
											backgroundColor: "transparent",
											border: "none",
											cursor: "pointer",
											padding: "0",
											fontWeight: "500",
										})}
									>
										Cambiar foto
									</button>
									<p
										className={css({
											fontSize: "11px",
											fontFamily: "dmSans",
											color: "#AA8880",
											marginTop: "2px",
										})}
									>
										JPG, PNG o GIF · Máx. 2 MB
									</p>
								</div>
								<input
									ref={avatarInputRef}
									type="file"
									accept="image/*"
									onChange={handleAvatarChange}
									className={css({ display: "none" })}
								/>
							</div>

							<div>
								<label
									className={css({
										fontSize: "11px",
										fontFamily: "dmSans",
										fontWeight: "500",
										textTransform: "uppercase",
										letterSpacing: "0.07em",
										color: "#AA8880",
										display: "block",
										marginBottom: "6px",
									})}
								>
									Nombre de usuario
								</label>
								<input
									type="text"
									value={newUsername}
									onChange={(e) =>
										setNewUsername(e.target.value)
									}
									className={inputStyle}
								/>
							</div>

							<div>
								<label
									className={css({
										fontSize: "11px",
										fontFamily: "dmSans",
										fontWeight: "500",
										textTransform: "uppercase",
										letterSpacing: "0.07em",
										color: "#AA8880",
										display: "block",
										marginBottom: "6px",
									})}
								>
									Edad
								</label>
								<input
									type="number"
									min="1"
									max="120"
									placeholder="Tu edad"
									value={newAge}
									onChange={(e) => setNewAge(e.target.value)}
									className={inputStyle}
								/>
							</div>

							<div>
								<label
									className={css({
										fontSize: "11px",
										fontFamily: "dmSans",
										fontWeight: "500",
										textTransform: "uppercase",
										letterSpacing: "0.07em",
										color: "#AA8880",
										display: "block",
										marginBottom: "6px",
									})}
								>
									Sobre mí
								</label>
								<textarea
									placeholder="Cuéntanos algo sobre ti..."
									value={newBio}
									onChange={(e) => setNewBio(e.target.value)}
									rows={3}
									className={css({
										width: "100%",
										backgroundColor: "#FFFFFF",
										border: "1px solid #EDE5E3",
										borderRadius: "8px",
										padding: "10px 14px",
										fontSize: "14px",
										fontFamily: "dmSans",
										color: "#1A0A08",
										outline: "none",
										resize: "vertical",
										_placeholder: { color: "#AA8880" },
										_focus: { borderColor: "#E03020" },
									})}
								/>
							</div>

							{msgProfile && (
								<p className={msgStyle(msgProfile.ok)}>
									{msgProfile.text}
								</p>
							)}
							<div
								className={css({
									display: "flex",
									justifyContent: "flex-end",
								})}
							>
								<button
									onClick={handleSaveProfile}
									disabled={savingProfile}
									className={saveBtn}
								>
									{savingProfile
										? "Guardando..."
										: "Guardar perfil"}
								</button>
							</div>
						</div>

						<div className={sectionCard}>
							<h2 className={sectionTitle}>Correo electrónico</h2>
							<p
								className={css({
									fontSize: "12px",
									fontFamily: "dmSans",
									color: "#AA8880",
									marginTop: "-4px",
								})}
							>
								Te enviaremos un email de confirmación a la
								nueva dirección.
							</p>
							<input
								type="email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								className={inputStyle}
							/>
							{msgEmail && (
								<p className={msgStyle(msgEmail.ok)}>
									{msgEmail.text}
								</p>
							)}
							<div
								className={css({
									display: "flex",
									justifyContent: "flex-end",
								})}
							>
								<button
									onClick={handleSaveEmail}
									disabled={savingEmail}
									className={saveBtn}
								>
									{savingEmail ? "Guardando..." : "Guardar"}
								</button>
							</div>
						</div>

						<div className={sectionCard}>
							<h2 className={sectionTitle}>Cambiar contraseña</h2>
							<input
								type="password"
								placeholder="Nueva contraseña"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className={inputStyle}
							/>
							<input
								type="password"
								placeholder="Confirmar nueva contraseña"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								className={inputStyle}
							/>
							{msgPassword && (
								<p className={msgStyle(msgPassword.ok)}>
									{msgPassword.text}
								</p>
							)}
							<div
								className={css({
									display: "flex",
									justifyContent: "flex-end",
								})}
							>
								<button
									onClick={handleSavePassword}
									disabled={savingPassword}
									className={saveBtn}
								>
									{savingPassword
										? "Guardando..."
										: "Cambiar contraseña"}
								</button>
							</div>
						</div>

						<div
							className={css({
								backgroundColor: "#FFFFFF",
								border: "1px solid #FDECEA",
								borderRadius: "12px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							})}
						>
							<h2
								className={css({
									fontFamily: "fraunces",
									fontWeight: "300",
									fontSize: "18px",
									color: "#E03020",
								})}
							>
								Eliminar cuenta
							</h2>
							<p
								className={css({
									fontSize: "13px",
									fontFamily: "dmSans",
									fontWeight: "300",
									color: "#664438",
									lineHeight: "1.6",
								})}
							>
								Esta acción es permanente e irreversible. Se
								eliminarán todos tus patrones, favoritos y datos
								personales.
							</p>
							<div
								className={css({
									display: "flex",
									justifyContent: "flex-end",
								})}
							>
								<button
									onClick={handleDeleteAccount}
									disabled={deletingAccount}
									className={css({
										backgroundColor: "#FDECEA",
										color: "#E03020",
										padding: "9px 20px",
										borderRadius: "8px",
										fontSize: "13px",
										fontFamily: "dmSans",
										fontWeight: "500",
										border: "1px solid #E03020",
										cursor: "pointer",
										transition: "all 0.15s",
										_hover: {
											backgroundColor: "#E03020",
											color: "#FFFFFF",
										},
										_disabled: {
											opacity: "0.6",
											cursor: "not-allowed",
										},
									})}
								>
									{deletingAccount
										? "Eliminando..."
										: "Eliminar mi cuenta"}
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
