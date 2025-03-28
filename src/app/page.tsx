"use client";

import { CommandDialogDemo } from "@/components/command-menu";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
const statements = [
	"Are you a Hook builder on Uniswap V4?",
	"Want us help you manage async swaps?",
	"Async swaps go brrr...",
	"Press ENTER!",
];
function App() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % statements.length);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	const currentStatement = statements[index];
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-1 md:p-10">
			<AnimatePresence mode="wait">
				<motion.div
					key={index}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className="font-mono text-muted-foreground"
				>
					<motion.span
						initial={{ width: 0 }}
						animate={{ width: "100%" }}
						transition={{ duration: 2, ease: "linear" }}
						style={{
							display: "inline-block",
							whiteSpace: "nowrap",
							overflow: "hidden",
						}}
					>
						{currentStatement}
					</motion.span>
				</motion.div>
			</AnimatePresence>
			<motion.div
				animate={{
					x: [0, 5, 0, 5, 0, 0],
					y: [0, -2, 2, -2, 2, 0],
					scale: 1,
				}}
				transition={{
					times: [0, 0.3, 0.6],
					repeat: Number.POSITIVE_INFINITY,
					repeatDelay: 2,
					duration: 0.5,
					ease: "easeInOut",
				}}
			>
				<CommandDialogDemo />
			</motion.div>
			<div className="w-full max-w-sm md:max-w-3xl">{/** <LoginForm /> */}</div>
		</div>
	);
}

export default App;
