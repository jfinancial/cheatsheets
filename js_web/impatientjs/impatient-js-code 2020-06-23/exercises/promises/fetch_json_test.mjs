/* npm t exercises/promises/fetch_json_test.mjs
Instructions:
- Start an HTTP server via:
  npm run serve
- Create fetch_json.mjs so that the test passes
- Use fetch(): https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  - Keep it simple: assume response.status is always 200 (if the Promise is fulfilled)
  - Implementation for Node.js:
    import fetch from 'isomorphic-fetch';
- Download a string and parse it yourself, via JSON.parse(str)
*/

import test from 'ava';
import {strict as assert} from 'assert';

import {fetchJson} from './fetch_json.mjs';

// Test callback returns a Promise! This enables async testing.
test('URL to JSON object', () =>
  fetchJson('http://localhost:8080/bond.json')
  .then(json => {
    assert.deepEqual(json, {
      first: 'Jane',
      last: 'Bond',
    });
  })
);
