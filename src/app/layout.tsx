import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/nav/page";
import Footer from "./components/footer/page";

export const metadata: Metadata = {
	title: "Patternnlty",
	description: "Crea y comparte patrones de diseño con la comunidad",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Nav isLogged={true} />
				{children}
				<Footer />
			</body>
		</html>
	);
}
