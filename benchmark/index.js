'use strict';

const vm = require('vm');

const expandPlaceholder = require('../');
const string = require('string');
const stringPlaceholder = require('string-placeholder');

const lodash = require('lodash');
lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const vmReplace = require('./vm');

const str = `
{{ a }} {{ b }} {{ c }} {{ d }} {{ e }}
{{ f }} {{ g }} {{ h }} {{ i }} {{ j }}
{{ k }} {{ l }} {{ m }} {{ n }} {{ o }}
{{ p }} {{ q }} {{ r }} {{ s }} {{ t }}
{{ u }} {{ v }} {{ w }} {{ x }} {{ y }}
{{ z }}
`;

const data = {
    a: 'a', b: 'b', c: 'c', d: 'd', e: 5,
    f: 'f', g: 'g', h: 'h', i: 'i', j: 10,
    k: 'k', l: 'l', m: 'm', n: 'n', o: 15,
    p: 'p', q: 'q', r: 'r', s: 's', t: 20,
    u: 'u', v: 'v', w: 'w', x: 'x', y: 25,
    z: 'z'
};

const ctx = vm.createContext(data);

let res = '';

suite('Expand', () => {

    set('iterations', 10000);

    bench('expand-placeholder', () => {
        res = expandPlaceholder(str, data);
    });

    bench('string.template', () => {
        res = string(str).template(data, '{{', '}}');

    });

    bench('string-placeholder', () => {
        res = stringPlaceholder(str, data, {
            before: '{{',
            after: '}}'
        });
    });

    bench('lodash.template', () => {
        // Why `lodash.template` used here?
        // ---
        // Most likely your string will be generated dynamically. Lodash parses the string once and
        // does not allow to change it. So be honest make parse string every time before calling.
        res = lodash.template(str)(data);
    });

    bench('vm', () => {
        // https://github.com/posthtml/posthtml-expressions/blob/d80c026536e849d82d98d9970f72d6de4d6f2d4b/lib/expression_parser.js
        res = vmReplace(ctx, [['{{', '}}']], str);
    });

});
