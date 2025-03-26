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
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";

export type User = {
	chainId: number;
	sender: string;
	swap: { totalCount: number };
	transfer: { totalCount: number };
	liquidity: { totalCount: number };
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
		accessorKey: "chainId",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<>
					{user.chainId in testnets ? (
						<>
							{user.chainId}
							<Badge variant="destructive" className="ml-4">
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
		accessorKey: "swap",
		cell: ({ row }) => {
			const user = row.original;
			return <>{user.swap.totalCount}</>;
		},
		header: "Total swaps",
	},
	{
		accessorKey: "liquidity",
		cell: ({ row }) => {
			const user = row.original;
			return <>{user.liquidity.totalCount}</>;
		},
		header: "Liquidity actions",
	},
	{
		accessorKey: "transfer",
		cell: ({ row }) => {
			const user = row.original;
			return <>{user.transfer.totalCount}</>;
		},
		header: "Total transfers",
	},
];
