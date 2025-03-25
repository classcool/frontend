import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	return NextResponse.json({ message: "Hello, World! GET" }, { status: 200 });
}

export async function POST(request: NextRequest) {
	const { cursor, chainId, query } = await request.json();
	const endpoint = process.env.NEXT_PUBLIC_PONDER_ENDPOINT_URL;
	if (!endpoint) {
		return NextResponse.json(
			{ message: "Error loading PONDER_URL" },
			{ status: 5020 },
		);
	}

	console.log("endpoint 🦉", endpoint);
	const variables = new Object() as {
		cursor: string;
		chainId: number | string;
	};

	if (cursor) variables.cursor = cursor;
	if (chainId) variables.chainId = chainId;
	const body = variables
		? JSON.stringify({ query: query, variables: variables })
		: JSON.stringify({ query: query });
	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	});
	const json = await res.json();
	// console.log("👾 ", json);

	return NextResponse.json(json, { status: 200 });
}
