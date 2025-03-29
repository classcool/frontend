"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
// import { csmmAbi } from "@/lib/abis/generated";
import { testnets } from "@/lib/constants";
import { fetchDataSingle, poolIdQuery } from "@/lib/queries";
import { timeAgo } from "@/lib/timestamp";
import { etherscanLinks, shortenHex } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	CheckCircle2Icon,
	Copy,
	LoaderIcon,
	MoreHorizontal,
	Terminal,
} from "lucide-react";
import { toast } from "sonner";
import type { Hex } from "viem";
import {
	type BaseError,
	useAccount,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";

const csmmAbi = [
	{
		type: "function",
		inputs: [
			{
				name: "key",
				internalType: "struct PoolKey",
				type: "tuple",
				components: [
					{ name: "currency0", internalType: "Currency", type: "address" },
					{ name: "currency1", internalType: "Currency", type: "address" },
					{ name: "fee", internalType: "uint24", type: "uint24" },
					{ name: "tickSpacing", internalType: "int24", type: "int24" },
					{ name: "hooks", internalType: "contract IHooks", type: "address" },
				],
			},
			{
				name: "order",
				internalType: "struct CSMM.AsyncOrder",
				type: "tuple",
				components: [
					{ name: "poolId", internalType: "PoolId", type: "bytes32" },
					{ name: "owner", internalType: "address", type: "address" },
					{ name: "zeroForOne", internalType: "bool", type: "bool" },
					{ name: "amountIn", internalType: "int256", type: "int256" },
				],
			},
		],
		name: "executeOrder",
		outputs: [],
		stateMutability: "nonpayable",
	},
] as const;

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
	const { data: hash, error, isPending, writeContract } = useWriteContract();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});
	const query = poolIdQuery(order.chainId, order.poolId);
	const poolData = useQuery({
		queryKey: ["pool", account.chainId],
		queryFn: () => fetchDataSingle(query),
	});

	// console.log("🐌 Async Pool Data", poolData.data);
	async function executeOrder(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form as HTMLFormElement);

		const orderData: any = {};
		formData.forEach((value, key) => {
			orderData[key] = value;
		});
		const poolKey = {
			currency0: poolData?.data.pool.currency0 as Hex,
			currency1: poolData?.data.pool.currency1 as Hex,
			fee: poolData?.data.pool.fee as number,
			tickSpacing: poolData?.data.pool.tickSpacing as number,
			hooks: poolData?.data.pool.hooks as Hex,
		} as const; // converts to a struct

		// console.log("key", poolKey);
		console.log("form", orderData);
		const asyncOrder = {
			poolId: orderData.poolId as Hex,
			owner: orderData.user as Hex,
			zeroForOne: orderData.zeroForOne == "true" ? true : false,
			amountIn: orderData.amountIn as bigint,
		} as const;

		writeContract({
			abi: csmmAbi,
			address: poolKey.hooks as Hex,
			functionName: "executeOrder",
			args: [poolKey, asyncOrder],
		});
	}
	const handleCopy = async () => {
		try {
			// Copy the text to the clipboard
			await navigator.clipboard.writeText(hash! as string);
		} catch (err) {
			toast("Failed to copy text.");
		}
	};
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
			<SheetContent side="right" className="flex flex-col overflow-y-auto">
				<SheetHeader className="gap-1">
					<SheetTitle>Async Swap</SheetTitle>
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
							<Select name="status">
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
							<Label htmlFor="amountIn">AmountOut</Label>
							<Input
								id="amountIn"
								name="amountIn"
								type="number"
								defaultValue={Number(order.amountIn)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<Label htmlFor="executor">Executor</Label>
						<Select name="executor" disabled defaultValue={account.address}>
							<SelectTrigger
								defaultValue={account.address}
								value={account.address}
								className="w-full"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									defaultValue={String(account.address)}
									value={account.address ? account.address : "executor"}
								>
									{account.address}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{isPending ? (
						<Button disabled type="submit" className="w-full">
							Submit
						</Button>
					) : (
						<Button type="submit" className="w-full">
							Submit
						</Button>
					)}
				</form>
				<div className="p-4">
					<Alert variant={error ? "destructive" : "default"}>
						<Terminal className="h-4 w-4" />
						<AlertTitle>
							{error ? "Transaction Error!" : "Transaction Status!"}
						</AlertTitle>
						<AlertDescription>
							{hash && (
								<>
									<span>Transation Hash</span>
									<div className="flex">
										<Button
											onClick={() => {
												window.open(
													`${account.chainId && etherscanLinks[account.chainId]}/tx/{hash}`,
													"_blank",
												);
												console.log(account.chain);
											}}
											className="cursor-pointer"
											variant="link"
										>
											{shortenHex(hash)}
										</Button>
										<Button
											variant="ghost"
											onClick={() => {
												toast("Copied txn hash to clipboard");
												handleCopy();
											}}
										>
											<Copy />
										</Button>
									</div>
								</>
							)}
							{isConfirming && <span>Waiting for confirmation...</span>}
							{isConfirmed && (
								<span>
									<CheckCircle2Icon className="text-green-500 dark:text-green-400" />
									Transaction confirmed.
								</span>
							)}
							{error && (
								<div>
									Error: {(error as BaseError).shortMessage || error.message}
								</div>
							)}
						</AlertDescription>
					</Alert>
				</div>
				<div className="px-4">
					<AsyncOrderAccordion />
				</div>
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

export function AsyncOrderAccordion() {
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger>What is aync swap(s)?</AccordionTrigger>
				<AccordionContent>
					Any swap order(s) that will execute some time in the future.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>
					Is the hook contract filling the orders?
				</AccordionTrigger>
				<AccordionContent>
					Yes, but only an executor role can submit the orders to be filled.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>
					Is it possible to create luquidity position with pending swaps?
				</AccordionTrigger>
				<AccordionContent>
					Yes. We plan on supporting async swap as liquidity positions.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
Copy;
