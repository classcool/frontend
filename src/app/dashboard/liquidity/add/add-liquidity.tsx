"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ERC20Abi } from "@/lib/abis/ERC20Abi";
import { RouterAbi } from "@/lib/abis/Router";
import { handleCopy } from "@/lib/copy";
import { fetchData, poolsQuery } from "@/lib/queries";
import { etherscanLinks, shortenHex } from "@/lib/utils";
import { CheckCircle2Icon, Copy, Terminal } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { BaseError, Hex } from "viem";
import {
	useAccount,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import type { Pool } from "../../pools/columns";

export default function AddLiquidity() {
	const [amount0, setAmount0] = useState<bigint>();
	const [amount1, setAmount1] = useState<bigint>();
	const [pools, setPools] = useState<Pool[]>();
	const [fetchError, setFetchError] = useState("");
	const [loading, setLoading] = useState(true);
	const [selectPool, setSelectPool] = useState<Pool>();
	const { data: hash, error, isPending, writeContract } = useWriteContract();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});
	const { chainId } = useAccount();
	const account = useAccount();

	async function addLiquidity(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		if (!selectPool) return;
		if (!amount0 || !amount1) return;
		console.log(
			selectPool?.currency0,
			selectPool?.currency1,
			BigInt(amount0),
			selectPool.hooks,
		);
		writeContract({
			abi: ERC20Abi,
			address: selectPool.currency0 as Hex,
			functionName: "approve",
			args: [selectPool.hooks as Hex, amount0],
		});
		writeContract({
			abi: ERC20Abi,
			address: selectPool.currency1 as Hex,
			functionName: "approve",
			args: [selectPool.hooks as Hex, amount1],
		});

		const poolKey = {
			currency0: selectPool.currency0 as Hex,
			currency1: selectPool.currency1 as Hex,
			fee: selectPool.fee,
			tickSpacing: selectPool.tickSpacing,
			hooks: selectPool.hooks as Hex,
		} as const; // this equivalent to struct

		writeContract({
			abi: RouterAbi,
			address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as Hex,
			functionName: "addLiquidity",
			args: [poolKey, amount0, amount1],
		});
	}

	useEffect(() => {
		const fetchQueryData = async () => {
			try {
				fetchData("", "", chainId!, poolsQuery).then(async (data) => {
					console.log(data);
					setPools(data.pools.items);
				});
			} catch (err: unknown) {
				if (err instanceof Error) {
					setFetchError(err.message);
				} else {
					setFetchError("An unknown error occured");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchQueryData();
	}, []);
	const handleSelect = (value: string) => {
		if (!pools) return;
		setSelectPool(pools[Number(value)]);
	};
	return (
		<>
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Create position</CardTitle>
					<CardDescription>Deploy your liquidity in one-click.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={addLiquidity}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="framework">Pools</Label>
								<Select
									name="poolIndex"
									onValueChange={(value) => handleSelect(value)}
								>
									<SelectTrigger id="framework">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="popper">
										{pools ? (
											pools.map((pool, index) => {
												return (
													<SelectItem
														key={pool.chainId + pool.currency0 + pool.currency1}
														value={index.toString()}
													>
														{`${pool.token0.symbol}-${pool.token1.symbol}`}
													</SelectItem>
												);
											})
										) : (
											<></>
										)}
									</SelectContent>
								</Select>
							</div>
							{selectPool && (
								<>
									<div className="flex">
										<CardContent>
											{shortenHex(selectPool?.currency0!, 4)}
											<Button
												onClick={() => handleCopy(selectPool.currency0)}
												variant="ghost"
											>
												<Copy />
											</Button>
										</CardContent>
									</div>
									<div className="flex">
										<CardContent className="flex items-center">
											{shortenHex(selectPool?.currency1!, 4)}{" "}
											<Button
												onClick={() => handleCopy(selectPool.currency1)}
												variant="ghost"
											>
												<Copy />
											</Button>
										</CardContent>
									</div>
								</>
							)}
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="amount0">Amount 0</Label>
								<Input
									id="amount0"
									type="number"
									min={0}
									placeholder="0"
									onChange={(e) => setAmount0(BigInt(e.target.value))}
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="amount1">Amount 1</Label>
								<Input
									id="amount1"
									type="number"
									min={0}
									placeholder="0"
									onChange={(e) => setAmount1(BigInt(e.target.value))}
								/>
							</div>
							<Button
								type="submit"
								disabled={
									isPending ||
									amount0 === undefined ||
									amount1 === undefined ||
									selectPool === undefined
								}
							>
								Add Liquidity
							</Button>
						</div>
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
														`${account.chainId ? etherscanLinks[account.chainId] : ""}/tx/${hash}`,
														"_blank",
													);
												}}
												className="cursor-pointer"
												variant="link"
											>
												{shortenHex(hash)}
											</Button>
											<Button
												variant="ghost"
												onClick={() => {
													handleCopy(hash);
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
				</CardContent>
			</Card>
		</>
	);
}
