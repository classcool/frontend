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
import { ArrowUpDown, Copy, Eye, MoreHorizontal } from "lucide-react";
import type { Hex } from "viem";

export type CurrencyType = {
	chainId: number;
	id: string;
	liquidityDelta: bigint;
	poolId: Hex;
	salt: string;
	sender: string;
	tickUpper: number;
	tickLower: number;
	timestamp: number;
};

export const columns: ColumnDef<CurrencyType>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const liquidity = row.original;

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
							onClick={() => navigator.clipboard.writeText(liquidity.poolId)}
						>
							<>
								<Copy />
								Copy PoolId
							</>
						</DropdownMenuItem>
						{liquidity.chainId === 130 ? (
							<DropdownMenuItem
								onClick={() =>
									window.open(`https://uniscan.xyz/tx/${liquidity.id}#eventlog`)
								}
							>
								<>
									<Eye />
									View Log
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
			const position = row.original;
			return <>{timeAgo(position.timestamp)}</>;
		},
		header: "Active",
	},
	{
		accessorKey: "chainId",
		cell: ({ row }) => {
			const position = row.original;
			return (
				<>
					{position.chainId in testnets ? (
						<>
							{position.chainId}
							<Badge variant="secondary" className="ml-4">
								testnet
							</Badge>
						</>
					) : (
						<>{position.chainId}</>
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
		accessorKey: "id",
		header: "TxHash",
	},
	{
		accessorKey: "sender",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Sender
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "poolId",
		header: "Pool Id",
	},
	{
		accessorKey: "amount0",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Amount0
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "amount1",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Amount1
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
