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

export type Pool = {
	chainId: number;
	currency0: string;
	currency1: string;
	fee: number;
	hooks: string;
	sqrtPriceX96: bigint;
	tick: number;
	tickSpacing: number;
	token0: Token;
	token1: Token;
	timestamp: number;
};

export type Token = {
	chainId: number;
	name: string;
	symbol: string;
	decimals: string;
};

export const columns: ColumnDef<Pool>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const pool = row.original;

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
						{pool.currency0 !== "0x0000000000000000000000000000000000000000" ? (
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(pool.currency0)}
							>
								<>
									<Copy />
									Copy Currency0
								</>
							</DropdownMenuItem>
						) : (
							<div />
						)}
						{pool.currency1 !== "0x0000000000000000000000000000000000000000" ? (
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(pool.currency1)}
							>
								<>
									<Copy />
									Copy Currency1
								</>
							</DropdownMenuItem>
						) : (
							<div />
						)}
						{pool.hooks !== "0x0000000000000000000000000000000000000000" ? (
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(pool.hooks)}
							>
								<>
									<Copy />
									Copy Hook
								</>
							</DropdownMenuItem>
						) : (
							<div />
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "timestamp",
		cell: ({ row }) => {
			const pool = row.original;
			return <>{timeAgo(pool.timestamp)}</>;
		},
		header: "Active",
	},
	{
		accessorKey: "chainId",
		cell: ({ row }) => {
			const pool = row.original;
			return (
				<>
					{pool.chainId in testnets ? (
						<>
							{pool.chainId}
							<Badge variant="destructive" className="ml-4">
								testnet
							</Badge>
						</>
					) : (
						<>{pool.chainId}</>
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
		accessorKey: "currency0",
		header: "Currency0",
	},
	{
		accessorKey: "currency1",
		header: "Currency1",
	},
	{
		accessorKey: "hooks",
		header: "Hooks",
	},
	{
		accessorKey: "fee",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Fee
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "tickSpacing",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					tickSpacing
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
