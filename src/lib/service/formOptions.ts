export function isOthersOption(option: string): boolean {
	return /^others?/i.test(option.trim());
}

export function isNoneOption(option: string): boolean {
    return option.toLowerCase() === "none";
}

export function noneDoesNotExist(options: string[]): boolean {
    return !options.some(isNoneOption);
}