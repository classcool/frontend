"use client";
import { TrendingUpIcon } from "lucide-react";

import { describe } from "node:test";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	fetchData,
	totalHooksQuery,
	totalPoolsQuery,
	totalUsersQuery,
} from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";

function TotalCountQuery(data: {
	totalCount: string;
	title: string;
	description: string;
}) {
	return (
		<Card className="@container/card]">
			<CardHeader className="relative">
				<CardDescription>{data.title}</CardDescription>
				<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
					+{JSON.stringify(data.totalCount)}
				</CardTitle>
				<div className="absolute right-4 top-4">
					{/**<Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
						<TrendingUpIcon className="size-3" />
						+12.5%
					</Badge>*/}
				</div>
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1 text-sm">
				<div className="line-clamp-1 flex gap-2 font-medium">
					Trending up <TrendingUpIcon className="size-4" />
				</div>
				<div className="text-muted-foreground">{data.description}</div>
			</CardFooter>
		</Card>
	);
}

export function DashboardCards() {
	const account = useAccount();
	const [totalHooks, setTotalHooks] = useState();

	const usersData = useQuery({
		queryKey: ["users", account.chainId],
		queryFn: () => fetchData("", "", account.chainId!, totalUsersQuery),
	});

	const poolsData = useQuery({
		queryKey: ["pools", account.chainId],
		queryFn: () => fetchData("", "", account.chainId!, totalPoolsQuery),
	});

	const hooksData = useQuery({
		queryKey: ["hooks", account.chainId],
		queryFn: () => fetchData("", "", account.chainId!, totalHooksQuery),
	});

	const loading = <Skeleton className="aspect-video rounded-xl" />;

	return (
		<div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
			{hooksData.isLoading || hooksData.isFetching
				? loading
				: TotalCountQuery({
						totalCount: hooksData.data.hooks.totalCount,
						title: "Total Hooks",
						description: "No. of hooks deployed",
					})}
			{poolsData.isLoading || poolsData.isFetching
				? loading
				: TotalCountQuery({
						totalCount: poolsData.data.pools.totalCount,
						title: "Total Pools",
						description: "No. of pools initialized",
					})}
			{usersData.isLoading || usersData.isFetching
				? loading
				: TotalCountQuery({
						totalCount: usersData.data.users.totalCount,
						title: "Total Users",
						description: "No. of unique addresses",
					})}
		</div>
	);
}
