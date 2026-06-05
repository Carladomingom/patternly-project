import Link from "next/link";
import { css } from "../../../../styled-system/css";
import Image from "next/image";

export default function Footer() {
	return (
		<footer
			className={css({
				width: "100%",
				borderTop: "1px solid",
				borderColor: "#EEE5E3",
				px: "6",
				py: "4",
			})}
		>
			<div
				className={css({
					display: {
						base: "flex",
					},
					flexDirection: {
						base: "column",
						md: "row",
					},
					alignItems: "center",
					justifyContent: "space-between",

					gap: "6",
				})}
			>
				<div
					className={css({
						gap: "8",
						display: "flex",
						fontFamily: "dmSans",
						color: "#6F4C42",
						fontSize: "12",
						marginRight: "8",
						marginLeft: "8",
						fontWeight: "600",
					})}
				>
					<Link href="mailto:carladomingomiquel@gmail.com">
						Contacto
					</Link>
					<Link href="https://github.com/Carladomingom/patternly-project.git">
						Github
					</Link>
					<Link href="/">Memoria</Link>
				</div>
				<Link
					href="/"
					className={css({
						marginRight: "8",
						marginLeft: "8",
					})}
				>
					<Image
						src="/logo-footer.svg"
						alt="Logo-footer"
						width={120}
						height={120}
					/>
				</Link>
			</div>
			<div
				className={css({
					marginTop: "6",
				})}
			>
				<p
					className={css({
						fontSize: "8",
						textAlign: "center",
					})}
				>
					© 2026 Patternly. Todos los derechos reservados.
				</p>
			</div>
		</footer>
	);
}
