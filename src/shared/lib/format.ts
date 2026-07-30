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

export function formatFlag(value?: boolean | null): string {
	if (value == null) {
		return '—';
	}
	return value ? 'Да' : 'Нет';
}

type LoadingTypesFlags = {
	side?: boolean | null;
	top?: boolean | null;
	rear?: boolean | null;
	full?: boolean | null;
};

export function formatLoadingTypes(loadingTypes: LoadingTypesFlags): string {
	const items = [
		loadingTypes.side && 'Боковая',
		loadingTypes.top && 'Верхняя',
		loadingTypes.rear && 'Задняя',
		loadingTypes.full && 'Полная',
	].filter(Boolean);

	return items.length > 0 ? items.join(', ') : '—';
}

type DocsFlags = {
	tir?: boolean | null;
	cmr?: boolean | null;
	t1?: boolean | null;
	med?: boolean | null;
};

export function formatDocs(docs: DocsFlags): string {
	const items = [
		docs.tir && 'TIR',
		docs.cmr && 'CMR',
		docs.t1 && 'T1',
		docs.med && 'Мед.',
	].filter(Boolean);

	return items.length > 0 ? items.join(', ') : 'Не требуются';
}
