export function toCamelCase(str: string) {
	return str
		.replace(/([-_\s][a-zA-Z])/g, (match) =>
			match.toUpperCase().replace(/[-_\s]/g, "")
		)
		.replace(/^([A-Z])/, (match) => match.toLowerCase());
}