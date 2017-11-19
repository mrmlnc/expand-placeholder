'use strict';

import * as assert from 'assert';

import expand, { IOptions, TData } from './expand';

interface IAssert {
	input?: string | null;
	expected: string;
	delimiters: [string, string];
	data?: TData;
}

function assertCase(obj: IAssert): void {
	obj.data = Object.assign({ one: '1', two: 2 }, obj.data);

	const opts: IOptions = {
		opening: obj.delimiters[0],
		closing: obj.delimiters[1],
		transformValue: <T extends string>(value: T): string => value
	};

	const defaultString = `${opts.opening} one ${opts.closing} ${opts.opening} two ${opts.closing} ${opts.opening} skip ${opts.closing}`;

	const result = expand(obj.input || defaultString, obj.data, opts);

	assert.equal(result, obj.expected);
}

describe('Expand', () => {
	describe('Default', () => {
		it('should works with default settings', () => assertCase({
			expected: '1 2 {{ skip }}',
			delimiters: ['{{', '}}']
		}));

		it('should works with empty value', () => assertCase({
			expected: '1  {{ skip }}',
			delimiters: ['{{', '}}'],
			data: { two: '' }
		}));
	});

	describe('Custom', () => {
		it('should work with { NAME }', () => assertCase({
			expected: '1 2 { skip }',
			delimiters: ['{', '}']
		}));

		it('should work with {% NAME %}', () => assertCase({
			expected: '1 2 {% skip %}',
			delimiters: ['{%', '%}']
		}));

		/* tslint:disable no-invalid-template-strings */
		it('should work with ${ NAME }', () => assertCase({
			expected: '1 2 ${ skip }',
			delimiters: ['${', '}']
		}));
		/* tslint:enable */

		it('should work with #{ NAME }', () => assertCase({
			expected: '1 2 #{ skip }',
			delimiters: ['#{', '}']
		}));

		it('should work with [ NAME ]', () => assertCase({
			expected: '1 2 [ skip ]',
			delimiters: ['[', ']']
		}));

		it('should work with ( NAME )', () => assertCase({
			expected: '1 2 ( skip )',
			delimiters: ['(', ')']
		}));

		it('should work with <% NAME %>', () => assertCase({
			expected: '1 2 <% skip %>',
			delimiters: ['<%', '%>']
		}));

		it('should work with % NAME %', () => assertCase({
			expected: '1 2 % skip %',
			delimiters: ['%', '%']
		}));

		it('should work with _ NAME _', () => assertCase({
			expected: '1 2 _ skip _',
			delimiters: ['_', '_']
		}));

		it('should work with __ NAME __', () => assertCase({
			expected: '1 2 __ skip __',
			delimiters: ['__', '__']
		}));

		it('should work with me NAME me', () => assertCase({
			input: 'me one me me two meme skip me',
			expected: '1 2me skip me',
			delimiters: ['me', 'me']
		}));

		it('should work with %NAME', () => assertCase({
			input: '%one %two%skip',
			expected: '1 2%skip',
			delimiters: ['%', '']
		}));

		it('should work with !NAME', () => assertCase({
			input: '!one !two!skip',
			expected: '1 2!skip',
			delimiters: ['!', '']
		}));

		it('should work with #NAME', () => assertCase({
			input: '#one #two#skip',
			expected: '1 2#skip',
			delimiters: ['#', '']
		}));
	});
});
