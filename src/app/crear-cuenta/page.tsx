import { css } from "../../../styled-system/css";
import Link from "next/link";

//className={css({})}
export default function CrearCuenta() {
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
			<div
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
					Regístrate
				</h2>
				<input
					type="name"
					placeholder="Nombre de usuario"
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontFamily: "dmSans",
						color: "#1A0A08",
						outline: "none",
						width: {
							base: "300px",
							md: "500px",
						},
						_placeholder: {
							color: "#AA8880",
						},
						_focus: {
							borderColor: "#E03020",
						},
					})}
				></input>
				<input
					type="email"
					placeholder="Correo electrónico"
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontFamily: "dmSans",
						color: "#1A0A08",
						outline: "none",
						width: {
							base: "300px",
							md: "500px",
						},
						_placeholder: {
							color: "#AA8880",
						},
						_focus: {
							borderColor: "#E03020",
						},
					})}
				></input>
				<input
					type="password"
					placeholder="Contraseña"
					className={css({
						backgroundColor: "#FAF8F8",
						border: "1px solid #EDE5E3",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontFamily: "dmSans",
						color: "#1A0A08",
						outline: "none",
						width: {
							base: "300px",
							md: "500px",
						},
						_placeholder: {
							color: "#AA8880",
						},
						_focus: {
							borderColor: "#E03020",
						},
					})}
				></input>

				<button
					className={css({
						backgroundColor: "#E6322B",
						padding: "10px 20px",
						borderRadius: "5px",
						color: "#FFFFFF",
						fontFamily: "dmSans",
						fontSize: "12",
						border: "none",
						marginTop: "20px",
					})}
				>
					Enviar
				</button>
			</div>
			<div
				className={css({
					backgroundColor: "#F8BDBE",

					borderRadius: "8px",
					padding: "12px 16px",
					fontSize: "10px",
					textAlign: "center",
					fontFamily: "dmSans",
					color: "#1A0A08",
					outline: "none",
					width: "300px",
				})}
			>
				<p>Correo electrónico no valido</p>
			</div>
			<div
				className={css({
					backgroundColor: "#F8BDBE",

					borderRadius: "8px",
					padding: "12px 16px",
					fontSize: "10px",
					textAlign: "center",
					fontFamily: "dmSans",
					color: "#1A0A08",
					outline: "none",
					width: "300px",
				})}
			>
				<p>nombre de usuario no disponible</p>
			</div>
		</div>
	);
}
