import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className="w-screen h-screen text-neutral-100 select-none"
		>
			<body className={`w-full h-full flex flex-col ${inter.className}`}>
				{children}
			</body>
		</html>
	);
}
