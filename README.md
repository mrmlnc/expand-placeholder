# expand-placeholder

> Takes a string and interpolates the values.

[![Travis Status](https://travis-ci.org/mrmlnc/expand-placeholder.svg?branch=master)](https://travis-ci.org/mrmlnc/expand-placeholder)

## Install

```shell
$ npm i -S expand-placeholder
```

## Why?

  * Dependencies free.
  * Very fast.
  * Sufficiently flexible.

## Usage

```js
const expandPlaceholder = require('expand-placeholder');

const str = 'Hello from {{ country }}!';
const data {
	country: 'Russia'
}

const expanded = expandPlaceholder(str, data);
console.log(expanded);
// => Hello from Russia!
```

## API

### expandPlaceholder(source, data, [options])

Takes a string and interpolates the values.

#### source

  * Type: `String`

A string for processing.

#### data

  * Type: `Object`

Data for the interpolation.

#### Options

  * Type: `Object`

```js
{
	// String. Characters that define the beginning of a placeholder.
	opening: '{{',
	// String. Characters that define the end of a placeholder.
	closing: '{{',
	// Function. Allows to change a value before the insert into string.
	transformValue: (val) => val
}
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/expand-placeholder/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
