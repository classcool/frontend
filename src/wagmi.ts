import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { unichain, unichainSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export function getConfig() {
	return createConfig({
		chains: [unichain, unichainSepolia],
		connectors: [
			injected(),
			coinbaseWallet(),
			walletConnect({
				projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
			}),
		],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		transports: {
			[unichain.id]: http(),
			[unichainSepolia.id]: http(),
		},
	});
}

declare module "wagmi" {
	interface Register {
		config: ReturnType<typeof getConfig>;
	}
}
