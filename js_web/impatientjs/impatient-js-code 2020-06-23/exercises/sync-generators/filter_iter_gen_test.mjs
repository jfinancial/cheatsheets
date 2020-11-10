/* npm t exercises/sync-generators/filter_iter_gen_test.mjs
Instructions:
– Implement filter_iter_gen.mjs
*/

import test from 'ava';
import {strict as assert} from 'assert';

import { filterIter } from './filter_iter_gen.mjs';

test('filterIter by element [gen]', t => {
  assert.deepEqual([...filterIter(['a', 'b', 'c'], str => true)], ['a', 'b', 'c']);
  assert.deepEqual([...filterIter(['a', 'b', 'c'], str => false)], []);

  assert.deepEqual([...filterIter(['a', '', 'c', ''], str => str.length > 0)], ['a', 'c']);
  assert.deepEqual([...filterIter(['a', '', 'c', ''], str => str.length === 0)], ['', '']);

  assert.deepEqual([...filterIter([-1, 3, -2, 5], x => x > 0)], [3, 5]);
  assert.deepEqual([...filterIter([-1, 3, -2, 5], x => x < 0)], [-1, -2]);
});

test('filterIter by index [gen]', t => {
  assert.deepEqual([...filterIter(['a', 'b', 'c', 'd'], (_, i) => i < 1)], ['a']);
  assert.deepEqual([...filterIter(['a', 'b', 'c', 'd'], (_, i) => i >= 1)], ['b', 'c', 'd']);

  assert.deepEqual([...filterIter(['a', 'b', 'c', 'd'], (_, i) => (i % 2) === 0)], ['a', 'c']);
  assert.deepEqual([...filterIter(['a', 'b', 'c', 'd'], (_, i) => (i % 2) === 1)], ['b', 'd']);
});
