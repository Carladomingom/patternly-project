import { css } from "../../../styled-system/css";
import Link from "next/link";

//className={css({})}
export default function Login() {
	return (
		<div>
			<h2>Iniciar Sesión</h2>
			<input type="email" placeholder="Correo electrónico"></input>
			<input type="password" placeholder="Contraseña"></input>
			<p>
				¿Has olvidado la contraseña?
				<Link href="/recuperar-contraseña">Recuperar contraseña</Link>
			</p>
			<button>Acceder</button>
			<p>
				¿Aún no te has registrado?{" "}
				<Link href="/registro">Regístrate aqui</Link>
			</p>
			<div>
				<p>Correo electrónico o contraseña incorrectos</p>
			</div>
		</div>
	);
}
