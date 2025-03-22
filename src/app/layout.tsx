import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../wagmi";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MEV-Resilient AMM Design",
	description:
		" Uniswap V4’s hook implementin of a new MEV-resilient mechanism, somewhat inspired by recent theoretical work.",
};

export default async function RootLayout(props: { children: ReactNode }) {
	const headersList = await headers();
	const initialState = cookieToInitialState(
		getConfig(),
		headersList.get("cookie"),
	);
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<Providers initialState={initialState}>
					<Toaster position="top-right" />
					<main className="h-svh w-svw">{props.children}</main>
				</Providers>
			</body>
		</html>
	);
}
