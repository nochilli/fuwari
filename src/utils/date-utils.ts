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

export function formatDateToYYYYMMDD(date: Date): string {
	const { day, month, year } = getUtcDateParts(date);
	return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
