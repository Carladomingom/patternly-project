import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/nav/page";
import Footer from "./components/footer/page";
import { css } from "../../styled-system/css";

export const metadata: Metadata = {
	title: "Patternly",
	description: "Crea y comparte patrones de diseño con la comunidad",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={css({
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				})}
			>
				<Nav isLogged={false} />
				<main
					className={css({
						flex: "1",
					})}
				>
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
