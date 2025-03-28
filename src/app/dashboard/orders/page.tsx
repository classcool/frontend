"use client";
import { ordersQuery } from "@/lib/queries";
import { DataTable, type PageInfo } from "../data-table";
import { columns } from "./columns";

export default function Orders() {
	return (
		<div className="grid gap-4">
			<h2>Async Swaps</h2>
			<DataTable
				columns={columns}
				queryTemplate={ordersQuery}
				keyName="orders"
			/>
		</div>
	);
}
