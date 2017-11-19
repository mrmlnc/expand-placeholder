'use strict';

import * as assert from 'assert';

import expand from './expand';

interface ITransform {
	(value: string): string;
}

function defaultTransform<T extends string>(value: T): string {
	return value;
}

function assertCase(input: string, expected: string, delimiters?: any, data?: any, transform?: ITransform): void {
	data = Object.assign({
		one: '1',
		two: 2
	}, data);

	const o = {
		opening: delimiters[0],
		closing: delimiters[1],
		transformValue: transform || defaultTransform
	};

	const result = expand(input || `${o.opening} one ${o.closing} ${o.opening} two ${o.closing} ${o.opening} skip ${o.closing}`, data, o);

	assert.equal(result, expected);
}

describe('Expand', () => {

	it('default', () => {
		assertCase('', '1 2 {{ skip }}', ['{{', '}}']);
	});

	it('default with empty value', () => {
		assertCase('', '1  {{ skip }}', ['{{', '}}'], { two: '' });
	});

	it('custom: { NAME }', () => {
		assertCase('', '1 2 { skip }', ['{', '}']);
	});

	it('custom: {% NAME %}', () => {
		assertCase('', '1 2 {% skip %}', ['{%', '%}']);
	});

	it('custom: ${ NAME }', () => {
		assertCase('', '1 2 ${ skip }', ['${', '}']);
	});

	it('custom: #{ NAME }', () => {
		assertCase('', '1 2 #{ skip }', ['#{', '}']);
	});

	it('custom: [ NAME ]', () => {
		assertCase('', '1 2 [ skip ]', ['[', ']']);
	});

	it('custom: ( NAME )', () => {
		assertCase('', '1 2 ( skip )', ['(', ')']);
	});

	it('custom: <% NAME %>', () => {
		assertCase('', '1 2 <% skip %>', ['<%', '%>']);
	});

	it('custom: % NAME %', () => {
		assertCase('%one% %two%%skip%', '1 2%skip%', ['%', '%']);
	});

	it('custom: _ NAME _', () => {
		assertCase('_one_ _two__skip_', '1 2_skip_', ['_', '_']);
	});

	it('custom: __ NAME __', () => {
		assertCase('__one__ __two____skip__', '1 2__skip__', ['__', '__']);
	});

	it('custom: %NAME', () => {
		assertCase('%one %two%skip', '1 2%skip', ['%', '']);
	});

	it('custom: !NAME', () => {
		assertCase('!one !two!skip', '1 2!skip', ['!', '']);
	});

	it('custom: #NAME', () => {
		assertCase('#one #two#skip', '1 2#skip', ['#', '']);
	});

	it('custom: me NAME me', () => {
		assertCase('me one me me two meme skip me', '1 2me skip me', ['me', 'me']);
	});

	it('transform function', () => {
		assertCase('', '__1__ __2__ {{ skip }}', ['{{', '}}'], {}, (val) => `__${val}__`);
	});

});
