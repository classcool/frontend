export function timeAgo(unixTimestamp: number): string {
	const now = Math.floor(Date.now() / 1000); // Current time in seconds
	const diff = now - unixTimestamp;

	if (diff < 0) return "in the future"; // Handle future timestamps

	if (diff <= 10) return "just now";
	if (diff < 60) return `${diff} seconds ago`;

	const minutes = Math.floor(diff / 60);
	if (minutes < 60)
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

	const hours = Math.floor(diff / 3600);
	if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

	const days = Math.floor(diff / 86400);
	if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

	const weeks = Math.floor(days / 7);
	if (weeks < 4) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;

	const years = Math.floor(days / 365);
	if (years < 10) return `${years} ${years === 1 ? "year" : "years"} ago`;

	const decades = Math.floor(years / 10);
	if (decades < 10)
		return `${decades} ${decades === 1 ? "decade" : "decades"} ago`;

	const centuries = Math.floor(years / 100);
	return `${centuries} ${centuries === 1 ? "century" : "centuries"} ago`;
}
