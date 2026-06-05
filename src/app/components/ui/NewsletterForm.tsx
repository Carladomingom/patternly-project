"use client";

import { useState } from "react";
import { css } from "../../../../styled-system/css";

export function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
		"idle",
	);
	const [message, setMessage] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!email.trim()) return;

		setStatus("loading");

		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (!res.ok) {
				setStatus("error");
				setMessage(
					data.error ?? "Ha ocurrido un error. Inténtalo de nuevo.",
				);
			} else {
				setStatus("ok");
				setMessage(
					"Si tienes una cuenta con nosotras, recibirás un correo electrónico con instrucciones para recuperar tu contraseña.",
				);
				setEmail("");
			}
		} catch {
			setStatus("error");
			setMessage("Ha ocurrido un error. Inténtalo de nuevo.");
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={css({
				display: "flex",
				flexDirection: "column",
				gap: "2",
				flex: "1",
				width: {
					base: "100%",
					md: "auto",
				},
			})}
		>
			<input
				type="email"
				placeholder="Introduce tu email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				disabled={status === "loading" || status === "ok"}
				className={css({
					backgroundColor: "#FAF8F8",
					border: "1px solid #EDE5E3",
					borderRadius: "8px",
					padding: "12px 16px",
					fontSize: "14px",
					fontFamily: "dmSans",
					color: "#1A0A08",
					outline: "none",
					width: "100%",
					_placeholder: {
						color: "#AA8880",
					},
					_focus: {
						borderColor: "#E03020",
					},
					_disabled: {
						opacity: "0.6",
						cursor: "not-allowed",
					},
				})}
			/>
			<button
				type="submit"
				disabled={status === "loading" || status === "ok"}
				className={css({
					backgroundColor: "#E03020",
					color: "#FFFFFF",
					padding: "12px 24px",
					borderRadius: "8px",
					fontSize: "14px",
					fontWeight: "500",
					fontFamily: "dmSans",
					border: "none",
					width: "100%",
					cursor: "pointer",
					_disabled: {
						opacity: "0.6",
						cursor: "not-allowed",
					},
				})}
			>
				{status === "loading" ? "Enviando..." : "Suscribirse"}
			</button>

			{/* Mensaje de confirmación o error */}
			{message && (
				<p
					className={css({
						fontFamily: "dmSans",
						fontSize: "13px",
						fontWeight: "300",
						color: status === "error" ? "#E03020" : "#664438",
						marginTop: "4px",
					})}
				>
					{message}
				</p>
			)}
		</form>
	);
}
