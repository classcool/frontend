"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const chainNames = {
	31337: "Anvil",
};

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const { connectors, connect, status, error, isPending } = useConnect();
	const { disconnect } = useDisconnect();
	const account = useAccount();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{account.chainId && account.chainId === 31337 ? (
										"Anvil Localhost"
									) : (
										<>
											{account.chainId && account.chain ? (
												account.chain.name
											) : (
												<>
													{isPending ? (
														"Connnect Me"
													) : (
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
															Connect Me
														</motion.div>
													)}
												</>
											)}
										</>
									)}
								</span>
								<span className="truncate text-xs">{account.status}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{/**<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />*/}
						{connectors.map((connector) => (
							<DropdownMenuGroup key={connector.uid}>
								<DropdownMenuItem onClick={() => connect({ connector })}>
									{connector.name}
								</DropdownMenuItem>
							</DropdownMenuGroup>
						))}
						{account.status === "connected" && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => disconnect()}>
									<LogOut />
									Disconnect
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
