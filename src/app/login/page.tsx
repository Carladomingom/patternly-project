"use client";

import { css } from "../../../styled-system/css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(false);
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			setError(true);
			return;
		}

		router.push("/");
		router.refresh();
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
					padding: {
						base: "40px",
						md: "50px",
					},
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
					Iniciar Sesión
				</h2>
				<input
					type="email"
					placeholder="Correo electrónico"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={loading}
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontFamily: "dmSans",
						color: "#1A0A08",
						outline: "none",
						width: { base: "300px", md: "500px" },
						_placeholder: { color: "#AA8880" },
						_focus: { borderColor: "#E03020" },
					})}
				/>
				<input
					type="password"
					placeholder="Contraseña"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={loading}
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontFamily: "dmSans",
						color: "#1A0A08",
						outline: "none",
						width: { base: "300px", md: "500px" },
						_placeholder: { color: "#AA8880" },
						_focus: { borderColor: "#E03020" },
					})}
				/>
				<p
					className={css({
						fontSize: "8px",
						color: "#1A0A08",
						textAlign: "center",
						width: "100%",
						fontFamily: "dmSans",
					})}
				>
					¿Has olvidado la contraseña?
					<Link
						href="/recuperar-contrasena"
						className={css({
							fontSize: "8px",
							color: "#1A0A08",
							fontWeight: "700",
							fontFamily: "dmSans",
						})}
					>
						{" "}
						Recuperar contraseña
					</Link>
				</p>
				<button
					type="submit"
					disabled={loading}
					className={css({
						backgroundColor: "#E6322B",
						padding: "10px 20px",
						borderRadius: "5px",
						color: "#FFFFFF",
						fontFamily: "dmSans",
						fontSize: "12",
						border: "none",
						marginTop: "20px",
						cursor: "pointer",
						_disabled: { opacity: "0.6", cursor: "not-allowed" },
					})}
				>
					{loading ? "Accediendo..." : "Acceder"}
				</button>
			</form>

			<p
				className={css({
					fontSize: "10px",
					color: "#1A0A08",
					textAlign: "center",
					width: "100%",
					fontFamily: "dmSans",
					margin: "20px 0",
				})}
			>
				¿Aún no te has registrado?{" "}
				<Link
					href="/crear-cuenta"
					className={css({
						fontSize: "10px",
						color: "#1A0A08",
						fontWeight: "700",
						fontFamily: "dmSans",
						display: { base: "block", md: "inline" },
					})}
				>
					Regístrate aqui
				</Link>
			</p>

			{error && (
				<div
					className={css({
						backgroundColor: "#F8BDBE",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "10px",
						textAlign: "center",
						fontFamily: "dmSans",
						color: "#1A0A08",
						width: "300px",
					})}
				>
					<p>Correo electrónico o contraseña incorrectos</p>
				</div>
			)}
		</div>
	);
}
