/* npm t exercises/promises/my_promisify_test.mjs
Instructions:
– Implement my_promisify.mjs
– In lines A and B, you can see how Node’s callbacks work
*/

import test from 'ava';
import {strict as assert} from 'assert';

import {myPromisify} from './my_promisify.mjs';

test.cb('Fulfillment', t => {
  const f = (arg, callback) => {
    callback(null, 'success '+arg); // (A)
  };
  const pf = myPromisify(f);
  pf('good').then(x => {
    assert.equal(x, 'success good');
    t.end();
  });
});

test.cb('Rejection', t => {
  const f = (arg, callback) => {
    callback('failure '+arg); // (B)
  };
  const pf = myPromisify(f);
  pf('bad').catch(err => {
    assert.equal(err, 'failure bad');
    t.end();
  });
});
