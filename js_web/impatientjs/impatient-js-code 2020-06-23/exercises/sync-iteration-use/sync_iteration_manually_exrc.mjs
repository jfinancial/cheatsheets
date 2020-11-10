/* npm t exercises/sync-iteration-use/sync_iteration_manually_exrc.mjs
Instructions:
– Use an iterator for arr instead of the current indexed access.
– Use assert.deepEqual() to check the objects returned by the iterator.
– That is: the assertions also check content and length of the array, but look quite different.
*/

import test from 'ava';
import {strict as assert} from 'assert';

test('instanceof', t => {
  const arr = ['a', 'b', 'c'];

  assert.equal(arr[0], 'a');
  assert.equal(arr[1], 'b');
  assert.equal(arr[2], 'c');
  assert.equal(arr.length, 3);
});
