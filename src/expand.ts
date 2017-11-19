'use strict';

export interface IOptions {
	opening: string;
	closing: string;
	transformValue: (<T extends string>(value: T) => string) | null;
}

export type TData = Record<string, string | number>;

function escapeRegexpString(input: string): string {
	return input.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

export default function expand(input: string, data: TData, options?: Partial<IOptions>): string {
	let result = input;

	const buildedOptions: IOptions = Object.assign(<IOptions>{
		opening: '{{',
		closing: '}}',
		transformValue: null
	}, options);

	const before = escapeRegexpString(buildedOptions.opening);
	let after = escapeRegexpString(buildedOptions.closing);
	if (after === '') {
		after = `(?=[\\s${before}])`;
	}

	const regexp = new RegExp(`${before}.+?${after}`, 'g');
	const matches = result.match(regexp);
	if (matches === null) {
		return result;
	}

	/* tslint:disable-next-line prefer-for-of */
	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const name = match.substring(buildedOptions.opening.length, match.length - buildedOptions.closing.length).trim();
		if (data.hasOwnProperty(name)) {
			const value = data[name];

			result = result.replace(match, buildedOptions.transformValue ? buildedOptions.transformValue(value as string) : value as string);
		}
	}

	return result;
}
