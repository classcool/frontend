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

export type HookType = {
	approved: boolean;
	chainId: number;
	operator: string;
	owner: string;
	timestamp: number;
};

export const columns: ColumnDef<HookType>[] = [
	{
		id: "actions",
		cell: ({ row }) => {
			const operator = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(operator.operator)}
						>
							<>
								<Copy />
								Copy Operator
							</>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(operator.owner)}
						>
							<>
								<Copy />
								Copy Owner
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
			const operator = row.original;
			return <>{timeAgo(operator.timestamp)}</>;
		},
		header: "Active",
	},
	{
		accessorKey: "chainId",
		cell: ({ row }) => {
			const operator = row.original;
			return (
				<>
					{operator.chainId in testnets ? (
						<>
							{operator.chainId}
							<Badge variant="outline" className="ml-4">
								testnet
							</Badge>
						</>
					) : (
						<>{operator.chainId}</>
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
		accessorKey: "operator",
		header: "Operator",
	},
	{
		accessorKey: "owner",
		header: "Owner",
	},
	{
		accessorKey: "approved",
		header: "Approved",
	},
];
