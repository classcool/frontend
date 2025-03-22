import { fetchData, poolsQuery } from "@/lib/queries";

async function getData() {
	function hooksQuery(cursor: string, direction: PageDirection) {
		let c = "after: $cursor";
		const id = "$chainId";
		if (cursor) {
			c = `${direction === "next" ? "after" : "before"}: $cursor`;
		}
		const opts = `(${c}, where: { chainId: ${id}})`;
		return `
	query MyQuery($cursor: String, $chainId: Int) {
		hooks ${opts} {
			items {
				chainId
				hookAddress
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;
	}

	console.log(hooksQuery("", ""));

	type PageDirection = "next" | "prev" | "";
	const fetchData = async (
		cursor: string,
		direction: PageDirection,
		chainId: number | "",
		queryTemplate: (cursor: string, direction: PageDirection) => string,
	) => {
		const endpoint = process.env.NEXT_PUBLIC_PONDER_ENDPOINT_URL!;
		const query = queryTemplate(cursor, direction);
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
		console.log("👾 ", json);
		return json.data;
	};

	const d = "";
	const c = "";
	const id = 1301;
	const res = await fetchData(c, d, id, hooksQuery);
	console.log(res);
}

getData();
