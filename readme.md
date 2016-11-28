# tamesy

[![npm version](https://badge.fury.io/js/tamesy.svg)](https://badge.fury.io/js/tamesy)
[![Build Status](https://travis-ci.org/tdeekens/tamesy.svg?branch=master)](https://travis-ci.org/tdeekens/tamesy) ♦️
[![Dependency Status](https://david-dm.org/tdeekens/tamesy.svg?style=flat)](https://david-dm.org/tdeekens/tamesy) ♦️
[![devDependency Status](https://david-dm.org/tdeekens/tamesy/dev-status.svg)](https://david-dm.org/tdeekens/tamesy#info=devDependencies) ♦️

> Tames a set of wild concurrent promises.

## Documentation

Tamesy exposes a `map` function to map over a set of `Promises` or a `iterator` factory with a given concurrency.

### Examples

```js
import map from 'tamesy';
/**
 * [delay execution by time ms]
 * @method delay
 * @param  {[integer]} time [delay in milliseconds]
 * @return {[Promise]}      [promise to chain into]
 */
function delay(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    })
}
/**
 * [queue of n items with max given]
 * @method queue
 * @param  {[integer]} length [length of queue]
 * @param  {[integer]} max    [maximum integer within queue]
 * @return {[Array]}          [queue with items]
 */
function queue(length, max) {
    return [...new Array(length)].map(() => Math.round(Math.random() * max))
}

// Queue map'ed onto delay factories (lazy Promises)
const asyncQueue = queue(10, 50).map(ms => () => delay(ms))

// More glitter!
console.huraaay = msg => console.info(`🎉 ${msg} 🍻`)

// Given a queue with 10 items and a maximum delay of 50ms
// execute two tasks concurrently without a factory function.
map(asyncQueue, 2).then(() => console.huraaay('All work done!'))

// Given the same queue pipe each item of the iterable into the factory function.
map(asyncQueue, 2, delay).then(() => console.huraaay('All work done!'))
```
