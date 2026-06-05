"use client";

import { css } from "../../../styled-system/css";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarContraseña() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const supabase = createClient();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/actualizar-contrasena`,
		});

		setLoading(false);
		setSent(true);
	}

	return (
		<div
			className={css({
				display: "flex",
				flexDirection: "column",
				gap: "4",
				alignItems: "center",
				justifyContent: "center",
				margin: "100px",
			})}
		>
			<form
				onSubmit={handleSubmit}
				className={css({
					border: "1px solid #F8BDBE",
					borderRadius: "8px",
					padding: { base: "40px", md: "50px" },
					display: "flex",
					flexDirection: "column",
					gap: "4",
					alignItems: "center",
					justifyContent: "center",
				})}
			>
				<h2
					className={css({
						fontFamily: "fraunces",
						fontWeight: "600",
						fontSize: "20",
					})}
				>
					Recuperar contraseña
				</h2>
				<input
					type="email"
					placeholder="Correo electrónico"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={loading || sent}
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontFamily: "dmSans",
						color: "#1A0A08",
						outline: "none",
						marginTop: "10px",
						width: { base: "300px", md: "500px" },
						_placeholder: { color: "#AA8880" },
						_focus: { borderColor: "#E03020" },
						_disabled: { opacity: "0.6", cursor: "not-allowed" },
					})}
				/>
				<button
					type="submit"
					disabled={loading || sent}
					className={css({
						backgroundColor: "#E6322B",
						padding: "10px 20px",
						borderRadius: "5px",
						color: "#FFFFFF",
						fontFamily: "dmSans",
						fontSize: "12",
						border: "none",
						marginTop: "10px",
						cursor: "pointer",
						_disabled: { opacity: "0.6", cursor: "not-allowed" },
					})}
				>
					{loading ? "Enviando..." : "Enviar"}
				</button>
			</form>

			{sent && (
				<div
					className={css({
						backgroundColor: "#CCE9B9",
						marginTop: "20px",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "10px",
						textAlign: "center",
						fontFamily: "dmSans",
						color: "#1A0A08",
						width: "300px",
					})}
				>
					<p>
						Si tienes una cuenta con nosotras, recibirás un correo
						electrónico con instrucciones para recuperar tu
						contraseña.
					</p>
				</div>
			)}
		</div>
	);
}
