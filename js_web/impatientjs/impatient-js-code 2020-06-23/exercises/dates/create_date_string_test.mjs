/* npm t exercises/dates/create_date_string_test.mjs
Instructions:
- Implement create_date_string.mjs
*/

import test from 'ava';
import {strict as assert} from 'assert';

import {createDateString} from './create_date_string.mjs';

test('createDateString()', () => {
  assert.equal(createDateString(new Date(2077, 0, 27)), '2077-01-27');
  assert.equal(createDateString(new Date(324, 10, 1)), '0324-11-01');
});
