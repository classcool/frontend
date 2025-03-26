"use client";
import { usersQuery } from "@/lib/queries";
import { DataTable, type PageInfo } from "../data-table";
import { columns } from "./columns";

export default function Users() {
	return (
		<div className="grid gap-4">
			<h2>Users</h2>
			<DataTable columns={columns} queryTemplate={usersQuery} keyName="users" />
		</div>
	);
}
