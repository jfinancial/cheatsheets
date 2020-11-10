import test from 'ava';
import {strict as assert} from 'assert';
import {fileURLToPath} from 'url';

const testFilePath = fileURLToPath(new URL('read_file_cb_exrc_data.txt', import.meta.url));

import {readFileSync} from 'fs';

test('Read file synchronously', t => {
  const text = readFileSync(testFilePath, { encoding: 'utf8' }).trim();
  assert.equal(text, 'The test data');
});

import {readFile} from 'fs';

test.cb('Read file via callback', t => { // call t.end() once you are finished
  readFile(testFilePath, { encoding: 'utf8' },
    function (err, text) {
      if (err) {
        console.error(err);
        t.end(err);
        return;
      }
      text = text.trim();
      assert.equal(text, 'The test data');
      t.end();
    });
});
