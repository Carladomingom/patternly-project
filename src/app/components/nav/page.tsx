"use client";

import Image from "next/image";
import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { useState } from "react";

type NavbarProps = {
	isLogged: boolean;
};

export default function Nav({ isLogged }: NavbarProps) {
	const [open, setOpen] = useState(false);

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
							fontFamily: "dmSans",
							color: "#6F4C42",
							fontSize: "12",
							marginRight: "4",
							fontWeight: "500",
						})}
					>
						<Link href="/comunidad">Comunidad</Link>

						<Link href="/crear-patron">Crear patrón</Link>
						{isLogged ? (
							<Link href="/mi-cuenta">
								<Image
									src="/login-icon.svg"
									alt="Login Icon"
									width={20}
									height={20}
								/>
							</Link>
						) : (
							<Link
								href="/login"
								className={css({ color: "#E6322B" })}
							>
								{" "}
								Iniciar Sesión{" "}
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
						<Link href="/mi-cuenta">
							<Image
								src="/login-icon.svg"
								alt="Login Icon"
								width={20}
								height={20}
							/>
						</Link>
					</div>
				</div>

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
						<Link href="/comunidad">Comunidad</Link>

						<Link href="/crear-patron">Crear patrón</Link>
					</div>
				)}
			</nav>
		</header>
	);
}
