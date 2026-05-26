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
						fontWeight: "300",
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
					<div
						className={css({
							width: {
								base: "400px",
							},
						})}
					>
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
								fontWeight: "300",

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

			<section
				className={css({
					display: "flex",
					gap: "10",
					flexDirection: {
						base: "column",
						md: "row",
					},
					margin: "40px",
					alignItems: "center",
					justifyContent: "center",
					padding: "40px 20px",
				})}
			>
				<div>
					<div className={css({ marginBottom: "40px" })}>
						<Image
							src="/crochet-icon.svg"
							alt="crochet"
							width={100}
							height={100}
						/>
						<p
							className={css({
								fontFamily: "dmSans",
								marginTop: "10px",
								fontWeight: "400",
								width: "100px",
								fontSize: "12",
								textAlign: "center",
							})}
						>
							Previsualización en tiempo real
						</p>
					</div>
					<div>
						<Image
							src="/comunidad-icon.svg"
							alt="Comunidad icon"
							width={100}
							height={100}
						/>
						<p
							className={css({
								fontFamily: "dmSans",
								marginTop: "10px",
								fontWeight: "400",
								width: "100px",
								fontSize: "12",
								textAlign: "center",
							})}
						>
							Comparte con la comunidad
						</p>
					</div>
				</div>
				<div>
					<div>
						<Image
							src="/pelota-icon.svg"
							alt="Pelota de lana"
							width={100}
							height={100}
						/>
						<p
							className={css({
								fontFamily: "dmSans",
								marginTop: "10px",
								fontWeight: "400",
								width: "100px",
								fontSize: "12",
								marginBottom: "40px",
								textAlign: "center",
							})}
						>
							Generación automática de patrones
						</p>
					</div>
					<div>
						<Image
							src="/guardar-icon.svg"
							alt="Save icon"
							width={100}
							height={100}
						/>
						<p
							className={css({
								fontFamily: "dmSans",
								marginTop: "10px",
								fontWeight: "400",
								width: "100px",
								fontSize: "12",
								textAlign: "center",
							})}
						>
							Guarda y gestiona tus diseños
						</p>
					</div>
				</div>
			</section>
			<section
				className={css({
					padding: "40px",
					display: "flex",
					gap: "10",
					flexDirection: "column",
					backgroundColor: "#FAF8F8",
					width: "100%",

					alignItems: "center",
					justifyContent: "center",
				})}
			>
				<h2
					className={css({
						fontFamily: "fraunces",
						marginTop: "10px",
						fontWeight: "400",
						width: {
							base: "250px",
							md: "400px",
						},
						fontSize: {
							base: "20",
							md: "30",
						},
					})}
				>
					Patrones de la Comunidad
				</h2>
				{"Aqui iran las cards con los patrones de la comunidad"}
				<button
					className={css({
						backgroundColor: "#FFFFFF",
						padding: "10px 20px",
						borderRadius: "5px",
						color: "#000000",
						fontFamily: "dmSans",
						fontSize: "12",
						border: "1px solid #EEE5E3",
						width: "150px",
						alignSelf: "center",
					})}
				>
					Ver más patrones
				</button>
			</section>
			<section>
				<div
					className={css({
						border: "1px solid #EDE5E3",
						borderLeft: "4px solid #E03020",
						borderRadius: "20px",
						margin: {
							base: "50px",
							md: "100px",
						},
						padding: "56px",
						justifyContent: "center",
						display: "flex",
						alignItems: "center",
						gap: "10",
						backgroundColor: "#FFFFFF",
						flexDirection: {
							base: "column",
							md: "row",
						},
					})}
				>
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "3",
							flex: "1",
						})}
					>
						<p
							className={css({
								fontSize: "12px",
								fontFamily: "dmSans",
								fontWeight: "500",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								color: "#E03020",
								display: "flex",
								alignItems: "center",
								gap: "8px",
								_before: {
									content: '""',
									display: "block",
									width: "20px",
									height: "1.5px",
									backgroundColor: "#E03020",
								},
							})}
						>
							Newsletter
						</p>

						<h2
							className={css({
								fontFamily: "fraunces",
								fontWeight: "400",
								fontSize: {
									base: "22px",
									md: "32px",
								},
								color: "#1A0A08",
								lineHeight: "1.2",
							})}
						>
							Recibe novedades de crochet
						</h2>

						{/* Descripción */}
						<p
							className={css({
								fontFamily: "dmSans",
								fontSize: "14px",
								fontWeight: "300",
								color: "#000000",
							})}
						>
							Patrones nuevos, tutoriales y tendencias directas a
							tu correo. Sin spam.
						</p>
					</div>

					<div
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
							})}
						/>
						<button
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
							})}
						>
							Suscribirse
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
