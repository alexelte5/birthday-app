export function validatePersonPost(name: string, parsedDate: Date) {
	if (!name || name.trim().length < 1) {
		return "Name ist erforderlich";
	}
	if (!parsedDate || isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
		return "Datum ist erforderlich und kann nicht in der Zukunft liegen";
	}
}

export function validatePersonPatch(name?: string, parsedDate?: Date) {
	if (parsedDate) {
		if (isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
			return "Datum ist invalide";
		}
	}
}
