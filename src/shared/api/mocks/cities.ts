export type CityOption = {
	id: number;
	name: string;
};

export const CITIES: CityOption[] = [
	{ id: 59, name: 'Пермь' },
	{ id: 100, name: 'Москва' },
	{ id: 78, name: 'Санкт-Петербург' },
	{ id: 66, name: 'Екатеринбург' },
	{ id: 54, name: 'Новосибирск' },
	{ id: 16, name: 'Казань' },
	{ id: 61, name: 'Ростов-на-Дону' },
	{ id: 23, name: 'Краснодар' },
	{ id: 52, name: 'Нижний Новгород' },
	{ id: 63, name: 'Самара' },
];

export function getCities(): CityOption[] {
	return CITIES;
}
