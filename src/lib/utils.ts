import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export interface ExplorerLinks {
	[chainId: number]: string;
}

export const etherscanLinks: ExplorerLinks = {
	130: "https://uniscan.xyz",
	1301: "https://sepolia.uniscan.xyz",
};

export function shortenHex(hexStr: string, numChars = 4): string {
	// Ensure the hex string starts with '0x' and remove it
	if (!hexStr.startsWith("0x")) {
		throw new Error("The hex string must start with '0x'.");
	}

	// Remove the '0x' prefix
	const cleanHexStr = hexStr.slice(2);

	// Ensure it's a valid 32-byte hex string (64 characters long)
	if (cleanHexStr.length !== 64 || !/^[0-9a-fA-F]+$/.test(cleanHexStr)) {
		throw new Error("The hex string must be 64 characters long (32 bytes).");
	}

	// Take the first 'numChars' characters, the last 'numChars' characters, and place '...' in between
	const shortened = `0x${cleanHexStr.slice(0, numChars)}...${cleanHexStr.slice(-numChars)}`;
	return shortened;
}
