export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function formatTimestamp(seconds: number) {
	let minutes = Math.floor(seconds / 60);
	let remainingSeconds = Math.floor((seconds % 60) * 10) / 10;

	if (minutes < 10) {
		return `0${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	}
	return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
