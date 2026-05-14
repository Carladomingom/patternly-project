import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
});

const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-fraunces",
});

export const metadata: Metadata = {
	title: "Patternly",
	description:
		"Crea tu patron de crochet y disfruta de tu nuevo jersey hecho a mano",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
