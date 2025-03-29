"use client";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	BookOpen,
	ChartCandlestick,
	ClockArrowUp,
	KeySquare,
	LayoutDashboard,
	LifeBuoy,
	Send,
	Settings2,
	Unplug,
	UsersRound,
	Waves,
	WavesLadder,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

export const data = {
	user: {
		name: "Hook Incubator",
		email: "logged in",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
		},
		{
			title: "Async Orders",
			url: "/dashboard/orders",
			icon: ClockArrowUp,
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
			title: "Currencies",
			url: "/dashboard/currencies",
			icon: ChartCandlestick,
		},
		{
			title: "Liquidity",
			url: "/dashboard/liquidity",
			icon: WavesLadder,
			items: [
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
			title: "Operators",
			url: "/dashboard/operators",
			icon: KeySquare,
		},
		{
			title: "Users",
			url: "/dashboard/users",
			icon: UsersRound,
		},
		{
			title: "Documentation",
			url: "/dashboard/documentation",
			icon: BookOpen,
			items: [
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
	],
	navSecondary: [
		{
			title: "Support",
			url: "http://x.com/share?text=amazing project build by @msakiart for @AtriumAcademy Uniswap Hook Incubator @UniswapFND",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "mailto:meek10x@gmail.com?subject=Feedback&body=Hey%20Meek,%0A%0AWanted to share some feedback!%0A%0A[ENTER FEEDBACK HERE]%0A%0ACheers!",
			icon: Send,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { toggleSidebar } = useSidebar();
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggleSidebar();
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [toggleSidebar]);
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									🪝
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">V4 Hook</span>
									<span className="truncate text-xs">Demo release</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
