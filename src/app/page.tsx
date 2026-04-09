import { css } from "../../styled-system/css";
import Image from "next/image";
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
			<section
				className={css({
					width: "100%",
					borderTop: "1px solid",
					borderBottom: "1px solid",
					borderColor: "#EEE5E3",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				})}
			>
				<div
					className={css({
						width: {
							base: "400px",
							md: "700px",
						},
						backgroundColor: "#FAF8F8",
						borderRadius: "10px",
						margin: "40px",
						padding: "20px",
						display: "flex",
						gap: "4",
						flexDirection: {
							base: "row",
							md: "row",
						},
						alignItems: "center",
						justifyContent: "center",
					})}
				>
					<div>
						<h2
							className={css({
								fontFamily: "fraunces",
								fontSize: {
									base: "20",
									md: "30",
								},

								width: {
									base: "200px",
									md: "300px",
								},
								textAlign: "inherit",
							})}
						>
							Ajusta talla, cuello, mangas...y
							<span
								className={css({
									fontFamily: "fraunces",
									fontStyle: "italic",
									fontWeight: "400",
									color: "#E6322B",
									fontSize: {
										base: "20",
										md: "30",
									},
									width: "300px",
								})}
							>
								{" "}
								miralo{" "}
							</span>
							en tiempo real
						</h2>{" "}
						<p
							className={css({
								fontFamily: "dmSans",
								marginTop: "10px",
								fontWeight: "400",

								fontSize: "12",
								width: "250px",
							})}
						>
							Cada cambio se refleja al instante. Sin sorpresas
							cuando empieces a tejer.
						</p>
					</div>
					<div>
						<Image
							src="/logo-mobile.svg"
							alt="Gift"
							width={200}
							height={200}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
