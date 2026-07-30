export function formatDateTime(value?: string | null): string {
	if (!value) {
		return '—';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

export function formatPrice(value?: number | null): string {
	if (value == null || Number.isNaN(value)) {
		return '—';
	}

	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatWeight(value?: number | null): string {
	if (value == null) {
		return '—';
	}
	return `${value} т`;
}

export function formatVolume(value?: number | null): string {
	if (value == null) {
		return '—';
	}
	return `${value} м³`;
}
