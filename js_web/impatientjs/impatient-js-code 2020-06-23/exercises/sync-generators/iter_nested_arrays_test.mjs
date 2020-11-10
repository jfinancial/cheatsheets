/* npm t exercises/sync-generators/iter_nested_arrays_test.mjs
Instructions:
- Implement iter_nested_arrays.mjs
*/

import test from 'ava';
import {strict as assert} from 'assert';

import {iterNestedArrays} from './iter_nested_arrays.mjs';

test('iterNestedArrays()', () => {
  assert.deepEqual([ ...iterNestedArrays([]) ], []);
  assert.deepEqual([ ...iterNestedArrays(['a']) ], ['a']);
  assert.deepEqual([ ...iterNestedArrays([[['a']]]) ], ['a']);
  assert.deepEqual([ ...iterNestedArrays(['a', ['b', 'c'], 'd']) ], ['a', 'b', 'c', 'd']);
  assert.deepEqual([ ...iterNestedArrays(['a', ['b', ['c']], 'd']) ], ['a', 'b', 'c', 'd']);
});
