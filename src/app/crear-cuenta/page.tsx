"use client";

import { css } from "../../../styled-system/css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ErrorState = {
	emailInvalid: boolean;
	emailTaken: boolean;
	usernameTaken: boolean;
};

export default function CrearCuenta() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ErrorState>({
		emailInvalid: false,
		emailTaken: false,
		usernameTaken: false,
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErrors({
			emailInvalid: false,
			emailTaken: false,
			usernameTaken: false,
		});
		setLoading(true);

		const { data: existingUser } = await supabase
			.from("profiles")
			.select("id")
			.eq("username", username.trim())
			.single();

		if (existingUser) {
			setErrors((prev) => ({ ...prev, usernameTaken: true }));
			setLoading(false);
			return;
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { username: username.trim() },
			},
		});

		setLoading(false);

		if (error) {
			if (error.message.toLowerCase().includes("already registered")) {
				setErrors((prev) => ({ ...prev, emailTaken: true }));
				return;
			}

			if (error.message.toLowerCase().includes("invalid")) {
				setErrors((prev) => ({ ...prev, emailInvalid: true }));
				return;
			}
			setErrors((prev) => ({ ...prev, emailInvalid: true }));
			return;
		}

		router.push("/");
		router.refresh();
	}

	const inputStyle = css({
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
	});

	const errorBox = css({
		backgroundColor: "#F8BDBE",
		borderRadius: "8px",
		padding: "12px 16px",
		fontSize: "10px",
		textAlign: "center",
		fontFamily: "dmSans",
		color: "#1A0A08",
		width: "300px",
	});

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
					Regístrate
				</h2>
				<input
					type="text"
					placeholder="Nombre de usuario"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					disabled={loading}
					className={inputStyle}
				/>
				<input
					type="email"
					placeholder="Correo electrónico"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={loading}
					className={inputStyle}
				/>
				<input
					type="password"
					placeholder="Contraseña"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={6}
					disabled={loading}
					className={inputStyle}
				/>
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
					{loading ? "Enviando..." : "Enviar"}
				</button>
			</form>

			<p
				className={css({
					fontSize: "10px",
					color: "#1A0A08",
					textAlign: "center",
					fontFamily: "dmSans",
				})}
			>
				¿Ya tienes cuenta?{" "}
				<Link
					href="/login"
					className={css({
						fontSize: "10px",
						color: "#1A0A08",
						fontWeight: "700",
						fontFamily: "dmSans",
					})}
				>
					Inicia sesión
				</Link>
			</p>

			{errors.emailInvalid && (
				<div className={errorBox}>
					<p>Correo electrónico no válido</p>
				</div>
			)}
			{errors.emailTaken && (
				<div className={errorBox}>
					<p>Este correo electrónico ya está registrado</p>
				</div>
			)}
			{errors.usernameTaken && (
				<div className={errorBox}>
					<p>Nombre de usuario no disponible</p>
				</div>
			)}
		</div>
	);
}
