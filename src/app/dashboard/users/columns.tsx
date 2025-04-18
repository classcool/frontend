"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { testnets } from "@/lib/constants";
import { timeAgo } from "@/lib/timestamp";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";

export type User = {
	chainId: number;
	sender: string;
	totalLiquiditys: number;
	totalTransfers: number;
	totalSwaps: number;
	swap: { totalCount: number };
	transfer: { totalCount: number };
	liquidity: { totalCount: number };
	totalInitialized: number;
	timestamp: number;
};

export const columns: ColumnDef<User>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const user = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.sender)}
						>
							<>
								<Copy />
								Copy address
							</>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "timestamp",
		cell: ({ row }) => {
			const user = row.original;
			return <>{timeAgo(user.timestamp)}</>;
		},
		header: "Active",
	},
	{
		accessorKey: "chainId",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<>
					{user.chainId in testnets ? (
						<>
							{user.chainId}
							<Badge variant="secondary" className="ml-4">
								testnet
							</Badge>
						</>
					) : (
						<>{user.chainId}</>
					)}
				</>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					ChainId
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "sender",
		header: "Sender",
	},
	{
		accessorKey: "totalSwaps",
		header: "Total swaps",
	},
	{
		accessorKey: "totalLiquiditys",
		header: "Liquidity actions",
	},
	{
		accessorKey: "totalTransfers",
		header: "Total transfers",
	},
	{
		accessorKey: "totalInitialized",
		header: "Pools Initialized",
	},
];
