'use strict';

const vm = require('vm');

module.exports = function expand(ctx, delimiters, input) {
	let current = 0;
	let char = input[current];
	let buf = [];

	while (current < input.length) {
		// Since we are matching multiple sets of delimiters, we need to run a loop
		// here to match each one.
		for (let i = 0; i < delimiters.length; i++) {
			// current delimiter set
			const d = delimiters[i];

			// If we can match the full open delimiter, we pull its contents so we can
			// parse the expression
			if (char === d[0][0] && matchDelimiter(char, d[0]) === d[0]) {
				// Move past the open delimiter
				next(d[0].length);

				// Loop until we find the close delimiter
				let expression = '';
				while (matchDelimiter(char, d[1]) !== d[1]) {
					expression += char;
					next();
				}

				// move past the close delimiter
				next(d[1].length);

				// evaluate the expression and push it to the output
				let expressionEval = vm.runInContext(expression.trim(), ctx);

				// push the full evaluated/escaped expression to the output buffer
				buf.push(expressionEval);
			}
		}

		buf.push(char);
		next();
	}


	// return the full string with expressions replaced
	return buf.join('');

	// Utility: From the current character, looks ahead to pull back a potential
	// delimiter match.
	function matchDelimiter(c, d) {
		return c + lookahead(d.length - 1);
	}

	// Utility: Move to the next character in the parse
	function next(n = 1) {
		for (let i = 0; i < n; i++) {
			char = input[++current];
		}
	}

	// Utility: looks ahead n characters and returns the result
	function lookahead(n) {
		let counter = current;
		const target = current + n;

		let res = '';
		while (counter < target) {
			res += input[++counter];
		}

		return res;
	}

}
