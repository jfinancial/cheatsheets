/* npm t exercises/sync-generators/cycle_over_gen_test.mjs
Instructions:
– Implement cycle_over_gen.mjs
– Manual version: exercises/sync-iteration-implement/cycle_over_manually_test.mjs
*/

import test from 'ava';
import {strict as assert} from 'assert';

import { cycleOver } from './cycle_over_gen.mjs';

test('No item means empty sequence (immediate end) [gen]', () => {
    assert.deepEqual([...cycleOver()], []);
  });
  
  test('First two different items (different) via destructuring [gen]', () => {
    const [a,b] = cycleOver('eeny', 'meeny', 'miny');
    assert.deepEqual([a, b], ['eeny', 'meeny']);
  });
  
  test('First two items (same) via destructuring [gen]', () => {
    const [a,b] = cycleOver('single');
    assert.deepEqual([a, b], ['single', 'single']);
  });
  
  test('First five items via destructuring [gen]', t => {
    const [a,b,c,d,e] = cycleOver('eeny', 'meeny', 'miny');
    assert.deepEqual([a, b,c,d,e], ['eeny', 'meeny', 'miny', 'eeny', 'meeny']);
  });
  