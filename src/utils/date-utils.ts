const monthAbbreviations = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

function getUtcDateParts(date: Date) {
	if (!Number.isFinite(date.getTime())) {
		throw new RangeError("Invalid date");
	}

	const day = date.getUTCDate();
	const month = date.getUTCMonth();
	const year = date.getUTCFullYear();

	return { day, month, year };
}

export function parseDateFromDDMMYYYY(value: string): Date | undefined {
	const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!match) return undefined;

	const day = Number(match[1]);
	const month = Number(match[2]) - 1;
	const year = Number(match[3]);
	if (month < 0 || month >= monthAbbreviations.length) return undefined;

	const date = new Date(Date.UTC(year, month, day));
	return date.getUTCDate() === day &&
		date.getUTCMonth() === month &&
		date.getUTCFullYear() === year
		? date
		: undefined;
}

export function formatDateToMonD(date: Date): string {
	const { day, month } = getUtcDateParts(date);
	return `${monthAbbreviations[month]} ${day}`;
}

export function formatDateToMonDYYYY(date: Date): string {
	const { day, month, year } = getUtcDateParts(date);
	return `${monthAbbreviations[month]} ${day} ${year}`;
}

export function formatRelativeTime(date: Date, now = new Date()): string {
	if (!Number.isFinite(date.getTime()) || !Number.isFinite(now.getTime())) {
		throw new RangeError("Invalid date");
	}

	const differenceInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
	const absoluteDifference = Math.abs(differenceInSeconds);
	const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

	if (absoluteDifference < 60) {
		return formatter.format(differenceInSeconds, "second");
	}
	if (absoluteDifference < 60 * 60) {
		return formatter.format(Math.round(differenceInSeconds / 60), "minute");
	}
	if (absoluteDifference < 24 * 60 * 60) {
		return formatter.format(Math.round(differenceInSeconds / (60 * 60)), "hour");
	}
	return formatter.format(Math.round(differenceInSeconds / (24 * 60 * 60)), "day");
}

export function formatDateToYYYYMMDD(date: Date): string {
	const { day, month, year } = getUtcDateParts(date);
	return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
