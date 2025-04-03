export type PageDirection = "next" | "prev" | "";
export const fetchDataSingle = async (query: string) => {
	const res = await fetch("/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});

	const json = await res.json();

	return json.data;
};
export const fetchData = async (
	cursor: string,
	direction: PageDirection,
	chainId: number | "",
	queryTemplate: (cursor: string, direction: PageDirection) => string,
) => {
	const query = queryTemplate(cursor, direction);
	// console.log("query 🧶", query);

	const res = await fetch("/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ cursor, chainId, query }),
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

export function poolIdQuery(chainId: number, poolId: string) {
	const opts = `chainId: ${chainId}, poolId: "${poolId}"`;
	return `query MyQuery {
  pool(${opts}) {
    chainId
    currency0
    currency1
    fee
    tickSpacing
    hooks
    tick
    sqrtPriceX96
    timestamp
    poolId
    token0 {
      address
      decimals
      name
      symbol
    }
    token1 {
      address
      name
      symbol
      decimals
    }
  }
}`;
}

export function ordersQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}}, orderBy: "timestamp", orderDirection: "desc")`;
	return `query MyQuery ($cursor: String, $chainId: Int){
  orders ${opts} {
    items {
      amountIn
      chainId
      owner
      poolId
			orderStatus
      zeroForOne
      timestamp
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}`;
}

export function usersQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}}, orderBy: "timestamp", orderDirection: "desc")`;
	return `query MyQuery($cursor: String, $chainId: Int) {
  users ${opts} {
    items {
      timestamp
			totalInitialized
      totalLiquiditys
      totalSwaps
      totalTransfers
      chainId
      sender
      liquidity {
        totalCount
      }
      transfer {
        totalCount
      }
      swap {
        totalCount
      }
    }
    pageInfo {
      startCursor
      hasPreviousPage
      hasNextPage
      endCursor
    }
  }
}`;
}

export function hooksQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}}, orderBy: "timestamp", orderDirection: "desc")`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		hooks ${opts} {
			items {
				timestamp
				chainId
				hookAddress
				pools {
					totalCount
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
	}`;
}

export function poolsQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	const id = "$chainId";
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	const opts = `(${c}, where: { chainId: ${id}}, orderBy: "timestamp", orderDirection: "desc")`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
    pools ${opts} {
      items {
				timestamp
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
	const opts = `(${c}, where: { chainId: ${id}}, orderBy: "timestamp", orderDirection: "desc")`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		liquiditys ${opts} {
			items {
				timestamp
				chainId
				sender
				id
				poolId
				sender
				amount0
				amount1
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
	const opts = `(${c}, where: { chainId: ${id}}, orderBy: "timestamp", orderDirection: "desc")`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		operators ${opts} {
			items {
				timestamp
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
