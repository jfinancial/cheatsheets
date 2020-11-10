/* npm t exercises/async-functions/fetch_json2_test.mjs
Instructions:
- Same instructions as exercises/promises/fetch_json_test.mjs
- This time: don’t use Promises, use an async function
*/

import test from 'ava';
import {strict as assert} from 'assert';

import {fetchJson} from './fetch_json2.mjs';

// Test callback returns a Promise! This enables async testing.
test('URL to JSON object (2)', () =>
  fetchJson('http://localhost:8080/bond.json')
  .then(json => {
    assert.deepEqual(json, {
      first: 'Jane',
      last: 'Bond',
    });
  })
);
