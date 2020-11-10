/* npm t exercises/async-js/map_cb_test.mjs
Instructions: Implement map_cb.mjs
*/

import test from 'ava';
import {strict as assert} from 'assert';

import {mapCb} from './map_cb.mjs';

function toUpperCaseCb(str, index, callback) {
  callback(null, str.toUpperCase());
}
function returnIndexCb(x, index, callback) {
  callback(null, index);
}

test.cb('toUpperCaseCb', t => {
  mapCb(['foo', 'bar', 'baz'], toUpperCaseCb,
    function (error, result) {
      assert.equal(error, null);
      assert.deepEqual(result, ['FOO', 'BAR', 'BAZ']);
      t.end();
    }
  );
});
test.cb('illegal first argument', t => {
  mapCb(null, toUpperCaseCb,
    function (error, result) {
      assert.ok(error instanceof Error);
      assert.equal(result, undefined);
      t.end();
    }
  );
});
test.cb('empty', t => {
  mapCb([], toUpperCaseCb,
    function (error, result) {
      assert.equal(error, null);
      assert.deepEqual(result, []);
      t.end();
    }
  );
});
test.cb('returnIndexCb', t => {
  mapCb([0, 0, 0, 0], returnIndexCb,
    function (error, result) {
      assert.equal(error, null);
      assert.deepEqual(result, [0, 1, 2, 3]);
      t.end();
    }
  );
});
