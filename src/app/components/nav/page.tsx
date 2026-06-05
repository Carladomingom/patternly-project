"use client";

import Image from "next/image";
import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
	isLogged: boolean;
};

export default function Nav({ isLogged }: NavbarProps) {
	const [open, setOpen] = useState(false);
	const [logged, setLogged] = useState(isLogged);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setLogged(!!session?.user);
			},
		);
		return () => listener.subscription.unsubscribe();
	}, []);

	async function handleLogout() {
		await supabase.auth.signOut();
		router.push("/");
		router.refresh();
	}

	return (
		<header
			className={css({
				width: "100%",
				borderBottom: "1px solid",
				borderColor: "gray.200",
				px: "6",
				py: "4",
			})}
		>
			<nav>
				{/* Desktop version */}
				<div
					className={css({
						display: {
							base: "none",
							md: "flex",
						},
						alignItems: "center",
						justifyContent: "space-between",
					})}
				>
					<Link
						href="/"
						className={css({
							flex: 1,
							width: "14",
							marginLeft: "4",
						})}
					>
						<Image
							src="/logo.svg"
							alt="Logo"
							width={70}
							height={70}
						/>
					</Link>
					<div
						className={css({
							gap: "8",
							display: "flex",
							alignItems: "center",
							fontFamily: "dmSans",
							color: "#6F4C42",
							fontSize: "12",
							marginRight: "4",
							fontWeight: "500",
						})}
					>
						<Link href="/comunidad">Comunidad</Link>

						<Link href="/crear-patron">Crear patrón</Link>

						{logged ? (
							<div
								className={css({
									display: "flex",
									alignItems: "center",
									gap: "4",
								})}
							>
								<Link href="/mi-cuenta">
									<Image
										src="/login-icon.svg"
										alt="Mi cuenta"
										width={20}
										height={20}
									/>
								</Link>
								<button
									onClick={handleLogout}
									className={css({
										border: "none",
										background: "transparent",
										fontFamily: "dmSans",
										color: "#6F4C42",
										fontSize: "12",
										fontWeight: "500",
										cursor: "pointer",
										padding: "0",
									})}
								>
									Cerrar sesión
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className={css({ color: "#E6322B" })}
							>
								Iniciar Sesión
							</Link>
						)}
					</div>
				</div>

				{/* Mobile version */}
				<div
					className={css({
						display: {
							base: "grid",
							md: "none",
						},
						gridTemplateColumns: "1fr auto 1fr",
						alignItems: "center",
					})}
				>
					<button
						onClick={() => setOpen(!open)}
						className={css({
							justifySelf: "start",
							border: "none",
							background: "transparent",
						})}
					>
						<Image
							src="/menu-icon.svg"
							alt="Menu"
							width={20}
							height={20}
						/>
					</button>

					<Link
						href="/"
						className={css({
							justifySelf: "center",
						})}
					>
						<Image
							src="/logo-mobile.svg"
							alt="logo-mobile"
							width={30}
							height={30}
						/>
					</Link>

					<div
						className={css({
							justifySelf: "end",
						})}
					>
						{logged ? (
							<Link href="/mi-cuenta">
								<Image
									src="/login-icon.svg"
									alt="Mi cuenta"
									width={20}
									height={20}
								/>
							</Link>
						) : (
							<Link
								href="/login"
								className={css({
									fontFamily: "dmSans",
									color: "#E6322B",
									fontSize: "12",
									fontWeight: "500",
								})}
							>
								Iniciar Sesión
							</Link>
						)}
					</div>
				</div>

				{/* Mobile menu desplegable */}
				{open && (
					<div
						className={css({
							display: {
								base: "flex",
								md: "none",
							},
							flexDirection: "column",
							gap: "4",
							mt: "4",
							fontFamily: "dmSans",
							color: "#6F4C42",
							fontSize: "12",
							fontWeight: "500",
						})}
					>
						<Link href="/comunidad" onClick={() => setOpen(false)}>
							Comunidad
						</Link>

						<Link
							href="/crear-patron"
							onClick={() => setOpen(false)}
						>
							Crear patrón
						</Link>

						{logged && (
							<button
								onClick={() => {
									setOpen(false);
									handleLogout();
								}}
								className={css({
									border: "none",
									background: "transparent",
									fontFamily: "dmSans",
									color: "#E6322B",
									fontSize: "12",
									fontWeight: "500",
									cursor: "pointer",
									textAlign: "left",
									padding: "0",
								})}
							>
								Cerrar sesión
							</button>
						)}
					</div>
				)}
			</nav>
		</header>
	);
}
