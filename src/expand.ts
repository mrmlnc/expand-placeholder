'use strict';

export interface IOptions {
	opening?: string;
	closing?: string;
	transformValue?: (value: any) => string;
}

export interface IData {
	[name: string]: number | string;
}

function escapeRegexpString(input: string): string {
	return input.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

export default function expand(input: string, data: IData, options?: IOptions): string {
	options = Object.assign(<IOptions>{
		opening: '{{',
		closing: '}}',
		transformValue: (val) => val
	}, options);

	const before = escapeRegexpString(options.opening);
	let after = escapeRegexpString(options.closing);
	if (!after) {
		after = `(?=[\\s${before}])`;
	}

	const regexp = new RegExp(`${before}(.+?)${after}`, 'g');
	let matchs = input.match(regexp);
	if (!matchs) {
		return input;
	}

	for (let i = 0; i < matchs.length; i++) {
		const match = matchs[i];
		const name = match.substring(options.opening.length, match.length - options.closing.length).trim();
		if (data.hasOwnProperty(name)) {
			input = input.replace(match, options.transformValue(data[name]));
		}
	}

	return input;
}
