"use client";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	BookOpen,
	ChartCandlestick,
	Circle,
	ClockArrowUp,
	House,
	KeySquare,
	LayoutDashboard,
	Settings2,
	Unplug,
	UsersRound,
	Waves,
	WavesLadder,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "./ui/button";

const commands = [
	{
		heading: "Suggestions",
		items: [
			{
				title: "Home",
				url: "/",
				icon: House,
			},
			{
				title: "Async Orders",
				url: "/dashboard/orders",
				icon: ClockArrowUp,
			},
			{
				title: "Currencies",
				url: "/dashboard/currencies",
				icon: ChartCandlestick,
			},
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: LayoutDashboard,
			},
			{
				title: "Hooks",
				url: "/dashboard/hooks",
				icon: Unplug,
			},
			{
				title: "Pools",
				url: "/dashboard/pools",
				icon: Waves,
			},
			{
				title: "Users",
				url: "/dashboard/users",
				icon: UsersRound,
			},
		],
	},
	{
		heading: "Liquidity",
		icon: WavesLadder,
		items: [
			{
				title: "Liquidity",
				url: "/dashboard/liquidity",
			},
			{
				title: "Add",
				url: "/dashboard/liquidity/add",
			},
			{
				title: "Positions",
				url: "/dashboard/liquidity/positions",
			},
		],
	},
	{
		heading: "Users",
		items: [
			{
				title: "Operators",
				url: "/dashboard/operators",
				icon: KeySquare,
			},
		],
	},
	{
		heading: "Documentation",
		icon: BookOpen,
		items: [
			{
				title: "Docs",
				url: "/dashboard/documentation",
			},
			{
				title: "Introduction",
				url: "/dashboard/documentation/introduction",
			},
			{
				title: "Get Started",
				url: "/dashboard/documentation/get-started",
			},
			{
				title: "Tutorials",
				url: "/dashboard/documentation/tutorials",
			},
		],
	},
];

export function CommandDialogDemo() {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handleSelect = (path: string) => {
		router.push(path);
	};

	return (
		<>
			<Button onClick={() => setOpen(true)} variant="ghost" size="default">
				<p className="text-sm text-muted-foreground">
					Press{" "}
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">⌘</span>K
					</kbd>
				</p>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{commands.map((group) => {
						return (
							<>
								<CommandGroup key={group.heading} heading={group.heading}>
									{group.items.map((item) => {
										return (
											<CommandItem
												key={item.title}
												onSelect={() => {
													handleSelect(item.url);
													setOpen(false);
												}}
											>
												{"icon" in item ? <item.icon /> : <Circle />}
												<span>{item.title}</span>
											</CommandItem>
										);
									})}
								</CommandGroup>
								<CommandSeparator key={`${group.heading}_separator`} />
							</>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
}
