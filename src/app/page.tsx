import { css } from "../../styled-system/css";
//className={css({})}
export default function Home() {
	return (
		<div>
			<section
				id="hero"
				className={css({
					height: "400px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				})}
			>
				<h1
					className={css({
						fontFamily: "fraunces",
						fontSize: {
							base: "45",
							md: "64",
						},
						textAlign: "center",
						color: "#000000",
					})}
				>
					Diseña tu jersey.
				</h1>
				<h1
					className={css({
						fontFamily: "fraunces",
						fontSize: {
							base: "45",
							md: "64",
						},
						fontWeight: "350",
						fontStyle: "italic",
						textAlign: "center",
						color: "#E6322B",
						paddingTop: "-10",
					})}
				>
					Teje con confianza.
				</h1>
				<p
					className={css({
						fontFamily: "dmSans",
						fontSize: {
							base: "12",
							md: "16",
						},
						textAlign: "center",

						color: "#684439",
						maxWidth: {
							base: "300px",
							md: "400px",
						},
						marginTop: "10px",
					})}
				>
					Crea patrones de crochet personalizados en segundos. Elige
					tu talla, estilo y tipo de punto - el patrón se genera solo.
				</p>
				<div
					className={css({
						display: "flex",
						gap: "4",
						flexDirection: {
							base: "row",
							md: "row",
						},
						alignItems: "center",
						marginTop: "25px",
					})}
				>
					<button
						className={css({
							backgroundColor: "#E6322B",
							padding: "10px 20px",
							borderRadius: "5px",
							color: "#FFFFFF",
							fontFamily: "dmSans",
							fontSize: "12",
							border: "none",
						})}
					>
						Crear patrón
					</button>
					<button
						className={css({
							backgroundColor: "#FFFFFF",
							padding: "10px 20px",
							borderRadius: "5px",
							color: "#E6322B",
							fontFamily: "dmSans",
							fontSize: "12",
							border: "1px solid #E6322B",
						})}
					>
						Explorar comunidad
					</button>
				</div>
			</section>
			<section></section>
		</div>
	);
}
