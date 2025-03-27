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
import type { Hex } from "viem";

export type AsyncOrder = {
	chainId: number;
	owner: string;
	poolId: Hex;
	amountIn: bigint;
	nonce: bigint;
	zeroForOne: boolean;
	timestamp: number;
};

export const columns: ColumnDef<AsyncOrder>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const order = row.original;

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
							onClick={() => navigator.clipboard.writeText(order.owner)}
						>
							<>
								<Copy />
								Copy owner
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
			const order = row.original;
			return <>{timeAgo(order.timestamp)}</>;
		},
		header: "Active",
	},
	{
		accessorKey: "chainId",
		cell: ({ row }) => {
			const order = row.original;
			return (
				<>
					{order.chainId in testnets ? (
						<>
							{order.chainId}
							<Badge variant="destructive" className="ml-4">
								testnet
							</Badge>
						</>
					) : (
						<>{order.chainId}</>
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
		accessorKey: "nonce",
		header: "Nonce",
	},
	{
		accessorKey: "amountIn",
		header: "Amount In",
	},
	{
		accessorKey: "owner",
		header: "Owner",
	},
	{
		accessorKey: "poolId",
		header: "Pool Id",
	},
	{
		accessorKey: "zeroForOne",
		header: "Zero For One",
	},
];
