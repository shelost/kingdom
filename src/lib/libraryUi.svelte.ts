/** TOC / library chrome — Type = title mark; Details = right-rail kind icons + flash greying. */
const TYPE_KEY = 'kingdom:library-type';
const DETAILS_KEY = 'kingdom:library-details';

function readBool(key: string, fallback = true): boolean {
	if (typeof localStorage === 'undefined') return fallback;
	try {
		const v = localStorage.getItem(key);
		if (v === '0') return false;
		if (v === '1') return true;
	} catch {
		/* ignore */
	}
	return fallback;
}

function writeBool(key: string, on: boolean) {
	try {
		localStorage.setItem(key, on ? '1' : '0');
	} catch {
		/* ignore */
	}
}

export const libraryUi = $state({
	type: readBool(TYPE_KEY, true),
	details: readBool(DETAILS_KEY, true)
});

export function setLibraryType(on: boolean) {
	libraryUi.type = on;
	writeBool(TYPE_KEY, on);
}

export function setLibraryDetails(on: boolean) {
	libraryUi.details = on;
	writeBool(DETAILS_KEY, on);
}
