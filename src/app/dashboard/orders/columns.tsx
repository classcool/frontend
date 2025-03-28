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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { csmmAbi } from "@/lib/abis/generated";
import { testnets } from "@/lib/constants";
import { fetchDataSingle, poolIdQuery } from "@/lib/queries";
import { timeAgo } from "@/lib/timestamp";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	CheckCircle2Icon,
	Copy,
	LoaderIcon,
	MoreHorizontal,
} from "lucide-react";
import type { Hex } from "viem";
import { useAccount, useWriteContract } from "wagmi";

export type AsyncOrderEventType = {
	chainId: number;
	owner: string;
	poolId: Hex;
	amountIn: bigint;
	zeroForOne: boolean;
	orderStatus: boolean;
	timestamp: number;
};

export const columns: ColumnDef<AsyncOrderEventType>[] = [
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
		accessorKey: "orderStatus",
		header: "Status",
		cell: ({ row }) => <TableCellViewer order={row.original} />,
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
					Chain Id
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "amountIn",
		header: "Amount In",
	},
	{
		accessorKey: "zeroForOne",
		header: "Zero For One",
	},
	{
		accessorKey: "poolId",
		header: "Pool Id",
	},
	{
		accessorKey: "owner",
		header: "User",
	},
];

function TableCellViewer({ order }: { order: AsyncOrderEventType }) {
	const account = useAccount();
	const { data: hash, isPending, writeContract } = useWriteContract();
	async function executeOrder(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form as HTMLFormElement);

		const orderData: any = {};
		formData.forEach((value, key) => {
			orderData[key] = value;
		});
		console.log(orderData);
		const query = poolIdQuery(order.chainId, order.poolId);
		const poolData = await fetchDataSingle(query);
		console.log(poolData);
		const poolKey = {
			currency0: poolData.currency0 as Hex,
			currency1: poolData.currency1 as Hex,
			fee: poolData.fee,
			tickSpacing: poolData.tickSpacing,
			hooks: poolData.hooks as Hex,
		} as const; // converts to a struct

		const asyncOrder = {
			poolId: orderData.poolId as Hex,
			owner: orderData.user as Hex,
			zeroForOne: orderData.zeroForOne == "true" ? true : false,
			amountIn: orderData.amountOut as bigint,
		} as const;

		writeContract({
			abi: csmmAbi,
			address: poolData.hooks as Hex,
			functionName: "executeOrder",
			args: [poolKey, asyncOrder],
		});
	}
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Badge
					variant="outline"
					className="cursor-pointer flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
				>
					{order.orderStatus === true ? (
						<>
							<CheckCircle2Icon className="text-green-500 dark:text-green-400" />
							Complete
						</>
					) : (
						<>
							<LoaderIcon />
							Pending
						</>
					)}
				</Badge>
			</SheetTrigger>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-1">
					<SheetTitle>Async Order</SheetTitle>
					<SheetDescription>ChainId {order.chainId}</SheetDescription>
				</SheetHeader>
				<form onSubmit={executeOrder} className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-3">
						<Label htmlFor="poolId">PoolId</Label>
						<Input
							id="poolId"
							name="poolId"
							type="text"
							defaultValue={order.poolId}
						/>
					</div>
					<div className="flex flex-col gap-3">
						<Label htmlFor="user">User</Label>
						<Input
							id="user"
							name="user"
							type="text"
							defaultValue={order.owner}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="zeroForOne">zeroForOne</Label>
							<Select
								id="zeroForOne"
								name="zeroForOne"
								defaultValue={order.zeroForOne === true ? "true" : "false"}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">true</SelectItem>
									<SelectItem value="false">false</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="status">Status</Label>
							<Select id="status" name="status">
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Aprrove">Approve</SelectItem>
									<SelectItem value="Reject">Reject</SelectItem>
									<SelectItem value="Refund">Refund</SelectItem>
									<SelectItem value="Cancel">Cancel</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="amountOut">AmountOut</Label>
							<Input
								id="amountOut"
								name="amountOut"
								type="number"
								defaultValue={Number(order.amountIn)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<Label htmlFor="executor">Executor</Label>
						<Select id="executor" name="executor" defaultValue={order.owner}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={account.address}>
									{account.address}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button type="submit" className="w-full">
						Submit
					</Button>
				</form>
				<SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
					<SheetClose asChild>
						<Button variant="outline" className="w-full">
							Done
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
