# tamesy

[![npm version](https://badge.fury.io/js/tamesy.svg)](https://badge.fury.io/js/tamesy)
[![Build Status](https://travis-ci.org/tdeekens/tamesy.svg?branch=master)](https://travis-ci.org/tdeekens/tamesy) ♦️
[![Dependency Status](https://david-dm.org/tdeekens/tamesy.svg?style=flat)](https://david-dm.org/tdeekens/tamesy) ♦️
[![devDependency Status](https://david-dm.org/tdeekens/tamesy/dev-status.svg)](https://david-dm.org/tdeekens/tamesy#info=devDependencies) ♦️

> Tames a set of wild concurrent promises.

## Installation

`npm i tamesy -save`

## Documentation

Tamesy exposes a `map` function to map over a set of `Promises` or a `iterator` factory with a given concurrency.

### API

`Tamesy` exposes a `map` function as its default export. The `map` function takes the following arguments:

 * `[Function<Promise>]` Array containing functions which return Promises serving as the factory (lazy).
 * `Number=Infinity`     Maximum limit of concurrently running Promises.
 * `Function`            Optional if passed a function invoked with each item which should return a Promise.
 * `Function`            Optional log function if passed a function to be used for debugging (e.g. `debug` in examples).
 * `Function`            Optional if passed a function providing a Promise (to overwrite native Promises e.g. `O.Promise`.

`Tamesy` returns a Promise which resolves to an Array<Any> whenever all tasks have ben run. The order of items is maintained - same as in the list of factory functions passed.

### Module formats

`Tamesy` is built as a UMD module using [`webpack`](https://github.com/tdeekens/tamesy/blob/master/config/umd.js#L6-L11). The distribution version is not added to `git` but created as a `preversion` [script](https://github.com/tdeekens/tamesy/blob/master/package.json#L15).

- ...ESM just import the `src/index.js` within your app.
- ...CommonJS use the `dist/tamesy.js`
- ...AMD use the `dist/tamesy.js`
- ...`<script />` link it to `dist/tamesy.js` or `dist/tamesy.min.js`

All build files are part of the npm distribution using the [`files`](https://github.com/tdeekens/tamesy/blob/master/package.json#L17-L21) array to keep install time short.

Also feel free to use [unpkg.com](https://unpkg.com/tamesy@1.1.1/dist/umd/tamesy.js) as a CDN to the [dist](https://unpkg.com/tamesy@1.1.1/dist/umd/) files.

### Examples

```js
import map from 'tamesy';
/**
 * Delay execution by time ms
 * @method delay
 * @param  {integer} time [delay in milliseconds]
 * @return {Promise}      [promise to chain into]
 */
function delay(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    })
}
/**
 * Queue of n items with max given
 * @method queue
 * @param  {integer} length [length of queue]
 * @param  {integer} max    [maximum integer within queue]
 * @return {Array}          [queue with items]
 */
function queue(length, max) {
    return [...new Array(length)].map(() => Math.round(Math.random() * max))
}

// Queue map'ed onto delay factories (lazy Promises)
const syncQueue = queue(10, 50)
const asyncQueue = syncQueue.map(ms => () => delay(ms))

console.huraaay = (msg, props) => console.info(`🎉 ${msg} 🍻`, props)

console.info('🏁 Starting the race 1...')
// Given a queue with 10 items and a maximum delay of 50ms
// execute two tasks concurrently without a factory function.
map(asyncQueue, 2, false, null, log).then(props => console.huraaay('All work WITHOUT iterator done! ', props))

console.info('🏁 Starting the race 2...')
// Given the same queue pipe each item of the iterable into the factory function.
map(syncQueue, 2, delay, null, log).then(props => console.huraaay('All work WITH iterator done! ', props))
```
