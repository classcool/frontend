export type PageDirection = "next" | "prev" | "";
export const fetchData = async (
	cursor: string,
	direction: PageDirection,
	chainId: number | "",
	queryTemplate: (cursor: string, direction: PageDirection) => string,
) => {
	const endpoint = process.env.NEXT_PUBLIC_PONDER_ENDPOINT_URL;
	if (!endpoint) {
		console.log("Error loading PONDER_URL 🚸");
		return;
	}
	// console.log("endpoint 🦉", endpoint);
	const query = queryTemplate(cursor, direction);
	// console.log("query 🧶", query);
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
	return json.data;
};

export function totalCurrenciesQuery() {
	return `query MyQuery($chainId: Int) {
  currencys(where: {chainId: $chainId}) {
    totalCount
  }
}`;
}

export function totalUsersQuery() {
	return `query MyQuery($chainId: Int) {
  users(where: {chainId: $chainId}) {
    totalCount
  }
}`;
}

export function totalPoolsQuery() {
	return `query MyQuery($chainId: Int) {
  pools(where: {chainId: $chainId}) {
    totalCount
  }
}`;
}

export function totalHooksQuery() {
	return `query MyQuery($chainId: Int) {
  hooks(where: {chainId: $chainId}) {
    totalCount
  }
}`;
}

export function hooksQuery(cursor: string, direction: PageDirection) {
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

export function currencysQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		currencys ${opts} {
			items {
				address
				chainId
				decimals
				symbol
				name
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

export function poolsQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
    pools ${opts} {
      items {
        chainId
        currency1
        currency0
        fee
        hooks
        poolId
        sqrtPriceX96
        tickSpacing
        tick
        token0 {
          name
          decimals
          symbol
        }
        token1 {
          name
          decimals
          symbol
        }
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

export function liquiditysQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		liquiditys ${opts} {
			items {
				chainId
				id
				liquidityDelta
				poolId
				salt
				sender
				tickLower
				tickUpper
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

export function operatorsQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		operators ${opts} {
			items {
				approved
				chainId
				operator
				owner
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
