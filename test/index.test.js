import tape from 'tape';
import tapePromise from 'tape-promise';
import sinon from 'sinon';

import map from './../src/index';

const test = tapePromise(tape);

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve.bind(undefined, timeout), timeout);
  });
}

function getQueue(length, max) {
  return [...new Array(length)].map(() => Math.round(Math.random() * max));
}

test('resolves with all async values in an async queue in order', t => {
  const queue = getQueue(10, 5);
  const asyncQueue = queue.map(ms => () => delay(ms));

  return map(asyncQueue).then(resolved => {
    t.deepEqual(resolved, queue);
  });
});

test('invokes the iterator with each item in a sync queue', t => {
  const queue = getQueue(10, 5);
  // Immediately resolving iterator Promise
  const iterator = sinon.spy(() => new Promise(resolve => resolve()));

  return map(queue, 3, iterator).then(() => {
    t.equal(queue.length, iterator.callCount);
  });
});

test('uses the passed in promise providing function to build the chain', t => {
  const queue = getQueue(10, 5);
  const asyncQueue = queue.map(ms => () => delay(ms));
  const getPromise = sinon.spy(fn => new Promise(fn));

  return map(asyncQueue, Infinity, undefined, getPromise).then(() => {
    t.equal(getPromise.callCount, 1);
  });
});

test('does not surpass the concurrency limit', t => {
  const concurrency = 2;
  let inFlight = 0;
  const queue = getQueue(10, 5);
  const iterator = sinon.spy(() => {
    inFlight++;
    t.equal(
      inFlight > concurrency,
      false,
      `${inFlight} promises in flight exceeding limit of ${concurrency}`
    );

    return delay(0).then(() => {
      inFlight--;
    });
  });

  return map(queue, concurrency, iterator);
});

test('rejects queue on rejecting queue item', t => {
  const rejection = new Error('rejected');
  const queue = [
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.reject(rejection),
    Promise.resolve(23),
  ];
  const asyncQueue = queue.map(item => () => item);

  return map(asyncQueue, 3)
    .then(() => {
      t.fail('Iterable with rejected promise should not resolve');
    })
    .catch(err => {
      t.equal(err, rejection);
    });
});
